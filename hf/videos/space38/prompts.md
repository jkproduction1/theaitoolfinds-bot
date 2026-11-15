# space38 prompts — DM for comment STAR
Made with Claude Opus 5.5. Paste one into Claude Code (or save it as a command in .claude/commands/<name>.md). Each asks for a single
HTML file (three.js + GLSL shaders, everything drawn in code, no external images) that you can preview in the browser and render to a
9:16 mp4. It usually takes a few rounds of feedback (camera, brightness, label positions) to get to the look in the video: that's normal.

## /explain-3d a black hole eating a star
Make a 4-second 9:16 (1080x1920, 30 fps) three.js animation, not to scale and time-lapsed, of a tidal disruption event.
- Center: a black sphere (the black hole) with a thin bright photon ring and a faint accretion disk (swirling fbm shader, white-hot inside,
  orange outside, brighter on the approaching side, additive blending + bloom).
- A glowing Sun-like star (granulation shader) falls in on an inward spiral. From ~0.7 s the tides stretch it along the direction to the
  hole ("spaghettification"), then it turns into a long stream of ~2,500 glowing particles that wraps around the hole.
- The stream feeds the disk: the disk brightens from the outside in as the debris arrives.
- Slow camera push-in from above the disk plane. Headline "It stretches the star like spaghetti." Labels: "Black hole", "Tidal stream –
  the star, stretched thin", "Hot disk – debris glowing as it falls". (NASA: a tidal disruption event; part of the debris forms a disk.)

## /x-ray Venus under its acid clouds
Make a 4-second 9:16 three.js animation of Venus on a dark star field: a pale yellow, streaky cloud deck lit from one side.
- An x-ray scan line sweeps down the planet; everything above the line turns the clouds see-through and reveals the surface underneath:
  dark basalt plains with glowing orange lava channels and volcanic hot spots under a warm orange haze.
- Slow orbit and push-in. Headline "Under the clouds: 475 °C." Labels: "Acid clouds – sulfuric acid droplets", "Crushing air – ~90×
  Earth's pressure", "Volcanic surface – hot enough to melt lead". (NASA: ~900 °F / 475 °C, ~90 times Earth's surface pressure.)

## /scale a magnetar versus Manhattan
Make a 4-second 9:16 three.js animation at true scale (1 unit = 1 km), at night.
- Left: a magnetar, a 20 km-wide glowing blue-white sphere resting on dark water, with violet dipole magnetic field lines around it and a
  blue glow on the water.
- Right: a long, narrow island city 21.6 km long and ~3.6 km wide (generic outline, a street grid of instanced boxes with tiny warm window
  lights, taller clusters in two places).
- Orange scale bars grow along the island (21.6 km) and under the star (20 km). Camera starts close on the star and pulls back until both
  are side by side. Headline "A dead star the size of Manhattan." Labels: "Magnetar – ~20 km across", "Manhattan – ~21.6 km long",
  "Magnetic field – strongest known in the universe".
