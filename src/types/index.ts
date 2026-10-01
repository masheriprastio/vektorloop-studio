export type AnimationType =
  | 'none'
  | 'floating'
  | 'shake'
  | 'pulse'
  | 'flicker'
  | 'wiggle'
  | 'spin'
  | 'heartbeat';

export type TransformOrigin =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-center'
  | 'bottom-center';

export type EasingFunction =
  | 'ease-in-out'
  | 'ease'
  | 'linear'
  | 'cubic-bezier(0.34, 1.56, 0.64, 1)' // bouncy
  | 'cubic-bezier(0.4, 0, 0.2, 1)'; // smooth

export interface LayerAnimationConfig {
  type: AnimationType;
  duration: number; // in seconds (e.g. 1.2)
  delay: number; // in seconds (e.g. 0)
  easing: EasingFunction;
  origin: TransformOrigin;
  intensity: number; // multiplier e.g. 1 (0.2 to 2)
  reverse?: boolean;
}

export interface SVGLayer {
  id: string;
  name: string;
  elements: string[]; // SVG inner markup string or path elements
  color?: string; // Dominant fill or stroke
  visible: boolean;
  animation: LayerAnimationConfig;
}

export interface ParsedSVG {
  viewBox: string;
  width: string | number;
  height: string | number;
  layers: SVGLayer[];
  rawSvg?: string;
  title?: string;
}

export type CanvasBackground = 'checkerboard' | 'dark' | 'light' | 'navy' | 'emerald';
