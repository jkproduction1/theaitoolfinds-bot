// Data-driven retro collage video (the house style). Scenes are physical little worlds
// built from the prop kit; the camera tilts from one to the next.
import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {FONT, fontCss} from './theme';

const K = (n: string) => staticFile(n.startsWith('job/') || n.startsWith('mascot/') ? n : `kit/${n}`);
const css = fontCss + `
@font-face{font-family:Anton;src:url(${staticFile('fonts/anton-latin-400-normal.woff2')})}
@font-face{font-family:Typewriter;src:url(${staticFile('fonts/special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Hand;src:url(${staticFile('fonts/caveat-latin-700-normal.woff2')})}`;
const Y = '#FFD60A';
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.inOut(Easing.cubic);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const TR = 14; // transition frames

type W = {w: string; s: number; e: number};
type Sc = {kind: string; from: number; to: number; props: any; dir?: number};
export type CollageProps = {
  durationInFrames: number; words: W[]; breaks: number[]; audio: string;
  music?: {file: string; start: number} | null; scenes: Sc[]; handle: string;
};

const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.4}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Drop: React.FC<{at: number; x: number; y: number; w: number; rot: number; z?: number; children: React.ReactNode}> = ({
  at, x, y, w, rot, z = 1, children,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 140, mass: 0.9}});
  const l = 1 - s;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, zIndex: z, opacity: f < at ? 0 : 1,
      transform: `translateY(${l * -260}px) rotate(${rot + l * 18}deg) scale(${1 + l * 0.35})`,
      filter: `drop-shadow(${8 + l * 30}px ${14 + l * 50}px ${10 + l * 30}px rgba(0,0,0,${0.45 - l * 0.2}))`}}>
      {children}
    </div>
  );
};

const Head: React.FC<{text: string; at: number; size?: number; color?: string}> = ({text, at, size = 150, color = Y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 9, stiffness: 180}});
  const depth = Array.from({length: 10}, (_, i) => `${i + 1}px ${i + 1}px 0 #2a1c05`).join(',');
  return (
    <div style={{fontFamily: 'Anton', fontSize: text.length > 14 ? size * 0.8 : size, lineHeight: 0.95, color,
      textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', opacity: f < at ? 0 : 1, padding: '0 40px',
      transform: `translateY(${(1 - s) * -120}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -8}deg)`,
      textShadow: `${depth}, 14px 20px 30px rgba(0,0,0,0.45)`, WebkitTextStroke: '3px #2a1c05'}}>{text}</div>
  );
};

const Screen: React.FC<{src: string; f: number}> = ({src, f}) => (
  <>
    <Img src={K(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.12 + f * 0.0012})`}} />
    <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 5px)'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 70px rgba(0,0,0,0.8)', background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.12), transparent 60%)'}} />
  </>
);

// CRT with content on its screen (screen hole measured on crt.png)
const Crt: React.FC<{w: number; src: string; f: number; popup?: any; popAt?: number}> = ({w, src, f, popup, popAt = 0}) => {
  const p = ease(f, popAt, popAt + 10);
  return (
    <div style={{position: 'relative', width: w}}>
      <div style={{position: 'absolute', zIndex: 2, left: '11.5%', top: '16%', width: '77%', height: '57%', overflow: 'hidden',
        borderRadius: w * 0.025, background: '#000'}}>
        <Screen src={src} f={f} />
        {popup && f >= popAt ? (
          <div style={{position: 'absolute', left: '8%', right: '8%', top: '22%', background: '#c3c3c3',
            border: '3px solid', borderColor: '#fff #404040 #404040 #fff', transform: `scale(${0.7 + 0.3 * p})`,
            opacity: p, fontFamily: 'Typewriter'}}>
            <div style={{background: 'linear-gradient(90deg,#000080,#1084d0)', color: '#fff', padding: '6px 10px', fontSize: w * 0.03,
              fontFamily: FONT, fontWeight: 700, display: 'flex', justifyContent: 'space-between'}}>
              <span>{popup.title}</span><span>✕</span></div>
            <div style={{padding: w * 0.025, fontSize: w * 0.04, color: '#000', textAlign: 'center'}}>{popup.text}</div>
            <div style={{display: 'flex', justifyContent: 'center', paddingBottom: w * 0.025}}>
              <div style={{border: '3px solid', borderColor: '#fff #404040 #404040 #fff', padding: '6px 26px',
                fontSize: w * 0.045, fontFamily: 'Anton', color: '#000', background: '#dcdcdc',
                transform: `scale(${1 + 0.05 * Math.sin(f / 4)})`}}>{popup.button}</div>
            </div>
          </div>
        ) : null}
      </div>
      <Img src={K('crt.png')} style={{width: w, position: 'relative', zIndex: 1}} />
    </div>
  );
};

const Polaroid: React.FC<{img: string; name?: string; sub?: string; w?: number}> = ({img, name, sub, w = 520}) => (
  <div style={{position: 'relative', width: w}}>
    <Img src={K('polaroid.png')} style={{width: w, display: 'block'}} />
    <div style={{position: 'absolute', left: '7.5%', top: '6.5%', width: '85%', height: '68%', overflow: 'hidden', background: '#111'}}>
      <Img src={K(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    {name ? <div style={{position: 'absolute', left: 0, right: 0, bottom: '5%', textAlign: 'center', fontFamily: 'Hand',
      fontSize: w * 0.115, color: '#1b1b2e', transform: 'rotate(-2deg)', whiteSpace: 'nowrap'}}>{name}
      {sub ? <span style={{fontSize: w * 0.07, color: '#7a2b2b'}}> = {sub}</span> : null}</div> : null}
    <Img src={K('tape.png')} style={{position: 'absolute', top: -w * 0.07, left: '30%', width: w * 0.42, transform: 'rotate(4deg)', opacity: 0.9}} />
  </div>
);

const PostIt: React.FC<{text: string; w?: number; color?: string}> = ({text, w = 360, color = '#ffe873'}) => (
  <div style={{width: w, minHeight: w * 0.9, background: color, padding: w * 0.08, boxSizing: 'border-box',
    fontFamily: 'Hand', fontSize: w * 0.16, color: '#1d1d2a', lineHeight: 1.05,
    boxShadow: 'inset 0 -20px 30px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center'}}>{text}</div>
);

const Pin: React.FC<{x: number}> = ({x}) => (
  <div style={{position: 'absolute', top: -20, left: x, width: 60, height: 60, borderRadius: 30, zIndex: 5,
    background: 'radial-gradient(circle at 35% 30%, #ff8a8a, #d0141c 55%, #7a0b10)', boxShadow: '6px 10px 10px rgba(0,0,0,0.45)'}} />
);

const Stamp: React.FC<{text: string; at: number; f: number; x: number; y: number}> = ({text, at, f, x, y}) => {
  const s = spring({frame: f - at, fps: 30, config: {damping: 8, stiffness: 260}});
  return f >= at ? (
    <div style={{position: 'absolute', zIndex: 30, left: x, top: y, transform: `scale(${2.4 - 1.4 * s}) rotate(-12deg)`,
      opacity: Math.min(1, s * 2), border: '12px solid #c1121f', borderRadius: 18, padding: '6px 40px',
      fontFamily: 'Anton', fontSize: 160, color: '#c1121f', letterSpacing: 6, mixBlendMode: 'multiply'}}>{text}</div>
  ) : null;
};

// Scrappy: flips in like a card, floats, hops to the voice, swaps pose
const Scrappy: React.FC<{poses: [number, string][]; at: number; x: number; y: number; h: number; rot?: number;
  amp: number[]; f: number}> = ({poses, at, x, y, h, rot = 0, amp, f}) => {
  const s = spring({frame: f - at, fps: 30, config: {damping: 11, stiffness: 120}});
  let pose = poses[0][1], since = poses[0][0];
  for (const [t, ps] of poses) if (f >= t) { pose = ps; since = t; }
  const swap = spring({frame: f - since, fps: 30, config: {damping: 9, stiffness: 260}});
  const a = amp[Math.max(0, Math.min(amp.length - 1, f))] || 0;
  return (
    <div style={{position: 'absolute', left: x, top: y + Math.sin(f / 11) * 8 - a * 26, height: h, zIndex: 20,
      opacity: f < at ? 0 : 1, perspective: 900, transformOrigin: '50% 100%',
      transform: `scale(${(0.9 + 0.1 * swap) * (1 + a * 0.04)}, ${(0.9 + 0.1 * swap) * (1 - a * 0.03)})`}}>
      <div style={{transform: `rotateY(${(1 - s) * 95}deg) rotate(${rot + Math.sin(f / 17) * 2.5}deg) translateY(${(1 - s) * 120}px)`,
        filter: 'drop-shadow(12px 22px 16px rgba(0,0,0,0.45))'}}>
        <Img src={staticFile(`mascot/${pose}.png`)} style={{height: h, display: 'block'}} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ scene kinds
type SP = {p: any; f: number; from: number; to: number; at: (re: string, fb: number) => number; amp: number[]};

const Hang: React.FC<SP> = ({p, f, from, to, amp}) => {
  const t = (f - from) / 30;
  const swing = 22 * Math.exp(-t * 1.3) * Math.cos(t * 4.2);
  const drop = spring({frame: f - from, fps: 30, config: {damping: 14, stiffness: 70}});
  return (
    <>
      <Img src={K('sky.jpg')} style={{position: 'absolute', width: 1080, height: 2100, objectFit: 'cover', top: -60 - (f - from) * 0.25}} />
      <div style={{position: 'absolute', left: 540, top: -40, width: 0, height: 0,
        transform: `translateY(${(1 - drop) * -900}px) rotate(${swing}deg)`, transformOrigin: '0 0'}}>
        <Img src={K('rope.png')} style={{position: 'absolute', left: -40, top: 0, width: 80, height: 700, objectFit: 'fill'}} />
        <div style={{position: 'absolute', left: -380, top: 640}}>
          <Crt w={760} src={p.screen} f={f - from} popup={p.popup} popAt={p.popAt ?? 16} />
        </div>
      </div>
      <Img src={K('grass.png')} style={{position: 'absolute', bottom: -40 - (f - from) * 0.4, left: -60, width: 1200}} />
      <div style={{position: 'absolute', top: 230, width: 1080}}>
        {p.head1 ? <Head text={p.head1} at={from + 6} /> : null}
        <div style={{height: 16}} />
        {p.head2 ? <Head text={p.head2} at={from + 20} size={120} color="#fff" /> : null}
      </div>
      <Sfx at={from + 2} src="whoosh" vol={0.35} />
      {p.head1 ? <Sfx at={from + 8} src="impact" vol={0.5} /> : null}
      {p.head2 ? <Sfx at={from + 22} src="impact" vol={0.4} /> : null}
      <Scrappy poses={p.poses || [[0, 'chill']]} at={from + 30} x={650} y={1330} h={600} rot={-3} amp={amp} f={f} />
    </>
  );
};

const Desk: React.FC<SP> = ({p, f, from, to, at, amp}) => {
  const items = p.items || [];
  const four = items.length > 3;
  const spots = four ? [[30, 190, -7], [560, 300, 6], [50, 760, -4], [560, 880, 5]] : [[60, 230, -7], [440, 560, 6], [90, 900, -4]];
  const pw = four ? 470 : 520;
  return (
    <>
      <Img src={K('desk.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${1 + (f - from) * 0.0006})`}} />
      <Drop at={from + 4} x={-70} y={1560} w={250} rot={-20}><Img src={K('paperball.png')} style={{width: '100%'}} /></Drop>
      {items.map((it: any, i: number) => {
        const t = it.word ? at(it.word, from + 8 + i * 18) : from + 8 + i * ((to - from - 20) / Math.max(1, items.length));
        const [x, y, r] = spots[i % spots.length];
        return (
          <Drop key={i} at={t} x={x} y={y} w={pw} rot={r} z={2 + i}>
            <Polaroid img={it.img} name={it.name} sub={it.sub} w={pw} />
            <Sfx at={t - 2} src="whoosh" vol={0.25} />
            <Sfx at={t + 4} src="pop" vol={0.45} />
          </Drop>
        );
      })}
      <Scrappy poses={p.poses || [[0, 'excited']]} at={from + 20} x={p.sx ?? 640} y={p.sy ?? 1330} h={520} amp={amp} f={f} />
    </>
  );
};

const CrtClose: React.FC<SP> = ({p, f, from, amp}) => {
  const k = ease(f, from, from + 30, IO);
  return (
    <>
      <Img src={K('desk.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover', filter: 'brightness(0.7)'}} />
      <div style={{position: 'absolute', left: 40, top: 300, transform: `scale(${1.05 + k * 0.12}) rotate(${-2 + k * 2}deg)`, transformOrigin: '50% 40%'}}>
        <Crt w={1000} src={p.screen} f={f - from} />
      </div>
      {p.note ? <Drop at={from + 14} x={600} y={1060} w={380} rot={6} z={5}><PostIt text={p.note} /></Drop> : null}
      {p.note ? <Sfx at={from + 16} src="pop" vol={0.45} /> : null}
      <Scrappy poses={p.poses || [[0, 'shock']]} at={from + 24} x={30} y={1180} h={620} amp={amp} f={f} />
    </>
  );
};

const Board: React.FC<SP> = ({p, f, from, to, at, amp}) => {
  const cards: string[] = p.cards || [];
  const typedAt = from + 14;
  const typed = p.note ? p.note.slice(0, Math.max(0, Math.floor((f - typedAt) * 1.3))) : '';
  return (
    <>
      <Img src={K('cork.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${1 + (f - from) * 0.0008})`}} />
      {p.note ? (
        <Drop at={from + 6} x={120} y={300} w={840} rot={-3}>
          <div style={{position: 'relative'}}>
            <Img src={K('paper.png')} style={{width: 840, display: 'block'}} />
            <div style={{position: 'absolute', left: 120, top: 190, right: 70, fontFamily: 'Typewriter', fontSize: 64,
              color: '#1d1d24', lineHeight: 1.3}}>{typed.split('\n').map((l: string, i: number) => <div key={i}>{l}</div>)}</div>
            <Pin x={390} />
          </div>
        </Drop>
      ) : null}
      {cards.map((c, i) => {
        const t = from + 8 + i * 9;
        const col = ['#ffe873', '#9fe3ff', '#ffb3c7', '#b8f5a6'][i % 4];
        return (
          <Drop key={i} at={t} x={70 + (i % 2) * 480} y={330 + Math.floor(i / 2) * 430} w={420} rot={(i % 2 ? 4 : -5)} z={3 + i}>
            <div style={{position: 'relative'}}><PostIt text={c} w={420} color={col} /><Pin x={180} /></div>
            <Sfx at={t + 2} src="pop" vol={0.35} />
          </Drop>
        );
      })}
      {p.stamp ? <Stamp text={p.stamp} at={p.stampWord ? at(p.stampWord, from + 40) : from + 40} f={f} x={240} y={p.note ? 1000 : 1250} /> : null}
      {p.stamp ? <Sfx at={p.stampWord ? at(p.stampWord, from + 40) : from + 40} src="impact" vol={0.6} /> : null}
      <Scrappy poses={p.poses || [[0, 'talk']]} at={from + 16} x={560} y={1180} h={640} rot={3} amp={amp} f={f} />
    </>
  );
};

const KINDS: Record<string, React.FC<SP>> = {hang: Hang, desk: Desk, crt: CrtClose, board: Board};

// ------------------------------------------------------------------ captions: small pill, fade
const Cap: React.FC<{words: W[]; breaks: number[]}> = ({words, breaks}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const ph: W[][] = [];
  words.forEach((w, i) => {
    const gap = i > 0 ? w.s - words[i - 1].e : 0;
    if (!ph.length || ph[ph.length - 1].length >= 3 || gap > 0.18 || breaks.includes(i)) ph.push([]);
    ph[ph.length - 1].push(w);
  });
  const p = ph.find((g, i) => t >= g[0].s && t < (ph[i + 1] ? ph[i + 1][0].s : g[g.length - 1].e + 0.4));
  if (!p) return null;
  const k = ease(f, p[0].s * 30, p[0].s * 30 + 6);
  return (
    <div style={{position: 'absolute', top: 1360, width: 1080, display: 'flex', justifyContent: 'center', zIndex: 50}}>
      <div style={{background: 'rgba(20,18,16,0.78)', color: '#fff', fontFamily: FONT, fontWeight: 600, fontSize: 40,
        padding: '10px 22px', borderRadius: 12, opacity: k, transform: `translateY(${(1 - k) * 10}px)`,
        filter: `blur(${(1 - k) * 6}px)`}}>{p.map((w) => w.w).join(' ').replace(/[.,]$/, '')}</div>
    </div>
  );
};

export const CollageMain: React.FC<CollageProps> = (v) => {
  const f = useCurrentFrame();
  const voice = useAudioData(staticFile(v.audio));
  const amp: number[] = [];
  if (voice) for (let i = 0; i < v.durationInFrames; i++) {
    const vis = visualizeAudio({fps: 30, frame: i, audioData: voice, numberOfSamples: 16});
    amp.push(Math.min(1, (vis.slice(0, 6).reduce((x, y) => x + y, 0) / 6) * 3));
  }
  const at = (re: string, fb: number) => {
    const r = new RegExp(re, 'i');
    const w = v.words.find((x) => r.test(x.w));
    return w ? Math.round(w.s * 30) : fb;
  };
  const talking = (fr: number) => v.words.some((w) => fr / 30 >= w.s - 0.05 && fr / 30 <= w.e + 0.1);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <style>{css}</style>
      {v.scenes.map((s, i) => {
        if (f < s.from - TR || f > s.to + TR) return null;
        // camera tilt: the new scene comes up from below, the old one leaves upward
        const inK = i === 0 ? 1 : ease(f, s.from - TR, s.from, IO);
        const outK = i === v.scenes.length - 1 ? 0 : ease(f, s.to - TR, s.to, IO);
        const dir = s.dir ?? 1;
        const Cmp = KINDS[s.kind] || Hang;
        return (
          <AbsoluteFill key={i} style={{transform: `translateY(${((1 - inK) - outK) * 1920 * dir}px)`}}>
            <Cmp p={s.props} f={f} from={s.from} to={s.to} at={at} amp={amp} />
          </AbsoluteFill>
        );
      })}
      {v.scenes.slice(1).map((s, i) => <Sfx key={'tr' + i} at={s.from - TR} src="whoosh" vol={0.3} />)}
      <Cap words={v.words} breaks={v.breaks} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,60,0.08), rgba(40,20,0,0.12))', mixBlendMode: 'multiply', zIndex: 60}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.55)', zIndex: 61}} />
      <AbsoluteFill style={{opacity: 0.16, mixBlendMode: 'overlay', zIndex: 62}}>
        <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85"
          numOctaves="2" seed={Math.floor(f / 2) % 40} /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
      </AbsoluteFill>
      <Audio src={staticFile(v.audio)} />
      {v.music ? <Audio src={staticFile(`music/${v.music.file}`)} startFrom={Math.round(v.music.start * 30)}
        volume={(fr) => (talking(fr) ? 0.045 : 0.1) * Math.min(1, fr / 8) * Math.min(1, (v.durationInFrames - fr) / 20)} /> : null}
    </AbsoluteFill>
  );
};
