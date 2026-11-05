# scale3 prompts — DM for comment SCALE
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/scale — Make a 9:16 full-screen 3D animation (three.js, rendered frame by frame with HTML + GSAP, ~4 s) that compares $ARGUMENTS
at TRUE scale. Start close on the small thing, pull the camera back until the big thing fills the frame, then line up copies of the
small thing across the big one so the ratio is visible. Real studio light, bloom, ACES tone mapping, star field if it's space.
Labels with leader lines, a short caption word by word with the key number in a blue box. Use only real, sourced ratios.
  Example: /scale the Sun vs Earth  (about 109 Earths fit across the Sun)

/blueprint — Show $ARGUMENTS as a technical blueprint that builds itself: white line drawings appear part by part on blue grid paper,
then turn into real metal 3D parts; then show how it works with particles or arrows. Same labels and captions as above.
  Example: /blueprint a jet engine  (fan → compressor → combustor → turbine; air blue before the burner, orange after)

/explode — Exploded view of $ARGUMENTS: the assembled object turns slowly, then every layer lifts apart in order with a label
saying what each part does. Studio light, soft shadow, same captions.
  Example: /explode my sneaker  (upper, insole, midsole, outsole)
