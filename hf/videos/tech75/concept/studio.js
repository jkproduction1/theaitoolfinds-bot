// Shared helpers for inside59 3D result clips (three.js, everything procedural).
import * as THREE from 'three';
import { RoomEnvironment } from './RoomEnvironment.js';

export const W = 1080, H = 1920, DUR = 6.33;
export const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t, a, b) => cl((t - a) / (b - a));
export const sm = x => x * x * (3 - 2 * x);
export const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const eout = x => 1 - Math.pow(1 - x, 4);
export const popS = x => { const c1 = 1.70158, c3 = c1 + 1, y = x - 1; return 1 + c3 * y * y * y + c1 * y * y; };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

export function setup(fov = 30, bgA = [.03, .034, .045], bgB = [.16, .16, .175]) {
  const stage = document.getElementById('stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.localClippingEnabled = true;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 3000);
  const bgU = { uA: { value: new THREE.Color(...bgA) }, uB: { value: new THREE.Color(...bgB) }, uT: { value: new THREE.Color(0, 0, 0) }, uRes: { value: new THREE.Vector2(W, H) }, uGrid: { value: 0 } };
  const bg = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: bgU,
    vertexShader: `void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform vec3 uA,uB,uT; uniform vec2 uRes; uniform float uGrid;
      void main(){ vec2 p = gl_FragCoord.xy/uRes; vec2 q = (p-vec2(.5,.56))*vec2(1.0,1.5);
        float v = 1.0-smoothstep(0.0,0.95,length(q));
        vec3 c = mix(uA,uB,v*v) + uT*v;
        vec2 g = abs(fract(gl_FragCoord.xy/54.0)-0.5); float gl = 1.0-smoothstep(0.0,0.04,min(g.x,g.y));
        c += uGrid*gl*vec3(.05,.12,.2)*(0.4+v);
        gl_FragColor = vec4(c,1.0); }`
  }));
  bg.renderOrder = -10; scene.add(bg);
  return { stage, renderer, scene, camera, bgU };
}

export function softTex() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.5)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// ---- labels: pills (html) + leader lines (svg) ----
const tv = new THREE.Vector3();
export function projector(camera) { return (x, y, z) => { tv.set(x, y, z).project(camera); return [(tv.x + 1) / 2 * W, (1 - tv.y) / 2 * H]; }; }
export function pill(el, x, y, a, sc) { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.opacity = a; el.style.transform = `translate(-50%,-50%) scale(${sc})`; }
export function leader(ax, ay, bx, by, a, col) {
  return a <= 0.001 ? '' : `<g opacity="${a}"><line x1="${ax}" y1="${ay}" x2="${ax + (bx - ax) * Math.min(1, a * 1.3)}" y2="${ay + (by - ay) * Math.min(1, a * 1.3)}" stroke="${col}" stroke-width="3.5"/>` +
    (a > 0.6 ? `<circle cx="${bx}" cy="${by}" r="9" fill="${col}"/><circle cx="${bx}" cy="${by}" r="19" fill="none" stroke="${col}" stroke-width="2.5" opacity=".6"/>` : '') + `</g>`;
}
// label helper: el, anchor [x,y,z], pill position fn, appear time, colour
export function labels(camera, defs) {
  const proj = projector(camera), svg = document.getElementById('lines');
  return (t) => {
    let s = '';
    for (const d of defs) {
      const a = sm(ramp(t, d.t0, d.t0 + 0.4)) * (d.t1 ? 1 - sm(ramp(t, d.t1, d.t1 + 0.35)) : 1);
      const [bx, by] = proj(...(typeof d.at === 'function' ? d.at(t) : d.at));
      let [px, py] = typeof d.pos === 'function' ? d.pos(bx, by, t) : d.pos;
      const hw = d.el.offsetWidth / 2, hh = d.el.offsetHeight / 2;
      px = Math.max(90 + hw, Math.min(990 - hw, px));
      pill(d.el, px, py, a, 0.86 + 0.14 * popS(ramp(t, d.t0, d.t0 + 0.45)));
      // leave from the pill edge closest to the anchor
      let ax = px, ay = py;
      if (Math.abs(by - py) > hh + 20) ay = py + Math.sign(by - py) * hh; else ax = px + Math.sign(bx - px) * hw;
      s += leader(ax, ay, bx, by, a, d.col || '#7fd4ff');
    }
    svg.innerHTML = s;
  };
}
export const CSS = `
  body{margin:0;background:#000;overflow:hidden}
  #stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b0f18;font-family:"Inter",system-ui,Arial,sans-serif}
  canvas{position:absolute;inset:0;display:block}
  #ov{position:absolute;inset:0;pointer-events:none}
  #ov svg{position:absolute;inset:0}
  .pill{position:absolute;left:0;top:0;opacity:0;transform:translate(-50%,-50%);background:rgba(6,14,26,.84);border:2.5px solid rgba(110,210,255,.8);border-radius:18px;padding:10px 28px 14px;color:#fff;white-space:nowrap;box-shadow:0 0 26px rgba(70,180,255,.35),0 8px 30px rgba(0,0,0,.45);font-weight:800;font-size:46px;letter-spacing:-.5px}
  .pill.hot{border-color:#ffb547;box-shadow:0 0 30px rgba(255,170,60,.45),0 8px 30px rgba(0,0,0,.45)}
  .pill.red{border-color:#ff4a4a;box-shadow:0 0 34px rgba(255,60,60,.55),0 8px 30px rgba(0,0,0,.45)}
`;
export function injectCSS() { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }
export async function ready(render) {
  window.renderAt = t => render(t); window.draw = render; window.DUR = DUR;
  const q = new URLSearchParams(location.search);
  await Promise.race([document.fonts.load('800 46px "Inter"'), new Promise(r => setTimeout(r, 1200))]);
  render(q.has('t') ? parseFloat(q.get('t')) : 5.0);
  requestAnimationFrame(() => { document.title = 'ok'; });
}
