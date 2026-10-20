import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT, fontCss, W} from './theme';
import {SCENES} from './scenes';
import {Mascot} from './Mascot';
import type {VideoProps, Word} from './types';

const GridBg: React.FC = () => {
  const f = useCurrentFrame();
  const off = (f * 0.4) % 60;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
        backgroundSize: '60px 60px', backgroundPosition: `0 ${off}px`, opacity: 0.7,
      }} />
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450,
        left: 90 + Math.sin(f / 70) * 160, top: 420 + Math.cos(f / 90) * 140,
        background: 'radial-gradient(circle, rgba(255,214,10,0.28) 0%, rgba(255,214,10,0) 65%)'}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: 350,
        left: 300 + Math.cos(f / 80) * 200, top: 900 + Math.sin(f / 60) * 120,
        background: 'radial-gradient(circle, rgba(255,106,61,0.12) 0%, rgba(255,106,61,0) 65%)'}} />
      <AbsoluteFill style={{background:
        'radial-gradient(ellipse at 50% 40%, rgba(244,244,241,0) 40%, rgba(244,244,241,0.95) 100%)'}} />
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
  const current = v.scenes.find((s) => f >= s.from && f < s.to);
  const dark = current?.type === 'avatar';
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <style>{fontCss}</style>
      <GridBg />
      {v.scenes.map((s, i) => {
        const Cmp = SCENES[s.type] || SCENES.title;
        const dur = Math.max(1, s.to - s.from);
        const last = i === v.scenes.length - 1;
        return (
          <Sequence key={i} from={s.from} durationInFrames={dur + (last ? 0 : OVERLAP)}
            layout="none">
            <SceneWrap dur={dur} idx={i} first={i === 0}>
              <Cmp p={s.props || {}} v={v} dur={dur} /></SceneWrap>
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
