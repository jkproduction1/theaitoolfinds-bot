import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, DARK, FONT, LIGHT, ToneCtx, fontCss, W} from './theme';
import {SCENES} from './scenes';
import {Mascot} from './Mascot';
import type {VideoProps, Word} from './types';

// Premium animated mesh-gradient background with film grain.
// Light scenes: warm cream with drifting yellow / peach / lilac light.
// Dark scenes: deep navy with yellow + indigo glow. Crossfades between the two.
const Blob: React.FC<{x: number; y: number; r: number; c: string}> = ({x, y, r, c}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2,
    borderRadius: r, background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 68%)`}} />
);

const MeshBg: React.FC<{darkAmt: number}> = ({darkAmt}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const sx = (a: number, sp: number, ph: number) => a * Math.sin(t * sp + ph);
  return (
    <AbsoluteFill style={{background: '#F6F1E7', overflow: 'hidden'}}>
      <Blob x={200 + sx(180, 0.23, 0)} y={420 + sx(160, 0.19, 1)} r={720} c="rgba(255,206,64,0.55)" />
      <Blob x={920 + sx(160, 0.17, 2)} y={980 + sx(200, 0.21, 0.5)} r={760} c="rgba(255,150,110,0.38)" />
      <Blob x={300 + sx(220, 0.15, 3)} y={1600 + sx(140, 0.25, 2)} r={700} c="rgba(170,160,255,0.35)" />
      <AbsoluteFill style={{opacity: darkAmt, background: '#0A0C1C'}}>
        <Blob x={850 + sx(160, 0.2, 1)} y={380 + sx(150, 0.18, 0)} r={760} c="rgba(98,84,255,0.55)" />
        <Blob x={180 + sx(200, 0.16, 2)} y={1250 + sx(180, 0.22, 1)} r={720} c="rgba(255,200,40,0.30)" />
        <Blob x={700 + sx(140, 0.24, 0)} y={1800 + sx(120, 0.2, 3)} r={640} c="rgba(40,140,255,0.35)" />
      </AbsoluteFill>
      {/* film grain so gradients never look flat or banded */}
      <AbsoluteFill style={{opacity: 0.16 + 0.06 * darkAmt, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"
            seed={Math.floor(f / 2) % 50} /></filter>
          <rect width="100%" height="100%" filter="url(#g)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background:
        'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)'}} />
    </AbsoluteFill>
  );
};

const OVERLAP = 8; // frames the old scene keeps flying out while the new one comes in

// Each scene: 3D tilt + blur in, slow camera drift, then flies out (overlapping the next)
const SceneWrap: React.FC<{dur: number; children: React.ReactNode; idx: number;
  first: boolean}> = ({dur, children, idx, first}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = first ? 1 : spring({frame: f, fps, config: {damping: 15, stiffness: 120}});
  const out = interpolate(f, [dur, dur + OVERLAP], [0, 1], {extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'});
  const drift = interpolate(f, [0, dur], [1, 1.035], {extrapolateRight: 'clamp'});
  const dir = idx % 2 ? -1 : 1;
  const style = idx % 3;
  const outT = style === 0 ? `translateY(${-out * 260}px)` :
    style === 1 ? `translateX(${-out * 300 * dir}px) rotate(${-out * 4 * dir}deg)` :
    `scale(${1 + out * 0.25})`;
  return (
    <AbsoluteFill style={{
      opacity: Math.min(1, inn * 1.4) * (1 - out),
      filter: `blur(${(1 - Math.min(1, inn)) * 14 + out * 10}px)`,
      transform: `perspective(1600px) rotateX(${(1 - inn) * 16}deg) ` +
        `translateY(${(1 - inn) * 90}px) scale(${(0.92 + 0.08 * inn) * drift}) ${outT}`,
    }}>{children}</AbsoluteFill>
  );
};

// Kinetic captions: 1-2 words at a time, big, highlighted words on a yellow marker
const Captions: React.FC<{words: Word[]; dark: boolean}> = ({words, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  // group into chunks of max 2 words (break on pauses)
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const nx = words[i + 1];
    const len = cur.reduce((a, x) => a + x.w.length, 0) + (nx ? nx.w.length : 0);
    if (cur.length >= 2 || !nx || nx.s - w.e > 0.25 || len > 13) {
      chunks.push(cur);
      cur = [];
    }
  });
  const ci = chunks.findIndex((c, i) => {
    const end = chunks[i + 1] ? chunks[i + 1][0].s : c[c.length - 1].e + 0.4;
    return t >= c[0].s && t < end;
  });
  if (ci < 0) return null;
  const ch = chunks[ci];
  const pop = spring({frame: f - Math.round(ch[0].s * fps), fps,
    config: {damping: 12, stiffness: 220}});
  return (
    <div style={{position: 'absolute', top: 1300, left: 120, width: W - 240, display: 'flex',
      flexWrap: 'wrap', justifyContent: 'center', gap: 18,
      transform: `scale(${0.85 + 0.15 * pop})`}}>
      {ch.map((w, i) => {
        const active = t >= w.s;
        // karaoke: every word gets the yellow marker while it is spoken,
        // keywords keep it for the rest of the chunk
        const speaking = t >= w.s && t < (ch[i + 1] ? ch[i + 1].s : w.e + 0.25);
        const hl = speaking || (w.hl && active);
        return (
          <span key={i} style={{
            fontFamily: FONT, fontWeight: 900, fontSize: 84, letterSpacing: -2,
            textTransform: 'lowercase', lineHeight: 1.1, padding: '0 14px', borderRadius: 14,
            color: hl ? C.ink : dark ? '#fff' : C.ink,
            backgroundImage: hl ? `linear-gradient(${C.yellow}, ${C.yellow})` : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${interpolate(t, [w.s - 0.05, w.s + 0.12], [0, 100], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}% 100%`,
            opacity: active ? 1 : 0.35,
            textShadow: dark && !hl ? '0 6px 24px rgba(0,0,0,0.6)' : 'none',
          }}>{w.w}</span>
        );
      })}
    </div>
  );
};

const Progress: React.FC<{total: number; dark: boolean}> = ({total, dark}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', top: 0, left: 0, height: 12, width: (f / total) * W,
        background: C.yellow}} />
      <div style={{position: 'absolute', top: 70, width: W, textAlign: 'center', fontFamily: FONT,
        fontWeight: 700, fontSize: 30, color: dark ? 'rgba(255,255,255,0.75)' : C.muted}} />
    </>
  );
};

export const Main: React.FC<VideoProps> = (v) => {
  const f = useCurrentFrame();
  const isDark = (s?: {type: string; props: any}) => !!s && (s.type === 'avatar' || s.props?.bg === 'dark');
  const ci = Math.max(0, v.scenes.findIndex((s) => f >= s.from && f < s.to));
  const current = v.scenes[ci];
  const dark = isDark(current);
  // smooth background crossfade over 10 frames at each scene change
  const prevDark = isDark(v.scenes[ci - 1]);
  const k = current ? Math.min(1, (f - current.from) / 10) : 1;
  const darkAmt = (prevDark ? 1 : 0) * (1 - k) + (dark ? 1 : 0) * k;
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <style>{fontCss}</style>
      <MeshBg darkAmt={darkAmt} />
      {v.scenes.map((s, i) => {
        const Cmp = SCENES[s.type] || SCENES.title;
        const dur = Math.max(1, s.to - s.from);
        const last = i === v.scenes.length - 1;
        return (
          <Sequence key={i} from={s.from} durationInFrames={dur + (last ? 0 : OVERLAP)}
            layout="none">
            <ToneCtx.Provider value={isDark(s) ? DARK : LIGHT}>
              <SceneWrap dur={dur} idx={i} first={i === 0}>
                <Cmp p={s.props || {}} v={v} dur={dur} /></SceneWrap>
            </ToneCtx.Provider>
          </Sequence>
        );
      })}
      {v.scenes.map((s, i) => (i === 0 ? null : (
        <Sequence key={'sfx' + i} from={Math.max(0, s.from - 4)} durationInFrames={20}
          layout="none">
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} />
        </Sequence>
      )))}
      {v.scenes.filter((s) => ['cta', 'media'].includes(s.type)).map((s, i) => (
        <Sequence key={'pop' + i} from={s.from + 6} durationInFrames={10} layout="none">
          <Audio src={staticFile('sfx/pop.wav')} volume={0.4} />
        </Sequence>
      ))}
      {v.scenes.filter((s) => s.type === 'cta').map((s, i) => (
        <Sequence key={'riser' + i} from={Math.max(0, s.from - 27)} durationInFrames={30}
          layout="none">
          <Audio src={staticFile('sfx/riser.wav')} volume={0.25} />
        </Sequence>
      ))}
      <Mascot v={v} />
      <Captions words={v.words} dark={dark} />
      <Progress total={v.durationInFrames} dark={dark} />
      <div style={{position: 'absolute', bottom: 70, width: W, textAlign: 'center',
        fontWeight: 700, fontSize: 30, color: dark ? 'rgba(255,255,255,0.7)' : C.muted}}>
        {v.handle}</div>
      {v.audio ? <Audio src={staticFile(v.audio)} /> : null}
    </AbsoluteFill>
  );
};
