# world34 prompts — DM for comment WORLD
Made with Claude Opus 5.5. Paste one into Claude Code (or save it as a command in .claude/commands/<name>.md). Each asks for a single
HTML file (three.js + GLSL shaders, everything drawn in code, no external images except optional public-domain NASA Earth textures) that
you can preview in the browser and render to a 9:16 mp4. It usually takes a few rounds of feedback (camera, brightness, label positions)
to get to the look in the video: that's normal.

## /simulate Earth with two suns
Make a 4-second 9:16 (1080x1920, 30 fps) three.js "what if" animation of Earth orbiting two suns, not to scale.
- Lower right: a big real-looking Earth (day texture, clouds, city lights on the night side, thin atmosphere rim).
- Upper left: two glowing suns slowly orbiting each other: a bigger warm-yellow one and a smaller orange-red one (additive glow sprites + bloom).
- Light Earth with BOTH suns in a custom shader, so each sun makes its own terminator: two coloured sunset bands and a two-tone atmosphere rim.
- Slow eased camera arc and push-in, never static. Headline "Kepler-16b really has two suns." (NASA Kepler, 2011).
  Labels: "Sun #1 – yellow, like ours", "Sun #2 – smaller, orange-red", "Two sunsets a day – and two shadows".

## /what-if the oceans drained
Make a 4-second 9:16 three.js animation of Earth seen over the Atlantic while the oceans drain.
- Real Earth texture; detect the ocean by colour and estimate depth from the distance to the coast.
- The water level drops: the shallow continental shelves dry first, the deep basins last; a soft wet sheen follows the waterline.
- The revealed seafloor: sandy shelves, dark abyssal plains with relief shading, and the Mid-Atlantic Ridge rising along the middle with a
  thin glowing rift and faint transform faults. Clouds fade out as the water goes.
- Slow pull-back. Headline "Underneath: a 65,000 km mountain range." (NOAA: the mid-ocean ridge is the longest mountain range on Earth).
  Labels: "Continental shelf", "Mid-Atlantic Ridge – part of the 65,000 km chain", "Abyssal plain".

## /scale Mauna Kea versus Everest
Make a 4-second 9:16 three.js cut-away to scale (1 unit = 1 km, vertical true scale) of Mauna Kea next to Everest.
- A 3D terrain block cut through both summits: Mauna Kea rising ~6,000 m from the sea floor to sea level and 4,205 m above it;
  a continent on the right with Everest at 8,848 m. Strata on the cut face, translucent blue water, a bright sea-level line.
- Start close on Mauna Kea's summit poking out of the sea, then the water clears and the camera pulls back to show the hidden part.
- Height bars grow from each base with odometer numbers: "Mauna Kea 10,211 m" (orange) and "Everest 8,848 m" (white). (USGS)
- Headline "10,211 m from its base. Everest: 8,848 m." Label "Sea level – most of Mauna Kea is below it".
