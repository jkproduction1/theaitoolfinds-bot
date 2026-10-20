// Style tests ("style frames in motion") - 3 directions, ~6 s each, no voice.
import React from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {FONT, fontCss} from './theme';

const SERIF = 'InstrumentItalic';
const css = fontCss + `@font-face{font-family:${SERIF};src:url(${staticFile('fonts/InstrumentSerif-Italic.woff2')});font-style:italic}`;
const Y = '#FFD60A';
const E = Easing.bezier(0.16, 1, 0.3, 1);      // expo-out: fast in, long soft landing
const EI = Easing.bezier(0.7, 0, 0.84, 0);     // in: for exits
const ease = (f: number, a: number, b: number, e = E) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const Grain: React.FC<{o?: number}> = ({o = 0.18}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%"><filter id="gr"><feTurbulence type="fractalNoise"
        baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2) % 40} /></filter>
        <rect width="100%" height="100%" filter="url(#gr)" /></svg>
    </AbsoluteFill>
  );
};

// Minimal captions: one short phrase, soft fade + de-blur, small, low.
const Cap: React.FC<{items: [number, number, string][]; dark?: boolean}> = ({items, dark}) => {
  const f = useCurrentFrame();
  const it = items.find(([a, b]) => f >= a && f < b);
  if (!it) return null;
  const k = ease(f, it[0], it[0] + 8);
  const out = 1 - ease(f, it[1] - 5, it[1], EI);
  return (
    <div style={{position: 'absolute', top: 1500, width: 1080, textAlign: 'center',
      fontFamily: FONT, fontWeight: 600, fontSize: 44, letterSpacing: -0.5,
      color: dark ? 'rgba(255,255,255,0.88)' : 'rgba(14,14,16,0.82)',
      opacity: k * out, filter: `blur(${(1 - k) * 8}px)`, transform: `translateY(${(1 - k) * 14}px)`}}>
      {it[2]}</div>
  );
};

// Line of huge type revealed from behind a mask (slides up out of nothing)
const MaskLine: React.FC<{at: number; children: React.ReactNode; size?: number; out?: number}> = ({
  at, children, size = 150, out = 9999,
}) => {
  const f = useCurrentFrame();
  const k = ease(f, at, at + 16);
  const x = ease(f, out, out + 10, EI);
  return (
    <div style={{overflow: 'hidden', height: size * 1.08, lineHeight: 1}}>
      <div style={{transform: `translateY(${(1 - k) * 110 - x * 110}%) rotate(${(1 - k) * 4}deg)`,
        transformOrigin: 'left bottom', fontSize: size, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};

const Scrappy: React.FC<{pose: string; at: number; x: number; y: number; h: number; flip?: boolean;
  rot?: number; out?: number}> = ({pose, at, x, y, h, flip, rot = 0, out = 9999}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 10, stiffness: 170}});
  const o = ease(f, out, out + 8, EI);
  const bob = Math.sin(f / 9) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y + bob + o * 400, height: h,
      transform: `scale(${(flip ? -1 : 1) * s}, ${s}) rotate(${rot * (flip ? -1 : 1)}deg)`,
      transformOrigin: '50% 100%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))'}}>
      <Img src={staticFile(`mascot/${pose}.png`)} style={{height: h}} />
    </div>
  );
};

// ============================================================ A: EDITORIAL KINETIC
// Type IS the visual. Cream paper, camera drifting the whole time, serif italic accent,
// a terminal that flips in in 3D, Scrappy leaning on the type block.
export const ConceptA: React.FC = () => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, 180], [1, 1.09]);
  const rot = interpolate(f, [0, 180], [-1.2, 0.8]);
  const term = ease(f, 70, 92);
  const typed = Math.floor(interpolate(f, [92, 140], [0, 42], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const code = 'npx create-backend --ai "todo app + auth"';
  const blockOut = ease(f, 64, 76, EI);
  const star = Math.round(interpolate(f, [120, 160], [0, 12400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E}));
  return (
    <AbsoluteFill style={{background: '#F5EFE4', fontFamily: FONT, overflow: 'hidden'}}>
      <style>{css}</style>
      <AbsoluteFill style={{background:
        'radial-gradient(circle at 20% 15%, rgba(255,206,64,0.55), transparent 45%), radial-gradient(circle at 90% 80%, rgba(255,140,100,0.35), transparent 45%)'}} />
      <AbsoluteFill style={{transform: `scale(${cam}) rotate(${rot}deg)`}}>
        <div style={{position: 'absolute', left: 80, top: 430, color: '#111', fontWeight: 900,
          letterSpacing: -7, transform: `translateY(${-blockOut * 200}px)`, opacity: 1 - blockOut}}>
          <MaskLine at={2}>This repo</MaskLine>
          <MaskLine at={8}>writes your</MaskLine>
          <MaskLine at={14}>
            <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, letterSpacing: -3,
              position: 'relative'}}>
              <span style={{position: 'absolute', left: -10, right: -14, bottom: 22, height: 48,
                background: Y, zIndex: -1, transformOrigin: 'left',
                transform: `scaleX(${ease(f, 26, 40)})`}} />entire</span> backend.
          </MaskLine>
        </div>
        {/* terminal flips in */}
        <div style={{position: 'absolute', left: 90, top: 520, width: 900, height: 520, borderRadius: 34,
          background: '#0E0E12', boxShadow: '0 50px 120px rgba(20,20,40,0.35)', opacity: term,
          transform: `perspective(1400px) rotateX(${(1 - term) * 55}deg) rotateZ(${(1 - term) * -6}deg) translateY(${(1 - term) * 220}px)`}}>
          <div style={{display: 'flex', gap: 12, padding: 26}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />)}
          </div>
          <div style={{padding: '10px 44px', fontFamily: 'monospace', fontSize: 38, color: '#E8E8EA', lineHeight: 1.5}}>
            <span style={{color: Y}}>$ </span>{code.slice(0, typed)}<span style={{opacity: f % 14 < 7 ? 1 : 0}}>▍</span>
            {f > 142 ? <div style={{color: '#7CF29A', opacity: ease(f, 142, 150)}}>✓ API, database, auth ready</div> : null}
          </div>
          <div style={{position: 'absolute', right: 40, bottom: 34, fontWeight: 900, fontSize: 64, color: '#fff',
            opacity: ease(f, 118, 128), fontVariantNumeric: 'tabular-nums'}}>
            <span style={{color: Y}}>★</span> {star.toLocaleString('en-US')}</div>
        </div>
      </AbsoluteFill>
      <Scrappy pose="chill" at={24} x={640} y={1040} h={520} out={66} />
      <Scrappy pose="excited" at={150} x={700} y={1060} h={500} flip />
      <Cap items={[[4, 62, 'this repo writes your entire backend'], [80, 178, 'one command, and it is done']]} />
      <Grain o={0.14} />
    </AbsoluteFill>
  );
};

// ============================================================ B: FOOTAGE FIRST
// Full-bleed result, hard punch-ins on the beat, flash frame, huge white type with
// motion blur, a 1 s UI insert, Scrappy reaction pop.
export const ConceptB: React.FC = () => {
  const f = useCurrentFrame();
  const beats = [0, 14, 28, 42];                       // hard cuts
  const zooms = [1.0, 1.35, 1.8, 1.15];
  const centers = [[50, 50], [42, 30], [55, 62], [50, 45]];
  let b = 0;
  beats.forEach((t, i) => { if (f >= t) b = i; });
  const inUi = f >= 58 && f < 96;
  const after = f >= 96;
  const z = (after ? 1.05 : zooms[b]) * (1 + ((f - (after ? 96 : beats[b])) * 0.004));
  const [cx, cy] = after ? [50, 48] : centers[b];
  const flash = beats.concat([58, 96]).some((t) => f >= t && f < t + 2);
  const word = (txt: string, at: number, size: number, serif = false) => {
    const k = ease(f, at, at + 7);
    return (
      <span style={{display: 'inline-block', marginRight: 26, opacity: k,
        transform: `translateY(${(1 - k) * 60}px) scale(${1.25 - 0.25 * k})`,
        filter: `blur(${(1 - k) * 12}px)`, fontFamily: serif ? SERIF : FONT,
        fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : 900, fontSize: size,
        color: serif ? Y : '#fff', letterSpacing: serif ? -2 : -6}}>{txt}</span>
    );
  };
  const uiZoom = interpolate(f, [58, 96], [1.6, 2.1]);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: FONT, overflow: 'hidden'}}>
      <style>{css}</style>
      {!inUi ? (
        <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${cx}% ${cy}%`}}>
          <Img src={staticFile('concept/result.jpg')} style={{width: 1920, height: 1920, objectFit: 'cover',
            position: 'absolute', left: -420, top: 0}} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `scale(${uiZoom})`, transformOrigin: '74% 82%'}}>
          <OffthreadVideo src={staticFile('concept/rec.mp4')} muted startFrom={330}
            style={{width: 1728, position: 'absolute', left: -324, top: 0}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)'}} />
      {/* light leak sweep */}
      <AbsoluteFill style={{background: `linear-gradient(110deg, transparent ${interpolate(f, [0, 180], [-40, 120])}%, rgba(255,190,60,0.35) ${interpolate(f, [0, 180], [-25, 135])}%, transparent ${interpolate(f, [0, 180], [-10, 150])}%)`, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', top: 260, left: 70, right: 70, lineHeight: 1.0}}>
        {f < 58 ? <>{word('this', 2, 170)}{word('shouldn’t', 7, 170)}<br />{word('be', 12, 170)}{word('free.', 17, 190, true)}</> : null}
        {f >= 96 ? <>{word('draw', 98, 150)}{word('boxes,', 103, 150)}<br />{word('get', 110, 150)}{word('this.', 115, 170, true)}</> : null}
      </div>
      {flash ? <AbsoluteFill style={{background: '#fff', opacity: 0.85}} /> : null}
      <Scrappy pose="shock" at={30} x={600} y={1180} h={560} out={56} />
      <Scrappy pose="talk" at={126} x={-40} y={1200} h={540} />
      <Cap dark items={[[2, 56, 'the new FLUX model, free in your browser'], [100, 178, 'you place it, the AI fills it']]} />
      <Grain o={0.22} />
    </AbsoluteFill>
  );
};

// ============================================================ C: 3D UI STACK
// Dark stage, tool windows floating in depth, the camera dollies through them,
// one hero glow, serif italic headline, Scrappy standing on a window edge.
export const ConceptC: React.FC = () => {
  const f = useCurrentFrame();
  const dolly = interpolate(f, [0, 180], [0, 1], {easing: Easing.inOut(Easing.cubic)});
  const yaw = interpolate(dolly, [0, 1], [18, -14]);
  const win = (i: number, x: number, y: number, z: number, w: number, h: number, child: React.ReactNode, glow = false) => {
    const k = ease(f, 4 + i * 6, 26 + i * 6);
    return (
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 28,
        overflow: 'hidden', background: '#16161D', opacity: k,
        transform: `translateZ(${z + (1 - k) * -600}px) translateY(${(1 - k) * 120}px)`,
        boxShadow: glow ? `0 0 0 2px ${Y}, 0 0 80px ${Y}66, 0 0 160px ${Y}33` : '0 0 0 1.5px rgba(255,255,255,0.12), 0 40px 90px rgba(0,0,0,0.6)'}}>
        {child}
      </div>
    );
  };
  const head = (t: string, at: number, serif = false) => {
    const k = ease(f, at, at + 14);
    return <div style={{overflow: 'hidden', height: 130}}><div style={{transform: `translateY(${(1 - k) * 105}%)`,
      fontFamily: serif ? SERIF : FONT, fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : 900,
      fontSize: 122, letterSpacing: serif ? -2 : -5, color: serif ? Y : '#fff', lineHeight: 1}}>{t}</div></div>;
  };
  return (
    <AbsoluteFill style={{background: '#07070C', fontFamily: FONT, overflow: 'hidden'}}>
      <style>{css}</style>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 35%, rgba(98,84,255,0.45), transparent 50%), radial-gradient(circle at 20% 85%, rgba(255,200,40,0.18), transparent 45%)'}} />
      <div style={{position: 'absolute', left: 80, top: 210}}>
        {head('Draw boxes.', 6)}{head('Say what goes in.', 14)}{head('done.', 24, true)}
      </div>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 40%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
          transform: `translateY(${interpolate(dolly, [0, 1], [80, -40])}px) translateZ(${dolly * 260}px) rotateY(${yaw}deg) rotateX(8deg)`}}>
          {win(0, 90, 760, -280, 560, 420, <Img src={staticFile('concept/ui.jpg')} style={{width: 1200, marginLeft: -580, marginTop: -330}} />)}
          {win(1, 470, 690, -80, 520, 300, <div style={{padding: 30, color: '#ddd', fontSize: 30, lineHeight: 1.35}}>
            <div style={{color: Y, fontWeight: 800, marginBottom: 10}}>Prompt</div>A tiny raccoon DJ, neon club, 35mm film</div>)}
          {win(2, 280, 980, 120, 560, 560, <Img src={staticFile('concept/result.jpg')} style={{width: 560, height: 560, objectFit: 'cover',
            transform: `scale(${1.05 + dolly * 0.08})`}} />, true)}
        </div>
      </AbsoluteFill>
      <Scrappy pose="chill" at={40} x={720} y={760} h={430} />
      <Cap dark items={[[6, 90, 'layout control, right in the browser'], [96, 178, 'free and open weights']]} />
      <Grain o={0.16} />
    </AbsoluteFill>
  );
};
