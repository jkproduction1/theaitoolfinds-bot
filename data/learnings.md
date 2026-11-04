# learnings.md: what works for @theaitoolfinds (rewrite on Wednesday + Sunday runs from data/stats.json)

Last update: 2026-11-04 (live with Jan), from 26 posts (2026-10-20 → 11-03). Still a small sample: leads, not laws.

## The big change
- **Since 2026-11-01 (retention structure + predictor) TikTok reach roughly doubled:** Nov 1–3 posts average ~630 TT views
  (8 of 9 above 390), Oct 20–30 averaged ~250. Part of it may be account growth; the jump is too big and too sudden to be only that.
- **Instagram finally moves on save-worthy posts:** Floorplan 2,198 IG views / 74 saves / 10 shares (best post ever),
  styles5 (App demo) 822 IG / 34 saves, pixelfx 379 IG / 12 saves / 6 shares. Before Nov IG was flat at ~100–260.
- Watch time / completion still not in the stats.

## Topics: winners (TikTok views / likes / saves; IG views)
1. Floorplan 858 / 31 / 19, IG 2,198: "Vibe coded an app? No idea how it works?" → a map of your own codebase.
2. Unslop 833 / 36 / 23, 10 comments: "Purple gradients, glows, emoji labels? Your app looks AI-made."
3. Claude-Mem 805 / 37 / 9: "Ever closed Claude Code and lost everything it learned?"
4. styles5 (App demo) 750 / 15 / 8, IG 822 / 34 saves: type a command → 5 animation styles, prompts in DM.
5. Hallmark 737 / 19 / 16: "One colored word in every headline? That's AI slop."
6. Opuscar2 685 / 27 / 20: "Your coding agent can now direct short films."
→ **Cluster that wins: pains of vibe coders / people building with Claude Code** — the AI-made look, not understanding
  your own app, lost context. Hook = a visible symptom the viewer recognises in their own work.

## Topics: losers
- tstack 66 TT: "Still babysitting your AI's pull requests? Theo's tstack…" (narrow dev workflow + a person's name).
- Listicles of commands (claude7 88, comfy5 158, codex6 283) and "free alternative to X" (OpenCode 88, REA 80, Orca 96,
  Concat 0 on TT) stay weak. CapCut/TikTok replacements: never on TikTok.
- Narrow groups (game devs: pixelfx 398 TT) do OK on IG (shares) but not great on TT.
- Mika (phone agent) 523 views but only 4 likes: surprise works for views, not for engagement.

## Hook patterns
- Works: a symptom list ("Purple gradients, glows, emoji labels?"), "Vibe coded an app? No idea how it works?",
  "Ever closed X and lost…", "can now" + surprising ability.
- Weak: "Paying for X? There's a free one.", "Most people use X like…", a creator's name in the hook.

## Formats
- **App demo with the voice "Type /… and you get this" = strongest IG post so far:** explain3d (/explain-3d, 3D explainers), Jan 11-04: 2,600 IG views + 38 likes within hours.
  Keep that voice line; amplify with before→after results and a faster rhythm (BRAIN §3b).
- App demo 1/3 (styles5): strongest IG saves after Floorplan. Keep 1 a day (Jan). dimdemo/explain3d/teardown/motion3d2 not in stats yet.
- Paper vs. old style: no style effect visible; topic + hook explain the differences.
- Predictor: it rated tstack 76 and mika 93 but they did worst/average; topic matters more than its craft checks.
  angle_prior recalibrated 2026-11-04 (see hf/predict_weights.json).

## Test next
- More vibe-coder pain topics (security, broken deploys, AI-looking UI, context loss) — 1 per day.
- App demo with prompts in DM: does the DM keyword bring comments? (styles5 only 1 TT comment so far.)
- Posting 4 a day (Jan's 20:00 extra on 11-04): check if it splits reach like 10-25.
