/**
 * Generates a complete, single-file HTML application containing Tailwind CSS (CDN),
 * Lucide Icons (CDN), and Vanilla JavaScript.
 * This satisfies the user's specific request for an all-in-one standalone HTML file.
 */
export function generateStandaloneHTML(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VektorLoop Studio - Single File Edition</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .checkerboard-pattern {
      background-image: linear-gradient(45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(-45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #1e293b 75%),
                        linear-gradient(-45deg, transparent 75%, #1e293b 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      background-color: #0f172a;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">

  <!-- Header -->
  <header class="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between z-20">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <i data-lucide="sparkles" class="w-4 h-4 text-slate-950"></i>
      </div>
      <h1 class="text-base font-bold tracking-tight text-white flex items-center gap-2">
        VektorLoop <span class="text-xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">Single-File</span>
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <button id="btn-export-svg" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
        <i data-lucide="download" class="w-3.5 h-3.5"></i> Ekspor SVG
      </button>
      <button id="btn-copy-code" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition border border-slate-700">
        <i data-lucide="code" class="w-3.5 h-3.5"></i> Salin HTML
      </button>
    </div>
  </header>

  <!-- Main Content Layout (Split Screen) -->
  <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
    
    <!-- Left Column: Controls & Layers -->
    <div class="w-full lg:w-[420px] border-r border-slate-800 bg-slate-900 flex flex-col overflow-y-auto">
      
      <!-- Upload & Preset Section -->
      <div class="p-4 border-b border-slate-800">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aset & Preset</span>
          <div class="flex gap-1.5">
            <button id="preset-rocket-btn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">🚀 Roket</button>
            <button id="preset-bell-btn" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">🔔 Lonceng</button>
          </div>
        </div>

        <div id="drop-zone" class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/40">
          <i data-lucide="upload-cloud" class="w-7 h-7 mx-auto text-slate-400 mb-2"></i>
          <p class="text-xs text-slate-300 font-medium">Tarik & lepas file SVG, PNG, atau JPG</p>
          <p class="text-[11px] text-slate-500 mt-1">atau klik untuk menelusuri komputer</p>
          <input type="file" id="file-input" class="hidden" accept=".svg,.png,.jpg,.jpeg">
        </div>
      </div>

      <!-- Layers & Components Section -->
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <i data-lucide="layers" class="w-4 h-4 text-amber-400"></i>
            <span class="text-xs font-semibold text-slate-300">Daftar Layer Terdeteksi</span>
          </div>
          <span id="layer-count-badge" class="text-[11px] text-slate-400 font-mono">0 Layer</span>
        </div>

        <!-- Layer List Container -->
        <div id="layer-list" class="space-y-2.5 flex-1 overflow-y-auto pr-1"></div>
      </div>
    </div>

    <!-- Right Column: Live Studio Preview -->
    <div class="flex-1 flex flex-col bg-slate-950 relative">
      
      <!-- Studio Toolbar -->
      <div class="h-12 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-900/40">
        <!-- Play / Pause / Reset -->
        <div class="flex items-center gap-1.5">
          <button id="btn-toggle-play" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 border border-slate-700">
            <i id="play-icon" data-lucide="pause" class="w-3.5 h-3.5"></i>
            <span id="play-text">Jeda</span>
          </button>
          <button id="btn-reset-anim" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700" title="Ulang Animasi">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Background & Zoom Controls -->
        <div class="flex items-center gap-3">
          <!-- Background Buttons -->
          <div class="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button id="bg-checker-btn" class="p-1.5 rounded hover:bg-slate-800 text-slate-300" title="Pola Transparan">
              <i data-lucide="grid" class="w-3.5 h-3.5"></i>
            </button>
            <button id="bg-dark-btn" class="p-1.5 rounded hover:bg-slate-800 text-slate-300" title="Mode Gelap">
              <i data-lucide="moon" class="w-3.5 h-3.5"></i>
            </button>
            <button id="bg-light-btn" class="p-1.5 rounded hover:bg-slate-800 text-slate-300" title="Mode Terang">
              <i data-lucide="sun" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Zoom -->
          <div class="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button id="btn-zoom-out" class="p-1.5 hover:bg-slate-800 rounded"><i data-lucide="minus" class="w-3 h-3"></i></button>
            <span id="zoom-label" class="px-1.5 font-mono text-[11px]">100%</span>
            <button id="btn-zoom-in" class="p-1.5 hover:bg-slate-800 rounded"><i data-lucide="plus" class="w-3 h-3"></i></button>
          </div>
        </div>
      </div>

      <!-- Preview Viewport Canvas -->
      <div id="preview-viewport" class="flex-1 checkerboard-pattern flex items-center justify-center p-8 overflow-hidden relative select-none">
        <div id="svg-stage" class="transition-transform duration-100 flex items-center justify-center w-72 h-72"></div>
      </div>
    </div>
  </div>

  <script>
    // State
    const state = {
      isPaused: false,
      zoom: 1,
      bg: 'checkerboard',
      layers: [],
      viewBox: '0 0 256 256'
    };

    // Default Preset: Rocket
    const presetRocket = {
      viewBox: '0 0 256 256',
      layers: [
        {
          id: 'layer-stars',
          name: 'Bintang & Kilau (Stars)',
          color: '#FACC15',
          visible: true,
          elements: ['<circle cx="36" cy="48" r="4" fill="#FACC15" opacity="0.8" />', '<circle cx="216" cy="72" r="5" fill="#FDE047" opacity="0.9" />'],
          anim: { type: 'pulse', duration: 1.8, origin: 'center' }
        },
        {
          id: 'layer-flame',
          name: 'Semburan Api (Rocket Flame)',
          color: '#F97316',
          visible: true,
          elements: ['<path d="M 112 188 C 104 212 108 244 128 252 C 148 244 152 212 144 188 Z" fill="#F97316" />', '<path d="M 118 190 C 114 206 118 228 128 234 C 138 228 142 206 138 190 Z" fill="#FEF08A" />'],
          anim: { type: 'flicker', duration: 0.45, origin: 'top' }
        },
        {
          id: 'layer-body',
          name: 'Badan Utama (Rocket Fuselage)',
          color: '#3B82F6',
          visible: true,
          elements: ['<path d="M 128 28 C 104 68 96 128 98 182 L 158 182 C 160 128 152 68 128 28 Z" fill="#E2E8F0" />', '<path d="M 96 148 L 68 184 C 64 190 70 196 78 194 L 98 182 Z" fill="#EF4444" />', '<path d="M 160 148 L 188 184 C 192 190 186 196 178 194 L 158 182 Z" fill="#DC2626" />'],
          anim: { type: 'floating', duration: 1.6, origin: 'center' }
        },
        {
          id: 'layer-window',
          name: 'Kaca Kokpit (Cockpit Glass)',
          color: '#38BDF8',
          visible: true,
          elements: ['<circle cx="128" cy="132" r="18" fill="#1E293B" stroke="#94A3B8" stroke-width="4" />', '<circle cx="128" cy="132" r="14" fill="#38BDF8" />'],
          anim: { type: 'floating', duration: 1.6, origin: 'center' }
        }
      ]
    };

    const presetBell = {
      viewBox: '0 0 256 256',
      layers: [
        {
          id: 'layer-waves',
          name: 'Gelombang Notifikasi',
          color: '#38BDF8',
          visible: true,
          elements: ['<path d="M 64 100 C 52 118 52 138 64 156" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" fill="none" />', '<path d="M 192 100 C 204 118 204 138 192 156" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" fill="none" />'],
          anim: { type: 'pulse', duration: 1.2, origin: 'center' }
        },
        {
          id: 'layer-bell',
          name: 'Kubah Lonceng',
          color: '#FBBF24',
          visible: true,
          elements: ['<path d="M 128 36 C 120 36 114 42 114 50 L 114 56 C 88 64 74 96 74 134 C 74 162 62 172 58 178 C 56 182 58 188 64 188 L 192 188 C 198 188 200 182 198 178 C 194 172 182 162 182 134 C 182 96 168 64 142 56 L 142 50 C 142 42 136 36 128 36 Z" fill="#FBBF24" />', '<circle cx="128" cy="198" r="18" fill="#B45309" />'],
          anim: { type: 'wiggle', duration: 1.0, origin: 'top' }
        },
        {
          id: 'layer-badge',
          name: 'Badge Angka Merah',
          color: '#EF4444',
          visible: true,
          elements: ['<circle cx="186" cy="74" r="18" fill="#EF4444" stroke="#FFFFFF" stroke-width="4" /><text x="186" y="80" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="bold">1</text>'],
          anim: { type: 'heartbeat', duration: 1.4, origin: 'center' }
        }
      ]
    };

    function getKeyframes(id, anim) {
      if (!anim || anim.type === 'none') return '';
      switch (anim.type) {
        case 'floating':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }\`;
        case 'shake':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2px, 2px); } 50% { transform: translate(2px, -2px); } 75% { transform: translate(-2px, -1px); } }\`;
        case 'pulse':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }\`;
        case 'flicker':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; } 25% { transform: scaleY(1.22) scaleX(0.92); opacity: 0.9; } 50% { transform: scaleY(0.88) scaleX(1.08); opacity: 0.98; } 75% { transform: scaleY(1.15) scaleX(0.95); opacity: 0.85; } }\`;
        case 'wiggle':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }\`;
        case 'heartbeat':
          return \`@keyframes anim-\${id} { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.15); } 28% { transform: scale(1); } 42% { transform: scale(1.15); } 70% { transform: scale(1); } }\`;
        default:
          return '';
      }
    }

    function renderStage() {
      const stage = document.getElementById('svg-stage');
      const cssRules = [];
      const keyframes = [];

      state.layers.forEach(layer => {
        if (!layer.visible) {
          cssRules.push(\`#\${layer.id} { display: none; }\`);
          return;
        }
        if (layer.anim && layer.anim.type !== 'none') {
          const origin = layer.anim.origin === 'top' ? 'top center' : 'center center';
          const playState = state.isPaused ? 'paused' : 'running';
          cssRules.push(\`#\${layer.id} {
            transform-box: fill-box;
            transform-origin: \${origin};
            animation: anim-\${layer.id} \${layer.anim.duration}s ease-in-out infinite;
            animation-play-state: \${playState};
          }\`);
          keyframes.push(getKeyframes(layer.id, layer.anim));
        }
      });

      const layerContent = state.layers.map(layer => \`<g id="\${layer.id}">\${layer.elements.join('')}</g>\`).join('');

      const svgHTML = \`<svg viewBox="\${state.viewBox}" class="w-full h-full drop-shadow-2xl">
        <style>
          \${cssRules.join('\\n')}
          \${keyframes.join('\\n')}
        </style>
        \${layerContent}
      </svg>\`;

      stage.innerHTML = svgHTML;
      stage.style.transform = \`scale(\${state.zoom})\`;
    }

    function renderLayersList() {
      const list = document.getElementById('layer-list');
      const badge = document.getElementById('layer-count-badge');
      badge.textContent = \`\${state.layers.length} Layer\`;

      list.innerHTML = state.layers.map((layer, index) => \`
        <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-full border border-white/20" style="background-color: \${layer.color || '#3B82F6'}"></span>
              <span class="text-xs font-semibold text-slate-200">\${layer.name}</span>
            </div>
            <button onclick="toggleVisibility(\${index})" class="text-slate-400 hover:text-slate-200">
              <i data-lucide="\${layer.visible ? 'eye' : 'eye-off'}" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">Preset Efek</label>
              <select onchange="updateAnimation(\${index}, 'type', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200">
                <option value="none" \${layer.anim.type === 'none' ? 'selected' : ''}>Diam (None)</option>
                <option value="floating" \${layer.anim.type === 'floating' ? 'selected' : ''}>Melayang (Floating)</option>
                <option value="shake" \${layer.anim.type === 'shake' ? 'selected' : ''}>Getar (Shake)</option>
                <option value="pulse" \${layer.anim.type === 'pulse' ? 'selected' : ''}>Napas (Pulse)</option>
                <option value="flicker" \${layer.anim.type === 'flicker' ? 'selected' : ''}>Api (Flicker)</option>
                <option value="wiggle" \${layer.anim.type === 'wiggle' ? 'selected' : ''}>Goyang (Wiggle)</option>
                <option value="heartbeat" \${layer.anim.type === 'heartbeat' ? 'selected' : ''}>Detak (Heartbeat)</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">Durasi (\${layer.anim.duration}s)</label>
              <input type="range" min="0.3" max="3.0" step="0.1" value="\${layer.anim.duration}" oninput="updateAnimation(\${index}, 'duration', parseFloat(this.value))" class="w-full accent-amber-500">
            </div>
          </div>
        </div>
      \`).join('');

      lucide.createIcons();
    }

    window.toggleVisibility = function(idx) {
      state.layers[idx].visible = !state.layers[idx].visible;
      renderStage();
      renderLayersList();
    };

    window.updateAnimation = function(idx, field, val) {
      state.layers[idx].anim[field] = val;
      renderStage();
      if (field === 'duration') {
        const label = document.querySelector(\`label[for="dur-\${idx}"]\`);
        if (label) label.textContent = \`Durasi (\${val}s)\`;
      }
    };

    function loadPreset(data) {
      state.viewBox = data.viewBox;
      state.layers = JSON.parse(JSON.stringify(data.layers));
      renderStage();
      renderLayersList();
    }

    // Handlers
    document.getElementById('preset-rocket-btn').onclick = () => loadPreset(presetRocket);
    document.getElementById('preset-bell-btn').onclick = () => loadPreset(presetBell);

    const playBtn = document.getElementById('btn-toggle-play');
    playBtn.onclick = () => {
      state.isPaused = !state.isPaused;
      document.getElementById('play-text').textContent = state.isPaused ? 'Mulai' : 'Jeda';
      document.getElementById('play-icon').setAttribute('data-lucide', state.isPaused ? 'play' : 'pause');
      lucide.createIcons();
      renderStage();
    };

    document.getElementById('btn-reset-anim').onclick = () => {
      renderStage();
    };

    document.getElementById('btn-zoom-in').onclick = () => {
      state.zoom = Math.min(2.5, state.zoom + 0.2);
      document.getElementById('zoom-label').textContent = Math.round(state.zoom * 100) + '%';
      renderStage();
    };

    document.getElementById('btn-zoom-out').onclick = () => {
      state.zoom = Math.max(0.5, state.zoom - 0.2);
      document.getElementById('zoom-label').textContent = Math.round(state.zoom * 100) + '%';
      renderStage();
    };

    const vp = document.getElementById('preview-viewport');
    document.getElementById('bg-checker-btn').onclick = () => {
      vp.className = 'flex-1 checkerboard-pattern flex items-center justify-center p-8 overflow-hidden relative select-none';
    };
    document.getElementById('bg-dark-btn').onclick = () => {
      vp.className = 'flex-1 bg-slate-950 flex items-center justify-center p-8 overflow-hidden relative select-none';
    };
    document.getElementById('bg-light-btn').onclick = () => {
      vp.className = 'flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-hidden relative select-none';
    };

    // File Drop & Input
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    dropZone.onclick = () => fileInput.click();

    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('border-amber-500'); };
    dropZone.ondragleave = () => { dropZone.classList.remove('border-amber-500'); };
    dropZone.ondrop = (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-amber-500');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    };
    fileInput.onchange = (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    };

    function handleFile(file) {
      if (file.name.endsWith('.svg') || file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const svg = doc.querySelector('svg');
          if (!svg) return alert('SVG tidak valid');

          state.viewBox = svg.getAttribute('viewBox') || '0 0 256 256';
          const shapes = Array.from(svg.querySelectorAll('path, circle, rect, polygon, polyline, ellipse'));
          state.layers = shapes.slice(0, 8).map((shape, idx) => ({
            id: 'layer-parsed-' + (idx + 1),
            name: 'Elemen ' + (idx + 1) + ' (' + shape.tagName + ')',
            color: shape.getAttribute('fill') || '#38BDF8',
            visible: true,
            elements: [shape.outerHTML],
            anim: { type: idx === 0 ? 'floating' : 'pulse', duration: 1.5, origin: 'center' }
          }));
          renderStage();
          renderLayersList();
        };
        reader.readAsText(file);
      } else {
        alert('File gambar raster diterima! Gunakan versi lengkap aplikasi untuk penelusuran multi-layer palet tingkat lanjut.');
      }
    }

    // Export SVG
    document.getElementById('btn-export-svg').onclick = () => {
      const stage = document.getElementById('svg-stage');
      const blob = new Blob([stage.innerHTML], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vektorloop-animated.svg';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Copy Code
    document.getElementById('btn-copy-code').onclick = () => {
      const stage = document.getElementById('svg-stage');
      navigator.clipboard.writeText(stage.innerHTML).then(() => {
        alert('Kode Animated SVG berhasil disalin ke clipboard!');
      });
    };

    // Init with Rocket
    loadPreset(presetRocket);
  </script>
</body>
</html>`;
}
