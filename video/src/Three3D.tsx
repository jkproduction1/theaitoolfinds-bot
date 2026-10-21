// 3D camera test: a kit plate becomes a real 3D relief (depth map displacement), the camera
// dollies/arcs through it with rack focus, the sticky note is a bending 3D sheet, Scrappy and
// dust live at their own depth -> true parallax.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {fontCss} from './theme';

const css = fontCss + `
@font-face{font-family:Typewriter;src:url(${staticFile('fonts/special-elite-latin-400-normal.woff2')})}
@font-face{font-family:Hand;src:url(${staticFile('fonts/caveat-latin-700-normal.woff2')})}`;
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const k = (f: number, a: number, b: number, e = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});

const PH = 2;                       // plate height in world units
const PW = PH * 768 / 1376;         // plate width
const DEPTH = 0.55;                 // relief strength
const SCR = {x: 0.4407, y: 0.5523, w: 0.2318, h: 0.1134};

function useTex(url: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [h] = useState(() => delayRender('tex ' + url));
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(url), (t) => {
      t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; setTex(t); continueRender(h);
    }, undefined, () => continueRender(h));
  }, [url, h]);
  return tex;
}
function useFonts() {
  const [h] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load('40px Hand'), document.fonts.load('40px Typewriter')]).then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
}

// world position on the plate for image uv (u right, v down)
const P = (u: number, v: number) => [(u - 0.5) * PW, (0.5 - v) * PH] as const;

const reliefVS = `
uniform sampler2D uDepth; uniform float uAmt; varying vec2 vUv; varying float vD;
void main(){ vUv = uv; float d = texture2D(uDepth, uv).r; vD = d;
  vec3 p = position; p.z += d * uAmt; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`;
const reliefFS = `
uniform sampler2D uTex; uniform float uFocus; uniform float uBlur; uniform float uT; varying vec2 vUv; varying float vD;
void main(){
  float coc = clamp(abs(vD - uFocus) * uBlur, 0.0, 1.0) * 0.006;
  vec4 c = vec4(0.0);
  for (int i = 0; i < 12; i++) { float a = float(i) * 2.39996; float r = sqrt(float(i) / 12.0);
    c += texture2D(uTex, vUv + vec2(cos(a), sin(a)) * r * coc * vec2(1.0, 0.56)); }
  c /= 12.0;
  // blind light sweeping across the room, only on lit (near-wall) parts
  float s = smoothstep(0.55, 0.9, sin((vUv.x * 0.9 + vUv.y * 1.6) * 70.0 + uT * 0.05));
  c.rgb += c.rgb * s * 0.18 * smoothstep(0.2, 0.6, 1.0 - vD);
  gl_FragColor = c; }`;

const Relief: React.FC<{tex: THREE.Texture; depth: THREE.Texture; focus: number; blur: number; f: number}> = ({tex, depth, focus, blur, f}) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: reliefVS, fragmentShader: reliefFS,
    uniforms: {uTex: {value: tex}, uDepth: {value: depth}, uAmt: {value: DEPTH}, uFocus: {value: 0}, uBlur: {value: 0}, uT: {value: 0}},
  }), [tex, depth]);
  mat.uniforms.uFocus.value = focus; mat.uniforms.uBlur.value = blur; mat.uniforms.uT.value = f;
  return <mesh material={mat}><planeGeometry args={[PW, PH, 384, 688]} /></mesh>;
};

// plate texture with the live CRT screen painted in (so it sits exactly on the 3D monitor)
function usePlate(room: THREE.Texture | null) {
  const cv = useMemo(() => { const c = document.createElement('canvas'); c.width = 1152; c.height = 2064; return c; }, []);
  const tex = useMemo(() => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; return t; }, [cv]);
  const draw = (f: number) => {
    if (!room) return;
    const g = cv.getContext('2d')!; const W = cv.width, H = cv.height;
    g.drawImage(room.image as HTMLImageElement, 0, 0, W, H);
    const x = SCR.x * W, y = SCR.y * H, w = SCR.w * W, h = SCR.h * H;
    const grd = g.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w * 0.7);
    grd.addColorStop(0, '#12382c'); grd.addColorStop(1, '#03100b');
    g.save(); g.beginPath(); g.roundRect(x, y, w, h, 14); g.clip();
    g.fillStyle = grd; g.fillRect(x, y, w, h);
    const msg = '> new free tool found';
    const typed = msg.slice(0, Math.floor(interpolate(f, [10, 50], [0, msg.length], cl))) + (Math.floor(f / 8) % 2 ? '_' : ' ');
    let fs = Math.round(h * 0.16); g.font = `${fs}px Typewriter`;
    const tw = g.measureText(msg + '_').width; if (tw > w * 0.86) { fs = Math.floor(fs * w * 0.86 / tw); g.font = `${fs}px Typewriter`; } g.fillStyle = '#9dffcc'; g.shadowColor = '#2dff8a'; g.shadowBlur = 14;
    g.fillText(typed, x + w * 0.07, y + h * 0.45);
    g.shadowBlur = 0; g.fillStyle = 'rgba(0,0,0,0.35)';
    for (let yy = y; yy < y + h; yy += 4) g.fillRect(x, yy, w, 2);
    g.restore();
    // screen light spilling onto the desk / wall
    const sp = g.createRadialGradient(x + w / 2, y + h / 2, w * 0.3, x + w / 2, y + h / 2, w * 1.4);
    sp.addColorStop(0, `rgba(80,255,170,${0.10 + 0.03 * Math.sin(f / 3)})`); sp.addColorStop(1, 'rgba(80,255,170,0)');
    g.globalCompositeOperation = 'screen'; g.fillStyle = sp; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
    tex.needsUpdate = true;
  };
  return {tex, draw};
}

// sticky note: a real sheet that bends from its pin and flutters
const noteVS = `
uniform float uT; uniform float uGust; varying vec2 vUv; varying float vShade;
void main(){ vUv = uv; vec3 p = position; float hang = 1.0 - uv.y;   // 0 at pin (top) -> 1 at bottom
  float w = sin(uT * 0.24 + hang * 2.2) * 0.5 + sin(uT * 0.5 + hang * 4.0) * 0.18;
  p.z += hang * hang * w * 0.09 * uGust; p.y += hang * hang * abs(w) * 0.01;
  vShade = 1.0 - hang * w * 0.6;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`;
const noteFS = `
uniform sampler2D uTex; varying vec2 vUv; varying float vShade;
void main(){ vec4 c = texture2D(uTex, vUv); gl_FragColor = vec4(c.rgb * clamp(vShade, 0.6, 1.2) * vec3(0.55, 0.52, 0.44), c.a); }`;
const NotePlane: React.FC<{f: number; pos: [number, number, number]; text: string}> = ({f, pos, text}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 240; const g = c.getContext('2d')!;
    const gr = g.createLinearGradient(0, 0, 0, 240); gr.addColorStop(0, '#f6dd6a'); gr.addColorStop(1, '#e3c24a');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 240);
    g.fillStyle = '#2a2418'; g.font = '52px Hand'; g.textAlign = 'center';
    text.split('\n').forEach((l, i) => g.fillText(l, 128, 105 + i * 54));
    g.fillStyle = '#b5121b'; g.beginPath(); g.arc(128, 16, 11, 0, 7); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
  }, [text]);
  const mat = useMemo(() => new THREE.ShaderMaterial({vertexShader: noteVS, fragmentShader: noteFS, transparent: true, side: THREE.DoubleSide,
    uniforms: {uTex: {value: tex}, uT: {value: 0}, uGust: {value: 1}}}), [tex]);
  const ff = f - (f % 2);  // on twos
  mat.uniforms.uT.value = ff; mat.uniforms.uGust.value = 0.6 + 0.4 * Math.sin(ff / 23);
  return (
    <group position={pos} rotation={[0, 0, -0.09]}>
      <mesh position={[0.008, -0.012, -0.004]}><planeGeometry args={[0.155, 0.145]} /><meshBasicMaterial color="#000" transparent opacity={0.35} /></mesh>
      <mesh material={mat}><planeGeometry args={[0.15, 0.141, 16, 16]} /></mesh>
    </group>
  );
};

const Sprite: React.FC<{tex: THREE.Texture; pos: [number, number, number]; h: number; flip?: boolean; light?: number; rot?: number}> = ({tex, pos, h, flip, light = 0.5, rot = 0}) => {
  const img = tex.image as HTMLImageElement;
  const w = h * img.width / img.height;
  return (
    <mesh position={[pos[0], pos[1] + h / 2, pos[2]]} rotation={[0, 0, rot]} scale={[flip ? -1 : 1, 1, 1]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent color={new THREE.Color(light, light * 0.92, light * 0.8)} toneMapped={false} />
    </mesh>
  );
};

const Dust3D: React.FC<{f: number}> = ({f}) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry(); const n = 160; const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = ((i * 0.6180339) % 1 - 0.5) * PW * 1.1; a[i * 3 + 1] = ((i * 0.41421) % 1 - 0.5) * PH; a[i * 3 + 2] = 0.15 + ((i * 0.7320508) % 1) * 1.2; }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  return (
    <points geometry={geo} position={[Math.sin(f / 60) * 0.02, -((f * 0.0012) % 0.2), 0]}>
      <pointsMaterial size={0.0055} color="#ffe2b8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

// camera rig: slow dolly + arc, then a speed-ramped push into the monitor
const Rig: React.FC<{f: number}> = ({f}) => {
  const a = k(f, 0, 150, Easing.bezier(0.33, 0, 0.67, 1));
  const ramp = k(f, 120, 150, Easing.bezier(0.8, 0, 0.2, 1));
  const [tx, ty] = P(SCR.x + SCR.w / 2, SCR.y + SCR.h / 2);
  return (
    <CameraCtl
      pos={[interpolate(a, [0, 1], [-0.04, 0.03]) + ramp * (tx - 0.03), interpolate(a, [0, 1], [0.03, -0.05]) + ramp * (ty + 0.05), 3.45 - a * 0.75 - ramp * 2.05]}
      look={[tx * (0.4 + 0.6 * a), ty * (0.5 + 0.5 * a), 0.25]} />
  );
};
const CameraCtl: React.FC<{pos: number[]; look: number[]}> = ({pos, look}) => {
  const {camera} = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateProjectionMatrix();
  return null;
};

// read the depth value at an image point (so props sit exactly on the surface)
function depthAt(tex: THREE.Texture, u: number, v: number) {
  const img = tex.image as HTMLImageElement;
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d')!; g.drawImage(img, 0, 0);
  return g.getImageData(Math.round(u * img.width), Math.round(v * img.height), 1, 1).data[0] / 255;
}

const Scene: React.FC<{room: THREE.Texture; depth: THREE.Texture; scrappy: THREE.Texture; fonts: boolean}> = ({room, depth, scrappy, fonts}) => {
  const f = useCurrentFrame();
  const plate = usePlate(room);
  plate.draw(f);
  const dScr = useMemo(() => (depth ? depthAt(depth, SCR.x + SCR.w / 2, SCR.y + SCR.h / 2) : 0), [depth]);
  const dNote = useMemo(() => (depth ? depthAt(depth, 0.36, 0.36) : 0), [depth]);
  const dDesk = useMemo(() => (depth ? depthAt(depth, 0.76, 0.735) : 0), [depth]);
  if (!room || !depth || !scrappy || !fonts) return null;
  // rack focus: start on the note (near), pull to the monitor
  const focus = interpolate(k(f, 40, 75), [0, 1], [0.62, 0.48]);
  const [sx, sy] = P(SCR.x + SCR.w / 2, SCR.y + SCR.h / 2);
  return (
    <>
      <Rig f={f} />
      <Relief tex={plate.tex} depth={depth} focus={focus} blur={3.2} f={f} />
      <NotePlane f={f} pos={[...P(0.36, 0.36), dNote * DEPTH + 0.01] as any} text={'try it\nfree!'} />
      <Sprite tex={scrappy} pos={[P(0.76, 0.735)[0], P(0.76, 0.735)[1], dDesk * DEPTH + 0.005]} h={0.22} flip light={0.42} rot={0.1} />
      <Dust3D f={f} />
    </>
  );
};

export const Three3D: React.FC = () => {
  const f = useCurrentFrame();
  const room = useTex('kit/room1.jpg'), depth = useTex('kit/depth/room1.png'), scrappy = useTex('mascot/chill.png');
  const fonts = useFonts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{css}</style>
      <ThreeCanvas width={1080} height={1920} linear flat gl={{antialias: true}} camera={{fov: 30, near: 0.01, far: 50, position: [0, 0, 3.45]}}>
        {room && depth && scrappy && fonts ? <Scene room={room} depth={depth} scrappy={scrappy} fonts={fonts} /> : null}
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,60,0.06), rgba(0,40,40,0.12))', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(0,0,0,0.72)'}} />
      <AbsoluteFill style={{opacity: 0.2, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"
          seed={Math.floor(f / 2) % 50} /></filter><rect width="100%" height="100%" filter="url(#gn)" /></svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
