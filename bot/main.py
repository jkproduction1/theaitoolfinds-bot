"""Run the whole pipeline once:  find tool -> research -> script -> screenshot -> voice -> video.

Usage:
  python -m bot.main                       # auto-pick a tool
  python -m bot.main --url https://x.ai    # make a video about a specific tool
"""
import argparse
from pathlib import Path
import json
import re
import shutil
import traceback
from datetime import datetime, timezone

from . import capture, config, discover, media, motion, research, telegram, tts, writer


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40] or "tool"


def make_one(cand: dict) -> dict:
    site = research.fetch(cand["url"])
    if len(site["text"]) < 300 and not site["description"]:
        raise RuntimeError("website has too little text to describe it")
    print(f"[main] researching {site['url']}")

    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H%M")
    folder = config.OUT / f"{stamp}_{slug(cand['name'])}"
    work = folder / "_work"
    work.mkdir(parents=True, exist_ok=True)
    try:
        demo = media.find(site, work)
        if cand.get("storyboard"):  # written by Claude in chat instead of the API model
            script = json.loads(Path(cand["storyboard"]).read_text())
            script.setdefault("tool_name", script.get("name") or cand["name"])
            script.setdefault("script", " ".join(x["text"] for x in script["sentences"]))
            print(f"[main] using hand-written storyboard {cand['storyboard']}")
        else:
            script = writer.write_storyboard(cand, site, has_media=bool(demo))
        shot = capture.screenshot(site["url"], work / "screenshot.png")
        voice = work / "voice.mp3"
        words = tts.synthesize(script["script"], voice)
        vlen = tts.duration(voice)
        print(f"[main] voiceover {vlen:.1f}s, {len(words)} words")

        motion.build(script, site["url"], shot, voice, words, vlen, folder / "video.mp4",
                     work, demo=demo)

        caption = script["caption"].strip() + "\n\n" + " ".join(script.get("hashtags", []))
        (folder / "caption.txt").write_text(caption, encoding="utf-8")
        meta = {**script, "url": site["url"], "domain": discover.domain_of(site["url"]),
                "source": cand["source"], "created": stamp, "duration": round(vlen, 1),
                "demo": demo["url"] if demo else None}
        (folder / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    except Exception:
        shutil.rmtree(folder, ignore_errors=True)  # don't publish half-made folders
        raise
    shutil.rmtree(work, ignore_errors=True)
    print(f"[main] DONE -> {folder}")
    if telegram.enabled():
        try:
            telegram.send_for_approval(folder, meta, caption)
        except Exception as e:
            print(f"[telegram] failed: {e}")
    return meta


def remember(meta: dict, cand: dict):
    hist_path = config.DATA / "history.json"
    hist = discover.load_history()
    hist.append({"name": meta["tool_name"], "domain": meta["domain"],
                 "date": meta["created"], "source": meta["source"]})
    hist_path.write_text(json.dumps(hist, indent=2, ensure_ascii=False))
    if cand.get("queue_line"):  # remove used line from queue.txt
        q = config.DATA / "queue.txt"
        lines = q.read_text(encoding="utf-8").splitlines()
        q.write_text("\n".join(l for l in lines if l.strip() != cand["queue_line"]) + "\n",
                     encoding="utf-8")


CATS = ["video", "design", "coding", "github", "useful"]
ROT = config.DATA / "rotation.json"
PICKS = config.DATA / "picks.json"
MIN_SCORE = 7


def today_category(advance=False):
    st = json.loads(ROT.read_text()) if ROT.exists() else {"i": 0}
    cat = CATS[st["i"] % len(CATS)]
    if advance:
        st["i"] += 1
        ROT.write_text(json.dumps(st))
    return cat


def made_today() -> int:
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return sum(1 for h in discover.load_history() if str(h.get("date", "")).startswith(day))


def ranked_candidates(category: str):
    """Discovery + strict AI scoring. Returns (cands, [ranked dicts])."""
    cands = discover.candidates()
    queued = [i for i, c in enumerate(cands) if c["source"] == "queue"]
    per_src, rest = {}, []
    for i, c in enumerate(cands):  # best ~10 per source so no source dominates
        if c["source"] == "queue":
            continue
        per_src[c["source"]] = per_src.get(c["source"], 0) + 1
        if per_src[c["source"]] <= 10:
            rest.append(i)
    recent = [h["name"] for h in discover.load_history()]
    try:
        scored = writer.rank([cands[i] for i in rest], recent, category)
        ranked = [{**r, "index": rest[r["index"]]} for r in scored]
    except Exception as e:  # LLM down -> fall back to the discovery score order
        print(f"[main] ranking failed ({str(e)[:80]}), using score order")
        ranked = [{"index": i, "score": 7, "angle": "wow-demo", "why": ""} for i in rest[:8]]
    ranked = [{"index": i, "score": 10, "angle": "wow-demo", "why": "your queue"}
              for i in queued] + ranked
    for r in ranked:
        cands[r["index"]]["angle"] = r["angle"]
        cands[r["index"]]["ai_score"] = r["score"]
    print("[main] top picks:", " | ".join(
        f"{cands[r['index']]['name'][:30]} {r['score']:.0f} {r['angle']}" for r in ranked[:8]))
    return cands, ranked


def produce(cands, order, count) -> int:
    made, tried = 0, set()
    for i in order:
        if made >= count:
            break
        if i in tried:
            continue
        tried.add(i)
        c = cands[i]
        print(f"\n[main] trying: {c['name']} ({c['url']})  angle={c.get('angle')}")
        try:
            meta = make_one(c)
            remember(meta, c)
            made += 1
        except Exception as e:
            print(f"[main] skipped {c['name']}: {e}")
            traceback.print_exc(limit=1)
    return made


def send_pick_list():
    """Morning: send today's best candidates to Telegram, Jan taps which to make."""
    cat = today_category(advance=True)
    cands, ranked = ranked_candidates(cat)
    top = [r for r in ranked if r["score"] >= MIN_SCORE][:5]
    items = [{"name": cands[r["index"]]["name"], "url": cands[r["index"]]["url"],
              "desc": cands[r["index"]].get("desc", ""), "source": cands[r["index"]]["source"],
              "angle": r["angle"], "score": r["score"], "why": r["why"]} for r in top]
    PICKS.write_text(json.dumps({"date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                                 "category": cat, "items": items, "picked": []}, indent=2))
    if telegram.enabled():
        telegram.send_pick_list(cat, items)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="make a video about this exact tool")
    ap.add_argument("--count", type=int, default=1)
    ap.add_argument("--storyboard", help="jobs/<name>.json written by Claude (has url + name)")
    ap.add_argument("--pick-list", action="store_true", help="send today's candidates to Telegram")
    ap.add_argument("--fill", type=int, default=0,
                    help="auto mode: make videos only until N exist today")
    args = ap.parse_args()

    if args.pick_list:
        return send_pick_list()

    if args.storyboard:
        sb = json.loads(Path(args.storyboard).read_text())
        args.url = sb["url"]
    if args.url:
        picks = json.loads(PICKS.read_text()) if PICKS.exists() else {"items": []}
        known = next((p for p in picks.get("items", []) if p["url"] == args.url), {})
        cands = [{"name": known.get("name") or discover.domain_of(args.url), "url": args.url,
                  "desc": known.get("desc", ""), "source": known.get("source", "manual"),
                  "score": 0, "angle": known.get("angle", "wow-demo"),
                  "storyboard": args.storyboard}]
        if args.storyboard:
            cands[0]["name"] = sb.get("name") or cands[0]["name"]
        made = produce(cands, [0], 1)
    else:
        count = args.count
        if args.fill:
            count = max(0, args.fill - made_today())
            if not count:
                print(f"[main] already {made_today()} videos today, nothing to do")
                return
        # prefer today's morning list (things Jan did not pick yet), then fresh discovery
        picks = json.loads(PICKS.read_text()) if PICKS.exists() else {}
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        if picks.get("date") == today and picks.get("items"):
            done = {h["domain"] for h in discover.load_history()}
            cands = [dict(p, score=0) for p in picks["items"]
                     if discover.domain_of(p["url"]) not in done]
            made = produce(cands, list(range(len(cands))), count) if cands else 0
            count -= made
        else:
            made = 0
        if count > 0:
            cands, ranked = ranked_candidates(today_category())
            good = [r["index"] for r in ranked if r["score"] >= MIN_SCORE]
            made += produce(cands, good or [r["index"] for r in ranked[:3]], count)
    if not made:
        raise SystemExit("Could not make any video")


if __name__ == "__main__":
    main()
