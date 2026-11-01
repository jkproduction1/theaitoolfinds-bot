"""Our own retention predictor (v1, rules + weights that the learning loop recalibrates).

python3 hf/predict.py <name>            -> score 0-100, flags, and a row in data/predictions.json
python3 hf/predict.py --script <name>   -> same, from script.txt only (before voicing / rendering)

It scores what keeps people watching short videos, measured on our own files:
  hook      first sentence short, concrete (number / "you" / pain or surprise), lands in ~2 s
  payoff    tool named by ~3.5 s
  pace      words per second in a comfortable band; total length in the 18-30 s sweet spot
  filler    setup / licence / hosting words after the payoff (things viewers don't miss)
  visuals   longest stretch without a visual change (from the render, ffmpeg scene detection)
  ending    video ends soon after the CTA
Weights live in hf/predict_weights.json. On Sunday runs BRAIN.md step 0 compares data/predictions.json with
data/stats.json (TikTok views, completion / watch time when available) and nudges the weights; keep a note of
every change in data/learnings.md. With few videos this is a checklist with numbers, not a proven model.
"""
import json, re, subprocess, sys
from datetime import datetime
from pathlib import Path

H = Path(__file__).resolve().parent
ROOT = H.parent
WEIGHTS = H / "predict_weights.json"
OUT = ROOT / "data" / "predictions.json"
DEFAULT_W = {"topic": 30, "hook": 25, "payoff": 15, "pace": 10, "length": 15, "filler": 15, "visuals": 15, "ending": 5}

NUM = re.compile(r"\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|hundred|thousand|million)\b", re.I)
PAIN = re.compile(r"\b(paying|pay|still|tired|lost|forget|forgets|slow|waste|worried|stuck|broke|hate|never|every time|same|missed|ever)\b", re.I)
SURPRISE = re.compile(r"\b(can now|now|free|secret|nobody|most people|without|instead|only)\b", re.I)
FILLER = re.compile(r"\b(licen[cs]e|mit|apache|agpl|gpl|self-?host(ed)?|docker|node|npm|install(ed|s)?|setup|set up|"
                    r"configure|api key|dashboard|repository|repo|github|version|beta|also)\b", re.I)
BANNED = re.compile(r"\b(revolutionary|game-?changer|unlock|supercharge|seamless|delve)\b", re.I)


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def sentences(tokens):
    out, cur = [], []
    for i, t in enumerate(tokens):
        cur.append(i)
        if re.search(r"[.?!]$", t):
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    return out


def scene_gaps(mp4, dur, fps=4, thr=2.0):
    """Longest stretch where the picture barely changes (mean abs difference of small grey frames < thr)."""
    try:
        import numpy as np
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", f"fps={fps},scale=108:192,format=gray",
                              "-f", "rawvideo", "-"], capture_output=True, timeout=600).stdout
        fr = np.frombuffer(raw, np.uint8).reshape(-1, 192, 108).astype(np.float32)
    except Exception:
        return None, None
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    still, best, changes = 0, 0, int((d >= thr).sum())
    for x in d:
        still = still + 1 if x < thr else 0
        best = max(best, still)
    return round(best / fps, 2), changes


def predict(name, script_only=False):
    vdir = H / "videos" / name
    tokens = (vdir / "script.txt").read_text().split()
    post = json.loads((vdir / "post.json").read_text()) if (vdir / "post.json").exists() else {}
    vj = H / "work" / name / "assets" / "voice.json"
    words = json.loads(vj.read_text()) if (vj.exists() and not script_only) else None
    if words and len(words) != len(tokens):
        words = None
    # timings: real voice timings, else ~2.6 words/s estimate
    S = [w["start"] for w in words] if words else [i / 2.6 for i in range(len(tokens))]
    E = [w["end"] for w in words] if words else [(i + 1) / 2.6 for i in range(len(tokens))]
    dur = E[-1] + 1.6
    sents = sentences(tokens)
    hook = sents[0]
    hook_txt = " ".join(tokens[i] for i in hook)
    hook_end = E[hook[-1]]
    F, flags = {}, []

    # hook
    h = 0.35 * clamp((14 - len(hook)) / 8) + 0.25 * clamp((3.2 - hook_end) / 1.6)
    h += 0.15 * bool(NUM.search(hook_txt)) + 0.1 * bool(re.search(r"\byou(r)?\b", hook_txt, re.I))
    h += 0.15 * bool(PAIN.search(hook_txt) or SURPRISE.search(hook_txt))
    F["hook"] = round(clamp(h), 2)
    F["hook_words"], F["hook_end_s"] = len(hook), round(hook_end, 2)
    if len(hook) > 12: flags.append(f"hook má {len(hook)} slov (cíl ≤10)")
    if hook_end > 3.0: flags.append(f"hook končí v {hook_end:.1f} s (cíl ≤2,5 s)")

    # payoff: first time the tool name is spoken
    tool = (post.get("tool_name") or "").lower().split()
    t_tool = None
    norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
    if tool:
        key = norm("".join(tool))
        for i in range(len(tokens)):
            joined = ""
            for j in range(i, min(i + 4, len(tokens))):
                joined += norm(tokens[j])
                if joined == key or (len(key) >= 4 and joined.startswith(key)):
                    t_tool = S[i]; break
                if not key.startswith(joined):
                    break
            if t_tool is not None:
                break
    F["tool_named_s"] = round(t_tool, 2) if t_tool is not None else None
    F["payoff"] = round(clamp((6.0 - t_tool) / 2.5) if t_tool is not None else 0.5, 2)
    if t_tool is not None and t_tool > 4.0: flags.append(f"nástroj zazní až v {t_tool:.1f} s (cíl ≤3,5 s)")

    # pace + length
    speech = E[-1] - S[0]
    wps = len(tokens) / max(speech, 1)
    F["wps"], F["dur_s"], F["words"] = round(wps, 2), round(dur, 1), len(tokens)
    F["pace"] = round(clamp(1 - abs(wps - 2.9) / 1.2), 2)
    F["length"] = round(1.0 if 18 <= dur <= 30 else clamp(1 - (dur - 30) / 12) if dur > 30 else clamp(1 - (18 - dur) / 8), 2)
    if dur > 30: flags.append(f"video má {dur:.0f} s (cíl 18–30 s)")

    # filler after the payoff
    pay_i = next((i for i, s in enumerate(S) if s >= (t_tool or 3.0)), 0)
    body = " ".join(tokens[pay_i:])
    n_fill = len(FILLER.findall(body))
    F["filler_hits"] = n_fill
    F["filler"] = round(clamp(1 - n_fill / 5), 2)
    if n_fill >= 3: flags.append(f"{n_fill}× výplň (licence/instalace/hosting…): škrtnout, co divák nepotřebuje")
    if BANNED.search(" ".join(tokens)): flags.append("zakázané slovo (revolutionary/unlock/…)")

    # visuals (needs the render)
    mp4 = H / "work" / name / "renders" / "final.mp4"
    if mp4.exists() and not script_only:
        gap, n = scene_gaps(mp4, dur)
        F["longest_static_s"], F["visual_changes"] = gap, n
        F["visuals"] = round(clamp((5.0 - gap) / 2.5), 2) if gap is not None else 0.5
        if gap and gap > 3.5: flags.append(f"{gap:.1f} s bez změny obrazu (cíl ≤3 s)")
    else:
        F["visuals"] = 0.5

    # ending
    cta = next((i for i, t in enumerate(tokens) if t.lower().strip(".,") == "comment"), None)
    tail = dur - S[cta] if cta is not None else None
    F["ending"] = round(clamp((6.0 - tail) / 2.5), 2) if tail is not None else 0.5
    if tail and tail > 5: flags.append(f"po CTA ještě {tail:.1f} s")

    # topic angle: the strongest signal in our data so far (prior per angle, recalibrated from stats on Sundays)
    cfg = json.loads(WEIGHTS.read_text()) if WEIGHTS.exists() else {"weights": DEFAULT_W, "angle_prior": {}}
    W, prior = cfg["weights"], cfg.get("angle_prior", {})
    angle = post.get("angle")
    F["angle"] = angle
    F["topic"] = prior.get(angle, 0.5)
    if angle is None: flags.append("post.json nemá \"angle\" (typ tématu) → topic 0,5")
    elif F["topic"] < 0.45: flags.append(f"typ tématu \"{angle}\" u nás zatím slabě funguje")
    score = round(100 * sum(W[k] * F[k] for k in W) / sum(W.values()))
    row = {"name": name, "date": datetime.now().strftime("%Y-%m-%d"), "score": score, "mode": "script" if script_only else "full",
           "features": F, "flags": flags, "weights": W}
    rows = json.loads(OUT.read_text()) if OUT.exists() else []
    rows = [r for r in rows if not (r["name"] == name and r["mode"] == row["mode"])] + [row]
    OUT.write_text(json.dumps(rows, indent=1, ensure_ascii=False))
    return row


if __name__ == "__main__":
    a = sys.argv[1:]
    so = "--script" in a
    n = [x for x in a if not x.startswith("--")][0]
    r = predict(n, script_only=so)
    print(f"{n}: {r['score']}/100")
    for k, v in r["features"].items():
        print(f"  {k}: {v}")
    for f in r["flags"]:
        print("  ⚑", f)
