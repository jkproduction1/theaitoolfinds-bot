# Spec-ad references (Jan, 2026-11-07) — what makes them smooth. Read before every 3D/UI spec ad (BRAIN §3d).
Jan: we do NOT want to look like these. We have our own style; use this file only to remember WHY they feel smooth.

## The 5 references (frames studied at ~2 fps)
1. **Duolingo spec ad (12 s).** Solid brand-green background the whole time. Left column: kinetic type, the VO appears word
   by word, the key word sits in a coloured pill ("a day", "lesson", "streak", "chest", "league"). Right: ONE hero object
   that keeps morphing into the next idea (timer ring counts 1→5 min → check mark → +10 XP → streak flame 57 → chest →
   leaderboard card → video-call card). End: the hero object expands as a circle wipe into a white end card, tagline types on.
2. **WhatsApp "ticks" (14 s).** Story = the journey of one message: "Happy birthday, Mom" sent → camera pulls out of the
   phone onto a flat world map → dashed line crosses the ocean ("almost 6,000 km") → lands on her lock screen at 12:00 →
   "Two ticks… two blue ticks" → logo. One continuous camera, palette shifts teal → night navy, captions under the action.
3. **Lovart (29 s).** Dark space with floating, tilted 3D UI panels; the camera glides through layers; big white type beats
   ("Memory.", "Every week.") with speed lines; one acid-green glow accent; posts/cards fan out and stack; end on a pill CTA.
4. **Apple Watch (22 s).** Explainer journey: watch on wrist → dive into the skin → green LEDs flash → inside a blood vessel
   (labelled) → back out to the ECG line → heart icon. Captions word by word, key word highlighted. Continuous camera.
5. **Sendra courier (10 s).** Clean white map UI + one blue accent. Headline card "It has to be there today." (blue keyword),
   route draws on the map, tracking card counts 4→1→0 like an odometer, signature card draws the signature stroke by stroke,
   logo slides in, slider "Across town, within the hour" with a live counter.

## Principles that make them feel premium
- **One world, one camera.** Few or no hard cuts: the camera travels through one canvas/map/space. When there IS a cut it is a
  match (same shape, same place on screen, same motion direction).
- **Object continuity.** One hero element morphs into the next state instead of being replaced (ring → check → flame → card).
- **Story = the product's core mechanic as a tiny journey** (a message travels, a parcel arrives, a lesson becomes a streak,
  light reads blood). Simple, no melodrama.
- **Kinetic typography synced to the VO,** word by word; exactly one key word per line in an accent pill/colour.
- **One background colour per section + one accent.** Brand colour or black/white; never busy.
- **Numbers move** (odometer counters, timers, distances); strokes draw on (lines, check marks, signatures).
- **UI is real-product quality:** rounded cards, soft 2-layer shadows, slight 3D tilt and depth layering, nothing generic.
- **End reveal grows out of the hero object** (circle wipe / zoom through), tagline types on, small CTA.
- 10–15 s is the sweet spot; steady VO rhythm, 2–3 words per beat; text never cropped, generous margins.

## Learnings from Luca's (DrillUp) public guide "How I made the Clawd skill video" (Jan sent it, 2026-11-07)
- **Open with a feeling/moment, not the product or logo.** The logo moment is when people scroll away.
- **Exactly 3 named colours** and where each goes; never let the model pick new colours per scene.
- **Every scene has a job** (problem → proof → twist → answer → build-up → rules → end). Plan per scene: start second,
  what moves, what the viewer should feel. A scene without a job goes.
- **One continuous camera, no cuts**; every move starts and stops softly like a real camera.
- **Sound is written down per event**: which sound, how loud, why. The model can't hear the video, so the plan must say it.
- **No slow outro.** End with one short CTA right after the message and stop (retention: a 5 s dead ending on a 16 s
  video means < 70 % watched → less reach).
- His per-video prompt is ~3,000 words (every colour, timing, camera path, sound, checks); the reusable rules live in a
  skill file Claude loads once. Business: free in-browser test → paid prompts + skill.
