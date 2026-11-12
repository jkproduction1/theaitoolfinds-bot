# space25 prompts — DM for comment SPACE
Paste one into Claude Code (any recent Claude model). Each asks for a single HTML file (three.js + GLSL shaders, no external images except
public-domain NASA Blue Marble textures for Earth) that you can preview in the browser and render to a 9:16 mp4. It usually takes a few
rounds of feedback (brightness, camera, labels) to get to the look in the video: that's normal.

## /explain-3d how a neutron star spins
Make a 5-second 9:16 (1080x1920, 30 fps) three.js animation of a neutron star, close up, on a deep-space background with stars.
- A small, intensely bright blue-white sphere with a subtle surface texture and a soft glow (bloom, but never a blown-out frame).
- Thin glowing dipole magnetic field-line loops around it; the magnetic axis is tilted against the spin axis (thin line).
- Two narrow radio beams come out of the magnetic poles and sweep around like a lighthouse as it spins (shown slowed down).
- Slow continuous camera push-in. Headline "716 spins every second." (fastest known: ~716 per second). Labels with a dot:
  "About 12 km across – the size of a city", "1.4× the Sun's mass – squeezed into it", "Radio beams – sweep like a lighthouse · slowed".

## /zoom-in the surface of the Sun
Make a 5-second 9:16 fragment-shader animation: start on the whole Sun (limb darkening, soft glow around the disc), then one continuous
eased zoom (exponential, ~85x) into the surface until boiling granulation fills the frame: bright cells separated by thin dark lanes,
slowly churning (animated Worley noise with domain warp), a small sunspot passes on the way in.
- Headline "Each cell is the size of Texas." (NSF Inouye Solar Telescope). Labels: "Granules – hot plasma rising",
  "Dark lanes – cooler plasma sinking", "Surface – about 5,500 °C".

## /scale Jupiter's Great Red Spot versus Earth
Make a 5-second 9:16 three.js animation: a close-up of Jupiter's cloud bands (shader: cream/tan/brown bands that flow and curl, a big
brick-red oval storm that swirls, pale collar around it). Then a realistic Earth (NASA textures, clouds, thin blue atmosphere) slides in
and settles on top of the storm, TO SCALE: the spot is ~16,000 km wide (and shrinking, NASA Hubble), Earth 12,742 km.
- Slow pull-back. Headline "Wider than the whole Earth." Labels: "Great Red Spot – ~16,000 km wide, shrinking",
  "Earth – 12,742 km wide", "Jupiter – 11× wider than Earth".
