import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ParsedSVG } from '../types';
import {
  buildAnimatedSVGString,
  generateHTMLEmbedCode,
  generateReactComponentCode
} from '../utils/svgParser';
import { generateStandaloneHTML } from '../utils/standaloneHtmlGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedSvg: ParsedSVG;
}

type TabType = 'svg' | 'html' | 'react' | 'singlefile';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  parsedSvg
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('svg');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const animatedSvgString = buildAnimatedSVGString(parsedSvg, false);
  const htmlEmbedCode = generateHTMLEmbedCode(parsedSvg);
  const reactComponentCode = generateReactComponentCode(parsedSvg);
  const standaloneHTML = generateStandaloneHTML();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([animatedSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(parsedSvg.title || 'vektorloop-icon').toLowerCase().replace(/\s+/g, '-')}-animated.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Ekspor Aset Animasi Vektor</h3>
              <p className="text-[11px] text-neutral-400">
                Pilih format keluaran yang sesuai dengan kebutuhan proyek web Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('svg')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'svg'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            File SVG (.svg)
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'html'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            HTML & CSS Murni
          </button>

          <button
            onClick={() => setActiveTab('react')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'react'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Komponen React (TSX)
          </button>

          <button
            onClick={() => setActiveTab('singlefile')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'singlefile'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            Aplikasi Single-File HTML
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'svg' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Self-Contained Animated SVG File
                </p>
                <p className="text-neutral-400 text-[11px]">
                  File SVG ini telah disisipi tag <code className="text-amber-300">&lt;style&gt;</code> dan keyframes CSS animasi. Bisa langsung digunakan dalam tag <code className="text-amber-300">&lt;img src="..."&gt;</code>, latar web, maupun aplikasi mobile.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400 font-mono">
                  Ukuran: {parsedSvg.width}x{parsedSvg.height} · {parsedSvg.layers.length} Layer
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(animatedSvgString)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Kode SVG'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSVG}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File .SVG</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-64 leading-relaxed">
                  {animatedSvgString}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300">
                <p className="font-semibold text-white mb-1">Snippet HTML & CSS Inline</p>
                <p className="text-neutral-400 text-[11px]">
                  Tempel langsung ke dalam halaman web Anda tanpa ketergantungan library luar (zero-dependency).
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleCopy(htmlEmbedCode)}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode HTML'}</span>
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-72 leading-relaxed">
                {htmlEmbedCode}
              </pre>
            </div>
          )}

          {activeTab === 'react' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300">
                <p className="font-semibold text-white mb-1">Komponen React (TSX / JSX)</p>
                <p className="text-neutral-400 text-[11px]">
                  Komponen React modular siap pakai dengan dukungan styling inline dan Tailwind.
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleCopy(reactComponentCode)}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Komponen React'}</span>
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-72 leading-relaxed">
                {reactComponentCode}
              </pre>
            </div>
          )}

          {activeTab === 'singlefile' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <p className="font-semibold text-white">
                    Aplikasi Web Single-File HTML Mandiri
                  </p>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Sesuai permintaan Anda, kami telah membungkus seluruh aplikasi studio ini ke dalam <strong>1 file HTML tunggal</strong> yang berisi HTML5, CSS Tailwind CDN, pustaka Lucide Icons CDN, dan Vanilla JavaScript murni. File ini dapat dibuka langsung di browser manapun tanpa server, npm, atau kompilasi!
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">
                  File: <span className="font-mono text-neutral-300">vektorloop-standalone-app.html</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(standaloneHTML)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Seluruh Kode HTML'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSingleFile}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File HTML Tunggal</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-64 leading-relaxed">
                {standaloneHTML.slice(0, 1500)}...
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Kompatibel dengan semua browser modern (Chrome, Safari, Firefox, Edge)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
