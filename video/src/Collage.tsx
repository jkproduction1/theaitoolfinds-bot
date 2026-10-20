// Retro collage style test: photographic props, 2.5D camera, type living ON objects.
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {FONT, fontCss} from './theme';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';

const K = (n: string) => staticFile(`kit/${n}`);
const css = fontCss + `
@font-face{font-family:Anton;src:url(${staticFile('fonts/anton-latin-400-normal.woff2')})}
@font-face{font-family:Typewriter;src:url(${staticFile('fonts/special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Hand;src:url(${staticFile('fonts/caveat-latin-700-normal.woff2')})}`;
const Y = '#FFD60A';
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});

type W = {word: string; start: number; end: number};

const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.4}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

// object that drops onto a surface: falls from above with a tilt, lands with a tiny bounce
const Drop: React.FC<{at: number; x: number; y: number; w: number; rot: number; children: React.ReactNode; z?: number}> = ({
  at, x, y, w, rot, children, z = 1,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 140, mass: 0.9}});
  const lift = 1 - s;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, zIndex: z, opacity: f < at ? 0 : 1,
      transform: `translateY(${lift * -260}px) rotate(${rot + lift * 18}deg) scale(${1 + lift * 0.35})`,
      filter: `drop-shadow(${8 + lift * 30}px ${14 + lift * 50}px ${10 + lift * 30}px rgba(0,0,0,${0.45 - lift * 0.2}))`}}>
      {children}
    </div>
  );
};

// big condensed headline with a stacked 3D extrude
const Head: React.FC<{text: string; at: number; size?: number; color?: string}> = ({text, at, size = 150, color = Y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 9, stiffness: 180}});
  const depth = Array.from({length: 10}, (_, i) => `${i + 1}px ${i + 1}px 0 #2a1c05`).join(',');
  return (
    <div style={{fontFamily: 'Anton', fontSize: size, lineHeight: 0.95, color, textTransform: 'uppercase',
      letterSpacing: 1, textAlign: 'center', opacity: f < at ? 0 : 1,
      transform: `translateY(${(1 - s) * -120}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -8}deg)`,
      textShadow: `${depth}, 14px 20px 30px rgba(0,0,0,0.45)`, WebkitTextStroke: '3px #2a1c05'}}>{text}</div>
  );
};

const Cap: React.FC<{words: W[]}> = ({words}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  // phrases of max 3 words
  const ph: W[][] = [];
  words.forEach((w, i) => {
    const gap = i > 0 ? w.start - words[i - 1].end : 0;
    if (!ph.length || ph[ph.length - 1].length >= 3 || gap > 0.18) ph.push([]);
    ph[ph.length - 1].push(w);
  });
  const p = ph.find((g, i) => t >= g[0].start && t < (ph[i + 1] ? ph[i + 1][0].start : g[g.length - 1].end + 0.4));
  if (!p) return null;
  const k = ease(f, p[0].start * 30, p[0].start * 30 + 6);
  return (
    <div style={{position: 'absolute', top: 1360, width: 1080, display: 'flex', justifyContent: 'center', zIndex: 50}}>
      <div style={{background: 'rgba(20,18,16,0.78)', color: '#fff', fontFamily: FONT, fontWeight: 600, fontSize: 40,
        padding: '10px 22px', borderRadius: 12, opacity: k, transform: `translateY(${(1 - k) * 10}px)`,
        filter: `blur(${(1 - k) * 6}px)`}}>{p.map((w) => w.word).join(' ').replace(/[.,]$/, '')}</div>
    </div>
  );
};

// Scrappy: paper-cutout that flips in like a card, floats, hops to the voice, and
// changes pose during the scene. poses = [[frame, 'pose'], ...]
const Scrappy: React.FC<{poses: [number, string][]; at: number; x: number; y: number; h: number; rot?: number;
  amp?: number[]}> = ({poses, at, x, y, h, rot = 0, amp}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 120}});
  let pose = poses[0][1], since = poses[0][0];
  for (const [t, ps] of poses) if (f >= t) { pose = ps; since = t; }
  const swap = spring({frame: f - since, fps, config: {damping: 9, stiffness: 260}});  // little pop on pose change
  const a = amp ? amp[Math.max(0, Math.min(amp.length - 1, f))] || 0 : 0;
  const hop = a * 26;
  const float = Math.sin(f / 11) * 8;
  return (
    <div style={{position: 'absolute', left: x, top: y + float - hop, height: h, zIndex: 20, opacity: f < at ? 0 : 1,
      perspective: 900, transformOrigin: '50% 100%',
      transform: `scale(${(0.9 + 0.1 * swap) * (1 + a * 0.04)}, ${(0.9 + 0.1 * swap) * (1 - a * 0.03)})`}}>
      <div style={{transform: `rotateY(${(1 - s) * 95}deg) rotate(${rot + Math.sin(f / 17) * 2.5}deg) translateY(${(1 - s) * 120}px)`,
        filter: 'drop-shadow(12px 22px 16px rgba(0,0,0,0.45))'}}>
        <Img src={staticFile(`mascot/${pose}.png`)} style={{height: h, display: 'block'}} />
      </div>
    </div>
  );
};

export const CollageTest: React.FC = () => {
  const f = useCurrentFrame();
  const [data, setData] = useState<{dur: number; words: W[]} | null>(null);
  const [h] = useState(() => delayRender('words'));
  useEffect(() => {
    fetch(staticFile('kit/test/words.json')).then((r) => r.json()).then((d) => { setData(d); continueRender(h); })
      .catch(() => { setData({dur: 9.5, words: []}); continueRender(h); });
  }, [h]);
  const voiceAudio = useAudioData(staticFile('kit/test/voice.mp3'));
  if (!data) return null;
  const ws = data.words;
  const amp: number[] = [];
  if (voiceAudio) for (let i = 0; i < 320; i++) {
    const v = visualizeAudio({fps: 30, frame: i, audioData: voiceAudio, numberOfSamples: 16});
    amp.push(Math.min(1, (v.slice(0, 6).reduce((x, y) => x + y, 0) / 6) * 3));
  }
  const talking = (fr: number) => ws.some((w) => fr / 30 >= w.start - 0.05 && fr / 30 <= w.end + 0.1);
  const at = (re: RegExp, fb: number) => { const w = ws.find((x) => re.test(x.word)); return w ? w.start * 30 : fb; };
  const s2 = at(/^Photoshop/i, 95) - 6;      // desk scene
  const s3 = at(/^And$/i, 205) - 4;           // corkboard scene
  const tPs = at(/^Photoshop/i, 95), tPr = at(/^Premiere/i, 120), tAe = at(/^After/i, 150);

  // ---- scene 1: sky + hanging CRT (pendulum)
  const t1 = f / 30;
  const swing = 22 * Math.exp(-t1 * 1.3) * Math.cos(t1 * 4.2);          // damped pendulum (deg)
  const drop = spring({frame: f, fps: 30, config: {damping: 14, stiffness: 70}});
  const toDesk = ease(f, s2 - 4, s2 + 16, Easing.inOut(Easing.cubic));   // camera tilts down
  const toBoard = ease(f, s3 - 4, s3 + 14, Easing.inOut(Easing.cubic));
  const cam = 1 + f * 0.0006;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <style>{css}</style>
      {/* SCENE 1 */}
      <AbsoluteFill style={{transform: `translateY(${-toDesk * 1920}px)`}}>
        <Img src={K('sky.jpg')} style={{position: 'absolute', width: 1080, height: 2100, objectFit: 'cover',
          top: -60 - f * 0.25}} />
        <div style={{position: 'absolute', left: 540, top: -40, width: 0, height: 0,
          transform: `translateY(${(1 - drop) * -900}px) rotate(${swing}deg)`, transformOrigin: '0 0'}}>
          <Img src={K('rope.png')} style={{position: 'absolute', left: -40, top: 0, width: 80, height: 700, objectFit: 'fill'}} />
          <div style={{position: 'absolute', left: -380, top: 640, width: 760}}>
            <div style={{position: 'absolute', zIndex: 2, left: '11.5%', top: '16%', width: '77%', height: '57%', overflow: 'hidden',
              borderRadius: 18, background: '#000'}}>
              <Img src={K('tools/effectcraft-hero.png')} style={{width: '100%', height: '100%', objectFit: 'cover',
                transform: `scale(${1.15 + f * 0.001})`}} />
              <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)'}} />
              <AbsoluteFill style={{boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'}} />
            </div>
            <Img src={K('crt.png')} style={{width: 760, position: 'relative', zIndex: 1}} />
          </div>
        </div>
        <Img src={K('grass.png')} style={{position: 'absolute', bottom: -40 - f * 0.4, left: -60, width: 1200}} />
        <div style={{position: 'absolute', top: 230, width: 1080}}>
          <Head text="7 Adobe apps" at={6} />
          <div style={{height: 16}} />
          <Head text="rebuilt by AI" at={20} size={120} color="#fff" />
        </div>
        <Scrappy poses={[[0, 'chill'], [60, 'talk']]} at={34} x={650} y={1330} h={600} rot={-3} amp={amp} />
        <Sfx at={2} src="whoosh" vol={0.35} />
        <Sfx at={8} src="impact" vol={0.5} />
        <Sfx at={22} src="impact" vol={0.4} />
      </AbsoluteFill>

      {/* SCENE 2: desk top-down, polaroids drop on each app name */}
      <AbsoluteFill style={{transform: `translateY(${(1 - toDesk) * 1920 - toBoard * 1920}px) scale(${cam})`}}>
        <Img src={K('desk.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        <Drop at={s2 + 2} x={-60} y={1500} w={260} rot={-20}><Img src={K('paperball.png')} style={{width: '100%'}} /></Drop>
        {[
          ['tools/photocraft-demo.jpg', 'PhotoCraft', 'Photoshop', tPs, 70, 250, -7],
          ['tools/filmcraft-hero.png', 'FilmCraft', 'Premiere', tPr, 420, 620, 6],
          ['tools/effectcraft-hero.png', 'EffectCraft', 'After Effects', tAe, 110, 1010, -4],
        ].map(([img, name, sub, t, x, y, r], i) => (
          <Drop key={i} at={t as number} x={x as number} y={y as number} w={560} rot={r as number} z={2 + i}>
            <div style={{position: 'relative', width: 560}}>
              <Img src={K('polaroid.png')} style={{width: 560, display: 'block'}} />
              <div style={{position: 'absolute', left: '7.5%', top: '6.5%', width: '85%', height: '68%', overflow: 'hidden', background: '#111'}}>
                <Img src={K(img as string)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: '5%', textAlign: 'center', fontFamily: 'Hand',
                fontSize: 64, color: '#1b1b2e', transform: 'rotate(-2deg)'}}>{name as string}
                <span style={{fontSize: 40, color: '#7a2b2b'}}> = {sub as string}</span></div>
              <Img src={K('tape.png')} style={{position: 'absolute', top: -40, left: '30%', width: 240, transform: 'rotate(4deg)', opacity: 0.9}} />
            </div>
            <Sfx at={(t as number) - 2} src="whoosh" vol={0.25} />
            <Sfx at={(t as number) + 4} src="pop" vol={0.45} />
          </Drop>
        ))}
        <Scrappy poses={[[0, 'excited'], [tAe + 40, 'talk']]} at={tAe + 8} x={600} y={1180} h={640} amp={amp} />
      </AbsoluteFill>

      {/* SCENE 3: corkboard, note typed, FREE stamp */}
      <AbsoluteFill style={{transform: `translateY(${(1 - toBoard) * 1920}px) scale(${1 + Math.max(0, f - s3) * 0.0008})`}}>
        <Img src={K('cork.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        <Drop at={s3 + 6} x={120} y={380} w={840} rot={-3}>
          <div style={{position: 'relative'}}>
            <Img src={K('paper.png')} style={{width: 840, display: 'block'}} />
            <div style={{position: 'absolute', left: 120, top: 190, right: 70, fontFamily: 'Typewriter', fontSize: 66,
              color: '#1d1d24', lineHeight: 1.3}}>
              {'all 7 apps are\nfree + open source.'.slice(0, Math.max(0, Math.floor((f - s3 - 14) * 1.3)))
                .split('\n').map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <div style={{position: 'absolute', top: -20, left: 400, width: 64, height: 64, borderRadius: 32,
              background: 'radial-gradient(circle at 35% 30%, #ff8a8a, #d0141c 55%, #7a0b10)', boxShadow: '6px 10px 10px rgba(0,0,0,0.45)'}} />
          </div>
        </Drop>
        {(() => {
          const st = s3 + 44;
          const s = spring({frame: f - st, fps: 30, config: {damping: 8, stiffness: 260}});
          return f >= st ? (
            <div style={{position: 'absolute', zIndex: 30, left: 250, top: 1000, transform: `scale(${2.4 - 1.4 * s}) rotate(-12deg)`,
              opacity: Math.min(1, s * 2), border: '12px solid #c1121f', borderRadius: 18, padding: '6px 40px',
              fontFamily: 'Anton', fontSize: 170, color: '#c1121f', letterSpacing: 6, mixBlendMode: 'multiply'}}>FREE</div>
          ) : null;
        })()}
        <Sfx at={s3 + 44} src="impact" vol={0.6} />
        <Scrappy poses={[[0, 'talk'], [s3 + 46, 'shock'], [s3 + 70, 'chill']]} at={s3 + 16} x={560} y={1180} h={660} rot={3} amp={amp} />
      </AbsoluteFill>

      <Cap words={ws} />
      {/* grade + grain + vignette */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,60,0.08), rgba(40,20,0,0.12))', mixBlendMode: 'multiply', zIndex: 60}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.55)', zIndex: 61}} />
      <AbsoluteFill style={{opacity: 0.16, mixBlendMode: 'overlay', zIndex: 62}}>
        <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85"
          numOctaves="2" seed={Math.floor(f / 2) % 40} /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
      </AbsoluteFill>
      <Audio src={staticFile('kit/test/voice.mp3')} />
      {/* music bed: starts on the track's hook, ducks under the voice, fades in/out */}
      <Audio src={staticFile('music/t1.mp3')} startFrom={Math.round(14.63 * 30)}
        volume={(fr) => (talking(fr) ? 0.045 : 0.1) * Math.min(1, fr / 8) * Math.min(1, (300 - fr) / 20)} />
    </AbsoluteFill>
  );
};
