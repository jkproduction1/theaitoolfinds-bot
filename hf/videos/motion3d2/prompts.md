# motion3d v2 prompts — DM for comment MOTION

Save each as a Claude Code command (.claude/commands/<name>.md, "$ARGUMENTS" = your request) or paste it directly.

/explain-3d — Make a 9:16 cinematic 3D explainer of $ARGUMENTS with three.js, rendered frame by frame (HTML + GSAP timeline), 4 s.
Real studio HDRI lighting (e.g. a CC0 studio HDRI), ACES tone mapping, bloom, glass with transmission, brushed metal. Cut the object
open, show the part that does the work moving, labels with leader lines (name + one short line). Top: a short caption word by word with one
key word in a blue box. Bottom: title + "with Claude Code". No logos, no invented numbers.
  Example: /explain-3d how a camera lens focuses  (half-cut barrel, glass elements, light rays converge on the sensor as the focus group slides; the photo goes from blurred to sharp)

/motion3d — Make a 9:16 cinematic 3D animation of $ARGUMENTS with three.js, 4 s, same look (HDRI, bloom, depth of field), one slow camera move,
an exploded view if it has parts, glowing heat/energy where it helps the story. No logos.
  Example: /motion3d how a laptop fan keeps the chip cool  (lid opens, keyboard deck lifts away, chip glows hot, heat pipe, fan spins up, air flows out through the fins, chip cools to blue)

/hero-3d — Build the hero section of a landing page for $ARGUMENTS: nav, a big glass 3D shape (three.js, transmission + HDRI) over soft colour
blobs, headline that types in, subline, CTA button, three feature cards, smooth scroll. Invent the product name; no real brands.
  Example: /hero-3d landing page for my AI startup  ("nova": glass torus knot, "Think faster with Nova.", Start free, 3 feature cards)
