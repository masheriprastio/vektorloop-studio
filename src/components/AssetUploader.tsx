import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Image as ImageIcon, Sliders, Check } from 'lucide-react';
import { ParsedSVG } from '../types';
import { BUILT_IN_PRESETS } from '../utils/presets';
import { parseSVGString } from '../utils/svgParser';
import { vectorizeRasterImage, VectorizeOptions } from '../utils/imageVectorizer';

interface AssetUploaderProps {
  onLoadSVG: (svg: ParsedSVG) => void;
  activePresetTitle?: string;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  onLoadSVG,
  activePresetTitle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Raster modal options
  const [pendingRasterFile, setPendingRasterFile] = useState<File | null>(null);
  const [rasterMode, setRasterMode] = useState<'color' | 'silhouette'>('color');
  const [colorCount, setColorCount] = useState<number>(3);
  const [threshold, setThreshold] = useState<number>(128);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

    if (isSvg) {
      setIsProcessing(true);
      try {
        const text = await file.text();
        const parsed = parseSVGString(text);
        parsed.title = file.name.replace(/\.svg$/i, '');
        onLoadSVG(parsed);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memproses file SVG');
      } finally {
        setIsProcessing(false);
      }
    } else if (file.type.startsWith('image/')) {
      // Raster image: show raster vectorization options
      setPendingRasterFile(file);
    } else {
      setErrorMsg('Format file tidak didukung. Harap gunakan SVG, PNG, atau JPG.');
    }
  };

  const handleApplyRaster = async () => {
    if (!pendingRasterFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const opts: VectorizeOptions = {
        mode: rasterMode,
        colorCount,
        threshold
      };
      const result = await vectorizeRasterImage(pendingRasterFile, opts);
      onLoadSVG(result);
      setPendingRasterFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memvektorisasi gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border-b border-neutral-800 space-y-3 shrink-0">
      {/* Preset Icons Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Contoh Preset
          </span>
          <span className="text-[10px] text-neutral-500">Siap pakai</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {BUILT_IN_PRESETS.map((preset) => {
            const isSelected = activePresetTitle === preset.title;
            const iconEmoji = preset.title?.includes('Roket')
              ? '🚀'
              : preset.title?.includes('Lonceng')
              ? '🔔'
              : '☕';
            return (
              <button
                key={preset.title}
                onClick={() => onLoadSVG(preset)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all text-left truncate ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700/80 text-neutral-300 hover:text-white'
                }`}
              >
                <span>{iconEmoji}</span>
                <span className="truncate">{preset.title?.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) {
            handleFileProcess(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-neutral-700/80 hover:border-neutral-600 bg-neutral-950/40 hover:bg-neutral-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-200">
              {isProcessing ? 'Memproses Vektor...' : 'Unggah File Gambar'}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              SVG langsung berlapis · PNG/JPG konversi vektor
            </p>
          </div>
        </div>
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-[11px] text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Raster Tracing Configuration Modal/Drawer */}
      {pendingRasterFile && (
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Konversi Raster ke Vektor
            </span>
            <button
              onClick={() => setPendingRasterFile(null)}
              className="text-[11px] text-neutral-400 hover:text-white"
            >
              Batal
            </button>
          </div>

          <div className="text-[11px] text-neutral-400 truncate">
            File: <span className="text-neutral-200 font-mono">{pendingRasterFile.name}</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg">
            <button
              onClick={() => setRasterMode('color')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
                rasterMode === 'color'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Multi-Layer Warna
            </button>
            <button
              onClick={() => setRasterMode('silhouette')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
                rasterMode === 'silhouette'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Siluet Monokrom
            </button>
          </div>

          {rasterMode === 'color' ? (
            <div>
              <div className="flex items-center justify-between text-[11px] text-neutral-300 mb-1">
                <span>Jumlah Layer Warna Terpisah</span>
                <span className="font-mono text-amber-400">{colorCount} Warna</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={colorCount}
                onChange={(e) => setColorCount(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[11px] text-neutral-300 mb-1">
                <span>Ambang Batas Gelap/Terang (Threshold)</span>
                <span className="font-mono text-amber-400">{threshold}</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          )}

          <button
            onClick={handleApplyRaster}
            disabled={isProcessing}
            className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
          >
            {isProcessing ? 'Sedang Mentranslasikan...' : 'Konversi & Terapkan Animasi'}
          </button>
        </div>
      )}
    </div>
  );
};
