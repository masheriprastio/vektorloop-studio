import React, { useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Sun,
  Moon,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Palette
} from 'lucide-react';
import { ParsedSVG, CanvasBackground } from '../types';
import { buildAnimatedSVGString } from '../utils/svgParser';

interface PreviewCanvasProps {
  parsedSvg: ParsedSVG;
  isPaused: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  parsedSvg,
  isPaused,
  onTogglePlay,
  onReset
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [background, setBackground] = useState<CanvasBackground>('checkerboard');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate the live SVG markup
  const animatedSvgString = buildAnimatedSVGString(parsedSvg, isPaused);

  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, +(prev - 0.25).toFixed(2)));
  const handleZoomReset = () => setZoom(1);

  // Get background class / style
  const getBackgroundStyle = () => {
    switch (background) {
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'dark':
        return 'bg-neutral-950 text-neutral-100';
      case 'navy':
        return 'bg-slate-900 text-slate-100';
      case 'emerald':
        return 'bg-emerald-950 text-emerald-100';
      case 'checkerboard':
      default:
        return 'bg-neutral-950 text-neutral-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative select-none">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/60 px-4 flex items-center justify-between shrink-0 z-10 backdrop-blur">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPaused
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Mulai (Play)' : 'Jeda (Pause)'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition"
            title="Reset Posisi & Siklus Animasi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* Asset Info */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
            <span className="font-mono text-[11px] text-neutral-300">
              {parsedSvg.viewBox}
            </span>
            <span>·</span>
            <span>{parsedSvg.layers.filter((l) => l.visible).length} Aktif</span>
          </div>
        </div>

        {/* Canvas Display Controls: Background & Zoom */}
        <div className="flex items-center gap-2">
          {/* Background Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setBackground('checkerboard')}
              className={`p-1.5 rounded-md transition ${
                background === 'checkerboard'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Latar Transparan (Checkerboard)"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBackground('dark')}
              className={`p-1.5 rounded-md transition ${
                background === 'dark'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Latar Gelap (Dark Mode)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBackground('light')}
              className={`p-1.5 rounded-md transition ${
                background === 'light'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Latar Terang (Light Mode)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBackground('navy')}
              className={`p-1.5 rounded-md transition ${
                background === 'navy'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Latar Navy Deep"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md transition"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-300 hover:text-white transition"
              title="Reset Zoom ke 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md transition"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-auto flex items-center justify-center p-8 transition-colors ${getBackgroundStyle()}`}
      >
        {/* Subtle grid background when checkerboard mode */}
        {background === 'checkerboard' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #1e293b 25%, transparent 25%),
                linear-gradient(-45deg, #1e293b 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #1e293b 75%),
                linear-gradient(-45deg, transparent 75%, #1e293b 75%)
              `,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
            }}
          />
        )}

        {/* Crosshair guidelines */}
        {showGridLines && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-px bg-white/5 absolute" />
            <div className="h-full w-px bg-white/5 absolute" />
          </div>
        )}

        {/* SVG Container on Stage */}
        <div
          className="relative transition-transform duration-150 ease-out z-10 flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Framed Canvas Box */}
          <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 relative flex items-center justify-center p-4">
            <div
              className="w-full h-full drop-shadow-2xl flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: animatedSvgString }}
            />
          </div>
        </div>

        {/* Floating status tag */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-neutral-900/80 backdrop-blur border border-neutral-800 text-[11px] text-neutral-400 font-mono shadow-lg flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span>{isPaused ? 'Animasi Dijeda' : 'Animasi Berjalan (CSS 60fps)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
