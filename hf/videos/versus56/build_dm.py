"""versus56 DM variant: same side-by-side (free prompt vs system, bees), no music, CTA 'Tap "Get the system" above' instead of
'Comment SYSTEM' (in the auto-DM the text + buttons come first, this video is the next message). -> bot/media/dm_versus_bees.mp4 (720p)"""
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent; ROOT = H.parent.parent.parent; W = H.parent.parent / "work" / "versus56"; D = W / "dm"; D.mkdir(parents=True, exist_ok=True)
assert (W / "left.mp4").exists(), "run build.py first (renders the free-prompt scene)"
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto((H / "layers_dm.html").as_uri())
    for l in ["bg", "fg", "r1", "r2", "r3", "end", "mask"]:
        pg.evaluate("l=>document.body.dataset.l=l", l); pg.wait_for_timeout(150)
        pg.screenshot(path=str(D / f"{l}.png"), omit_background=(l not in ("bg", "mask")),
                      clip=({"x": 0, "y": 0, "width": 400, "height": 711} if l == "mask" else None))
    b.close()
R = ROOT / "hf" / "page" / "media" / "bees.mp4"   # bees story, voice + soft sfx, no music, -22 LUFS
DUR, END = 23.6, 21.0
fade = lambda n, t: f"[{n}:v]format=rgba,fade=t=in:st={t}:d=0.35:alpha=1[o{n}]"
fc = ";".join([
    "[1:v]scale=400:711,format=rgba[l0];[l0][8:v]alphamerge[l]",
    "[2:v]scale=400:711,format=rgba[r0];[r0][8:v]alphamerge[r]",
    "[0:v][l]overlay=80:478[a];[a][r]overlay=560:478:eof_action=repeat[b];[b][3:v]overlay[c]",
    fade(4, 3.0), fade(5, 6.0), fade(6, 9.0), fade(7, END),
    "[c][o4]overlay[d];[d][o5]overlay[e];[e][o6]overlay[f];[f][o7]overlay,scale=720:1280,format=yuv420p[v]",
    f"[2:a]apad,atrim=0:{DUR},loudnorm=I=-16:TP=-1.5:LRA=11[au]"])
img = lambda p: ["-loop", "1", "-framerate", "30", "-t", str(DUR), "-i", str(D / p)]
out = ROOT / "bot" / "media" / "dm_versus_bees.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", *img("bg.png"), "-stream_loop", "-1", "-i", str(W / "left.mp4"), "-i", str(R),
                *img("fg.png"), *img("r1.png"), *img("r2.png"), *img("r3.png"), *img("end.png"), *img("mask.png"),
                "-filter_complex", fc, "-map", "[v]", "-map", "[au]", "-t", str(DUR), "-r", "30", "-c:v", "libx264", "-preset", "slow",
                "-crf", "27", "-c:a", "aac", "-b:a", "96k", "-ar", "44100", "-movflags", "+faststart", str(out)], check=True)
print("ok", out, out.stat().st_size)
