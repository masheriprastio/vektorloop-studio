import React from 'react';
import { Download, Code2, Sparkles, FileCode, Play, Pause, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  onDownloadStandalone: () => void;
  isPaused: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  onDownloadStandalone,
  isPaused,
  onTogglePlay,
  onReset
}) => {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur px-5 flex items-center justify-between z-20 shrink-0">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <Sparkles className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
        </div>
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          VektorLoop <span className="font-normal text-xs text-neutral-400 font-mono ml-1 hidden sm:inline">Studio</span>
        </span>
      </div>

      {/* Zone 2: Navigation & Quick Play Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-neutral-950/70 border border-neutral-800 rounded-lg p-0.5">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isPaused
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
            title={isPaused ? 'Lanjutkan Animasi (Play)' : 'Jeda Animasi (Pause)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isPaused ? 'Mulai' : 'Jeda'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
            title="Reset Animasi"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone 3: Export Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDownloadStandalone}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium rounded-lg border border-neutral-700 transition"
          title="Unduh seluruh aplikasi web dalam 1 file HTML mandiri"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Single-File HTML</span>
        </button>

        <button
          onClick={onExportClick}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm shadow-amber-500/10 whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Vektor</span>
        </button>
      </div>
    </header>
  );
};
