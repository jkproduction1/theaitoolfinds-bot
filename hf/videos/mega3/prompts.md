# mega3 prompts — DM for comment MEGA
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/time-lapse — Make a 9:16 full-screen 3D time-lapse (three.js, rendered frame by frame with HTML + GSAP, ~4 s) of $ARGUMENTS being
built from nothing to finished, in the real build order. Slow orbiting camera, the sun sweeps across the sky so the shadows turn,
it ends at dusk with the lights coming on. Studio HDRI light, bloom, soft shadows. Labels with leader lines for the key stages,
a short caption word by word with one key word in a blue box. No invented numbers.
  Example: /time-lapse a skyscraper going up  (concrete core first, floors follow, the tower crane climbs with it, glass facade last)

/x-ray — 3D x-ray of $ARGUMENTS: start with the real-looking object, a glowing scan line sweeps across and turns it into a
see-through x-ray shell (fresnel glow), revealing the parts inside. Animate what flows between them. Labels + caption as above.
  Example: /x-ray an electric car  (battery pack of cells in the floor → inverter DC→AC → motor at the wheels; braking sends energy back)

/explain-3d — Cinematic 3D explainer of $ARGUMENTS: wide shot first, then the camera flies in and the casing fades into a cutaway
that shows the mechanism working. Real studio HDRI light, bloom, depth, labels and captions as above.
  Example: /explain-3d a wind turbine  (wind turns the blades → slow main shaft → gearbox speeds it up → generator makes electricity)
