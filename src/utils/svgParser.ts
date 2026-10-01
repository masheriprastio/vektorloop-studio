import { ParsedSVG, SVGLayer, LayerAnimationConfig, AnimationType, TransformOrigin } from '../types';

/**
 * Returns CSS transform-origin value from TransformOrigin
 */
export function getTransformOriginCSS(origin: TransformOrigin): string {
  switch (origin) {
    case 'top-center':
      return 'top center';
    case 'bottom-center':
      return 'bottom center';
    case 'top':
      return 'top center';
    case 'bottom':
      return 'bottom center';
    case 'left':
      return 'center left';
    case 'right':
      return 'center right';
    case 'center':
    default:
      return 'center center';
  }
}

/**
 * Generates custom @keyframes definition for a specific layer configuration
 */
export function generateKeyframes(id: string, config: LayerAnimationConfig): string {
  const { type, intensity = 1 } = config;
  const mult = Math.max(0.1, intensity);

  switch (type) {
    case 'floating': {
      const dist = (8 * mult).toFixed(1);
      return `@keyframes anim-${id} {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-${dist}px); }
}`;
    }
    case 'shake': {
      const d1 = (1.5 * mult).toFixed(1);
      const d2 = (2.0 * mult).toFixed(1);
      const r1 = (1.0 * mult).toFixed(1);
      return `@keyframes anim-${id} {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(-${d1}px, ${d1}px) rotate(-${r1}deg); }
  40% { transform: translate(${d1}px, -${d1}px) rotate(${r1}deg); }
  60% { transform: translate(-${d2}px, -${d1}px) rotate(${r1}deg); }
  80% { transform: translate(${d1}px, ${d2}px) rotate(-${r1}deg); }
}`;
    }
    case 'pulse': {
      const s = (1 + 0.12 * mult).toFixed(2);
      return `@keyframes anim-${id} {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(${s}); }
}`;
    }
    case 'flicker': {
      const sy1 = (1 + 0.22 * mult).toFixed(2);
      const sx1 = Math.max(0.7, 1 - 0.1 * mult).toFixed(2);
      const sy2 = Math.max(0.7, 1 - 0.15 * mult).toFixed(2);
      const sx2 = (1 + 0.1 * mult).toFixed(2);
      return `@keyframes anim-${id} {
  0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
  25% { transform: scaleY(${sy1}) scaleX(${sx1}); opacity: 0.88; }
  50% { transform: scaleY(${sy2}) scaleX(${sx2}); opacity: 0.98; }
  75% { transform: scaleY(${sy1}) scaleX(${sx1}); opacity: 0.82; }
}`;
    }
    case 'wiggle': {
      const deg = (8 * mult).toFixed(1);
      return `@keyframes anim-${id} {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-${deg}deg); }
  75% { transform: rotate(${deg}deg); }
}`;
    }
    case 'spin': {
      return `@keyframes anim-${id} {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    }
    case 'heartbeat': {
      const s1 = (1 + 0.15 * mult).toFixed(2);
      return `@keyframes anim-${id} {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(${s1}); }
  28% { transform: scale(1); }
  42% { transform: scale(${s1}); }
  70% { transform: scale(1); }
}`;
    }
    case 'none':
    default:
      return '';
  }
}

/**
 * Generate full CSS block for all layers in the SVG
 */
export function generateCSSStyles(layers: SVGLayer[], isPaused: boolean = false): string {
  const rules: string[] = [];
  const keyframes: string[] = [];

  layers.forEach((layer) => {
    if (!layer.visible) {
      rules.push(`  #${layer.id} { display: none; }`);
      return;
    }

    if (layer.animation.type !== 'none') {
      const animName = `anim-${layer.id}`;
      const originCSS = getTransformOriginCSS(layer.animation.origin);
      const playState = isPaused ? 'paused' : 'running';

      rules.push(`  #${layer.id} {
    transform-box: fill-box;
    transform-origin: ${originCSS};
    animation: ${animName} ${layer.animation.duration}s ${layer.animation.easing} ${layer.animation.delay}s infinite;
    animation-play-state: ${playState};
  }`);

      const kf = generateKeyframes(layer.id, layer.animation);
      if (kf) keyframes.push(kf);
    }
  });

  return `/* VektorLoop Animated SVG Styles */
${rules.join('\n\n')}

${keyframes.join('\n\n')}`;
}

/**
 * Parse an SVG string into structured layers
 */
export function parseSVGString(svgContent: string): ParsedSVG {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Format SVG tidak valid: ' + (parserError.textContent?.slice(0, 120) || 'Gagal memproses XML'));
  }

  const svgElem = doc.querySelector('svg');
  if (!svgElem) {
    throw new Error('Tidak ditemukan elemen <svg> dalam file.');
  }

  // Sanitize potential scripts
  const scripts = svgElem.querySelectorAll('script');
  scripts.forEach((s) => s.remove());

  // Determine viewBox
  let viewBox = svgElem.getAttribute('viewBox');
  const widthAttr = svgElem.getAttribute('width') || '256';
  const heightAttr = svgElem.getAttribute('height') || '256';

  const numericWidth = parseFloat(widthAttr) || 256;
  const numericHeight = parseFloat(heightAttr) || 256;

  if (!viewBox) {
    viewBox = `0 0 ${numericWidth} ${numericHeight}`;
  }

  const layers: SVGLayer[] = [];
  let layerIndex = 1;

  // Function to extract color helper
  const extractColor = (el: Element): string | undefined => {
    const fill = el.getAttribute('fill');
    if (fill && fill !== 'none' && !fill.startsWith('url(')) return fill;
    const stroke = el.getAttribute('stroke');
    if (stroke && stroke !== 'none') return stroke;
    const style = el.getAttribute('style');
    if (style) {
      const match = style.match(/fill:\s*([^;]+)/i);
      if (match && match[1] && match[1] !== 'none') return match[1].trim();
    }
    return undefined;
  };

  // Check top-level child elements inside svg
  const directChildren = Array.from(svgElem.children).filter(
    (el) => !['defs', 'title', 'desc', 'metadata', 'style'].includes(el.tagName.toLowerCase())
  );

  // If there are top-level groups with multiple children, respect them
  const hasGroups = directChildren.some((el) => el.tagName.toLowerCase() === 'g');

  if (hasGroups && directChildren.length > 1) {
    directChildren.forEach((child) => {
      const tag = child.tagName.toLowerCase();
      const existingId = child.getAttribute('id') || `layer-${layerIndex}`;
      const safeId = existingId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const nameAttr = child.getAttribute('data-name') || child.getAttribute('id') || `Layer ${layerIndex} (${tag})`;

      // Clean element of existing animation inline transforms
      child.removeAttribute('transform-origin');

      const color = extractColor(child) || (child.querySelector('[fill]') ? extractColor(child.querySelector('[fill]')!) : '#3B82F6');

      layers.push({
        id: safeId,
        name: nameAttr,
        elements: [child.outerHTML],
        color: color || '#64748B',
        visible: true,
        animation: {
          type: 'none',
          duration: 1.5,
          delay: 0,
          easing: 'ease-in-out',
          origin: 'center',
          intensity: 1.0
        }
      });
      layerIndex++;
    });
  } else {
    // If it's a flat SVG or single container group, extract all geometric elements
    const shapes = Array.from(
      svgElem.querySelectorAll('path, circle, rect, polygon, polyline, ellipse, text')
    );

    if (shapes.length === 0) {
      // Fallback: take innerHTML as a single layer
      layers.push({
        id: 'layer-main',
        name: 'Vektor Utama (Main Shape)',
        elements: [svgElem.innerHTML],
        color: '#3B82F6',
        visible: true,
        animation: {
          type: 'floating',
          duration: 1.5,
          delay: 0,
          easing: 'ease-in-out',
          origin: 'center',
          intensity: 1.0
        }
      });
    } else {
      // Group shapes logically if there are many, or keep each shape if <= 10
      shapes.forEach((shape) => {
        const tag = shape.tagName.toLowerCase();
        const existingId = shape.getAttribute('id') || `shape-${layerIndex}`;
        const safeId = existingId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const color = extractColor(shape) || '#64748B';

        let friendlyName = `Komponen ${layerIndex}`;
        if (tag === 'circle') friendlyName = `Lingkaran ${layerIndex}`;
        else if (tag === 'rect') friendlyName = `Persegi ${layerIndex}`;
        else if (tag === 'path') friendlyName = `Garis/Path ${layerIndex}`;

        layers.push({
          id: safeId,
          name: friendlyName,
          elements: [shape.outerHTML],
          color,
          visible: true,
          animation: {
            type: 'none',
            duration: 1.5,
            delay: 0,
            easing: 'ease-in-out',
            origin: 'center',
            intensity: 1.0
          }
        });
        layerIndex++;
      });
    }
  }

  return {
    title: 'Custom Vector Asset',
    viewBox,
    width: numericWidth,
    height: numericHeight,
    layers
  };
}

/**
 * Builds the final standalone Animated SVG string with injected CSS styles
 */
export function buildAnimatedSVGString(parsedSvg: ParsedSVG, isPaused: boolean = false): string {
  const css = generateCSSStyles(parsedSvg.layers, isPaused);

  const layerMarkups = parsedSvg.layers
    .map((layer) => {
      // Wrap in a group with id corresponding to layer.id
      const innerContent = layer.elements.join('\n    ');
      return `  <!-- Layer: ${layer.name} -->
  <g id="${layer.id}">
    ${innerContent}
  </g>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${parsedSvg.viewBox}" width="${parsedSvg.width}" height="${parsedSvg.height}">
  <defs>
    <style type="text/css">
<![CDATA[
${css}
]]>
    </style>
  </defs>

${layerMarkups}
</svg>`;
}

/**
 * Generates an HTML + CSS embed code snippet
 */
export function generateHTMLEmbedCode(parsedSvg: ParsedSVG): string {
  const svgString = buildAnimatedSVGString(parsedSvg, false);
  return `<!-- VektorLoop Animated SVG Integration -->
<div class="vectorloop-container" style="max-width: 320px; width: 100%; aspect-ratio: 1; display: inline-flex; align-items: center; justify-content: center;">
  ${svgString}
</div>`;
}

/**
 * Generates a React component code snippet
 */
export function generateReactComponentCode(parsedSvg: ParsedSVG): string {
  const svgString = buildAnimatedSVGString(parsedSvg, false);
  return `import React from 'react';

export default function AnimatedIcon({ className = "w-48 h-48", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: \`${svgString.replace(/`/g, '\\`')}\` }} />
  );
}`;
}
