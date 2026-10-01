import React, { useState } from 'react';
import { ParsedSVG, SVGLayer } from './types';
import { PRESET_ROCKET } from './utils/presets';
import { Header } from './components/Header';
import { AssetUploader } from './components/AssetUploader';
import { LayersPanel } from './components/LayersPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ExportModal } from './components/ExportModal';
import { generateStandaloneHTML } from './utils/standaloneHtmlGenerator';

export default function App() {
  const [parsedSvg, setParsedSvg] = useState<ParsedSVG>(PRESET_ROCKET);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Update layer metadata
  const handleUpdateLayer = (layerId: string, updated: Partial<SVGLayer>) => {
    setParsedSvg((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updated } : layer
      )
    }));
  };

  // Update layer animation configs
  const handleUpdateLayerAnimation = (
    layerId: string,
    anim: Partial<SVGLayer['animation']>
  ) => {
    setParsedSvg((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === layerId
          ? { ...layer, animation: { ...layer.animation, ...anim } }
          : layer
      )
    }));
  };

  // Load a new SVG or preset
  const handleLoadSVG = (newSvg: ParsedSVG) => {
    setParsedSvg(newSvg);
    setIsPaused(false);
  };

  // Toggle playback
  const handleTogglePlay = () => {
    setIsPaused((prev) => !prev);
  };

  // Reset animations
  const handleReset = () => {
    // Force a re-trigger of CSS animations by briefly toggling layers
    const cloned = JSON.parse(JSON.stringify(parsedSvg));
    setParsedSvg(cloned);
  };

  // Download standalone single-file HTML directly
  const handleDownloadStandalone = () => {
    const htmlContent = generateStandaloneHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vektorloop-standalone-app.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
      {/* Top Bar */}
      <Header
        onExportClick={() => setIsExportOpen(true)}
        onDownloadStandalone={handleDownloadStandalone}
        isPaused={isPaused}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
      />

      {/* Main Workspace: Split-Screen Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Side: Controls, Uploader, Layer List */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] border-r border-neutral-800 bg-neutral-900/90 flex flex-col overflow-hidden shrink-0 z-10 shadow-xl">
          {/* Asset & Preset Uploader */}
          <AssetUploader
            onLoadSVG={handleLoadSVG}
            activePresetTitle={parsedSvg.title}
          />

          {/* Layer Separation & Looping Animation Settings */}
          <LayersPanel
            layers={parsedSvg.layers}
            onUpdateLayer={handleUpdateLayer}
            onUpdateLayerAnimation={handleUpdateLayerAnimation}
          />
        </aside>

        {/* Right Side: Realtime Studio Canvas & Viewport */}
        <section className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <PreviewCanvas
            parsedSvg={parsedSvg}
            isPaused={isPaused}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
          />
        </section>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        parsedSvg={parsedSvg}
      />
    </div>
  );
}
