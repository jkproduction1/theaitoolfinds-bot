# /explain-3d prompts — DM for comment EXPLAIN

Paste into Claude Code (or save as .claude/commands/explain-3d.md with "$ARGUMENTS" for the topic):

/explain-3d — Make a 9:16 cinematic 3D explainer of $ARGUMENTS with three.js, rendered frame by frame (HTML + GSAP timeline).
Dark studio background with a soft radial glow, a studio environment map for reflections and realistic PBR materials
(brushed aluminium, glass with clearcoat, matte plastic, copper, PCB green). Start with the whole object slowly turning,
then explode it into its real parts with smooth easing. Every part gets a label with a leader line and a dot (name + one
short line of what it does) on a dark backing so it never overlaps the model. Top caption: one short sentence that
appears word by word with one key word in a blue box. Bottom: title + "with Claude Code". 4–6 seconds, no logos,
no invented numbers.

Examples used in the video:
- /explain-3d how a smartphone works  (display, logic board, cameras, battery, frame)
- /explain-3d how wireless charging works  (transmitter coil, magnetic field, receiver coil)
- /explain-3d how noise-cancelling headphones work  (microphone, chip, speaker + noise wave vs. anti-noise wave)
