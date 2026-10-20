import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import {C, FONT, Icon, W, useTone} from './theme';
import type {Asset, VideoProps} from './types';

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
export const Title: React.FC<SP> = ({p, v, dur}) => {
  // Hook: show WHAT the tool does right away (real demo or the product itself),
  // with a compact name tag above it. A text-only title loses viewers in second one.
  const f = useCurrentFrame();
  const a = useSpring(0);
  const b = useSpring(4, 15);
  const tone = useTone();
  const m = pickAsset(v, p.asset) || v.media;
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
          <div style={{fontWeight: 900, fontSize: v.title.length > 16 ? 50 : 62, color: tone.fg,
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
  const tone = useTone();
  return (
    <div style={{fontWeight: 900, fontSize: 64, color: tone.fg, letterSpacing: -2,
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
        {showReply && pickAsset(v, p.asset) ? (
          <div style={{alignSelf: 'flex-start', transform: `scale(${r})`, transformOrigin: 'left top'}}>
            <AssetView a={pickAsset(v, p.asset)!} w={620} maxH={640} radius={26} zoomTo={1.06}
              dur={dur} />
          </div>
        ) : showReply ? (
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
  const tone = useTone();
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
        {p.sub ? <div style={{fontWeight: 700, fontSize: 52, color: tone.fg, opacity: t,
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
  const tone = useTone();
  const a = useSpring(0);
  const b = useSpring(8, 10, 170);
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
        <div style={{fontWeight: 900, fontSize: 70, color: tone.fg, opacity: a, letterSpacing: -2,
          transform: `translateY(${(1 - a) * 40}px)`, textAlign: 'center'}}>Want the link?</div>
        <Card style={{padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 26,
          transform: `scale(${b})`}}>
          <Icon name="MessageCircle" size={70} color={C.ink} />
          <div style={{fontWeight: 700, fontSize: 46, color: C.muted}}>Comment</div>
          <div style={{background: C.yellow, fontWeight: 900, fontSize: 64, color: C.ink,
            padding: '6px 26px', borderRadius: 18,
            transform: `scale(${1 + 0.04 * Math.sin(f / 4)})`}}>{v.keyword}</div>
        </Card>
        <div style={{fontWeight: 700, fontSize: 40, color: tone.muted, opacity: a}}>
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
  const m = pickAsset(v, p.asset) || v.media;
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

// ================================================================ v4 scenes

export const pickAsset = (v: VideoProps, i: any): Asset | null => {
  const list = v.assets || [];
  if (i === undefined || i === null || !list.length) return null;
  return list[Math.max(0, Math.min(list.length - 1, Number(i) || 0))];
};

// One image/video in a rounded card, sized to its own aspect ratio, slow push-in
const AssetView: React.FC<{a: Asset; w: number; maxH: number; radius?: number; zoomTo?: number;
  dur: number; style?: React.CSSProperties}> = ({a, w, maxH, radius = 32, zoomTo = 1.08, dur, style}) => {
  const f = useCurrentFrame();
  let h = (w * a.h) / a.w;
  let ww = w;
  if (h > maxH) { ww = (w * maxH) / h; h = maxH; }
  const zoom = interpolate(f, [0, Math.max(1, dur)], [1, zoomTo], {extrapolateRight: 'clamp'});
  const st: React.CSSProperties = {width: ww, height: h, objectFit: 'cover', transform: `scale(${zoom})`};
  return (
    <div style={{width: ww, height: h, borderRadius: radius, overflow: 'hidden', background: '#111',
      boxShadow: '0 40px 90px rgba(10,10,30,0.35), 0 0 0 3px rgba(255,255,255,0.9)', ...style}}>
      {a.kind === 'video' ? <OffthreadVideo src={staticFile(a.src)} muted style={st} />
        : <Img src={staticFile(a.src)} style={st} />}
    </div>
  );
};

// HERO: one real result, big, with a label sticker
export const Hero: React.FC<SP> = ({p, v, dur}) => {
  const a = pickAsset(v, p.asset ?? 0) || v.media;
  const enter = useSpring(0, 13, 120);
  const lab = useSpring(8, 10, 190);
  if (!a) return null;
  return (
    <Stage>
      <Sfx at={2} src="pop" vol={0.3} len={10} />
      <div style={{position: 'relative', transform: `translateY(${(1 - enter) * 160}px) ` +
        `rotate(${(1 - enter) * 6}deg) scale(${0.85 + 0.15 * enter})`, opacity: Math.min(1, enter * 1.5)}}>
        <AssetView a={a} w={920} maxH={1020} dur={dur} />
        {(p.label || a.label) ? (
          <div style={{position: 'absolute', bottom: -34, right: 30,
            transform: `scale(${lab}) rotate(3deg)`, background: C.yellow, color: C.ink,
            fontWeight: 900, fontSize: 40, padding: '12px 26px', borderRadius: 18,
            boxShadow: '0 14px 34px rgba(0,0,0,0.25)'}}>{p.label || a.label}</div>
        ) : null}
      </div>
    </Stage>
  );
};

// GALLERY: 2-4 real results fanned out like photos dropped on a table
export const Gallery: React.FC<SP> = ({p, v, dur}) => {
  const f = useCurrentFrame();
  const idx: number[] = (p.items && p.items.length ? p.items : (v.assets || []).map((_, i) => i))
    .slice(0, 4);
  const list = idx.map((i) => pickAsset(v, i)).filter(Boolean) as Asset[];
  const n = list.length;
  const tone = useTone();
  if (!n) return null;
  const pos = n === 1 ? [[0, 0, 0]] : n === 2 ? [[-170, -90, -6], [170, 110, 5]]
    : n === 3 ? [[-230, -200, -7], [220, -60, 6], [-40, 230, -2]]
    : [[-220, -250, -6], [220, -210, 5], [-210, 210, 4], [230, 250, -5]];
  const w = n === 1 ? 860 : n === 2 ? 540 : 420;
  const drift = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <Stage>
      {p.title ? <div style={{position: 'absolute', top: 10, width: W, textAlign: 'center',
        fontWeight: 900, fontSize: 60, letterSpacing: -2, color: tone.fg, zIndex: 5}}>{p.title}</div> : null}
      <div style={{position: 'relative', width: W, height: 1000, marginTop: p.title ? 80 : 0}}>
        {list.map((a, i) => {
          const s = spring({frame: f - i * 6, fps: 30, config: {damping: 12, stiffness: 130}});
          const [x, y, r] = pos[i];
          return (
            <div key={i} style={{position: 'absolute', left: W / 2 + x - w / 2,
              top: 440 + y * 0.8 - (w * Math.min(1.2, a.h / a.w)) / 2,
              transform: `translateY(${(1 - s) * 700}px) rotate(${r * s + (1 - s) * 20 + drift * (i % 2 ? 1 : -1)}deg) ` +
                `scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, s * 2), zIndex: i}}>
              <Sfx at={i * 6 + 3} src="whoosh" vol={0.18} len={14} />
              <AssetView a={a} w={w} maxH={w * 1.2} radius={24} dur={dur} />
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// COUNTER: a number that counts up fast and lands with an impact
export const Counter: React.FC<SP> = ({p, dur}) => {
  const f = useCurrentFrame();
  const tone = useTone();
  const to = Number(p.to) || 0;
  const land = Math.min(24, Math.floor(dur * 0.5));
  const k = interpolate(f, [2, land], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)});
  const val = Number.isInteger(to) ? Math.round(to * k) : (to * k).toFixed(1);
  const pop = spring({frame: f - land, fps: 30, config: {damping: 8, stiffness: 200}});
  const sub = useSpring(land + 4);
  const ticks = [];
  for (let t = 3; t < land; t += 3) ticks.push(t);
  return (
    <Stage>
      {ticks.map((t, i) => <Sfx key={i} at={t} src="tick" vol={0.22} len={4} />)}
      <Sfx at={land} src="impact" vol={0.5} len={22} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <div style={{fontWeight: 900, fontSize: 340, letterSpacing: -16, lineHeight: 1,
          color: tone.fg, transform: `scale(${1 + 0.08 * pop * (1 - Math.min(1, (f - land) / 20))})`,
          fontVariantNumeric: 'tabular-nums'}}>
          {p.prefix || ''}{val}<span style={{color: C.yellow}}>{p.suffix || ''}</span></div>
        <div style={{height: 22, width: 520 * k, background: C.yellow, borderRadius: 11,
          marginTop: -10}} />
        {p.sub ? <div style={{fontWeight: 700, fontSize: 54, color: tone.fg, marginTop: 26,
          opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`, textAlign: 'center',
          maxWidth: 900}}>{p.sub}</div> : null}
      </div>
    </Stage>
  );
};

// STRIKE: the old way gets crossed out, the new way slams in
export const Strike: React.FC<SP> = ({p, dur}) => {
  const f = useCurrentFrame();
  const tone = useTone();
  const a = useSpring(0);
  const line = interpolate(f, [10, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)});
  const b = spring({frame: f - 22, fps: 30, config: {damping: 10, stiffness: 170}});
  return (
    <Stage>
      <Sfx at={10} src="whoosh" vol={0.3} len={14} />
      <Sfx at={22} src="impact" vol={0.45} len={22} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
        <div style={{position: 'relative', opacity: a * (1 - 0.45 * line)}}>
          <div style={{fontWeight: 800, fontSize: 92, color: tone.fg, letterSpacing: -3,
            textAlign: 'center', maxWidth: 940, lineHeight: 1.05}}>{p.old}</div>
          <div style={{position: 'absolute', left: -20, top: '52%', height: 14, borderRadius: 7,
            width: `calc(${line} * (100% + 40px))`, background: C.accent, opacity: line > 0 ? 1 : 0,
            transform: 'rotate(-3deg)'}} />
        </div>
        <div style={{background: C.yellow, color: C.ink, fontWeight: 900, fontSize: 110,
          letterSpacing: -4, padding: '10px 44px', borderRadius: 30, textAlign: 'center',
          maxWidth: 960, lineHeight: 1.02, transform: `scale(${b}) rotate(${-2 * b}deg)`,
          boxShadow: '0 30px 70px rgba(0,0,0,0.25)'}}>{p.new}</div>
      </div>
    </Stage>
  );
};

export const SCENES: Record<string, React.FC<SP>> = {
  title: Title, browser: Browser, icons: Icons, checklist: Checklist, chat: Chat, flow: Flow,
  big: Big, compare: Compare, cta: Cta, avatar: Avatar, media: Media,
  hero: Hero, gallery: Gallery, counter: Counter, strike: Strike,
};

export const SceneFont = FONT;

// ================================================================ SCREEN (real recorded use)
// Plays a real browser session with the tool. The camera glides like Screen Studio:
// zooms in on the cursor when it types/clicks, pulls back while loading, then pushes
// in on the result. Clicks + typing get sound.
type Ev = {t: number; kind: string; x: number; y: number; bw?: number; bh?: number};

const camKeys = (ev: Ev[]) => {
  const k: {t: number; z: number; x: number; y: number}[] = [{t: 0, z: 1.0, x: 0.5, y: 0.5}];
  for (const e of ev) {
    if (['move', 'click', 'type_start', 'type_end', 'upload'].includes(e.kind)) k.push({t: e.t, z: 1.75, x: e.x, y: e.y});
    else if (e.kind === 'wait_start') k.push({t: e.t + 0.25, z: 1.0, x: 0.5, y: 0.5});
    else if (e.kind === 'reveal') k.push({t: e.t, z: Math.max(1.3, Math.min(2.6, 0.9 / Math.max(e.bw || 0.5, e.bh || 0.5))), x: e.x, y: e.y});
  }
  return k;
};

export const Screen: React.FC<SP> = ({p, v, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tone = useTone();
  const rec = (v.recordings || [])[p.rec ?? 0];
  const enter = useSpring(0, 15, 120);
  if (!rec) return null;
  const from = p.from ?? 0;
  const to = p.to ?? rec.dur;
  const rate = Math.max(0.75, Math.min(2.6, (to - from) / (dur / fps)));
  const keys = camKeys(rec.events);
  // critically damped follow of the keyframe target -> smooth, no linear moves
  let z = 1, x = 0.5, y = 0.5, vz = 0, vx = 0, vy = 0;
  const steps = Math.round(from * fps / rate) + f;
  for (let i = 0; i <= steps; i++) {
    const tt = (i / fps) * rate;
    let tgt = keys[0];
    for (const kk of keys) if (kk.t <= tt) tgt = kk;
    const w = 0.16;
    vz = vz * 0.72 + (tgt.z - z) * w; z += vz;
    vx = vx * 0.72 + (tgt.x - x) * w; x += vx;
    vy = vy * 0.72 + (tgt.y - y) * w; y += vy;
  }
  const W0 = 960;
  const H0 = Math.min(1060, (W0 * rec.h) / rec.w);
  // keep the zoomed view inside the recording
  const half = 0.5 / z;
  const cx = Math.max(half, Math.min(1 - half, x));
  const cy = Math.max(half, Math.min(1 - half, y));
  const tx = (0.5 - cx) * W0 * z;
  const ty = (0.5 - cy) * ((W0 * rec.h) / rec.w) * z;
  const sfx = rec.events.filter((e) => e.t >= from && e.t <= to);
  const typeTicks: number[] = [];
  const ts = rec.events.find((e) => e.kind === 'type_start' && e.t >= from && e.t <= to);
  const te = rec.events.find((e) => e.kind === 'type_end' && e.t >= from);
  if (ts && te) for (let t = ts.t; t < Math.min(te.t, to); t += 0.11) typeTicks.push(t);
  const frameOf = (t: number) => ((t - from) / rate) * fps;
  return (
    <Stage>
      {sfx.filter((e) => e.kind === 'click').map((e, i) =>
        <Sfx key={'c' + i} at={frameOf(e.t)} src="tick" vol={0.6} len={5} />)}
      {sfx.filter((e) => e.kind === 'reveal').map((e, i) =>
        <Sfx key={'r' + i} at={frameOf(e.t)} src="pop" vol={0.45} len={10} />)}
      {typeTicks.map((t, i) => <Sfx key={'t' + i} at={frameOf(t)} src="type" vol={i % 2 ? 0.16 : 0.24} len={3} />)}
      <div style={{transform: `translateY(${(1 - enter) * 140}px) scale(${0.9 + 0.1 * enter})`,
        opacity: Math.min(1, enter * 1.4)}}>
        <div style={{width: W0, height: H0, borderRadius: 34, overflow: 'hidden', position: 'relative',
          background: '#0b0b0f', boxShadow: tone.dark
            ? '0 0 0 2px rgba(255,255,255,0.12), 0 40px 120px rgba(90,80,255,0.35)'
            : '0 0 0 2px rgba(0,0,0,0.06), 0 40px 100px rgba(20,20,40,0.28)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: W0, height: (W0 * rec.h) / rec.w,
            transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: '50% 50%'}}>
            <OffthreadVideo src={staticFile(rec.src)} muted playbackRate={rate}
              startFrom={Math.round(from * fps)} style={{width: W0}} />
          </div>
        </div>
      </div>
    </Stage>
  );
};
SCENES.screen = Screen;
