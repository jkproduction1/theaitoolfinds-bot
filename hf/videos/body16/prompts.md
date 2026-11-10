# body16 prompts — DM for comment BODY
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/x-ray — Make a 9:16 full-screen 3D x-ray film (three.js, rendered frame by frame with HTML + GSAP, ~5 s) of $ARGUMENTS. Start with
the real, solid object; a glowing scan line sweeps across it and everything behind the line turns into a see-through x-ray
that shows the real parts inside. Then the parts work: show what flows through them, in the right order. Studio HDRI light, bloom.
Labels with leader lines for each part, a short caption word by word with one key word in a blue box. No invented numbers.
  Example: /x-ray the human heart  (the heart beats; blue oxygen-poor blood comes into the right side and is pumped to the lungs,
  red oxygen-rich blood leaves the left ventricle through the aorta to the body)

/zoom-in — Make a 9:16 full-screen 3D zoom film (three.js, ~5 s) of $ARGUMENTS. Start on the real thing at normal size, then the
camera pushes into it in one smooth move until we float among its tiny parts, built to look real (glossy, soft depth with fog),
drifting slowly. Label the 3 main parts with what each one does. Labels + caption as above.
  Example: /zoom-in a drop of blood  (red blood cells carry oxygen, a white blood cell fights germs, platelets help stop bleeding)

/explain-3d — Make a 9:16 full-screen 3D explainer (three.js, ~5 s) of $ARGUMENTS. Show a clean cutaway, the camera pushes in, and
the real mechanism plays step by step, slow enough to follow. Labels + caption as above.
  Example: /explain-3d how lungs breathe  (the diaphragm pulls down, the lungs expand and air flows in through the trachea;
  it relaxes up and the air flows out)
