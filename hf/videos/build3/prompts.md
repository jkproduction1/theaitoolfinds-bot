# build3 prompts — DM for comment BUILD
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/how-its-made — Make a 9:16 full-screen 3D "how it's made" film (three.js, rendered frame by frame with HTML + GSAP, ~4 s) of
$ARGUMENTS, showing the real production steps in order, from raw materials to the finished product. The camera follows the
product from step to step; a see-through cutaway where the action happens inside a machine. Studio HDRI light, bloom, depth.
Labels with leader lines for each step, a short caption word by word with one key word in a blue box. No invented numbers.
  Example: /how-its-made a glass bottle  (sand + soda ash + limestone melt in a furnace → a hot gob drops into a mould →
  air blows it into shape → it is cooled slowly so it doesn't crack)

/explode — 3D exploded view of $ARGUMENTS: start with the assembled object, then every layer flies apart along one axis in
build order, then the camera dives into one key part, which splits further and shows how it moves. Labels + caption as above.
  Example: /explode a mechanical keyboard  (keycaps → switches (stem, spring, housing) → plate → PCB → case)

/time-lapse — Make a 9:16 full-screen 3D time-lapse (three.js, rendered frame by frame with HTML + GSAP, ~4 s) of $ARGUMENTS being
built from nothing to finished, in the real build order. Slow orbiting camera, the sun sweeps across the sky, it ends at dusk
with the lights coming on. Studio HDRI light, bloom, soft shadows. Labels with leader lines for the key stages, caption as above.
  Example: /time-lapse a bridge being built  (suspension bridge: towers first, main cables strung over them, suspenders drop,
  the deck is hung piece by piece)
