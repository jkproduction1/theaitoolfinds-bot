export type Word = {w: string; s: number; e: number; hl?: boolean};

export type Asset = {src: string; kind: 'video' | 'image'; w: number; h: number; label?: string};

export type Scene = {
  type:
    | 'title' | 'browser' | 'icons' | 'checklist' | 'chat' | 'flow' | 'big' | 'compare'
    | 'cta' | 'avatar' | 'media' | 'gallery' | 'hero' | 'counter' | 'strike';
  from: number; // frame
  to: number; // frame
  props: Record<string, any>;
};

export type VideoProps = {
  fps: number;
  durationInFrames: number;
  title: string;
  category: string;
  host: string;
  handle: string;
  keyword: string;
  audio: string;
  screenshot: string;
  screenshotW: number;
  screenshotH: number;
  logo: string | null;
  avatar: string | null;
  media: Asset | null;
  assets?: Asset[];
  scenes: Scene[];
  words: Word[];
  cover: {line1: string; line2: string};
};
