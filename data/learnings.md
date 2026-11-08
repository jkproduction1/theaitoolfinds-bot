# learnings.md: what works for @theaitoolfinds (rewrite on Wednesday + Sunday runs from data/stats.json)

Last update: 2026-11-08 (Sunday run), from 35 videos (2026-10-20 → 11-07; stats pulled 11-07, so route3 is only hours old
and inside3 ~1 day). Small sample: leads, not laws. Watch time: data/retention.md is still empty.

## The big change
- **Instagram exploded on App demos.** All 7 "Type one command…" 3D demos since 11-03 did 3.8k–72k IG views, against a
  2.3k ceiling for everything else (Floorplan). inside3 = **71,596 IG / 2,747 saves / 789 shares / 588 comments**
  (~20× our previous best). route3 = 12,937 IG / 440 saves / 85 comments within hours: a real IG hit (confirmed), 3rd by views
  and still climbing. Save rate on these is ~3–4% of views (Floorplan 3.2%), comments are mostly the DM keyword.
- **TikTok did not follow.** App demos average 495 TT views (9 posts); the first three were ~800 (explain3d 843,
  styles5 811, motion3dv 798), the last six all 285–438. Relatable-pain posts average 767 TT (5 posts).
  Guess: repeated near-identical "Type one command" hooks are wearing out on TT; age of the newest posts is part of it.
- So the two platforms now want different things: IG rewards the App demo series, TT still rewards a vibe-coder pain hook.

## Top / bottom 3 (views / likes / saves / shares / comments)
TikTok top: unslop 901 / 38 / 24 / 1 / 10 · floorplan 866 / 31 / 19 / 2 / 2 · opuscar2 845 / 28 / 22 / 1 / 2 (explain3d 843 just behind).
TikTok bottom: rea 80 · opencode 88 · claude7 89 (all 10-24, old style). Since 11-01: tstack 153, route3 285, mega3 296.
Instagram top: inside3 71,596 / 1,071 / 2,747 / 789 / 588 · mega3 13,064 / 146 / 436 / 83 / 81 · route3 12,937 / 181 / 440 / 93 / 85.
Instagram bottom: claudemem 100 · claudeseo 109 · ponytail 110 (claudemem was #4 on TT: no overlap between platforms).

## Hook patterns
- IG winner: "Type one command and Claude shows you what's inside anything." (inside3). The 3 biggest IG posts all
  start with "Type one command" + a concrete result; inside3's "what's inside anything" beat "a 3D animation of anything" (mega3, scale3) by 5×.
  Guess: curiosity about the object beats the word "3D animation".
- TT winners still: a symptom the viewer recognises ("Purple gradients, glows, emoji labels?", "Vibe coded an app? No idea how it works?",
  "Ever closed Claude Code and lost…") and "can now" + surprising ability (opuscar2).
- Weak everywhere: "Paying for X? There's a free one.", "Most people use X like…", listicles, a person's name (tstack).

## Formats
- **App demo ("Type /<command>… and you get this") = our IG engine**: 9 posts, IG avg ~15.6k (median ~8.7k, 8 with IG data), TT avg 495.
  Keep 3 a day (Jan, 11-07). Comment-keyword + DM prompts works on IG (15–588 comments), not on TT (0–2).
- Paper / AI-tool videos: none since 11-04; last ones did 300–900 TT and 260–2.3k IG.
- Length vs. watch time: no retention data yet. All Nov videos were 19–27 s; no visible length effect on views inside that range.
- Predictor: total score barely tracks TT views (rho 0.19, 16 Nov posts) and runs opposite on IG. Hook score showed nothing.
  Recalibrated 2026-11-08 (app-demo prior 0.95 → 0.65 because it is TT-based; hook 20 → 17, visuals 8 → 11). See hf/predict_weights.json.

## Test next
- Keep the "inside / what's inside anything" object-curiosity framing for App demos (inside3 is the outlier to copy), vary objects.
- TT: give App demos a pain-style first line instead of the identical "Type one command…" (e.g. "Can't explain how X works?
  Type one command…"). Compare TT views vs. the last six (285–438).
- Ask Jan for 2–3 retention screenshots (inside3 IG, route3 TT) so length vs. watch time can finally be judged.
- Research leads (2026-11-08 WebSearch, not verified yet; check README before scripting):
  - "Claude Opus 5.5 makes motion-design videos by writing a program that draws every frame" is being covered in 6+ languages
    (pasqualepillitteri.it). Test a hook that says it outright: "No video model. Claude writes the code for every frame."
  - HyperFrames (heygen-com/hyperframes) and remotion-dev/skills are installable Claude skills with slash workflows
    (/pr-to-video, /faceless-explainer, /product-launch-video; roo.beehiiv.com, 10-11). Good fit for an App demo: "Type /pr-to-video…".
  - Revid keeps a ranking of the 64 most-liked Opus 5.5 motion-graphics videos: skim it for formats/objects before the next week.
  - Viral 3D health/anatomy explainers (viralpromptslab, "Viral 3D Health Videos") match inside3's pattern: guess, test
    "what's inside the heart / an engine / a phone" demos.
- data/viral_inbox.md: empty this week.
