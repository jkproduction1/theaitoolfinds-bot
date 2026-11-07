---
description: Cinematic 3D explainer of anything as one self-contained HTML file (three.js, 9:16, ~8 s loop, ready to screen-record)
argument-hint: <topic, e.g. "how a jet engine works">
---
# /explain-3d

Build a cinematic, vertical 3D explainer of: **$ARGUMENTS**

Write ONE self-contained file `explain-3d/index.html` (create the folder). No build step, no npm, no external images or
models. Everything is drawn in code with three.js. When done, print one line: how to open it and record it.

## Facts first (do this before any code)
- Decide the 3–4 key parts and the ONE thing that moves/flows between them. Textbook facts only, no invented numbers.
- Write the caption: max 7 words, plain English, one key word (that word gets the highlight box).
- Write 3–4 labels: a bold name (1–3 words) + a short mono sub-line (max 4 words).

## Tech (exactly this, so it works first time)
- `<script type="importmap">` → `"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"`,
  `"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"`. Use `RoomEnvironment` + `PMREMGenerator`
  for reflections, `EffectComposer` + `RenderPass` + `UnrealBloomPass` (strength 0.45, radius 0.5, threshold 0.85).
- Renderer: antialias, `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`, exposure 1.0.
- Stage is exactly 1080×1920 (9:16), CSS-scaled to fit the window with black letterbox. Canvas + an HTML overlay div of the
  same size for caption and labels.
- ONE pure function `render(t)` (t in seconds) sets EVERYTHING (camera, parts, opacities, particles, labels, caption) from t
  only — no state between frames, no `Math.random()` inside it (use a seeded PRNG at build time). The loop calls
  `render((performance.now()-start)/1000 % 8)`. Support `?t=3.2` in the URL to freeze on one moment. Press `R` to restart.

## Look (premium, never cheap)
- Background: radial gradient #262a31 → #08090b (scene.background as a canvas texture). One soft key light + the room env.
- Build the object from primitives with care: `ExtrudeGeometry` with bevels for plates and housings, `LatheGeometry` for
  round parts, `TubeGeometry` along curves for pipes/wires/flows, `InstancedMesh` for many repeated small parts.
  Materials: `MeshPhysicalMaterial` (metal: metalness 1 roughness .25–.35; plastic: roughness .45 clearcoat .5;
  glass/shell: transmission 0 + transparent opacity for the cutaway). Real proportions, rounded edges, no floating parts.
- Palette: neutral greys + ONE accent for the moving thing (electric blue #58d6ff for energy/data/air, warm #ff6a3d for
  heat/fire, #7ee2b8 for liquids/life). Accent parts use emissive + bloom.
- Object centred in the upper-middle (y 520–1250 px). Keep 70 px side margins for everything.

## Motion (8 s loop)
- 0.0–1.2 s: establishing shot, slow orbit (≈10°), object whole.
- 1.2–2.6 s: camera pushes in (ease in-out quint) while the outer casing fades to a cutaway (opacity 1 → 0.12, keep its
  edges as faint lines with `EdgesGeometry`).
- 2.6–6.4 s: the mechanism works: the flow moves along a `CatmullRomCurve3` as glowing particles (16–40 small spheres or
  sprites, seeded offsets), moving parts rotate/slide with physically plausible speeds. Labels appear one by one
  (stagger 0.25 s) with an expo-out pop.
- 6.4–8.0 s: slow pull-back, labels fade, back to the opening frame so the loop is seamless.
- Easing: expo-out for arrivals, quint in-out for camera, never linear except continuous rotation.

## Overlay (HTML, Inter / system-ui)
- Caption at top: 62 px, bold, white, centred, words rise in one by one (0.16 s apart) from t=0.25; the key word sits in a
  blue (#2f6bff) rounded box. Text-shadow for contrast.
- Labels: dark pill `rgba(8,9,12,.92)` with a 2 px leader line from the pill to the projected 3D anchor (Vector3.project),
  orange dot (#ff6a3d) at the anchor. Labels in one column (x≈640 px), never overlapping (sort by y, min 120 px apart).
- Title bar near the bottom (y≈1580): "<short topic> explainer" bold + "made with code" in an italic serif, on a soft dark
  gradient band.

## Self-check before you finish
Open the file in your head frame by frame at t = 0.5, 2.0, 4.0, 6.0: nothing cut off at the edges, labels readable and not
overlapping the object's key part, caption fits on max 2 lines, the moving thing is clearly visible, no part is floating.
Fix anything that fails, then finish.
