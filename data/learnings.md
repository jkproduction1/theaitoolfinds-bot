# learnings.md: what works for @theaitoolfinds (rewrite on Wednesday + Sunday runs from data/stats.json)

Last update: 2026-11-22 (Sunday run), stats pulled 2026-11-21. **Instagram decides (Jan, 2026-11-18); TikTok only briefly.**
Posts mapped by name / data/posted.json post_id; IG story entries (no hook, ~400-700 views) are excluded.
Not in stats yet: everything released 11-20 and later except styles60/inside59 (earth61, styles62, inside63, usa64, earth65-67).
Several IG posts have no IG row (inside49, styles47, inside53, versus56, heist32, asteroid24) -> unknown, not zero.
Watch time: data/retention.md is still EMPTY -> nothing about length vs. retention. Ask Jan for screenshots again.

## Instagram, since 11-01 (views / saves)
- Top 3: earth8 874,145 / 41,932 · space7 188,722 / 7,109 · styles33 147,793 / 8,222 (then inside3 135,428, storm45 98,963).
- Bottom 3: hallmark 804 · claudemem 878 · unslop 878 (old Paper pain posts, 11-01/02).
- Last 7 days (posted 11-15..11-21): top storm45 98,963 · styles44 98,516 · styles48 91,632; bottom styles42 5,274 ·
  mystery52 14,954 · styles60 15,958. Targets from §3b: >=30k OK, <10k flop -> only styles42 is a flop.
- App demo / "Type it, get it" IG: n=29, avg 73,289, **median 19,842**. Every other angle has median <= 1,534 (new-ability n=4,
  relatable-pain n=5 878) except penguin10 (styles-list) 16,564. The format decides, the topic second.

## The finding of the week: the CAPTION's first line (guess, but a strong one)
- All 4 IG posts >= 60k this week opened the caption with the promise line **"Type one command and Claude [verb] ..."**
  (styles37 61k, storm45 99k, styles44 99k, styles48 92k).
- Since the unique-caption rule (11-17), captions list the three topics ("Why is ice slippery? Why does popcorn pop? ...",
  "How do bees make honey, ...") and land at 15-28k: around51 16k, mystery52 15k, honey54 28k, earth58 20k, styles60 16k, inside59 18k.
- Same-day pair 11-17: styles48 (promise line) 91,632 vs around51 (topic list) 16,278. Same format, same styles family.
- Caveats: newer posts are younger (1-4 days vs 5-6), styles42 (11-15, caption started "Comment FABLE...") did 5,274, and the
  reach of the whole account may simply be cooling. n is small -> **test, don't conclude**.
- Rule to keep: never an identical caption (Jan). Test: keep the PROMISE structure, vary the wording each time
  ("Type one command and Claude opens up anything in 3D", "One command, and Claude turns a question into a film" ...), topics after it.

## PROMPTS vs SYSTEM (mix v7 since 11-19)
- In stats so far: PROMPTS earth58 19,842 + inside59 17,892 vs SYSTEM styles60 15,958 (IG, 1-2 days old). Same range -> the
  system CTA does not obviously cost views. Sales per 100 DMs per slot are not in stats.json (need Gumroad utm_content + Zernio DMs).
  **No conclusion yet; judge after 7 days (11-25) as BRAIN says.**

## Hooks / topics (IG)
- Winners: big global curiosity - Earth what-ifs (earth8), space (space7), what's inside (inside3), famous explainer styles
  (styles33/44/48), nature at its most dangerous (storm45). Danger/scale words + one strong promise.
- Weaker: cute/soft everyday questions (around51 popcorn/ice 16k, honey54 bees 28k), a single mystery story (mystery52 15k).
- Voice line "Type slash <command> <topic>... and you get this" is identical on hits and misses -> it is the engine, not the differentiator.
- Predictor on IG App demos (n=24, Spearman vs views): topic +0.28, hook_words +0.45, visuals -0.32, length -0.13, total score +0.09.

## TikTok (brief, does not decide anything)
- Top: space7 365,876 · space14 65,300 · styles28 5,515 (mystery17 5,113). Bottom: tstack 165 · inside53 302 · honey54 321.
- App demo TT median 893 (n=37); everything since 11-15 sits 300-970. TT keeps getting the same posts, no own tests (Jan, 11-18).

## Length
- All mapped videos 12.8-34 s. Spearman dur_s vs views: IG App demos +0.03 (n=24), TT App demos -0.19 (n=30) -> no link in this range.

## Older findings, condensed (kept for reference)
- Explainer-style series has the best IG save rate (5.6-6.3% on styles19/28/33); comments 1-2% of views = keyword DMs work at scale.
- Result-first twins (styles19r, planet21r): 1-1, inconclusive; prompt-first is the rule now (Jan 11-12).
- Tutorials (trip24 10k IG, gtamap22 ~3k): below App demos; format inactive since mix v5/v7.
- Paper "pain" posts and generic framing (nature18 9.8k, motion13) stay weak.
- Research leads from 11-15 (unverified): talking-object explainers, crowded Claude prompt-pack niche, Claude Code rule against
  recreating specific games. 2026-11-22: no new web research pass this run (time went to the 3 videos); data/viral_inbox.md not read for new links.

## Test next
1. Caption promise line ("Type one command and Claude ..." in new wording each time) on all 3 posts for 3-4 days; compare IG views
   at the same age with the topic-list captions of 11-17..11-21.
2. Keep reach topics (Earth, space, danger, what's inside) on 08:00 PROMPTS; avoid soft cute topics there.
3. PROMPTS vs SYSTEM: on 11-25 compare views per slot + paid sales per 100 DMs (Gumroad utm_content).
4. Ask Jan for watch-time screenshots (one hit, one 15k post) -> data/retention.md.

## Predictor recalibration log
- 2026-11-22 (Sun): **IG-first** (Jan 11-18), so angle_prior now from IG medians (stats 11-21), same median blend as before
  (0.5*old + 0.5*median/app-demo median 19,842; the strict avg rule would zero everything behind earth8):
  app-demo 1.0 (avg 73,289 / med 19,842, n=29), styles-list 0.83 (16,564, n=1, =), relatable-pain 0.96->0.50 (878, n=5),
  new-ability 0.78->0.43 (1,534, n=4), fear 0.48->0.28 (1,527, n=1), listicle 0.20->0.13 (1,194, n=1); news/alternative/pain-command
  no IG data, kept. Weights: topic 30->33, hook 12->11, visuals 18->16 (IG App demos: topic +0.28, hook -0.29, visuals -0.32; sum 100).
  Total score vs IG views: all posts -0.05 (n=43), App demos +0.09 (n=24) -> still a checklist, not a forecast.
- Earlier: 11-15 hook 14->12, payoff 10->9, visuals 16->18, length 12->13 (TikTok-based); 11-11 hook 17->14, payoff 12->10,
  visuals 11->16; 11-08 app-demo 0.95->0.65, hook 20->17, visuals 8->11; 11-04 first calibration. Details: hf/predict_weights.json "note".

## 2026-11-16 Viral Styles Launchpad (Gumroad) — state and next steps
- Product live: https://theaitoolfinds.gumroad.com/l/viral-styles-launchpad ($29, code LAUNCH auto-applied = $19 for the first 50). Files: Installation-Guide.html, viral-styles.zip, bonus.zip.
- DM funnel: comment keyword → DM with a prompts PDF on Google Drive (medium-length prompts + offer block for the system). Done for EARTH, SPACE, FABLE (styles 3), INSIDE, COSMOS and STYLES (styles44, "Type it, get it #37"). Links live in data/dm_links.json.
- To change the link of existing auto-DMs: edit data/dm_links.json (key = exact automation name "<tool> (<KEYWORD>)"), then dispatch post-approved.yml with autodm="seturl dry", read logs/autodm.log, then "seturl apply". Many posts share one tool name, so always dry-run first. Already-sent DMs keep their old link.
- Problem: Drive PDFs do not load in Instagram's in-app browser (also not with /preview). Jan's plan for the next session: a free "prompts" product page on Gumroad (custom HTML page, copy buttons, offer block) that also collects emails, then email marketing. Draft product exists: /l/free-prompts (unpublished).
- Keyword clash: STYLES is used by three automations and STYLE by two; comments are bound to their post, but story replies / DMs can match any of them. Pick unused keywords for new videos.
- Buyer pack sources are NOT in this repo (they were built in a session workspace). Ask Jan before rebuilding.
- 2026-11-16 (later): free prompts page for Gumroad product `luszgi` (/l/free-prompts) is built (file sent to Jan, he publishes it with the Gumroad CLI). It shows the exact prompts of one video when the link carries `?v=<video folder name>` (table of 48 videos is embedded) or, for new videos with no page update, `?c=<style>|<style>|<style>&t=<topic>|<topic>|<topic>` (style keys: paper-collage, flat-science, painted-story, what-if, deep-dive, scale, explain-3d, x-ray, zoom-in, explode, time-lapse, how-its-made …). Ready-made links per automation: data/dm_links_page.json (NOT applied yet; apply with `seturl` only after Jan confirms the page loads from Instagram and the parameter survives). "Get the system" second DM button is on 35 own automations (`setdm`, data/dm_system.json); new posts get it only after a `setdm apply` run.
