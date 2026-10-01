import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Flame,
  Activity,
  MoveVertical,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronRight,
  Edit2,
  Check
} from 'lucide-react';
import { SVGLayer, AnimationType, TransformOrigin, EasingFunction } from '../types';

interface LayersPanelProps {
  layers: SVGLayer[];
  onUpdateLayer: (layerId: string, updated: Partial<SVGLayer>) => void;
  onUpdateLayerAnimation: (layerId: string, anim: Partial<SVGLayer['animation']>) => void;
}

const ANIMATION_OPTIONS: { type: AnimationType; label: string; icon: string }[] = [
  { type: 'none', label: 'Diam (Tidak Ada Animasi)', icon: '⏸' },
  { type: 'floating', label: 'Melayang (Floating Y-axis)', icon: '☁️' },
  { type: 'shake', label: 'Getar / Roket Thruster (Shake)', icon: '⚡' },
  { type: 'flicker', label: 'Lidah Api Cepat (Flame Flicker)', icon: '🔥' },
  { type: 'pulse', label: 'Napas Membesar (Scale Pulse)', icon: '✨' },
  { type: 'wiggle', label: 'Goyang Pendulum (Wiggle)', icon: '🔔' },
  { type: 'heartbeat', label: 'Detak Ganda (Heartbeat)', icon: '💓' },
  { type: 'spin', label: 'Berputar 360° (Continuous Spin)', icon: '🔄' },
];

const ORIGIN_OPTIONS: { origin: TransformOrigin; label: string }[] = [
  { origin: 'center', label: 'Tengah (Center)' },
  { origin: 'top-center', label: 'Atas (Top)' },
  { origin: 'bottom-center', label: 'Bawah (Bottom)' },
  { origin: 'left', label: 'Kiri (Left)' },
  { origin: 'right', label: 'Kanan (Right)' },
];

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  onUpdateLayer,
  onUpdateLayerAnimation
}) => {
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(
    layers.length > 0 ? layers[0].id : null
  );
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const startEditName = (layer: SVGLayer) => {
    setEditingNameId(layer.id);
    setTempName(layer.name);
  };

  const saveEditName = (layerId: string) => {
    if (tempName.trim()) {
      onUpdateLayer(layerId, { name: tempName.trim() });
    }
    setEditingNameId(null);
  };

  const handleBulkAnimation = (type: AnimationType) => {
    layers.forEach((l) => {
      onUpdateLayerAnimation(l.id, { type });
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 overflow-hidden">
      {/* Panel Sub-header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-semibold text-white tracking-wide">
            Komponen & Layer Vektor
          </h2>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
            {layers.length}
          </span>
        </div>

        {/* Quick bulk action */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBulkAnimation('floating')}
            className="text-[10px] text-neutral-400 hover:text-amber-300 px-2 py-0.5 rounded hover:bg-neutral-800 transition"
            title="Terapkan efek floating ke semua layer"
          >
            Float Semua
          </button>
          <span className="text-neutral-700">·</span>
          <button
            onClick={() => handleBulkAnimation('none')}
            className="text-[10px] text-neutral-400 hover:text-red-300 px-2 py-0.5 rounded hover:bg-neutral-800 transition"
            title="Nonaktifkan animasi di semua layer"
          >
            Matikan
          </button>
        </div>
      </div>

      {/* Layer List Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {layers.length === 0 ? (
          <div className="text-center py-12 px-4 text-neutral-500 text-xs">
            Tidak ada layer terdeteksi. Unggah file SVG atau gambar untuk memulai.
          </div>
        ) : (
          layers.map((layer, index) => {
            const isExpanded = expandedLayerId === layer.id;
            const anim = layer.animation;

            return (
              <div
                key={layer.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-neutral-950/80 border-neutral-700 shadow-lg'
                    : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Layer Bar Header */}
                <div className="p-3 flex items-center gap-2.5">
                  {/* Expand Toggle */}
                  <button
                    onClick={() =>
                      setExpandedLayerId(isExpanded ? null : layer.id)
                    }
                    className="text-neutral-500 hover:text-neutral-300 transition"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Color Swatch */}
                  <div
                    className="w-4 h-4 rounded-md border border-white/20 shrink-0 shadow-inner"
                    style={{ backgroundColor: layer.color || '#3B82F6' }}
                    title={`Warna: ${layer.color || 'Default'}`}
                  />

                  {/* Layer Name / Edit */}
                  <div className="flex-1 min-w-0">
                    {editingNameId === layer.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditName(layer.id);
                            if (e.key === 'Escape') setEditingNameId(null);
                          }}
                          autoFocus
                          className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => saveEditName(layer.id)}
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <span
                          className={`text-xs font-medium truncate ${
                            layer.visible ? 'text-neutral-200' : 'text-neutral-500 line-through'
                          }`}
                        >
                          {layer.name}
                        </span>
                        <button
                          onClick={() => startEditName(layer)}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-neutral-300 transition p-0.5"
                          title="Ubah nama layer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Animation Badge */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                      anim.type !== 'none'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {anim.type}
                  </span>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() =>
                      onUpdateLayer(layer.id, { visible: !layer.visible })
                    }
                    className={`p-1 rounded transition ${
                      layer.visible
                        ? 'text-neutral-400 hover:text-neutral-200'
                        : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                    title={layer.visible ? 'Sembunyikan layer' : 'Tampilkan layer'}
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded Animation Controls */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-neutral-800/80 space-y-3">
                    {/* Animation Type Selector */}
                    <div>
                      <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Pilihan Animasi
                      </label>
                      <select
                        value={anim.type}
                        onChange={(e) =>
                          onUpdateLayerAnimation(layer.id, {
                            type: e.target.value as AnimationType
                          })
                        }
                        className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {ANIMATION_OPTIONS.map((opt) => (
                          <option key={opt.type} value={opt.type}>
                            {opt.icon} {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {anim.type !== 'none' && (
                      <>
                        {/* Speed / Duration Slider */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">Kecepatan Siklus (Durasi)</span>
                            <span className="font-mono text-amber-400 font-semibold">
                              {anim.duration}s
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.5"
                            step="0.05"
                            value={anim.duration}
                            onChange={(e) =>
                              onUpdateLayerAnimation(layer.id, {
                                duration: parseFloat(e.target.value)
                              })
                            }
                            className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg"
                          />
                          <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5 font-mono">
                            <span>0.2s (Cepat)</span>
                            <span>3.5s (Lambat)</span>
                          </div>
                        </div>

                        {/* Intensity / Amplitude Slider */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">Kekuatan Efek (Intensitas)</span>
                            <span className="font-mono text-amber-400 font-semibold">
                              {anim.intensity}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.3"
                            max="2.0"
                            step="0.1"
                            value={anim.intensity}
                            onChange={(e) =>
                              onUpdateLayerAnimation(layer.id, {
                                intensity: parseFloat(e.target.value)
                              })
                            }
                            className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg"
                          />
                        </div>

                        {/* Grid: Origin & Delay */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {/* Transform Origin */}
                          <div>
                            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                              Titik Poros (Origin)
                            </label>
                            <select
                              value={anim.origin}
                              onChange={(e) =>
                                onUpdateLayerAnimation(layer.id, {
                                  origin: e.target.value as TransformOrigin
                                })
                              }
                              className="w-full bg-neutral-900 border border-neutral-700/80 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                            >
                              {ORIGIN_OPTIONS.map((orig) => (
                                <option key={orig.origin} value={orig.origin}>
                                  {orig.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Delay */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                              <span>Jeda Delay</span>
                              <span className="font-mono text-neutral-300 font-normal">
                                {anim.delay}s
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1.5"
                              step="0.05"
                              value={anim.delay}
                              onChange={(e) =>
                                onUpdateLayerAnimation(layer.id, {
                                  delay: parseFloat(e.target.value)
                                })
                              }
                              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg mt-2"
                            />
                          </div>
                        </div>

                        {/* Easing Selector */}
                        <div>
                          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                            Kurva Gerak (Easing)
                          </label>
                          <select
                            value={anim.easing}
                            onChange={(e) =>
                              onUpdateLayerAnimation(layer.id, {
                                easing: e.target.value as EasingFunction
                              })
                            }
                            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-md px-2 py-1 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                          >
                            <option value="ease-in-out">Halus (ease-in-out)</option>
                            <option value="linear">Stabil Linier (linear)</option>
                            <option value="ease">Reguler (ease)</option>
                            <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">
                              Membal (Bouncy Spring)
                            </option>
                            <option value="cubic-bezier(0.4, 0, 0.2, 1)">
                              Material Kecepatan (Smooth Decel)
                            </option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
