# orbit35 prompts — DM for comment ORBIT
Made with Claude Opus 5.5. Paste one into Claude Code (or save it as a command in .claude/commands/<name>.md). Each asks for a single
HTML file (three.js + GLSL shaders, everything drawn in code, no external images except optional public-domain NASA Earth textures) that
you can preview in the browser and render to a 9:16 mp4. It usually takes a few rounds of feedback (camera, brightness, label positions)
to get to the look in the video: that's normal.

## /explain-3d a solar flare hitting Earth
Make a 4-second 9:16 (1080x1920, 30 fps) three.js animation, not to scale and time-lapsed, of a solar flare reaching Earth.
- Upper left: a big glowing Sun (animated granulation shader, limb darkening, soft orange corona). Lower right: a small real-looking Earth
  with clouds and a thin blue atmosphere, wrapped in glowing blue dipole magnetic field lines.
- 0–0.5 s: a bright flash and glowing loops on the side of the Sun facing Earth. 0.4–1 s: a thin beam of light streaks to Earth first.
- 0.5–2.5 s: a slower orange plasma cloud (CME, particles) balloons out toward Earth, flows around the magnetic field, which squeezes on
  the day side and stretches into a long tail on the night side. 2–3 s: green auroras light up around both poles.
- Slow camera drift with a gentle push-in. Headline "Its light hits us in about 8 minutes." (NASA: flare light ~8 min, a CME 1–4 days).
  Labels: "Solar flare", "Plasma cloud (CME) – takes 1 to 4 days", "Magnetic shield – bends it around Earth".

## /x-ray Jupiter down to its core
Make a 4-second 9:16 three.js animation of Jupiter (flowing cloud-band shader with a red oval storm) on a dark star field.
- An x-ray scan line sweeps down the planet and tints it blue, then a 90° wedge opens toward the camera.
- The cut faces show the layers: pale molecular hydrogen, a glowing blue layer of liquid metallic hydrogen, and a large orange core with a
  soft, blurry edge that blends into the layer around it (not a hard ball).
- Slow orbit and push-in. Headline "Its core isn't solid. It's fuzzy." (NASA Juno: the core is larger than expected, not solid, partly
  dissolved = "dilute"/"fuzzy"). Labels: "Cloud tops", "Liquid metallic hydrogen – makes its magnetic field", "Fuzzy core".

## /zoom-in Saturn's rings
Make a 4-second 9:16 three.js animation that starts on all of Saturn (banded planet, rings with the Cassini division, the planet's shadow
on the rings) and dives in one continuous, eased camera move into the A ring until single lumpy chunks of water ice (instanced, soft
lighting, slow tumbling) drift past the camera in sunlight, with the ring plane fading behind them.
- Headline "Mostly ice, often just 10 m thick." (NASA: the rings are about 30 feet / 10 m thick in most places). Labels: "Saturn",
  "Ring particles – mostly water ice", "Thin as a building – ~10 m in most places".
