# uberad — the prompt Jan pastes on camera (Claude Code, desktop app, Code tab)

Build a 13-second vertical (1080x1920) spec ad for Uber, all in code: three.js for a rainy night city, HTML/CSS for the phone UI,
GSAP for the timeline. Story "3 %": a phone at 3 % battery in the rain at 1 a.m., you type "Home", the camera flies out of the
screen into the 3D city, a blue route lights up, the car arrives ("Driver is 2 min away", "Your ride is here"), one calm
continuous camera move rides along, you arrive ("You've arrived") and the screen dies at that exact moment. One second of
silence, then a clean end card with the name in plain text.
Palette: #0A0A0B night, #1C1D20 graphite, #F5F5F2 warm white, #276EF1 blue for route and UI, #FFB547 street lamps only,
#FF3B30 battery only. Inter Display, two weights. Expo-out arrivals, slow inOut camera, soft springs on notifications,
motion blur, wet asphalt reflections, rain in the lamp light. No logo: name as plain text + "Unofficial spec ad · not affiliated".
Expose window.setT(t) so every frame renders deterministically.

---
Generic version for the paid "3D Ad Kit" (no brand):
Build a 13-second vertical (1080x1920) cinematic app ad for <APP / CATEGORY>, all in code (three.js + HTML/CSS + GSAP).
Tell a tiny story with a payoff in the last 2 seconds: <PROBLEM MOMENT> → the app solves it → <QUIET PAYOFF>.
One continuous camera move, a locked 5-colour palette (<COLOURS>), one typeface, expo-out arrivals, soft springs on UI,
quiet SFX cues. End card: <NAME> in plain text + one-line tagline. Expose window.setT(t) for frame-accurate rendering.
