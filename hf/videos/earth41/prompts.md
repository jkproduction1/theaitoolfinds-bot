# earth41 prompts — DM for comment TIDE
Made with Claude Opus 5.5. Paste one into Claude Code (or save it as a command in .claude/commands/<name>.md). Each asks for a single
HTML file (three.js + GLSL shaders, everything drawn in code, no external images except optional public-domain NASA Earth textures) that
you can preview in the browser and render to a 9:16 mp4. It usually takes a few rounds of feedback (camera, brightness, label positions)
to get to the look in the video: that's normal.

## /simulate the Moon twice as close
Make a 4-second 9:16 (1080x1920, 30 fps) three.js "what if" animation: the Moon drifts from today's distance to half of it (not to scale).
- Lower right: a big real-looking Earth (day texture, clouds, city lights on the night side, thin atmosphere rim).
- Upper left: a cratered Moon (procedural texture) moving closer and growing; a thin orange line connects it to Earth.
- A translucent blue ocean shell stretched toward the Moon (and on the far side) swells as the Moon comes closer: tidal force goes with
  1/distance³ (NOAA), so half the distance = 8× the pull. Odometers: "Moon – 384,400 → 192,200 km away", "Tidal pull ×1.0 → ×8.0".
- Slow eased camera drift. Headline "Half the distance: 8× the tidal pull." Label "Not to scale – distances shortened".

## /x-ray Earth down to its core
Make a 4-second 9:16 three.js "x-ray" cutaway of Earth in a dark studio. Real Earth texture with one octant cut out; colour the three
cut faces by radius, to scale (NASA): crust (~30 km on land, draw it a little thicker so it shows), mantle (~2,900 km of hot rock, deep
red to orange with slow convection noise), liquid iron-nickel outer core (~2,300 km, yellow-orange, flowing), solid inner core (1,221 km
radius, pale glowing yellow-white). Thin dark lines between the layers.
- A cyan scan ring sweeps from the surface to the centre; each label pops in when the ring reaches its layer.
- Slow eased orbit + push-in. Headline "Inner core: up to 5,400 °C." (NASA). Labels: "Crust – ≈30 km on land", "Mantle – ≈2,900 km of
  hot rock", "Outer core – liquid iron + nickel", "Inner core – solid, 1,221 km radius".

## /scale the biggest typhoon versus Europe
Make a 4-second 9:16 three.js animation of a real-looking Earth seen over Europe. Put a typhoon over central Europe at true scale:
Typhoon Tip (October 1979) had gale-force winds out to 1,100 km from its eye (NOAA AOML), so about 2,200 km across.
- Draw the storm in a shader on a shell just above the surface: log-spiral cloud bands, a bright eyewall and a clear eye, spinning
  counter-clockwise; it grows in, then an orange ring marks the 1,100 km radius.
- Start close on the eye, then pull back until all of Europe is in frame. Headline "Typhoon Tip, 1979: ≈2,200 km across."
- Labels: "Typhoon Tip, 1979 – largest storm on record", "Gale-force winds – 1,100 km from the eye", "Europe – same scale".
