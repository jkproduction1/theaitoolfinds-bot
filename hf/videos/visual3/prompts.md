# visual3 prompts — DM for comment VISUAL
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/visualize — Make a 9:16 full-screen animated explainer of $ARGUMENTS with three.js, rendered frame by frame (HTML + GSAP), 4 s.
Real studio HDRI light, bloom, ACES tone mapping. Show the parts as a 3D scene and the flow between them as light pulses
(each part lights up when the pulse arrives). Labels with leader lines, a short caption word by word with one key word in a blue
box, title + "with Claude Code" at the bottom. No logos, no invented numbers.
  Example: /visualize how a computer works  (SSD → RAM → CPU → GPU → screen)

/explain-3d — Cinematic 3D explainer of $ARGUMENTS: assemble the object from its parts, then show the physics that makes it work
(arrows/particles), same look and captions as above.
  Example: /explain-3d how a drone flies  (props spin, airflow down, faster props on one side tilt it)

/how-its-made — Show how $ARGUMENTS is made, step by step in 3D (raw material → process → finished product lifting out and glowing).
  Example: /how-its-made a microchip  (silicon wafer, UV light prints the pattern through a mask, one chip lifts out)
