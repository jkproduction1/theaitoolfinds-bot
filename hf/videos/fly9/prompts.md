# fly9 prompts — DM for comment FLY
Save each as a Claude Code command (.claude/commands/<name>.md, "$ARGUMENTS" = your idea) or paste it directly.

/explain-3d — A 6-second vertical (9:16) 3D explainer of $ARGUMENTS, ONE self-contained HTML file with three.js and a deterministic
render(t). Clean studio look (soft white models, one key light, soft shadows), the camera slowly orbits, the mechanism is SHOWN with
moving parts / flow lines and 1–2 labels (bold name + short mono sub-line), one bold caption at the top with the key word in a highlight box.
E.g. a plane: air flows over a wing tilted into the airflow, the wing pushes air down, a big "Lift" arrow pushes the plane up. Textbook facts only.

/cutaway — A 9:16 3D cutaway of $ARGUMENTS (three.js, one HTML file, render(t), ~6 s): the object stands upright, its shell slices open
to show what's inside, parts light up one by one with leader-line labels in one column. E.g. a rocket: payload, liquid-oxygen tank,
fuel tank (e.g. kerosene), engines that burn both — caption "Most of a rocket is fuel." Real facts only.

/orbit — A 9:16 3D orbit animation of $ARGUMENTS (three.js, one HTML file, render(t), ~6 s): the planet pops in, an orbit ring draws
itself while the object flies one full lap and a clock counts the real time. E.g. the space station: ~400 km up, ~28,000 km/h, one lap
about every 90 minutes (NASA). Real numbers only.
