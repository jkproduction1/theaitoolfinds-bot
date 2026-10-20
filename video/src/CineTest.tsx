// Style test v2: cinematic retro room. Push-in, fluttering note, Scrappy leaning on the
// monitor, CRT typing, zoom-through into the screen, CRT texture, mask + sticker type.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FONT, fontCss} from './theme';

const css = fontCss + `
@font-face{font-family:Anton;src:url(${staticFile('fonts/anton-latin-400-normal.woff2')})}
@font-face{font-family:Typewriter;src:url(${staticFile('fonts/special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Hand;src:url(${staticFile('fonts/caveat-latin-700-normal.woff2')})}
@font-face{font-family:InstrumentItalic;src:url(${staticFile('fonts/InstrumentSerif-Italic.woff2')});font-style:italic}`;
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const k = (f: number, a: number, b: number, e = IO) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const twos = (f: number) => f - (f % 2);   // stop-motion feel: update on twos

// screen rect of the monitor inside room.jpg (fractions of the image)
const SCR = {x: 0.36, y: 0.6, w: 0.28, h: 0.16};

const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.4}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Grain: React.FC<{o: number}> = ({o}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: 'overlay', zIndex: 90}}>
      <svg width="100%" height="100%"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.9"
        numOctaves="2" seed={Math.floor(f / 2) % 50} /></filter><rect width="100%" height="100%" filter="url(#gn)" /></svg>
    </AbsoluteFill>
  );
};

// CRT look: scanlines + RGB aperture mask + bloom + slight roll
const CrtTex: React.FC<{o?: number}> = ({o = 1}) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{opacity: 0.35 * o, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 4px)'}} />
      <AbsoluteFill style={{opacity: 0.18 * o, mixBlendMode: 'multiply',
        background: 'repeating-linear-gradient(90deg, #ff3b3b 0 2px, #3bff6b 2px 4px, #3b6bff 4px 6px)'}} />
      <AbsoluteFill style={{opacity: 0.12 * o, background: `linear-gradient(180deg, transparent ${(f * 3) % 120 - 20}%, rgba(255,255,255,0.5) ${(f * 3) % 120 - 15}%, transparent ${(f * 3) % 120 - 10}%)`}} />
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${180 * o}px rgba(0,0,0,0.9)`}} />
    </>
  );
};

// sticky note that flutters in a draft (pinned at the top edge)
const Note: React.FC<{x: number; y: number; text: string; rot: number}> = ({x, y, text, rot}) => {
  const f = twos(useCurrentFrame());
  const gust = 0.6 + 0.4 * Math.sin(f / 23);
  const flap = Math.sin(f / 4.3) * 14 * gust + Math.sin(f / 2.1) * 4 * gust;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 230, height: 220, perspective: 600, zIndex: 3}}>
      <div style={{width: '100%', height: '100%', transformOrigin: '50% 0%',
        transform: `rotate(${rot + Math.sin(f / 9) * 1.5}deg) rotateX(${flap}deg) skewX(${flap * 0.15}deg)`,
        background: 'linear-gradient(180deg, #f6dd6a 0%, #e8c94e 100%)', boxShadow: `0 ${8 + flap}px 18px rgba(0,0,0,0.55)`,
        fontFamily: 'Hand', fontSize: 46, color: '#2a2418', lineHeight: 1, padding: '34px 18px', boxSizing: 'border-box',
        textAlign: 'center', filter: 'brightness(0.75) sepia(0.2)'}}>{text}</div>
      <div style={{position: 'absolute', top: -10, left: 100, width: 30, height: 30, borderRadius: 15,
        background: 'radial-gradient(circle at 35% 30%, #ff8a8a, #b5121b 60%)', boxShadow: '3px 6px 6px rgba(0,0,0,0.6)'}} />
    </div>
  );
};

export const CineTest: React.FC = () => {
  const f = useCurrentFrame();
  // --- camera: slow push-in toward the screen, then zoom-through
  const push = k(f, 0, 78, Easing.bezier(0.3, 0, 0.7, 1));
  const dive = k(f, 78, 102, Easing.in(Easing.cubic));
  const inside = f >= 100;
  const cx = (SCR.x + SCR.w / 2) * 100, cy = (SCR.y + SCR.h / 2) * 100;
  const roomScale = 1.04 + push * 0.22 + dive * 3.2;
  // --- CRT text typing on the monitor (room part)
  const msg = '> new free tool found_';
  const typed = msg.slice(0, Math.floor(interpolate(f, [22, 66], [0, msg.length], cl)));
  const flash = inside && f < 104;
  // --- inside the screen: headline
  const l1 = k(f - 104, 0, 14, OUT), l2 = k(f - 104, 8, 22, OUT);
  const slap = spring({frame: f - 132, fps: 30, config: {damping: 9, stiffness: 240}});
  const circle = k(f, 140, 158, OUT);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <style>{css}</style>
      {!inside ? (
        <AbsoluteFill style={{transform: `scale(${roomScale})`, transformOrigin: `${cx}% ${cy}%`}}>
          <Img src={staticFile('kit/room1.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
          {/* glowing screen content */}
          <div style={{position: 'absolute', left: `${SCR.x * 100}%`, top: `${SCR.y * 100}%`, width: `${SCR.w * 100}%`,
            height: `${SCR.h * 100}%`, background: 'radial-gradient(ellipse at 50% 50%, #12382c 0%, #04130e 80%)',
            borderRadius: 14, overflow: 'hidden', boxShadow: '0 0 60px 10px rgba(80,255,170,0.25)'}}>
            <div style={{position: 'absolute', left: '8%', top: '30%', fontFamily: 'Typewriter', fontSize: 30,
              color: '#8dffc4', textShadow: '0 0 8px #3dff9a, 0 0 22px #1aff7a'}}>{typed}</div>
            <CrtTex />
          </div>
          {/* screen light spilling into the room */}
          <AbsoluteFill style={{background: `radial-gradient(circle at ${cx}% ${cy}%, rgba(80,255,170,${0.10 + 0.05 * Math.sin(f / 3)}) 0%, transparent 30%)`, mixBlendMode: 'screen'}} />
          <Note x={150} y={430} text={'try it\nfree!'} rot={-6} />
          {/* Scrappy leaning on the monitor (right side, standing on the desk) */}
          <div style={{position: 'absolute', left: 670, top: 1020 + Math.sin(f / 13) * 3, height: 420, zIndex: 4,
            transform: 'rotate(-7deg) scaleX(-1)', transformOrigin: '50% 100%', filter: 'brightness(0.62) contrast(1.05) drop-shadow(-14px 10px 14px rgba(0,0,0,0.7))'}}>
            <Img src={staticFile('mascot/chill.png')} style={{height: 420}} />
          </div>
          {/* venetian blind light sweeping slowly */}
          <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: 0.55,
            background: `repeating-linear-gradient(118deg, rgba(255,220,170,0.0) ${0 + f * 0.15}px, rgba(255,220,170,0.0) ${30 + f * 0.15}px, rgba(255,210,150,0.55) ${42 + f * 0.15}px, rgba(255,220,170,0.0) ${60 + f * 0.15}px)`}} />
          {/* floating dust in the lamp light */}
          {Array.from({length: 26}, (_, i) => {
            const sx = (i * 137) % 1080, sy = (i * 291) % 1200 + 200;
            const dx = Math.sin((f + i * 20) / 40) * 30, dy = -((f * (0.3 + (i % 5) * 0.1) + i * 50) % 300);
            return <div key={i} style={{position: 'absolute', left: sx + dx, top: sy + dy, width: 3 + (i % 3), height: 3 + (i % 3),
              borderRadius: 3, background: 'rgba(255,230,190,0.55)', filter: 'blur(0.6px)'}} />;
          })}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1712 0%, #070605 75%)'}}>
          {/* canvas / fabric texture */}
          <AbsoluteFill style={{opacity: 0.22, mixBlendMode: 'overlay',
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)'}} />
          <div style={{position: 'absolute', top: 640, left: 70, right: 70, transform: `scale(${1.08 - 0.08 * k(f, 100, 180, OUT)})`}}>
            <div style={{overflow: 'hidden', height: 170}}>
              <div style={{fontFamily: 'Anton', fontSize: 168, color: '#f3ead8', letterSpacing: 2, lineHeight: 1,
                transform: `translateY(${(1 - l1) * 110}%)`}}>THIS SHOULDN'T</div>
            </div>
            <div style={{overflow: 'hidden', height: 170}}>
              <div style={{fontFamily: 'Anton', fontSize: 168, color: '#f3ead8', letterSpacing: 2, lineHeight: 1,
                transform: `translateY(${(1 - l2) * 110}%)`}}>BE</div>
            </div>
            {f >= 132 ? (
              <div style={{position: 'absolute', left: 300, top: 205, transform: `scale(${2.2 - 1.2 * slap}) rotate(${-8 + 3 * slap}deg)`,
                background: '#FFD60A', padding: '4px 34px 14px', borderRadius: 10, boxShadow: '0 16px 30px rgba(0,0,0,0.5)',
                fontFamily: 'InstrumentItalic', fontStyle: 'italic', fontSize: 150, color: '#16130c', lineHeight: 1}}>free.</div>
            ) : null}
            {/* hand-drawn marker circle */}
            <svg width="620" height="300" style={{position: 'absolute', left: 230, top: 150, overflow: 'visible'}}>
              <path d="M40,150 C40,40 560,30 580,140 C600,250 90,280 50,170 C30,110 200,60 330,62"
                fill="none" stroke="#e8432c" strokeWidth="9" strokeLinecap="round"
                strokeDasharray="1700" strokeDashoffset={1700 * (1 - circle)} />
            </svg>
          </div>
          <CrtTex o={0.8} />
          {flash ? <AbsoluteFill style={{background: '#d8fff0', opacity: 1 - (f - 100) / 4}} /> : null}
        </AbsoluteFill>
      )}
      {/* caption pill (unchanged style) */}
      <div style={{position: 'absolute', top: 1360, width: 1080, display: 'flex', justifyContent: 'center', zIndex: 80}}>
        <div style={{background: 'rgba(20,18,16,0.78)', color: '#fff', fontFamily: FONT, fontWeight: 600, fontSize: 40,
          padding: '10px 22px', borderRadius: 12}}>{f < 100 ? 'this free tool' : f < 132 ? "shouldn't be" : 'free'}</div>
      </div>
      {/* chromatic edge + vignette + grain */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(0,0,0,0.75)', zIndex: 85}} />
      <Grain o={0.22} />
      <Sfx at={20} src="type" vol={0.3} /><Sfx at={40} src="type" vol={0.3} /><Sfx at={58} src="type" vol={0.3} />
      <Sfx at={84} src="riser" vol={0.3} /><Sfx at={100} src="impact" vol={0.5} />
      <Sfx at={104} src="whoosh" vol={0.3} /><Sfx at={132} src="pop" vol={0.5} />
    </AbsoluteFill>
  );
};
