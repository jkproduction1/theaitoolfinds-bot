# motion13 prompts — DM for comment MOTION
Save as Claude Code commands (.claude/commands/<name>.md, "$ARGUMENTS" = your topic) or paste directly.

/glassmorphism — Make a 9:16 motion-design clip (HTML canvas + GSAP, rendered frame by frame, ~4 s) of $ARGUMENTS as frosted-glass UI:
3–4 big soft colour blobs drifting on a dark background; glass cards spring in (back.out) with real background blur, a bright 1 px edge,
a soft diagonal highlight and a deep shadow; small floating glass chips; live details (waveform, progress bar) keep moving.
  Example: /glassmorphism a music player

/ui-motion — Make a 9:16 UI-motion clip (HTML canvas + GSAP, ~4 s) of $ARGUMENTS on a phone mock-up: a small black pill at the top
springs open into the element (real spring: overshoot, then settle), more items stack under it with older ones tucked behind and
scaled down, the top one expands to show detail, then is swiped away and the stack slides up. Soft shadows, 2-layer depth.
  Example: /ui-motion a phone notification

/kinetic-type — Make a 9:16 kinetic-typography clip (~4 s) for $ARGUMENTS: one word per beat (~0.3 s), heavy sans, scale punches,
mask wipes and slide-ins, a colour flip on every beat, thin moving bars and a 01/07 counter, ending on the big launch line.
  Example: /kinetic-type a product launch
