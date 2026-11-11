# gtamap22 prompt — DM for comment GTA
1. Open Claude and attach a reference image: a screenshot of the map look you like (satellite view, clouds, pin and label).
2. Pick the model Claude Fable 5.2.
3. Paste:

Make a 9:16, 30 fps map-transition animation in the look of my reference image (zoom out above the clouds, fly, zoom back in), as one HTML file (canvas + JavaScript, no external images), then
render it to an mp4.
- Route: start close over <CITY A>, pull back above the clouds, glide along the coast / islands and descend on <PLACE B>. Use the real
  coastline of the region (public-domain outline data) and draw everything else in code.
- Landscape (satellite look, drawn per pixel with noise): relief with hill shading, fields, wetlands, a street grid for towns, beaches;
  water coloured by distance from the shore (deep navy → blue → turquoise → pale sand banks), small waves and sun glints.
- Clouds: three separate layers at different heights, soft edges, shadows on the ground; each layer has its own wind and scales by its
  height so it rushes past when the camera climbs or dives through it (real parallax). A few small clouds over the destination.
- Camera: tilted perspective (oblique near the ground, almost top-down at the top). ONE continuous move with strong easy-ease
  (cubic-bezier .72,0,.28,1), no cuts, no flashes; zoom starts earlier and ends later than the pan; motion blur from 6 sub-frames;
  slow drift after landing so nothing ever stands still.
- UI: place names painted on the map next to a glowing dot with pulsing rings; a glowing route with flowing dashes that draws itself
  along the road; at the end a glass card with the real distance and drive time, linked to the dot by a thin line.
- Look: dark, cinematic grade (deep blue multiply, far haze, vignette, fine grain).
Show me 8 stills first, then iterate with me on the motion before the final render.

Note: it took a few rounds of feedback to get to the result in the video (terrain detail, cloud edges, easing). Expect to iterate.
