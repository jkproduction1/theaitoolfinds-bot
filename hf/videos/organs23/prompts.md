# organs23 prompts — DM for comment ORGANS
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.
Note: the results in the video took a few rounds of feedback (framing, brightness, timing). Expect to iterate.

/x-ray — Make a 9:16 full-screen 3D x-ray film (three.js, rendered frame by frame with HTML + GSAP, ~5 s) of $ARGUMENTS. Start with
the real, solid object; a glowing scan line sweeps across it and everything behind the line turns into a see-through x-ray
that shows the real parts inside. Then show how it works, slow enough to follow. Studio HDRI light, bloom.
Labels with leader lines for each part, a short caption word by word with one key word in a highlight box. No invented numbers.
  Example: /x-ray the human eye  (real eyeball with iris and glossy cornea → x-ray shows cornea, lens, retina, optic nerve → camera
  swings to the side: light rays from an upright arrow pass through cornea and lens, cross, and the picture lands upside down on the retina)

/zoom-in — Make a 9:16 full-screen 3D zoom film (three.js, ~5 s) of $ARGUMENTS. Start wide, then the camera pushes in through soft
depth fog until we are right at the action, and it keeps following it in one smooth move. Label the 3 main parts with what each
one does. Labels + caption as above.
  Example: /zoom-in a brain cell firing  (signals run in along the dendrites, the cell body charges up, a spike runs down the axon
  jumping from gap to gap in the myelin, and the synapse releases a burst of messenger molecules onto the next cell)

/explain-3d — Make a 9:16 full-screen 3D explainer (three.js, ~5 s) of $ARGUMENTS. Show a clean cutaway (front half see-through),
the camera drifts in slowly, and the real mechanism plays step by step. Labels + caption as above.
  Example: /explain-3d how your stomach digests food  (muscle waves squeeze along the wall and churn the food, acid from the lining
  breaks the chunks into small bits, the pylorus opens a little at a time and lets small squirts into the small intestine)
