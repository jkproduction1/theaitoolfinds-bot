# kitchen11 prompts — DM for comment KITCHEN
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/x-ray — Make a 9:16 full-screen 3D x-ray film (three.js, rendered frame by frame with HTML + GSAP, ~4 s) of $ARGUMENTS. Start with
the real, solid object; a glowing scan line sweeps across it and everything behind the line turns into a blue see-through x-ray
that shows the real parts inside. Then the parts work: show what flows through them, in the right order. Studio HDRI light, bloom.
Labels with leader lines for each part, a short caption word by word with one key word in a blue box. No invented numbers.
  Example: /x-ray a coffee machine  (water tank → pump → boiler heats the water → group head → espresso into the cup)

/explain-3d — Make a 9:16 full-screen 3D explainer (three.js, rendered frame by frame with HTML + GSAP, ~4 s) of $ARGUMENTS. The
outer shell turns see-through, the camera pushes in, and the real mechanism plays step by step. Labels + caption as above.
  Example: /explain-3d how a microwave heats food  (magnetron makes microwaves → they bounce off the metal walls → the turntable
  spins → water in the food shakes and heats up)

/explode — 3D exploded view of $ARGUMENTS: start with the assembled object, then every part flies apart in build order, then one
key part comes to life (glows, moves, works). Labels + caption as above.
  Example: /explode a toaster  (shell lifts off, crumb tray drops, heating wire on mica sheets glows red, the bread browns)
