// ---------- scan: x-ray above the line, solid below ----------
let SCAN = 40;
const planeS = new THREE.Plane(V(0, -1, 0), SCAN), planeX = new THREE.Plane(V(0, 1, 0), -SCAN);
const XV = `#include <clipping_planes_pars_vertex>
varying vec3 vN; varying vec3 vV; varying vec3 vW;
void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix*wp;
  vN = normalize(normalMatrix*normal); vV = normalize(-mvPosition.xyz); gl_Position = projectionMatrix*mvPosition;
  #include <clipping_planes_vertex>
}`;
const XF = `#include <clipping_planes_pars_fragment>
uniform vec3 uC; uniform float uB, uG, uA, uScan;
varying vec3 vN; varying vec3 vV; varying vec3 vW;
void main(){
  #include <clipping_planes_fragment>
  float f = pow(1.0-abs(dot(normalize(vN),normalize(vV))), 2.0);
  float s = 0.85+0.15*sin(vW.y*5.0);
  float band = exp(-abs(vW.y-uScan)*1.1)*1.5;
  gl_FragColor = vec4(uC*((uB+uG*f)*s + band*(0.3+f))*uA, 1.0); }`;
const XM = [], EM = [];
function xrayMat(color, base, gain) {
  const m = new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color(color) }, uB: { value: base }, uG: { value: gain }, uA: { value: 0 }, uScan: { value: SCAN } },
    vertexShader: XV, fragmentShader: XF, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, clipping: true });
  m.clippingPlanes = [planeX]; XM.push(m); return m;
}
function edgeMat(color, op) { const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  m.clippingPlanes = [planeX]; m.userData.op = op; EM.push(m); return m; }
function shell(geo, solid, parent = scene, col = '#3aa8ff', xr = [0.03, 0.7], edge = 25, eop = 0.5) {
  const g = new THREE.Group();
  const s = solid.clone(); s.clippingPlanes = [planeS]; s.side = THREE.DoubleSide; g.add(new THREE.Mesh(geo, s));
  g.add(new THREE.Mesh(geo, xrayMat(col, xr[0], xr[1])));
  if (edge) g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, edge), edgeMat('#9fe6ff', eop)));
  parent.add(g); return g;
}
const box = (w, h, d, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
