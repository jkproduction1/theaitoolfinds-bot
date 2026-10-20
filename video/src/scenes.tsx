import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import {C, FONT, Icon, W} from './theme';
import type {VideoProps} from './types';

type SP = {p: Record<string, any>; v: VideoProps; dur: number};

// Sound effect at a frame inside the current scene
const Sfx: React.FC<{at: number; src: string; vol?: number; len?: number}> = ({
  at, src, vol = 0.35, len = 25,
}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={len} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const useSpring = (delay = 0, damping = 14, stiffness = 140) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness, mass: 0.9}});
};

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });

// Area for the scene content (captions live below it)
const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{top: 230, height: 1080, alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </AbsoluteFill>
);

const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({
  style, children,
}) => (
  <div style={{
    background: C.card, borderRadius: 36, border: `2px solid ${C.line}`,
    boxShadow: '0 30px 80px rgba(20,20,30,0.12), 0 6px 18px rgba(20,20,30,0.06)', ...style,
  }}>{children}</div>
);

const Logo: React.FC<{v: VideoProps; size: number}> = ({v, size}) =>
  v.logo ? (
    <Img src={staticFile(v.logo)} style={{width: size, height: size, borderRadius: size * 0.22,
      objectFit: 'contain', background: '#fff'}} />
  ) : (
    <div style={{width: size, height: size, borderRadius: size * 0.22, background: C.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon name="Sparkles" size={size * 0.55} color={C.yellow} />
    </div>
  );

// ---------------------------------------------------------------- TITLE (hook)
export const Title: React.FC<SP> = ({v, dur}) => {
  // Hook: show WHAT the tool does right away (real demo or the product itself),
  // with a compact name tag above it. A text-only title loses viewers in second one.
  const f = useCurrentFrame();
  const a = useSpring(0);
  const b = useSpring(4, 15);
  const m = v.media;
  const zoom = interpolate(f, [0, dur], [1.0, 1.12], {extrapolateRight: 'clamp'});
  const cw = 940;
  let ch = 760;
  if (m) ch = Math.min(800, Math.max(660, (cw * m.h) / m.w));
  return (
    <AbsoluteFill style={{top: 230, height: 1080, alignItems: 'center'}}>
      <Sfx at={0} src="impact" vol={0.5} len={22} />
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 10,
        transform: `translateY(${(1 - a) * -40}px)`, opacity: a}}>
        <Logo v={v} size={86} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{background: C.yellow, color: C.ink, fontWeight: 800, fontSize: 24,
            padding: '6px 16px', borderRadius: 999, alignSelf: 'flex-start',
            letterSpacing: 1}}>AI TOOL OF THE DAY</div>
          <div style={{fontWeight: 900, fontSize: v.title.length > 16 ? 50 : 62, color: C.ink,
            letterSpacing: -2, lineHeight: 1, maxWidth: 760}}>{v.title}</div>
        </div>
      </div>
      <div style={{marginTop: 34, transform: `translateY(${(1 - b) * 120}px) scale(${0.92 + 0.08 * b})`,
        opacity: b}}>
        <Card style={{width: cw, height: ch, overflow: 'hidden', borderRadius: 36}}>
          {m && m.kind === 'video' ? (
            <OffthreadVideo src={staticFile(m.src)} muted style={{width: cw, height: ch,
              objectFit: 'cover', transform: `scale(${zoom})`}} />
          ) : m ? (
            <Img src={staticFile(m.src)} style={{width: cw, height: ch, objectFit: 'cover',
              transform: `scale(${zoom})`}} />
          ) : (
            <Img src={staticFile(v.screenshot)} style={{width: cw, objectFit: 'cover',
              objectPosition: 'top', transformOrigin: '50% 20%', transform: `scale(${zoom})`}} />
          )}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- BROWSER (screenshot)
export const Browser: React.FC<SP> = ({p, v, dur}) => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16);
  const cw = 900, ch = 980, bar = 58;
  const viewH = ch - bar;
  const scale = cw / v.screenshotW;
  const pageH = v.screenshotH * scale;
  const maxScroll = Math.max(0, pageH - viewH);
  const start = p.focus === 'middle' ? maxScroll * 0.35 : p.focus === 'bottom' ? maxScroll * 0.7 : 0;
  const motion = p.motion || 'scroll';
  const k = ease(f, 6, dur - 4);
  let y = start, zoom = 1, ox = 0;
  if (motion === 'scroll') y = Math.min(maxScroll, start + k * Math.min(1300, maxScroll * 0.45));
  else { zoom = 1 + 0.45 * k; ox = (p.x ?? 0.5) - 0.5; }
  return (
    <Stage>
      <Card style={{width: cw, height: ch, overflow: 'hidden', transform:
        `translateY(${(1 - enter) * 120}px) scale(${0.9 + 0.1 * enter})`, opacity: enter}}>
        <div style={{height: bar, background: '#F1F1EE', borderBottom: `2px solid ${C.line}`,
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />))}
          <div style={{marginLeft: 18, flex: 1, height: 34, borderRadius: 17, background: '#fff',
            border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center',
            padding: '0 18px', fontSize: 22, fontWeight: 600, color: C.muted}}>{v.host}</div>
        </div>
        <div style={{position: 'relative', width: cw, height: viewH, overflow: 'hidden'}}>
          <Img src={staticFile(v.screenshot)} style={{position: 'absolute', width: cw,
            top: -y, left: 0, transformOrigin: `${50 + ox * 100}% ${y + viewH * 0.35}px`,
            transform: `scale(${zoom})`}} />
        </div>
      </Card>
    </Stage>
  );
};

// ---------------------------------------------------------------- ICON GRID
export const Icons: React.FC<SP> = ({p}) => {
  const items: {icon: string; label: string}[] = (p.items || []).slice(0, 6);
  const cols = items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length));
  const size = cols <= 2 ? 380 : 290;
  return (
    <Stage>
      {p.title ? <Heading text={p.title} /> : null}
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 30,
        marginTop: p.title ? 40 : 0}}>
        {items.map((it, i) => <IconTile key={i} it={it} i={i} size={size} />)}
      </div>
    </Stage>
  );
};

const IconTile: React.FC<{it: {icon: string; label: string}; i: number; size: number}> = ({
  it, i, size,
}) => {
  const s = useSpring(i * 4, 12, 160);
  return (
    <Card style={{width: size, height: size * 0.92, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${s})`,
      opacity: Math.min(1, s * 1.5)}}>
      <Sfx at={i * 4 + 2} src="pop" vol={0.22} len={8} />
      <div style={{width: size * 0.36, height: size * 0.36, borderRadius: 26,
        background: i % 2 ? C.yellow : C.ink, display: 'flex', alignItems: 'center',
        justifyContent: 'center'}}>
        <Icon name={it.icon} size={size * 0.2} color={i % 2 ? C.ink : C.yellow} />
      </div>
      <div style={{fontWeight: 700, fontSize: size > 300 ? 38 : 30, color: C.ink,
        textAlign: 'center', padding: '0 18px', lineHeight: 1.1}}>{it.label}</div>
    </Card>
  );
};

const Heading: React.FC<{text: string}> = ({text}) => {
  const s = useSpring(0);
  return (
    <div style={{fontWeight: 900, fontSize: 64, color: C.ink, letterSpacing: -2,
      transform: `translateY(${(1 - s) * 40}px)`, opacity: s, textAlign: 'center',
      maxWidth: 940}}>{text}</div>
  );
};

// ---------------------------------------------------------------- CHECKLIST
export const Checklist: React.FC<SP> = ({p, dur}) => {
  const items: string[] = (p.items || []).slice(0, 4);
  const enter = useSpring(0, 16);
  const step = Math.max(6, Math.floor((dur * 0.6) / Math.max(1, items.length)));
  return (
    <Stage>
      <Card style={{width: 920, padding: '44px 46px', transform:
        `translateY(${(1 - enter) * 100}px)`, opacity: enter}}>
        {p.title ? <div style={{fontWeight: 900, fontSize: 52, color: C.ink, marginBottom: 26,
          letterSpacing: -1.5}}>{p.title}</div> : null}
        {items.map((t, i) => <CheckRow key={i} text={t} delay={6 + i * step} />)}
      </Card>
    </Stage>
  );
};

const CheckRow: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const s = useSpring(delay, 13, 170);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 0',
      borderTop: `2px solid ${C.line}`, opacity: 0.25 + 0.75 * Math.min(1, s)}}>
      <Sfx at={delay + 3} src="tick" vol={0.5} len={5} />
      <div style={{width: 58, height: 58, borderRadius: 29, flexShrink: 0,
        background: s > 0.5 ? C.yellow : '#EEE', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transform: `scale(${0.6 + 0.4 * s})`}}>
        <Icon name="Check" size={34} color={C.ink} stroke={3.4} />
      </div>
      <div style={{fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.15}}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------- CHAT (prompt -> result)
export const Chat: React.FC<SP> = ({p, v, dur}) => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 16);
  const prompt: string = p.prompt || '';
  const typed = Math.floor(interpolate(f, [6, Math.max(12, dur * 0.45)], [0, prompt.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const showReply = f > dur * 0.5;
  const r = useSpring(Math.floor(dur * 0.5), 14);
  const typeEnd = Math.max(12, dur * 0.45);
  const clicks = [];
  for (let k = 6; k < typeEnd; k += 3) clicks.push(k);  // keyboard clicks while typing
  return (
    <Stage>
      {clicks.map((k, i) => <Sfx key={i} at={k} src="type" vol={i % 2 ? 0.18 : 0.26} len={3} />)}
      <Sfx at={dur * 0.5} src="pop" vol={0.3} len={8} />
      <Card style={{width: 920, padding: 40, transform: `translateY(${(1 - enter) * 100}px)`,
        opacity: enter, display: 'flex', flexDirection: 'column', gap: 26}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Logo v={v} size={64} />
          <div style={{fontWeight: 800, fontSize: 38, color: C.ink}}>{v.title}</div>
        </div>
        <div style={{alignSelf: 'flex-end', maxWidth: 720, background: C.ink, color: '#fff',
          borderRadius: '30px 30px 8px 30px', padding: '24px 30px', fontSize: 36,
          fontWeight: 600, lineHeight: 1.25, minHeight: 50}}>
          {prompt.slice(0, typed)}<span style={{opacity: f % 16 < 8 ? 1 : 0}}>|</span>
        </div>
        {showReply ? (
          <div style={{alignSelf: 'flex-start', maxWidth: 760, background: '#F2F2EF',
            borderRadius: '30px 30px 30px 8px', padding: '24px 30px', fontSize: 36,
            fontWeight: 600, color: C.ink, lineHeight: 1.25, transform: `scale(${r})`,
            transformOrigin: 'left top'}}>{p.reply}</div>
        ) : null}
      </Card>
    </Stage>
  );
};

// ---------------------------------------------------------------- FLOW  A -> tool -> B
export const Flow: React.FC<SP> = ({p, v}) => {
  const a = useSpring(0);
  const b = useSpring(8);
  const c = useSpring(16);
  const node = (icon: string, label: string, s: number, dark = false) => (
    <Card style={{width: 760, padding: '30px 36px', display: 'flex', alignItems: 'center',
      gap: 28, transform: `scale(${s})`, opacity: Math.min(1, s * 1.4),
      background: dark ? C.ink : C.card}}>
      <div style={{width: 92, height: 92, borderRadius: 24, background: dark ? C.yellow : '#F1F1EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={icon} size={52} color={C.ink} />
      </div>
      <div style={{fontWeight: 800, fontSize: 44, color: dark ? '#fff' : C.ink}}>{label}</div>
    </Card>
  );
  const arrow = (s: number) => (
    <div style={{height: 70, display: 'flex', alignItems: 'center', opacity: s}}>
      <Icon name="ArrowDown" size={60} color={C.accent} stroke={3} />
    </div>
  );
  return (
    <Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {node(p.from_icon || 'FileText', p.from || 'Your input', a)}
        {arrow(b)}
        <div style={{transform: `scale(${b})`}}>
          <Card style={{padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 20,
            borderRadius: 999}}>
            <Logo v={v} size={64} />
            <div style={{fontWeight: 900, fontSize: 42, color: C.ink}}>{v.title}</div>
          </Card>
        </div>
        {arrow(c)}
        {node(p.to_icon || 'Sparkles', p.to || 'Result', c, true)}
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- BIG stamp (FREE, 10x...)
export const Big: React.FC<SP> = ({p}) => {
  const s = useSpring(0, 9, 180);
  const t = useSpring(8);
  return (
    <Stage>
      <Sfx at={1} src="impact" vol={0.55} len={22} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <div style={{background: C.yellow, color: C.ink, fontWeight: 900,
          fontSize: (p.text || '').length > 6 ? 150 : 230, padding: '10px 60px',
          borderRadius: 40, transform: `scale(${s}) rotate(${-4 * s}deg)`, letterSpacing: -6,
          boxShadow: '0 30px 80px rgba(0,0,0,0.15)'}}>{p.text}</div>
        {p.sub ? <div style={{fontWeight: 700, fontSize: 52, color: C.ink, opacity: t,
          transform: `translateY(${(1 - t) * 40}px)`, textAlign: 'center', maxWidth: 900}}>
          {p.sub}</div> : null}
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- COMPARE before/after
export const Compare: React.FC<SP> = ({p}) => {
  const a = useSpring(0);
  const b = useSpring(10);
  const row = (label: string, text: string, s: number, good: boolean) => (
    <Card style={{width: 900, padding: '34px 40px', transform: `translateX(${(1 - s) * (good ? 300 : -300)}px)`,
      opacity: Math.min(1, s * 1.3), background: good ? C.ink : C.card}}>
      <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 2,
        color: good ? C.yellow : C.muted}}>{label}</div>
      <div style={{fontWeight: 800, fontSize: 52, color: good ? '#fff' : C.ink, marginTop: 10,
        textDecoration: good ? 'none' : 'line-through', textDecorationColor: C.accent,
        textDecorationThickness: 6, lineHeight: 1.1}}>{text}</div>
    </Card>
  );
  return (
    <Stage>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
        {row('BEFORE', p.before || '', a, false)}
        {row('WITH THIS TOOL', p.after || '', b, true)}
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- CTA (comment keyword)
export const Cta: React.FC<SP> = ({v}) => {
  const a = useSpring(0);
  const b = useSpring(8, 10, 170);
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
        <div style={{fontWeight: 900, fontSize: 70, color: C.ink, opacity: a, letterSpacing: -2,
          transform: `translateY(${(1 - a) * 40}px)`, textAlign: 'center'}}>Want the link?</div>
        <Card style={{padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 26,
          transform: `scale(${b})`}}>
          <Icon name="MessageCircle" size={70} color={C.ink} />
          <div style={{fontWeight: 700, fontSize: 46, color: C.muted}}>Comment</div>
          <div style={{background: C.yellow, fontWeight: 900, fontSize: 64, color: C.ink,
            padding: '6px 26px', borderRadius: 18,
            transform: `scale(${1 + 0.04 * Math.sin(f / 4)})`}}>{v.keyword}</div>
        </Card>
        <div style={{fontWeight: 700, fontSize: 40, color: C.muted, opacity: a}}>
          Follow {v.handle} for daily AI tools</div>
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- AVATAR (your AI twin)
export const Avatar: React.FC<SP> = ({v}) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 90], [1.08, 1.0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.dark}}>
      {v.avatar ? (
        <OffthreadVideo src={staticFile(v.avatar)} muted
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
      ) : null}
      <AbsoluteFill style={{background:
        'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center'}}>
        <span style={{background: C.yellow, color: C.ink, fontWeight: 900, fontSize: 64,
          padding: '8px 26px', borderRadius: 16}}>{v.title}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- MEDIA (real demo)
export const Media: React.FC<SP> = ({p, v, dur}) => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 15);
  const lab = useSpring(6, 11, 180);
  const m = v.media;
  if (!m) return null;
  const maxW = 940, maxH = 1000;
  const k = Math.min(maxW / m.w, maxH / m.h);
  const w = m.w * k, h = m.h * k;
  const zoom = interpolate(f, [0, dur], [1.0, 1.07], {extrapolateRight: 'clamp'});
  return (
    <Stage>
      <div style={{position: 'relative', transform: `translateY(${(1 - enter) * 120}px)`,
        opacity: enter}}>
        <Card style={{width: w, height: h, overflow: 'hidden', borderRadius: 34}}>
          {m.kind === 'video' ? (
            <OffthreadVideo src={staticFile(m.src)} muted
              style={{width: w, height: h, objectFit: 'cover', transform: `scale(${zoom})`}} />
          ) : (
            <Img src={staticFile(m.src)}
              style={{width: w, height: h, objectFit: 'cover', transform: `scale(${zoom})`}} />
          )}
        </Card>
        <div style={{position: 'absolute', top: -30, left: 30, transform: `scale(${lab}) rotate(-3deg)`,
          background: C.yellow, color: C.ink, fontWeight: 900, fontSize: 38,
          padding: '10px 24px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 16, height: 16, borderRadius: 8, background: '#FF3B30',
            opacity: f % 30 < 18 ? 1 : 0.3}} />
          {(p.label || 'Real result').toUpperCase()}
        </div>
      </div>
    </Stage>
  );
};

export const SCENES: Record<string, React.FC<SP>> = {
  title: Title, browser: Browser, icons: Icons, checklist: Checklist, chat: Chat, flow: Flow,
  big: Big, compare: Compare, cta: Cta, avatar: Avatar, media: Media,
};

export const SceneFont = FONT;
