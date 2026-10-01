import { ParsedSVG } from '../types';

export const PRESET_ROCKET: ParsedSVG = {
  title: 'Roket Antariksa (Rocket Explorer)',
  viewBox: '0 0 256 256',
  width: 256,
  height: 256,
  layers: [
    {
      id: 'layer-stars',
      name: 'Bintang & Partikel (Stars)',
      visible: true,
      color: '#FACC15',
      elements: [
        '<circle cx="36" cy="48" r="4" fill="#FACC15" opacity="0.8" />',
        '<circle cx="216" cy="72" r="5" fill="#FDE047" opacity="0.9" />',
        '<path d="M 220 180 L 222 186 L 228 188 L 222 190 L 220 196 L 218 190 L 212 188 L 218 186 Z" fill="#67E8F9" opacity="0.85" />',
        '<path d="M 42 160 L 44 165 L 49 167 L 44 169 L 42 174 L 40 169 L 35 167 L 40 165 Z" fill="#FDE047" opacity="0.8" />'
      ],
      animation: {
        type: 'pulse',
        duration: 1.8,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.2
      }
    },
    {
      id: 'layer-flame-outer',
      name: 'Semburan Api Luar (Outer Flame)',
      visible: true,
      color: '#F97316',
      elements: [
        '<path d="M 112 188 C 104 212 108 244 128 252 C 148 244 152 212 144 188 Z" fill="#F97316" />'
      ],
      animation: {
        type: 'flicker',
        duration: 0.45,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'top-center',
        intensity: 1.3
      }
    },
    {
      id: 'layer-flame-core',
      name: 'Inti Api Panas (Inner Flame)',
      visible: true,
      color: '#FDE047',
      elements: [
        '<path d="M 118 190 C 114 206 118 228 128 234 C 138 228 142 206 138 190 Z" fill="#FEF08A" />'
      ],
      animation: {
        type: 'flicker',
        duration: 0.35,
        delay: 0.1,
        easing: 'ease-in-out',
        origin: 'top-center',
        intensity: 1.4
      }
    },
    {
      id: 'layer-fins',
      name: 'Sayap Roket (Fins & Booster)',
      visible: true,
      color: '#DC2626',
      elements: [
        '<path d="M 96 148 L 68 184 C 64 190 70 196 78 194 L 98 182 Z" fill="#EF4444" />',
        '<path d="M 160 148 L 188 184 C 192 190 186 196 178 194 L 158 182 Z" fill="#DC2626" />',
        '<path d="M 110 182 L 146 182 L 142 192 L 114 192 Z" fill="#475569" />'
      ],
      animation: {
        type: 'floating',
        duration: 1.6,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.0
      }
    },
    {
      id: 'layer-body',
      name: 'Badan Utama Roket (Rocket Body)',
      visible: true,
      color: '#3B82F6',
      elements: [
        '<path d="M 128 28 C 104 68 96 128 98 182 L 158 182 C 160 128 152 68 128 28 Z" fill="#E2E8F0" />',
        '<path d="M 128 28 C 118 64 112 110 112 182 L 128 182 L 128 28 Z" fill="#CBD5E1" opacity="0.6" />',
        '<path d="M 128 28 C 114 52 108 80 106 102 L 150 102 C 148 80 142 52 128 28 Z" fill="#EF4444" />'
      ],
      animation: {
        type: 'floating',
        duration: 1.6,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.0
      }
    },
    {
      id: 'layer-window',
      name: 'Kaca Kokpit (Porthole Window)',
      visible: true,
      color: '#38BDF8',
      elements: [
        '<circle cx="128" cy="132" r="18" fill="#1E293B" stroke="#94A3B8" stroke-width="4" />',
        '<circle cx="128" cy="132" r="14" fill="#38BDF8" />',
        '<path d="M 122 124 Q 132 120 138 128" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85" />'
      ],
      animation: {
        type: 'floating',
        duration: 1.6,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.0
      }
    }
  ]
};

export const PRESET_BELL: ParsedSVG = {
  title: 'Lonceng Notifikasi (Notification Bell)',
  viewBox: '0 0 256 256',
  width: 256,
  height: 256,
  layers: [
    {
      id: 'layer-sound-waves',
      name: 'Gelombang Suara (Soundwaves)',
      visible: true,
      color: '#38BDF8',
      elements: [
        '<path d="M 64 100 C 52 118 52 138 64 156" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />',
        '<path d="M 44 88 C 28 114 28 144 44 168" stroke="#0284C7" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.5" />',
        '<path d="M 192 100 C 204 118 204 138 192 156" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />',
        '<path d="M 212 88 C 228 114 228 144 212 168" stroke="#0284C7" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.5" />'
      ],
      animation: {
        type: 'pulse',
        duration: 1.2,
        delay: 0.1,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.3
      }
    },
    {
      id: 'layer-bell-body',
      name: 'Kubah Lonceng (Bell Body)',
      visible: true,
      color: '#FBBF24',
      elements: [
        '<path d="M 128 36 C 120 36 114 42 114 50 L 114 56 C 88 64 74 96 74 134 C 74 162 62 172 58 178 C 56 182 58 188 64 188 L 192 188 C 198 188 200 182 198 178 C 194 172 182 162 182 134 C 182 96 168 64 142 56 L 142 50 C 142 42 136 36 128 36 Z" fill="#FBBF24" />',
        '<path d="M 128 56 C 104 64 92 96 92 134 C 92 158 84 170 78 178 L 128 178 Z" fill="#F59E0B" opacity="0.5" />',
        '<ellipse cx="128" cy="188" rx="64" ry="10" fill="#D97706" />'
      ],
      animation: {
        type: 'wiggle',
        duration: 1.0,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'top-center',
        intensity: 1.2
      }
    },
    {
      id: 'layer-bell-clapper',
      name: 'Bandul Lonceng (Clapper)',
      visible: true,
      color: '#B45309',
      elements: [
        '<circle cx="128" cy="198" r="18" fill="#B45309" />',
        '<circle cx="128" cy="198" r="14" fill="#78350F" opacity="0.4" />'
      ],
      animation: {
        type: 'wiggle',
        duration: 0.9,
        delay: 0.05,
        easing: 'ease-in-out',
        origin: 'top-center',
        intensity: 1.5
      }
    },
    {
      id: 'layer-badge-dot',
      name: 'Titik Notifikasi (Badge Dot)',
      visible: true,
      color: '#EF4444',
      elements: [
        '<circle cx="186" cy="74" r="18" fill="#EF4444" stroke="#FFFFFF" stroke-width="4" />',
        '<text x="186" y="80" text-anchor="middle" fill="#FFFFFF" font-size="16" font-family="sans-serif" font-weight="bold">1</text>'
      ],
      animation: {
        type: 'heartbeat',
        duration: 1.4,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'center',
        intensity: 1.2
      }
    }
  ]
};

export const PRESET_COFFEE: ParsedSVG = {
  title: 'Kopi Hangat (Steaming Coffee)',
  viewBox: '0 0 256 256',
  width: 256,
  height: 256,
  layers: [
    {
      id: 'layer-steam-left',
      name: 'Uap Kiri (Steam 1)',
      visible: true,
      color: '#94A3B8',
      elements: [
        '<path d="M 96 100 C 88 85 102 70 94 50 C 88 35 98 25 94 15" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75" />'
      ],
      animation: {
        type: 'floating',
        duration: 1.8,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'bottom-center',
        intensity: 1.4
      }
    },
    {
      id: 'layer-steam-center',
      name: 'Uap Tengah (Steam 2)',
      visible: true,
      color: '#E2E8F0',
      elements: [
        '<path d="M 128 92 C 120 72 136 58 126 38 C 120 22 130 12 126 4" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9" />'
      ],
      animation: {
        type: 'floating',
        duration: 2.1,
        delay: 0.3,
        easing: 'ease-in-out',
        origin: 'bottom-center',
        intensity: 1.5
      }
    },
    {
      id: 'layer-steam-right',
      name: 'Uap Kanan (Steam 3)',
      visible: true,
      color: '#94A3B8',
      elements: [
        '<path d="M 160 100 C 168 85 154 70 162 50 C 168 35 158 25 162 15" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75" />'
      ],
      animation: {
        type: 'floating',
        duration: 1.9,
        delay: 0.6,
        easing: 'ease-in-out',
        origin: 'bottom-center',
        intensity: 1.3
      }
    },
    {
      id: 'layer-cup',
      name: 'Cangkir & Tatakan (Cup & Saucer)',
      visible: true,
      color: '#3B82F6',
      elements: [
        '<ellipse cx="128" cy="226" rx="84" ry="12" fill="#E2E8F0" />',
        '<path d="M 72 118 L 84 198 C 86 210 102 216 128 216 C 154 216 170 210 172 198 L 184 118 Z" fill="#3B82F6" />',
        '<path d="M 174 132 C 196 132 208 144 208 162 C 208 180 194 190 170 190" stroke="#3B82F6" stroke-width="12" stroke-linecap="round" fill="none" />',
        '<ellipse cx="128" cy="118" rx="56" ry="14" fill="#60A5FA" />',
        '<ellipse cx="128" cy="119" rx="50" ry="11" fill="#78350F" />',
        '<ellipse cx="128" cy="120" rx="44" ry="8" fill="#451A03" />'
      ],
      animation: {
        type: 'wiggle',
        duration: 2.8,
        delay: 0,
        easing: 'ease-in-out',
        origin: 'bottom-center',
        intensity: 0.4
      }
    }
  ]
};

export const BUILT_IN_PRESETS = [PRESET_ROCKET, PRESET_BELL, PRESET_COFFEE];
