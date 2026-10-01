import { ParsedSVG, SVGLayer } from '../types';

export interface VectorizeOptions {
  threshold?: number; // 0 - 255 for silhouette mode
  colorCount?: number; // 2 - 5 for multi-layer color mode
  mode?: 'color' | 'silhouette';
  smoothing?: boolean;
}

/**
 * Converts a raster image file (PNG/JPG/WEBP) into a multi-layered SVG object.
 */
export async function vectorizeRasterImage(
  file: File,
  options: VectorizeOptions = { mode: 'color', colorCount: 3, threshold: 128 }
): Promise<ParsedSVG> {
  const img = await loadImageFromFile(file);

  // Resize to manageable processing resolution for fast client-side tracing
  const maxDim = 200;
  let targetWidth = img.width;
  let targetHeight = img.height;
  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth >= targetHeight) {
      targetHeight = Math.round((targetHeight / targetWidth) * maxDim);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth / targetHeight) * maxDim);
      targetHeight = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Gagal menginisialisasi canvas 2D.');

  // Draw image
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);

  if (options.mode === 'silhouette') {
    return traceSilhouette(imgData, targetWidth, targetHeight, options.threshold || 128, file.name);
  } else {
    return traceColorLayers(imgData, targetWidth, targetHeight, options.colorCount || 3, file.name);
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal memuat gambar raster.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Traces a monochrome silhouette based on luminance threshold.
 */
function traceSilhouette(
  imgData: ImageData,
  width: number,
  height: number,
  threshold: number,
  fileName: string
): ParsedSVG {
  const { data } = imgData;
  const binaryGrid: boolean[][] = [];

  for (let y = 0; y < height; y++) {
    binaryGrid[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      // Mark true if dark enough and opaque
      binaryGrid[y][x] = a > 50 && lum < threshold;
    }
  }

  const pathD = gridToPathD(binaryGrid, width, height);

  const layer: SVGLayer = {
    id: 'layer-silhouette',
    name: 'Siluet Vektor',
    color: '#0F172A',
    visible: true,
    elements: [`<path d="${pathD}" fill="#0F172A" />`],
    animation: {
      type: 'floating',
      duration: 1.6,
      delay: 0,
      easing: 'ease-in-out',
      origin: 'center',
      intensity: 1.0
    }
  };

  return {
    title: fileName.replace(/\.[^/.]+$/, ''),
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    layers: [layer]
  };
}

/**
 * Traces multiple color layers by quantizing the image palette.
 */
function traceColorLayers(
  imgData: ImageData,
  width: number,
  height: number,
  colorCount: number,
  fileName: string
): ParsedSVG {
  const { data } = imgData;

  // Extract representative colors using k-means clustering on opaque pixels
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 80) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (pixels.length === 0) {
    throw new Error('Gambar transparan kosong.');
  }

  // Pick initial centroids evenly from sampled pixels
  const centroids: [number, number, number][] = [];
  const step = Math.max(1, Math.floor(pixels.length / colorCount));
  for (let k = 0; k < colorCount; k++) {
    centroids.push(pixels[Math.min(pixels.length - 1, k * step)]);
  }

  // Quick 4 iterations of K-Means
  for (let iter = 0; iter < 4; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: colorCount }, () => []);
    for (const [r, g, b] of pixels) {
      let minDist = Infinity;
      let bestCluster = 0;
      for (let k = 0; k < colorCount; k++) {
        const [cr, cg, cb] = centroids[k];
        const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
        if (dist < minDist) {
          minDist = dist;
          bestCluster = k;
        }
      }
      clusters[bestCluster].push([r, g, b]);
    }

    for (let k = 0; k < colorCount; k++) {
      if (clusters[k].length > 0) {
        const sum = clusters[k].reduce(
          (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
          [0, 0, 0]
        );
        centroids[k] = [
          Math.round(sum[0] / clusters[k].length),
          Math.round(sum[1] / clusters[k].length),
          Math.round(sum[2] / clusters[k].length)
        ];
      }
    }
  }

  const layers: SVGLayer[] = [];

  // For each centroid cluster, build a binary grid and trace
  centroids.forEach((centroid, cIndex) => {
    const [cr, cg, cb] = centroid;
    const hexColor = rgbToHex(cr, cg, cb);

    // Skip white/near-white backgrounds if they dominate and are at edge
    const isNearWhite = cr > 240 && cg > 240 && cb > 240;

    const binaryGrid: boolean[][] = [];
    let activePixelCount = 0;

    for (let y = 0; y < height; y++) {
      binaryGrid[y] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const a = data[idx + 3];
        if (a < 50) {
          binaryGrid[y][x] = false;
          continue;
        }

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Find which centroid this pixel is closest to
        let bestDist = Infinity;
        let bestK = 0;
        for (let k = 0; k < centroids.length; k++) {
          const [cx, cy, cz] = centroids[k];
          const dist = (r - cx) ** 2 + (g - cy) ** 2 + (b - cz) ** 2;
          if (dist < bestDist) {
            bestDist = dist;
            bestK = k;
          }
        }

        const match = bestK === cIndex;
        binaryGrid[y][x] = match;
        if (match) activePixelCount++;
      }
    }

    // Skip very small noise layers (< 15 pixels)
    if (activePixelCount < 15) return;

    const pathD = gridToPathD(binaryGrid, width, height);
    if (!pathD) return;

    const defaultAnim =
      cIndex === 0
        ? 'floating'
        : cIndex === 1
        ? 'pulse'
        : cIndex === 2
        ? 'wiggle'
        : 'none';

    layers.push({
      id: `layer-color-${cIndex + 1}`,
      name: isNearWhite ? `Latar/Highlight #${cIndex + 1}` : `Warna Layer #${cIndex + 1} (${hexColor})`,
      color: hexColor,
      visible: true,
      elements: [`<path d="${pathD}" fill="${hexColor}" />`],
      animation: {
        type: defaultAnim,
        duration: 1.5 + cIndex * 0.2,
        delay: cIndex * 0.1,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.0
      }
    });
  });

  return {
    title: fileName.replace(/\.[^/.]+$/, ''),
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    layers: layers.length > 0 ? layers : [
      {
        id: 'layer-fallback',
        name: 'Vektor Terdeteksi',
        color: '#3B82F6',
        visible: true,
        elements: [`<rect width="${width}" height="${height}" fill="#3B82F6" />`],
        animation: {
          type: 'floating',
          duration: 1.5,
          delay: 0,
          easing: 'ease-in-out',
          origin: 'center',
          intensity: 1.0
        }
      }
    ]
  };
}

/**
 * Converts a 2D boolean grid into compressed SVG path spans using scanline run-length encoding.
 * Creates clean geometric vector rectangles/polygons without heavy external dependencies.
 */
function gridToPathD(grid: boolean[][], width: number, height: number): string {
  const spans: string[] = [];

  for (let y = 0; y < height; y++) {
    let startX = -1;
    for (let x = 0; x < width; x++) {
      if (grid[y][x]) {
        if (startX === -1) startX = x;
      } else {
        if (startX !== -1) {
          const spanW = x - startX;
          spans.push(`M${startX} ${y}h${spanW}v1h-${spanW}Z`);
          startX = -1;
        }
      }
    }
    if (startX !== -1) {
      const spanW = width - startX;
      spans.push(`M${startX} ${y}h${spanW}v1h-${spanW}Z`);
    }
  }

  return spans.join(' ');
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}
