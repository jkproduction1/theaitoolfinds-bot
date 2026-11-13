# ocean30 prompts — DM for comment OCEAN
Made with Claude Opus 5.5. Paste one into Claude (or save as a Claude Code command, .claude/commands/<name>.md, "$ARGUMENTS" = your topic).
Each asks for a single HTML file (three.js, everything drawn in code, no external images) that you preview in the browser and render
to a 9:16 mp4. It usually takes a few rounds of feedback (camera framing, brightness, labels) to get to the look in the video: that's normal.

## /deep-dive a shipwreck 4 km down
Make a 5-second 9:16 (1080x1920, 30 fps) three.js animation of a dive to a shipwreck 4,000 m down.
- Near-black blue water with exponential fog, thousands of tiny drifting "marine snow" particles, two cold-white spotlights from the
  sub with faint visible light cones.
- One continuous camera move: start high in the dark water column, descend and glide in until a broken, rusting steel hull rises out
  of the dark on a dim sandy seabed (rust streaks, portholes, bent deck rails, a fallen mast, debris; a jagged broken end).
- A depth counter on the right climbs 3,200 → 4,000 m. Headline "4,000 m down: 400× the pressure." (+1 atmosphere every ~10 m, NOAA).
  Labels: "Total darkness – no sunlight below ~1,000 m", "About 400 atmospheres – +1 every 10 m down", "A steel wreck – slowly rusting away".

## /x-ray a giant squid
Make a 5-second 9:16 three.js "x-ray" animation of a giant squid hanging head-down in the dark.
- The body is translucent: additive fresnel-rim shader in cyan (mantle, fins, head, 8 arms and 2 much longer feeding tentacles with
  clubs that sway gently), with the insides glowing through: two huge eyes (warm white), the beak in the arm crown, pink gills, the pen.
- A glowing scan ring runs down the body once, brightening whatever it passes. Slow orbit + push-in on the eye.
- Headline "Its eye is as big as a dinner plate." (up to 10 in / ~25 cm, the largest eye of any animal, Smithsonian Ocean).
  Labels: "The biggest eye of any animal – up to 25 cm across", "Sharp beak – like a parrot's", "Two long feeding tentacles".

## /explain-3d how submarines survive the pressure
Make a 5-second 9:16 three.js explainer on a deep-blue studio background (HDRI reflections, soft bloom).
- A cut-open round metal pressure hull (a sphere with a quarter removed so you see the thick wall and a small seat inside).
- About 30 glowing arrows arrive from every direction and push on it evenly; the sphere holds.
- Then the camera tilts down to a thin, unbranded drinks can: the same arrows hit it and it crumples in an instant.
- Headline "A round hull spreads the squeeze evenly." Labels: "Water pushes in – from every side at once",
  "Round, thick metal hull – no weak corners", "A thin can – crushed in an instant".

Note: a few rounds of feedback are normal; tell Claude what to change and it redraws.
