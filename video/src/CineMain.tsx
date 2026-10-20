// Cinematic retro tech collage (house style v3). Data-driven like CollageMain, same props.
// Scene kinds: screen / title / flat / cork / detail  + legacy hang / desk / crt / board.
// Transitions are speed-ramped (whip, drop, zoom, flash). Old CollageMain stays untouched.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {FONT, fontCss} from './theme';
import {KINDS as LEGACY, Cap} from './CollageMain';
import type {CollageProps} from './CollageMain';

const css = fontCss + `
@font-face{font-family:Anton;src:url(${staticFile('fonts/anton-latin-400-normal.woff2')})}
@font-face{font-family:Typewriter;src:url(${staticFile('fonts/special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Hand;src:url(${staticFile('fonts/caveat-latin-700-normal.woff2')})}
@font-face{font-family:InstrumentItalic;src:url(${staticFile('fonts/InstrumentSerif-Italic.woff2')});font-style:italic}`;
const K = (n: string) => staticFile(n.startsWith('job/') || n.startsWith('mascot/') ? n : `kit/${n}`);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const RAMP = Easing.bezier(0.85, 0, 0.15, 1);  // speed ramp: slow-fast-slow
const k = (f: number, a: number, b: number, e = IO) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const twos = (f: number) => f - (f % 2);
const TR = 10;
const SHADE = 'brightness(0.72) sepia(0.22) saturate(0.9) contrast(1.05)';  // props sit in the room light

// screen holes / defaults per plate (fractions of the image). lean = Scrappy spot leaning on the device
type Plate = {scr?: [number, number, number, number]; tv?: boolean; note?: [number, number]; lean?: {x: number; y: number; h: number; flip?: boolean}};
const PLATES: Record<string, Plate> = {
  room1: {note: [380, 470], scr: [0.4407, 0.5523, 0.2318, 0.1134], lean: {x: 770, y: 1090, h: 300, flip: true}},
  room2: {note: [600, 540], scr: [0.385, 0.54, 0.31, 0.12], tv: true, lean: {x: 790, y: 1030, h: 290, flip: true}},
  room1b: {note: [520, 320], scr: [0.51, 0.509, 0.326, 0.152], lean: {x: 300, y: 1050, h: 300}},
  crt_close: {note: [790, 690], scr: [0.227, 0.414, 0.573, 0.24], lean: {x: 840, y: 1150, h: 380, flip: true}},
  tv_close: {note: [240, 760], scr: [0.312, 0.443, 0.4, 0.167], tv: true, lean: {x: 40, y: 1090, h: 340}},
  laptop_top: {note: [770, 1080], scr: [0.234, 0.323, 0.547, 0.116]},
};

const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.4}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

// ------------------------------------------------------------------ textures & light
const Grain: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: 'overlay', zIndex: 90}}>
      <svg width="100%" height="100%"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.9"
        numOctaves="2" seed={Math.floor(f / 2) % 50} /></filter><rect width="100%" height="100%" filter="url(#gn)" /></svg>
    </AbsoluteFill>
  );
};
const CrtTex: React.FC<{o?: number; f: number}> = ({o = 1, f}) => (
  <>
    <AbsoluteFill style={{opacity: 0.35 * o, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 4px)'}} />
    <AbsoluteFill style={{opacity: 0.16 * o, mixBlendMode: 'multiply',
      background: 'repeating-linear-gradient(90deg, #ff3b3b 0 2px, #3bff6b 2px 4px, #3b6bff 4px 6px)'}} />
    <AbsoluteFill style={{opacity: 0.12 * o, background: `linear-gradient(180deg, transparent ${(f * 3) % 120 - 20}%, rgba(255,255,255,0.5) ${(f * 3) % 120 - 15}%, transparent ${(f * 3) % 120 - 10}%)`}} />
    <AbsoluteFill style={{boxShadow: `inset 0 0 ${120 * o}px rgba(0,0,0,0.9)`}} />
  </>
);
const Fabric: React.FC = () => (
  <AbsoluteFill style={{opacity: 0.22, mixBlendMode: 'overlay',
    background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)'}} />
);
const Blinds: React.FC<{f: number; o?: number; ang?: number}> = ({f, o = 0.5, ang = 118}) => (
  <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: o, pointerEvents: 'none',
    background: `repeating-linear-gradient(${ang}deg, rgba(255,220,170,0) ${f * 0.15}px, rgba(255,220,170,0) ${30 + f * 0.15}px, rgba(255,210,150,0.6) ${42 + f * 0.15}px, rgba(255,220,170,0) ${60 + f * 0.15}px)`}} />
);
const Dust: React.FC<{f: number; n?: number}> = ({f, n = 24}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const sx = (i * 137) % 1080, sy = (i * 291) % 1300 + 200;
      const dx = Math.sin((f + i * 20) / 40) * 30, dy = -((f * (0.3 + (i % 5) * 0.1) + i * 50) % 300);
      return <div key={i} style={{position: 'absolute', left: sx + dx, top: sy + dy, width: 3 + (i % 3), height: 3 + (i % 3),
        borderRadius: 3, background: 'rgba(255,230,190,0.5)', filter: 'blur(0.6px)'}} />;
    })}
  </>
);

// ------------------------------------------------------------------ paper things
const Note: React.FC<{x: number; y: number; text: string; rot?: number; w?: number; color?: string; f: number; at: number}> = ({
  x, y, text, rot = -5, w = 200, color = '#f6dd6a', f, at,
}) => {
  const g = twos(f);
  const gust = 0.6 + 0.4 * Math.sin(g / 23);
  const flap = Math.sin(g / 4.3) * 14 * gust + Math.sin(g / 2.1) * 4 * gust;
  const s = spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 160}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: w * 0.94, perspective: 600, zIndex: 6,
      transform: `translateY(${(1 - s) * -200}px) scale(${1 + (1 - s) * 0.4})`}}>
      <div style={{width: '100%', height: '100%', transformOrigin: '50% 0%',
        transform: `rotate(${rot + Math.sin(g / 9) * 1.5}deg) rotateX(${flap}deg) skewX(${flap * 0.15}deg)`,
        background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`, boxShadow: `0 ${8 + flap}px 18px rgba(0,0,0,0.55)`,
        fontFamily: 'Hand', fontSize: w * 0.2, color: '#2a2418', lineHeight: 1, padding: `${w * 0.16}px ${w * 0.07}px`,
        boxSizing: 'border-box', textAlign: 'center', whiteSpace: 'pre-line', filter: 'brightness(0.68) sepia(0.25) saturate(0.85)'}}>{text}</div>
      <div style={{position: 'absolute', top: -10, left: w / 2 - 13, width: 26, height: 26, borderRadius: 15,
        background: 'radial-gradient(circle at 35% 30%, #ff8a8a, #b5121b 60%)', boxShadow: '3px 6px 6px rgba(0,0,0,0.6)'}} />
    </div>
  );
};

// falls onto a table seen from above (scale down + shadow tightens)
const Land: React.FC<{at: number; f: number; x: number; y: number; w: number; rot: number; z?: number; children: React.ReactNode}> = ({
  at, f, x, y, w, rot, z = 2, children,
}) => {
  if (f < at) return null;
  const s = spring({frame: f - at, fps: 30, config: {damping: 15, stiffness: 170}});
  const l = 1 - s;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, zIndex: z,
      transform: `scale(${1 + l * 0.6}) rotate(${rot + l * 14}deg) translate(${l * 60}px, ${l * -90}px)`,
      filter: `drop-shadow(${6 + l * 40}px ${10 + l * 60}px ${8 + l * 30}px rgba(0,0,0,${0.6 - l * 0.3}))`}}>
      {children}
    </div>
  );
};

const Polaroid: React.FC<{img?: string; name?: string; w: number}> = ({img, name, w}) => (
  <div style={{position: 'relative', width: w, filter: SHADE}}>
    <Img src={K('p_polaroid.png')} style={{width: w, display: 'block'}} />
    {img ? <div style={{position: 'absolute', left: '7.3%', top: '6.6%', width: '85.4%', height: '72.3%', overflow: 'hidden'}}>
      <Img src={K(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div> : null}
    {name ? <div style={{position: 'absolute', left: 0, right: 0, bottom: '5%', textAlign: 'center', fontFamily: 'Hand',
      fontSize: w * 0.12, color: '#1b1b2e', transform: 'rotate(-2deg)', whiteSpace: 'nowrap'}}>{name}</div> : null}
  </div>
);
const Card: React.FC<{text: string; w: number; f: number; at: number}> = ({text, w, f, at}) => {
  const typed = text.slice(0, Math.max(0, Math.floor((f - at - 6) * 1.4)));
  return (
    <div style={{position: 'relative', width: w, filter: SHADE}}>
      <Img src={K('p_card.png')} style={{width: w, display: 'block'}} />
      <div style={{position: 'absolute', left: '9%', top: '17%', right: '7%', fontFamily: 'Typewriter', fontSize: w * 0.075,
        color: '#1d1d24', lineHeight: 1.52, whiteSpace: 'pre-line'}}>{typed}</div>
    </div>
  );
};
const News: React.FC<{text: string; img?: string; w: number}> = ({text, img, w}) => (
  <div style={{position: 'relative', width: w, filter: SHADE}}>
    <Img src={K('p_newspaper.png')} style={{width: w, display: 'block'}} />
    <div style={{position: 'absolute', left: '8%', right: '8%', top: '7%', height: '17%', background: '#e9dfc6',
      fontFamily: 'Anton', fontSize: w * 0.105, lineHeight: 0.98, color: '#16130c', textTransform: 'uppercase', textAlign: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{text}</div>
    {img ? <div style={{position: 'absolute', left: '8%', right: '8%', top: '27%', height: '30%', overflow: 'hidden',
      filter: 'grayscale(1) contrast(1.2)', mixBlendMode: 'multiply'}}>
      <Img src={K(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div> : null}
  </div>
);
const Phone: React.FC<{img?: string; w: number}> = ({img, w}) => (
  <div style={{position: 'relative', width: w, filter: SHADE}}>
    <Img src={K('p_phone.png')} style={{width: w, display: 'block'}} />
    {img ? <div style={{position: 'absolute', left: '6%', top: '3%', width: '88%', height: '94%', overflow: 'hidden', borderRadius: w * 0.1}}>
      <Img src={K(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div> : null}
  </div>
);
const Item: React.FC<{it: any; w: number; f: number; at: number}> = ({it, w, f, at}) => {
  switch (it.type) {
    case 'polaroid': return <Polaroid img={it.img} name={it.name} w={w} />;
    case 'card': return <Card text={it.text || ''} w={w} f={f} at={at} />;
    case 'news': return <News text={it.text || ''} img={it.img} w={w} />;
    case 'phone': return <Phone img={it.img} w={w} />;
    default: return <Img src={K(it.src || 'p_floppy.png')} style={{width: w, filter: SHADE}} />;
  }
};
const DEFW: Record<string, number> = {polaroid: 440, card: 560, news: 560, phone: 300, prop: 300, sticky: 260};

// ------------------------------------------------------------------ type animations
const Mask: React.FC<{lines: string[]; f: number; at: number; size?: number; color?: string; align?: 'left' | 'center'}> = ({
  lines, f, at, size = 150, color = '#f3ead8', align = 'center',
}) => (
  <div style={{textAlign: align}}>
    {lines.map((l, i) => {
      const p = k(f - at, i * 7, i * 7 + 14, OUT);
      const sz = l.length > 12 ? size * 12 / l.length : size;
      return (
        <div key={i} style={{overflow: 'hidden', height: sz * 1.08}}>
          <div style={{fontFamily: 'Anton', fontSize: sz, color, letterSpacing: 2, lineHeight: 1.04, whiteSpace: 'nowrap',
            textTransform: 'uppercase', transform: `translateY(${(1 - p) * 110}%)`}}>{l}</div>
        </div>
      );
    })}
  </div>
);
const Sticker: React.FC<{text: string; f: number; at: number; x: number; y: number; size?: number}> = ({text, f, at, x, y, size = 140}) => {
  if (f < at) return null;
  const s = spring({frame: f - at, fps: 30, config: {damping: 9, stiffness: 240}});
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 8, transform: `scale(${2.2 - 1.2 * s}) rotate(${-8 + 3 * s}deg)`,
      background: '#FFD60A', padding: `4px ${size * 0.22}px ${size * 0.1}px`, borderRadius: 10, boxShadow: '0 16px 30px rgba(0,0,0,0.5)',
      fontFamily: 'InstrumentItalic', fontStyle: 'italic', fontSize: size, color: '#16130c', lineHeight: 1, whiteSpace: 'nowrap'}}>{text}</div>
  );
};
const Circle: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number}> = ({f, at, x, y, w, h}) => {
  const p = k(f, at, at + 18, OUT);
  return (
    <svg width={w} height={h} viewBox="0 0 620 300" preserveAspectRatio="none" style={{position: 'absolute', left: x, top: y, overflow: 'visible', zIndex: 9}}>
      <path d="M40,150 C40,40 560,30 580,140 C600,250 90,280 50,170 C30,110 200,60 330,62" fill="none" stroke="#e8432c"
        strokeWidth="9" strokeLinecap="round" strokeDasharray="1700" strokeDashoffset={1700 * (1 - p)} />
    </svg>
  );
};
// handwriting that writes itself on (left-to-right wipe)
const Hand: React.FC<{text: string; f: number; at: number; size?: number; color?: string}> = ({text, f, at, size = 90, color = '#f0e6d0'}) => {
  const p = k(f, at, at + Math.max(12, text.length * 1.6), Easing.linear);
  return (
    <div style={{fontFamily: 'Hand', fontSize: size, color, lineHeight: 1, whiteSpace: 'pre-line',
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>{text}</div>
  );
};
const Typed: React.FC<{text: string; f: number; at: number; size?: number; color?: string; glow?: boolean}> = ({text, f, at, size = 60, color = '#8dffc4', glow = true}) => {
  const t = text.slice(0, Math.max(0, Math.floor((f - at) * 1.2)));
  return (
    <div style={{fontFamily: 'Typewriter', fontSize: size, color, whiteSpace: 'pre-line', lineHeight: 1.2,
      textShadow: glow ? '0 0 8px #3dff9a, 0 0 22px #1aff7a' : '0 3px 10px rgba(0,0,0,0.6)'}}>
      {t}<span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0}}>_</span></div>
  );
};
const TextFx: React.FC<{t: any; f: number; at: number}> = ({t, f, at}) => {
  const a = at + (t.delay ?? 0);
  if (t.fx === 'hand') return <Hand text={t.text} f={f} at={a} size={t.size} color={t.color} />;
  if (t.fx === 'type') return <Typed text={t.text} f={f} at={a} size={t.size} color={t.color || '#f0e6d0'} glow={false} />;
  return <Mask lines={String(t.text).split('\n')} f={f} at={a} size={t.size} color={t.color} />;
};

// ------------------------------------------------------------------ Scrappy (leaning, in the room light)
const Scrappy: React.FC<{p: any; f: number; from: number; amp: number; def?: Plate['lean']; side: 'left' | 'right'}> = ({p, f, from, amp, def, side}) => {
  if (p.scrappy === false) return null;
  const o = {...(def || (side === 'left' ? {x: 20, y: 1480, h: 400} : {x: 760, y: 1480, h: 400, flip: true})), ...(p.scrappy || {})};
  const poses: [number, string][] = p.poses || [[0, 'chill']];
  let pose = poses[0][1], since = poses[0][0];
  for (const [t, ps] of poses) if (f >= from + t) { pose = ps; since = from + t; }
  const at = from + (o.at ?? 8);
  const s = spring({frame: f - at, fps: 30, config: {damping: 12, stiffness: 120}});
  const sw = spring({frame: f - since, fps: 30, config: {damping: 9, stiffness: 260}});
  const jy = -amp * 10 + Math.sin(f / 13) * 3, jr = Math.sin(f * 1.7) * amp * 2;
  const flip = o.flip ? -1 : 1;
  return (
    <div style={{position: 'absolute', left: o.x, top: o.y + jy + (1 - s) * 60, height: o.h, zIndex: 7, opacity: f < at ? 0 : Math.min(1, s * 1.5),
      transformOrigin: '50% 100%', transform: `rotate(${(o.lean ?? -6) * flip + jr}deg) scale(${(0.94 + 0.06 * sw) * (1 + amp * 0.03)}, ${(0.94 + 0.06 * sw) * (1 - amp * 0.02)}) scaleX(${flip})`,
      filter: `brightness(${o.light ?? 0.55}) sepia(0.35) contrast(1.1) drop-shadow(${-14 * flip}px 10px 14px rgba(0,0,0,0.75))`}}>
      <Img src={staticFile(`mascot/${pose}.png`)} style={{height: o.h}} />
    </div>
  );
};

// ------------------------------------------------------------------ scene kinds
type SP = {p: any; f: number; from: number; to: number; at: (re: string, fb: number) => number; amp: number; side: 'left' | 'right'};

// camera on a plate: push toward a focus point, optional dive (zoom-through) at the end
const Cam: React.FC<{f: number; from: number; to: number; fx: number; fy: number; push?: number; dive?: boolean; children: React.ReactNode}> = ({
  f, from, to, fx, fy, push = 0.18, dive, children,
}) => {
  const pk = k(f, from, to, Easing.bezier(0.3, 0, 0.7, 1));
  const dk = dive ? k(f, to - 12, to + 2, Easing.in(Easing.cubic)) : 0;
  return (
    <AbsoluteFill style={{transform: `scale(${1.04 + pk * push + dk * 3.4})`, transformOrigin: `${fx * 100}% ${fy * 100}%`,
      filter: dk > 0.2 ? `blur(${dk * 8}px)` : undefined}}>{children}</AbsoluteFill>
  );
};

const ScreenContent: React.FC<{show: any; f: number; from: number; tv?: boolean}> = ({show, f, from, tv}) => (
  <>
    {show?.img ? <Img src={K(show.img)} style={{width: '100%', height: '100%', objectFit: 'cover',
      filter: 'saturate(0.9) contrast(1.05)', transform: `scale(${1.06 + (f - from) * 0.001})`}} /> : null}
    {show?.type ? <div style={{position: 'absolute', left: '8%', top: '22%', right: '6%'}}>
      <Typed text={show.type} f={f} at={from + (show.delay ?? 6)} size={show.size ?? 40} color={tv ? '#ffe9b0' : '#8dffc4'} /></div> : null}
    <CrtTex f={f} o={show?.img ? 0.7 : 1} />
  </>
);

const ScreenScene: React.FC<SP> = ({p, f, from, to, at, amp, side}) => {
  const name = p.plate || 'room1';
  const pl = PLATES[name] || PLATES.room1;
  const [sx, sy, sw, sh] = pl.scr || [0.4, 0.5, 0.2, 0.1];
  const fx = sx + sw / 2, fy = sy + sh / 2;
  const glow = pl.tv ? '255,200,120' : '80,255,170';
  return (
    <>
      <Cam f={f} from={from} to={to} fx={fx} fy={fy} push={p.push ?? 0.2} dive={p.dive}>
        <Img src={K(`${name}.jpg`)} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: `${sx * 100}%`, top: `${sy * 100}%`, width: `${sw * 100}%`, height: `${sh * 100}%`,
          background: `radial-gradient(ellipse at 50% 50%, ${pl.tv ? '#3a2a12' : '#12382c'} 0%, #050505 85%)`, borderRadius: 14,
          overflow: 'hidden', boxShadow: `0 0 60px 10px rgba(${glow},0.22)`}}>
          <ScreenContent show={p.show} f={f} from={from} tv={pl.tv} />
        </div>
        <AbsoluteFill style={{background: `radial-gradient(circle at ${fx * 100}% ${fy * 100}%, rgba(${glow},${0.10 + 0.04 * Math.sin(f / 3)}) 0%, transparent 32%)`, mixBlendMode: 'screen'}} />
        {p.note ? <Note x={p.note.x ?? pl.note?.[0] ?? 120} y={p.note.y ?? pl.note?.[1] ?? 620} text={p.note.text || p.note} rot={p.note.rot ?? -6} w={p.note.w ?? 190}
          f={f} at={p.note.word ? at(p.note.word, from + 10) : from + 10} /> : null}
        <Scrappy p={p} f={f} from={from} amp={amp} def={pl.lean} side={side} />
        <Blinds f={f} o={0.5} />
        <Dust f={f} />
      </Cam>
      {p.head ? <div style={{position: 'absolute', top: p.headY ?? 260, left: 60, right: 60, zIndex: 10}}>
        <TextFx t={typeof p.head === 'string' ? {text: p.head} : p.head} f={f} at={from + 2} /></div> : null}
      {p.note ? <Sfx at={(p.note.word ? at(p.note.word, from + 10) : from + 10)} src="pop" vol={0.35} /> : null}
      {p.show?.type ? <><Sfx at={from + 6} src="type" vol={0.28} /><Sfx at={from + 22} src="type" vol={0.28} /></> : null}
      {p.dive ? <Sfx at={to - 14} src="riser" vol={0.3} /> : null}
    </>
  );
};

// big type "inside the screen" — hook / punchline
const TitleScene: React.FC<SP> = ({p, f, from, to, at, amp, side}) => {
  const lines: string[] = p.lines || ['NEW', 'TOOL'];
  const size = p.size ?? 150;
  const stAt = p.stickerWord ? at(p.stickerWord, from + 20) : from + 20 + lines.length * 7;
  const lh = size * 1.08;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1712 0%, #070605 75%)'}}>
      {p.bg ? <Img src={K(p.bg)} style={{position: 'absolute', width: 1080, height: 1920, objectFit: 'cover', opacity: p.bgO ?? 0.5,
        filter: `blur(${p.bgBlur ?? 5}px) saturate(0.75) brightness(0.8)`, transform: `scale(${1.15 + (f - from) * 0.0015})`}} /> : null}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, rgba(${p.glow ?? '80,255,170'},0.16) 0%, transparent 60%)`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5))'}} />
      <Fabric />
      <div style={{position: 'absolute', top: p.y ?? 640, left: 60, right: 60, transform: `scale(${1.08 - 0.08 * k(f, from, to, OUT)})`}}>
        <Mask lines={lines} f={f} at={from + 1} size={size} />
        {p.sticker ? <Sticker text={p.sticker} f={f} at={stAt} x={p.sx ?? 330} y={p.sy ?? lines.length * lh - 30} size={size * 0.9} /> : null}
        {p.circle ? <Circle f={f} at={stAt + 8} x={160} y={(p.circleLine ?? lines.length - 1) * lh - 50} w={640} h={lh + 90} /> : null}
        {p.sub ? <div style={{marginTop: p.sticker ? size * 1.1 : 30}}><Hand text={p.sub} f={f} at={stAt + 6} size={70} /></div> : null}
      </div>
      <Scrappy p={{scrappy: false, ...p}} f={f} from={from} amp={amp} side={side} />
      <CrtTex f={f} o={0.8} />
      {p.sticker ? <Sfx at={stAt} src="pop" vol={0.5} /> : null}
      <Sfx at={from + 1} src="impact" vol={0.45} />
    </AbsoluteFill>
  );
};

const SPOTS = [[90, 230, -6], [520, 420, 5], [110, 820, 3], [560, 1000, -4], [300, 600, 2]];
const FlatScene: React.FC<SP> = ({p, f, from, to, at, amp, side}) => {
  const plate = p.plate || 'mat_top';
  const items: any[] = p.items || [];
  const span = to - from - 16;
  return (
    <>
      <AbsoluteFill style={{transform: `scale(${1.05 + k(f, from, to) * 0.08}) rotate(${(p.rot ?? 1.5) * k(f, from, to)}deg)`}}>
        <Img src={K(`${plate}.jpg`)} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        {items.map((it, i) => {
          const t = it.word ? at(it.word, from + 6 + i * 14) : from + 4 + Math.round(i * span / Math.max(1, items.length));
          const [x, y, r] = it.pos || SPOTS[i % SPOTS.length];
          const w = it.w ?? DEFW[it.type] ?? 300;
          if (it.type === 'sticky') return <Note key={i} x={x} y={y} text={it.text} rot={r} w={w} f={f} at={t} color={it.color} />;
          return (
            <Land key={i} at={t} f={f} x={x} y={y} w={w} rot={r} z={2 + i}>
              <Item it={it} w={w} f={f} at={t} />
            </Land>
          );
        })}
        <Scrappy p={p} f={f} from={from} amp={amp} side={side} />
        <Blinds f={f} o={0.45} ang={p.blindAng ?? 128} />
        <Dust f={f} n={14} />
      </AbsoluteFill>
      {items.map((it, i) => {
        const t = it.word ? at(it.word, from + 6 + i * 14) : from + 4 + Math.round(i * span / Math.max(1, items.length));
        return <React.Fragment key={'s' + i}><Sfx at={t - 2} src="whoosh" vol={0.18} /><Sfx at={t + 5} src={it.type === 'card' ? 'type' : 'pop'} vol={0.35} /></React.Fragment>;
      })}
      {p.head ? <div style={{position: 'absolute', top: p.headY ?? 120, left: 60, right: 60, zIndex: 10}}>
        <TextFx t={typeof p.head === 'string' ? {text: p.head} : p.head} f={f} at={from + 2} /></div> : null}
    </>
  );
};

// cork board: pinned things + red string drawn between the pins + stamp
const CorkScene: React.FC<SP> = ({p, f, from, to, at, amp, side}) => {
  const plate = p.plate || 'cork_close';
  const items: any[] = p.items || [];
  const span = to - from - 20;
  const pins: [number, number, number][] = items.map((it, i) => {
    const [x, y] = it.pos || SPOTS[i % SPOTS.length];
    const w = it.w ?? DEFW[it.type] ?? 300;
    const t = it.word ? at(it.word, from + 6 + i * 14) : from + 4 + Math.round(i * span / Math.max(1, items.length));
    return [x + w / 2, y + 8, t];
  });
  const stampAt = p.stampWord ? at(p.stampWord, from + 40) : from + 40;
  const ss = spring({frame: f - stampAt, fps: 30, config: {damping: 8, stiffness: 260}});
  return (
    <>
      <AbsoluteFill style={{transform: `scale(${1.04 + k(f, from, to) * 0.1})`}}>
        <Img src={K(`${plate}.jpg`)} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        {items.map((it, i) => {
          const [x, y, r] = it.pos || SPOTS[i % SPOTS.length];
          const w = it.w ?? DEFW[it.type] ?? 300;
          const t = pins[i][2];
          if (it.type === 'sticky') return <Note key={i} x={x} y={y} text={it.text} rot={r} w={w} f={f} at={t} color={it.color} />;
          return (
            <Land key={i} at={t} f={f} x={x} y={y} w={w} rot={r * 0.6} z={2 + i}>
              <Item it={it} w={w} f={f} at={t} />
              <div style={{position: 'absolute', top: -12, left: w / 2 - 14, width: 28, height: 28, borderRadius: 15,
                background: 'radial-gradient(circle at 35% 30%, #ff8a8a, #b5121b 60%)', boxShadow: '3px 6px 6px rgba(0,0,0,0.6)'}} />
            </Land>
          );
        })}
        {p.string !== false && pins.length > 1 ? (
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, zIndex: 20}}>
            {pins.slice(1).map((b, i) => {
              const a = pins[i];
              const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 40;
              const pr = k(f, b[2] + 4, b[2] + 16, OUT);
              const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 40;
              return <path key={i} d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke="#b3141c" strokeWidth={4}
                strokeDasharray={len} strokeDashoffset={len * (1 - pr)} style={{filter: 'drop-shadow(3px 6px 3px rgba(0,0,0,0.5))'}} />;
            })}
          </svg>
        ) : null}
        <Scrappy p={p} f={f} from={from} amp={amp} side={side} />
        <Blinds f={f} o={0.4} />
      </AbsoluteFill>
      {p.stamp && f >= stampAt ? (
        <div style={{position: 'absolute', zIndex: 30, left: p.stampX ?? 250, top: p.stampY ?? 950, transform: `scale(${2.4 - 1.4 * ss}) rotate(-12deg)`,
          opacity: Math.min(1, ss * 2), border: '12px solid #c1121f', borderRadius: 18, padding: '6px 40px',
          fontFamily: 'Anton', fontSize: 150, color: '#c1121f', letterSpacing: 6, mixBlendMode: 'multiply'}}>{p.stamp}</div>
      ) : null}
      {p.stamp ? <Sfx at={stampAt} src="impact" vol={0.6} /> : null}
      {pins.map((pn, i) => <Sfx key={i} at={pn[2] + 4} src="pop" vol={0.35} />)}
      {p.head ? <div style={{position: 'absolute', top: p.headY ?? 120, left: 60, right: 60, zIndex: 10}}>
        <TextFx t={typeof p.head === 'string' ? {text: p.head} : p.head} f={f} at={from + 2} /></div> : null}
    </>
  );
};

// close-up detail plate: strong slow push-in + one line of text
const DetailScene: React.FC<SP> = ({p, f, from, to, amp, side}) => {
  const plate = p.plate || 'keyboard_close';
  return (
    <>
      <Cam f={f} from={from} to={to} fx={p.fx ?? 0.5} fy={p.fy ?? 0.5} push={p.push ?? 0.3}>
        <Img src={K(`${plate}.jpg`)} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        <Blinds f={f} o={0.35} />
        <Dust f={f} n={30} />
        <Scrappy p={{scrappy: false, ...p}} f={f} from={from} amp={amp} side={side} />
      </Cam>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.5) 100%)'}} />
      {p.text ? <div style={{position: 'absolute', top: p.textY ?? 300, left: 70, right: 70, zIndex: 10}}>
        <TextFx t={typeof p.text === 'string' ? {text: p.text, fx: 'hand', size: 110} : p.text} f={f} at={from + 4} /></div> : null}
    </>
  );
};

const KINDS: Record<string, React.FC<any>> = {
  screen: ScreenScene, title: TitleScene, flat: FlatScene, cork: CorkScene, detail: DetailScene, ...LEGACY,
};

// ------------------------------------------------------------------ main
type Sc = {kind: string; from: number; to: number; props: any};
const TRS = ['whip', 'drop', 'whip', 'zoom'];

export const CineMain: React.FC<CollageProps> = (v) => {
  const f = useCurrentFrame();
  const voice = useAudioData(staticFile(v.audio));
  let amp = 0;
  if (voice) {
    const vis = visualizeAudio({fps: 30, frame: f, audioData: voice, numberOfSamples: 16});
    amp = Math.min(1, (vis.slice(0, 6).reduce((x, y) => x + y, 0) / 6) * 3);
  }
  const at = (re: string, fb: number) => {
    const r = new RegExp(re, 'i');
    const w = v.words.find((x) => r.test(x.w));
    return w ? Math.round(w.s * 30) : fb;
  };
  const talking = (fr: number) => v.words.some((w) => fr / 30 >= w.s - 0.05 && fr / 30 <= w.e + 0.1);
  const scenes = v.scenes as Sc[];
  const trOf = (i: number) => {   // transition INTO scene i
    if (i === 0) return 'none';
    if (scenes[i - 1].props?.dive) return 'flash';
    return scenes[i].props?.tr || TRS[i % TRS.length];
  };
  // hook: the first scene snaps in with a speed-ramped push (something moves on frame 0)
  const hook = 1 - k(f, 0, 12, OUT);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <style>{css}</style>
      {scenes.map((s, i) => {
        const half = TR / 2;
        const tin = trOf(i), tout = i < scenes.length - 1 ? trOf(i + 1) : 'none';
        const hardIn = tin === 'flash' || tin === 'cut', hardOut = tout === 'flash' || tout === 'cut';
        if (f < (hardIn ? s.from : s.from - half) || f > (hardOut ? s.to - 1 : s.to + half)) return null;
        const pin = tin === 'none' || tin === 'flash' || tin === 'cut' ? 1 : k(f, s.from - half, s.from + half, RAMP);
        const pout = tout === 'none' || tout === 'flash' || tout === 'cut' ? (f >= s.to ? 1 : 0) : k(f, s.to - half, s.to + half, RAMP);
        if (pout >= 1 && tout !== 'none') return null;
        let tf = '', blur = 0;
        const mb = (x: number) => Math.sin(Math.PI * x) * 26;
        if (tin === 'whip' && pin < 1) { tf += `translateX(${(1 - pin) * 1080}px)`; blur = mb(pin); }
        if (tin === 'drop' && pin < 1) { tf += `translateY(${(1 - pin) * -1920}px)`; blur = mb(pin); }
        if (tin === 'zoom' && pin < 1) { tf += `scale(${0.4 + 0.6 * pin})`; blur = mb(pin); }
        if (tout === 'whip' && pout > 0) { tf += `translateX(${-pout * 1080}px)`; blur = mb(pout); }
        if (tout === 'drop' && pout > 0) { tf += `translateY(${pout * 1920}px)`; blur = mb(pout); }
        if (tout === 'zoom' && pout > 0) { tf += `scale(${1 + pout * 2.5})`; blur = mb(pout); }
        if (i === 0 && hook > 0) { tf += `scale(${1 + hook * 0.3})`; blur = Math.max(blur, hook * 14); }
        const Cmp = KINDS[s.kind] || ScreenScene;
        const legacy = s.kind in LEGACY;
        const ampArr: number[] = []; ampArr[f] = amp;
        return (
          <AbsoluteFill key={i} style={{transform: tf || undefined, filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
            zIndex: tin === 'zoom' ? 2 : 1, opacity: tin === 'zoom' ? Math.min(1, pin * 2) : 1}}>
            <Cmp p={s.props || {}} f={f} from={s.from} to={s.to} at={at} amp={legacy ? ampArr : amp} side={s.props?.side || (i % 2 ? 'left' : 'right')} />
          </AbsoluteFill>
        );
      })}
      {/* flash on dives / cuts */}
      {scenes.map((s, i) => {
        const t = trOf(i);
        if ((t !== 'flash' && t !== 'cut') || f < s.from || f > s.from + 4) return null;
        return <AbsoluteFill key={'fl' + i} style={{background: t === 'flash' ? '#e8fff4' : '#fff', opacity: (1 - (f - s.from) / 4) * (t === 'flash' ? 1 : 0.5), zIndex: 70}} />;
      })}
      {scenes.slice(1).map((s, i) => {
        const t = trOf(i + 1);
        return t === 'flash' ? <Sfx key={'tr' + i} at={s.from} src="impact" vol={0.45} /> : <Sfx key={'tr' + i} at={s.from - TR / 2} src="whoosh" vol={0.32} />;
      })}
      <Sfx at={0} src="whoosh" vol={0.3} />
      <Cap words={v.words} breaks={v.breaks} />
      {/* grade: warm highlights / teal shadows, vignette, grain */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,60,0.07), rgba(0,40,40,0.12))', mixBlendMode: 'multiply', zIndex: 84}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(0,0,0,0.72)', zIndex: 85}} />
      <Grain o={0.2} />
      <Audio src={staticFile(v.audio)} />
      {v.music ? <Audio src={staticFile(`music/${v.music.file}`)} startFrom={Math.round(v.music.start * 30)}
        volume={(fr) => (talking(fr) ? 0.045 : 0.1) * Math.min(1, fr / 8) * Math.min(1, (v.durationInFrames - fr) / 20)} /> : null}
    </AbsoluteFill>
  );
};
