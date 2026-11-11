# learnings.md: what works for @theaitoolfinds (rewrite on Wednesday + Sunday runs from data/stats.json)

Last update: 2026-11-11 (Wednesday run), stats pulled 2026-11-10; Nov posts mapped to videos via data/posted.json post_id.
Posts from 11-09/11-10 are only 1–2 days old (numbers still climbing). Watch time: data/retention.md is still EMPTY, so nothing
can be said about length vs. retention yet.

## The big change since Sunday
- **The App demo series went viral on both platforms.** earth8 = **513,871 IG views / 24,361 saves / 7,492 shares / 9,250 comments**
  (our best ever by ~4×). space7 = **165,156 TT + 164,178 IG** (first real TikTok hit: 8,872 likes, 6,780 saves, 860 comments).
  space14 ("the scariest things in space") = **40,494 TT + 40,212 IG**. inside3 kept climbing to 117,894 IG.
- **TikTok finally followed, but only for SPACE / EARTH.** The two TT hits are both space; all other App demos on TT stay 377–2,473
  (median 879). So it is the topic, not the format, that broke TT (guess, 2 data points, but consistent).
- On IG every App demo since 11-04 is 4.3k–514k; the median App demo (9.2k) beats every non-demo post we ever made except penguin10.

## Top / bottom 3 since 11-01 (views / likes / saves / shares / comments)
TikTok top: space7 165,156 / 8,872 / 6,780 / 621 / 860 · space14 40,494 / 1,668 / 1,204 / 92 / 218 · mystery17 2,473 / 105 / 57 / 7 / 31
(then build3 2,348, kitchen11 1,525, earth8 1,236).
TikTok bottom: tstack 162 · nature18 377 (1 day old) · visual3 384.
Instagram top: earth8 513,871 / 16,285 / 24,361 / 7,492 / 9,250 · space7 164,178 / 3,758 / 6,222 / 1,526 / 3,290 · inside3 117,894 / 2,056 / 4,741 / 1,421 / 1,181
(then space14 40,212, route3 39,032).
Instagram bottom: unslop 448 · claudemem 460 · hallmark 477 (all old Paper pain posts, 11-01/02).

## Hook / topic patterns
- **Winners are "what would happen" + space/Earth + fear/scale:** "…what would happen to Earth…" (earth8), "…animates space…" (space7),
  "…the scariest things in space" (space14). "What's inside anything" (inside3) is the non-space runner-up.
- Generic framing ("…how nature works" nature18 4.3k IG / 377 TT, "…like a motion designer" motion13 837 TT, "3D animation of anything")
  is clearly weaker than a concrete scary/curious object.
- Comments are ~1–2% of IG views on the hits (keyword DMs work at scale: 9,250 on earth8). TT comments now also come (860 on space7).
- Old TT pain hooks ("Purple gradients…?", "Vibe coded an app?") still do ~800–960 TT but ≤ 2.6k IG: not worth the slot any more.
- Sketch → Motion (sketch2): 3.9k IG / 524 TT on day 1 — below the App demo median; keep as occasional variety only.

## Formats
- **App demo = the engine on both platforms now.** 19 TT posts avg 11.7k (median 879); IG avg 63k (median 9.2k).
- Re-release test: planet21/planet21r (earth8 scenes, new voice, no music) and the result-first twins (styles20r, planet21r) have no
  numbers yet — compare on the next Sunday run.
- Tutorial format (§3e, gtamap22) starts today; no numbers yet.
- Length: all Nov videos 16–27 s; within that range dur_s shows no link to views (rho ~0 on both platforms). No retention data.

## Predictor (recalibrated 2026-11-11)
- Total score runs AGAINST views (Spearman TT −0.37 n=24, IG −0.70 n=21): App demos score low on hook/payoff and win anyway.
  Inside App demos only, visuals is the one feature tracking TT views (+0.42, n=14); hook ≈ 0.
- Change: weights hook 17→14, payoff 12→10, visuals 11→16; angle_prior app-demo 0.65→1.0 (best TT avg), relatable-pain 0.98,
  new-ability 0.72, fear 0.48, listicle 0.22, styles-list 0.71 (others kept). Details in hf/predict_weights.json "note".
- Treat the predictor as a checklist for flags, not a forecast: it still can't see the topic (space vs. kitchen), which is what mattered.

## Test next
- **More space / Earth / "what if" / "scariest" App demos** (black holes, impacts, volcanoes, deep ocean), at least 1 a day while it holds;
  vary objects, keep the concrete fear/curiosity word in the hook. Watch for fatigue: compare planet21 (re-release) with the originals.
- Bring the same fear/scale framing to body/inside topics ("the scariest thing inside your body"?) — guess, test once.
- Ask Jan again for 2–3 watch-time screenshots (earth8 IG, space7 TT, one weak demo) so length vs. retention can be judged.
- Tutorial: compare its first numbers with App demos of the same day before deciding how often.
- Research leads (2026-11-11 WebSearch, not verified; check sources before scripting):
  - "Opus 5.5 makes motion-design videos by writing a program that draws every frame" is still spreading (pasqualepillitteri.it in 10+
    languages, officechai "10 best examples" list). A tutorial or hook that says it outright is still timely.
  - "anything2explainer turns Claude into a motion-graphics film studio" (hermes-ai.net) and a Claude + Higgsfield MCP "Vox-style motion
    graphics" workflow (ai.joaoqueiros.com) are circulating: possible tutorial/App-demo topics (check repos/licences first).
  - Travel route / flight-path map animations remain a big evergreen reel format (Splice, Travel Animator, travelmap.video): fits the
    Tutorial format with a code-drawn globe.
  - Higgsfield released a virality predictor (creatorstoolbox newsletter); could cross-check our own predictor (paid credits: only if Jan taps).
- data/viral_inbox.md: empty this week.
