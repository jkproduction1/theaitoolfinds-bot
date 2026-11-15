# earth39 prompts — DM for comment WAVE
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

## /what-if a mega tsunami hit New York
Make a 4-second 9:16 three.js animation at dusk: a dense harbour skyline (your own generic towers with lit windows, one tall spire, no real
landmarks), a calm bay in front. A huge wave crest rises out of the bay, marches toward the city and the water stays high behind it,
swallowing the lower floors. Physically based water: Fresnel sky reflection, a low orange sun glint, foam only on the crest.
- Slow push-in from above the bay. Headline "Real record: 525 m tsunami run-up, Alaska 1958." (Lituya Bay run-up, NOAA). No made-up heights.
- Labels: "The wave – rising out of the bay", "Downtown", "What if – no real forecast".

## /scale the biggest typhoon versus Europe
Make a 4-second 9:16 three.js animation of a real-looking Earth seen over Europe. Put a typhoon over central Europe at true scale:
Typhoon Tip (October 1979) had gale-force winds out to 1,100 km from its eye (NOAA AOML), so about 2,200 km across.
- Draw the storm in a shader on a shell just above the surface: log-spiral cloud bands, a bright eyewall and a clear eye, spinning
  counter-clockwise; it grows in, then an orange ring marks the 1,100 km radius.
- Start close on the eye, then pull back until all of Europe is in frame. Headline "Typhoon Tip, 1979: ≈2,200 km across."
- Labels: "Typhoon Tip, 1979 – largest storm on record", "Gale-force winds – 1,100 km from the eye", "Europe – same scale".
