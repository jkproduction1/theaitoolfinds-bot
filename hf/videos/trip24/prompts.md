# trip24 prompt — DM for comment TRIP
1. Open Claude and type your trip (e.g. "Prague → Tokyo, 9:16 flight-route animation").
2. Pick the model Claude Opus 5.5.
3. Paste:

Make a 9:16, 30 fps travel-map animation of my trip <CITY A> → <CITY B> as one HTML file (canvas + JavaScript), then render it to an mp4.
- Map: a 3D-looking globe (orthographic projection, d3-geo) with the REAL coastlines and country borders from Natural Earth
  (public domain; world-atlas countries-50m TopoJSON + topojson-client). Embed the data, no fetching at render time.
  Dark navy ocean with a soft radial light and limb darkening, warm sand-coloured land with a faint coast glow, thin borders,
  faint graticule, blue atmosphere glow, stars in the background. Highlight the start and the destination country.
- Route: the real great circle between the two cities (d3.geoInterpolate). A faint dotted line for the whole route, and a glowing
  orange trail with flowing dashes that draws itself behind a small white plane (draw the plane yourself, no logos).
- Cities: glowing dots with pulsing rings and rounded name labels.
- Camera: ONE continuous move with strong easy-ease (cubic-bezier .72,0,.28,1): start close over <CITY A>, pull back until you see
  the whole globe, follow the plane and descend on <CITY B>. North stays up. No cuts, no flashes, a slow drift so nothing stands still.
- End: a glass card linked to the destination with a thin line, "<CITY A> → <CITY B>" and the real great-circle distance
  (haversine, R = 6371 km) counting up like an odometer.
- Look: cinematic grade, vignette, fine grain.
Show me 6 stills first, then iterate with me on the motion before the final render.

Note: expect a few rounds of feedback (camera timing, label positions, how long the end card stays). That's normal.
