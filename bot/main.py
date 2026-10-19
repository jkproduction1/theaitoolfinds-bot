"""Run the whole pipeline once:  find tool -> research -> script -> screenshot -> voice -> video.

Usage:
  python -m bot.main                       # auto-pick a tool
  python -m bot.main --url https://x.ai    # make a video about a specific tool
"""
import argparse
import json
import re
import shutil
import traceback
from datetime import datetime, timezone

from . import capture, config, discover, motion, research, tts, writer


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40] or "tool"


def make_one(cand: dict) -> dict:
    site = research.fetch(cand["url"])
    if len(site["text"]) < 300 and not site["description"]:
        raise RuntimeError("website has too little text to describe it")
    print(f"[main] researching {site['url']}")

    script = writer.write_storyboard(cand, site)
    name = script["tool_name"]
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H%M")
    folder = config.OUT / f"{stamp}_{slug(name)}"
    work = folder / "_work"
    work.mkdir(parents=True, exist_ok=True)

    shot = capture.screenshot(site["url"], work / "screenshot.png")
    voice = work / "voice.mp3"
    words = tts.synthesize(script["script"], voice)
    vlen = tts.duration(voice)
    print(f"[main] voiceover {vlen:.1f}s, {len(words)} words")

    motion.build(script, site["url"], shot, voice, words, vlen, folder / "video.mp4", work)

    caption = script["caption"].strip() + "\n\n" + " ".join(script.get("hashtags", []))
    (folder / "caption.txt").write_text(caption, encoding="utf-8")
    meta = {**script, "url": site["url"], "domain": discover.domain_of(site["url"]),
            "source": cand["source"], "created": stamp, "duration": round(vlen, 1)}
    (folder / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    shutil.rmtree(work, ignore_errors=True)
    print(f"[main] DONE -> {folder}")
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="make a video about this exact tool")
    ap.add_argument("--count", type=int, default=1)
    args = ap.parse_args()

    if args.url:
        cands = [{"name": discover.domain_of(args.url), "url": args.url, "desc": "",
                  "source": "manual", "score": 0}]
        order = [0]
    else:
        cands = discover.candidates()
        if not cands:
            raise SystemExit("No candidates found")
        queued = [i for i, c in enumerate(cands) if c["source"] == "queue"]
        rest = [i for i, c in enumerate(cands) if c["source"] != "queue"]
        recent = [h["name"] for h in discover.load_history()]
        ranked = writer.rank([cands[i] for i in rest], recent) if rest else []
        order = queued + [rest[i] for i in ranked] + [i for i in rest[:15]]

    made, tried = 0, set()
    for i in order:
        if made >= args.count:
            break
        if i in tried:
            continue
        tried.add(i)
        c = cands[i]
        print(f"\n[main] trying: {c['name']} ({c['url']})")
        try:
            meta = make_one(c)
            remember(meta, c)
            made += 1
        except Exception as e:
            print(f"[main] skipped {c['name']}: {e}")
            traceback.print_exc(limit=1)
    if not made:
        raise SystemExit("Could not make any video")


if __name__ == "__main__":
    main()
