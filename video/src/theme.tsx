import {staticFile} from 'remotion';
import {icons} from 'lucide-react';

export const W = 1080;
export const H = 1920;

export const C = {
  bg: '#F4F4F1',
  grid: '#E3E3DE',
  ink: '#0E0E10',
  muted: '#6B6B73',
  card: '#FFFFFF',
  line: '#E6E6E2',
  yellow: '#FFD60A',
  accent: '#FF6A3D',
  dark: '#141418',
};

export const FONT = 'InterTAF';

// Inter font faces, loaded once from /public/fonts
export const fontCss = `
@font-face{font-family:${FONT};src:url(${staticFile('fonts/Inter-Medium.otf')});font-weight:500}
@font-face{font-family:${FONT};src:url(${staticFile('fonts/Inter-SemiBold.otf')});font-weight:600}
@font-face{font-family:${FONT};src:url(${staticFile('fonts/Inter-Bold.otf')});font-weight:700}
@font-face{font-family:${FONT};src:url(${staticFile('fonts/Inter-ExtraBold.otf')});font-weight:800}
@font-face{font-family:${FONT};src:url(${staticFile('fonts/Inter-Black.otf')});font-weight:900}
`;

// Icons the storyboard AI is allowed to use (lucide names)
export const ICON_NAMES = [
  'Sparkles', 'Video', 'Clapperboard', 'Film', 'Scissors', 'Wand', 'Clock', 'Timer',
  'DollarSign', 'BadgeDollarSign', 'Gift', 'Bot', 'Brain', 'Cpu', 'Code', 'Terminal',
  'PenTool', 'Palette', 'Image', 'Images', 'Camera', 'Mic', 'AudioLines', 'Zap', 'Layers',
  'Rocket', 'Globe', 'Search', 'FileText', 'Mail', 'MessageSquare', 'Calendar', 'ChartLine',
  'TrendingUp', 'Users', 'User', 'ShoppingCart', 'Smartphone', 'Laptop', 'Download',
  'Upload', 'Share2', 'Lock', 'ShieldCheck', 'Languages', 'Captions', 'Type', 'Workflow',
  'Repeat', 'CircleCheck', 'Star', 'Heart', 'Eye', 'Lightbulb', 'Target', 'Megaphone', 'Box',
];

export const Icon: React.FC<{name?: string; size?: number; color?: string; stroke?: number}> = ({
  name, size = 64, color = C.ink, stroke = 2.2,
}) => {
  const Cmp = (icons as Record<string, React.FC<any>>)[name || ''] || icons.Sparkles;
  return <Cmp size={size} color={color} strokeWidth={stroke} />;
};
