# inside3 prompts — DM for comment INSIDE
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/explain-3d — Cinematic 3D explainer of $ARGUMENTS (three.js, 9:16 full screen, rendered frame by frame with HTML + GSAP, ~4 s):
wide shot first, then the camera flies in and the casing fades into a cutaway that shows the mechanism working. Real studio HDRI
light, bloom, depth, labels with leader lines for the key parts, a short caption word by word with one key word in a blue box.
Textbook facts only, no invented numbers.
  Example: /explain-3d how an SSD stores data  (controller + flash chips, no moving parts; zoom into a chip: electrons get trapped in
  tiny memory cells, each trapped charge = a stored bit)
  Example: /explain-3d how a fridge stays cold  (compressor squeezes the refrigerant → condenser coils on the back give the heat off →
  expansion valve, pressure drops and it gets cold → evaporator inside pulls heat out of the food space; hot loop red, cold loop blue)

/x-ray — 3D x-ray of $ARGUMENTS: start with the real-looking object, a glowing scan line sweeps across and turns it into a
see-through x-ray shell (fresnel glow), revealing the parts inside. Animate what flows between them. Labels + caption as above.
  Example: /x-ray an e-bike  (battery in the down tube → controller → hub motor in the rear wheel; the pedal sensor tells it when you pedal)
