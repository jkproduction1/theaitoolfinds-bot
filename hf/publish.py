"""Put a rendered HyperFrames video on the `videos` branch so the release step can send it to Telegram.

python3 hf/publish.py <name>
  reads  hf/videos/<name>/post.json  {url, tool_name, keyword, caption, summary_cs, cover_at}
  needs  hf/work/<name>/renders/final.mp4
  writes videos:<YYYY-MM-DD_HHMM>_<name>/{video.mp4, cover.jpg, caption.txt, meta.json}
Then dispatch make-video.yml with mode=release, storyboard=<that folder> (prints it).
"""
import json, shutil, subprocess, sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

name = sys.argv[1]
H = Path(__file__).resolve().parent
repo = H.parent
post = json.loads((H / "videos" / name / "post.json").read_text())
mp4 = H / "work" / name / "renders" / "final.mp4"
folder = datetime.now(ZoneInfo("Europe/Prague")).strftime("%Y-%m-%d_%H%M") + "_" + name
wt = Path("/tmp/hf-videos-branch")


def run(*a, cwd=repo):
    subprocess.run(list(a), cwd=cwd, check=True)


run("git", "fetch", "-q", "origin", "+videos:refs/remotes/origin/videos")
if wt.exists():
    subprocess.run(["git", "worktree", "remove", "--force", str(wt)], cwd=repo)
run("git", "worktree", "add", "-q", "-B", "videos", str(wt), "origin/videos")
d = wt / folder
d.mkdir()
shutil.copy(mp4, d / "video.mp4")
run("ffmpeg", "-v", "error", "-y", "-ss", str(post.get("cover_at", 1.0)), "-i", str(d / "video.mp4"),
    "-frames:v", "1", "-q:v", "3", str(d / "cover.jpg"))
(d / "caption.txt").write_text(post["caption"].strip() + "\n", encoding="utf-8")
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                            str(d / "video.mp4")], capture_output=True, text=True).stdout.strip())
meta = {"url": post["url"], "name": post["tool_name"], "tool_name": post["tool_name"], "keyword": post["keyword"],
        "summary_cs": post["summary_cs"], "style": "hyperframes-paper", "duration": round(dur, 1),
        "domain": post["url"].split("://")[-1].rstrip("/"), "created": folder[:15], "run_id": None, "artifact": None}
(d / "meta.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
run("git", "add", folder, cwd=wt)
run("git", "-c", "user.name=theaitoolfinds-bot", "-c", "user.email=bot@users.noreply.github.com",
    "commit", "-qm", f"video: {folder} (HyperFrames)", cwd=wt)
run("git", "push", "-q", "origin", "videos", cwd=wt)
print("PUBLISHED", folder)
