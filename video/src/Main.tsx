import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT, fontCss, W} from './theme';
import {SCENES} from './scenes';
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
      <AbsoluteFill style={{background:
        'radial-gradient(ellipse at 50% 40%, rgba(244,244,241,0) 40%, rgba(244,244,241,0.95) 100%)'}} />
    </AbsoluteFill>
  );
};

// Each scene slides/zooms in and quickly out
const SceneWrap: React.FC<{dur: number; children: React.ReactNode; idx: number}> = ({
  dur, children, idx,
}) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 5, dur], [0, 1], {extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'});
  const dir = idx % 2 ? -1 : 1;
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform:
      `translateX(${out * -160 * dir}px) scale(${1 - out * 0.06})`}}>{children}</AbsoluteFill>
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
    <div style={{position: 'absolute', top: 1370, left: 120, width: W - 240, display: 'flex',
      flexWrap: 'wrap', justifyContent: 'center', gap: 18,
      transform: `scale(${0.85 + 0.15 * pop})`}}>
      {ch.map((w, i) => {
        const active = t >= w.s;
        const hl = w.hl;
        return (
          <span key={i} style={{
            fontFamily: FONT, fontWeight: 900, fontSize: 84, letterSpacing: -2,
            textTransform: 'lowercase', lineHeight: 1.1, padding: '0 14px', borderRadius: 14,
            color: hl ? C.ink : dark ? '#fff' : C.ink,
            background: hl ? C.yellow : 'transparent',
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
        return (
          <Sequence key={i} from={s.from} durationInFrames={dur} layout="none">
            <SceneWrap dur={dur} idx={i}><Cmp p={s.props || {}} v={v} dur={dur} /></SceneWrap>
          </Sequence>
        );
      })}
      <Captions words={v.words} dark={dark} />
      <Progress total={v.durationInFrames} dark={dark} />
      <div style={{position: 'absolute', bottom: 70, width: W, textAlign: 'center',
        fontWeight: 700, fontSize: 30, color: dark ? 'rgba(255,255,255,0.7)' : C.muted}}>
        {v.handle}</div>
      {v.audio ? <Audio src={staticFile(v.audio)} /> : null}
    </AbsoluteFill>
  );
};
