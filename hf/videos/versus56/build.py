"""versus56: free prompt vs our system, topic "how bees make honey".
Left  = free_prompt.html: the published free flat-science prompt, run verbatim in a clean session (topic swapped), 6 s loop.
Right = bees55 story (flat science, voice + word captions). Layout = versus46/layers.html."""
import subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent; W = H.parent.parent / "work" / "versus56"; W.mkdir(parents=True, exist_ok=True)
(W / "fl").mkdir(exist_ok=True)
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto((H / "free_prompt.html").as_uri()); pg.wait_for_timeout(300)
    for i in range(180):
        pg.evaluate("t=>{document.getAnimations().forEach(a=>{a.pause();const d=a.effect.getComputedTiming();a.currentTime=t})}", i * 1000 / 30)
        pg.screenshot(path=str(W / "fl" / f"f{i:04d}.jpg"), type="jpeg", quality=92)
    pg2 = b.new_page(viewport={"width": 1080, "height": 1920})
    pg2.goto((H / "layers.html").as_uri())
    for l in ["bg", "fg", "r1", "r2", "r3", "end", "mask"]:
        pg2.evaluate("l=>document.body.dataset.l=l", l); pg2.wait_for_timeout(150)
        pg2.screenshot(path=str(W / f"{l}.png"), omit_background=(l != "bg" and l != "mask"), clip=({"x": 0, "y": 0, "width": 400, "height": 711} if l == "mask" else None))
    b.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "30", "-i", str(W / "fl" / "f%04d.jpg"), "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", str(W / "left.mp4")], check=True)
R = H.parent.parent / "work" / "bees55" / "renders" / "final.mp4"
D, END = 23.6, 21.0
def fade(n, t): return f"[{n}:v]format=rgba,fade=t=in:st={t}:d=0.35:alpha=1[o{n}]"
fc = ";".join([
    "[1:v]scale=400:711,format=rgba[l0];[l0][8:v]alphamerge[l]",
    "[2:v]scale=400:711,format=rgba[r0];[r0][8:v]alphamerge[r]",
    "[0:v][l]overlay=80:478[a];[a][r]overlay=560:478[b];[b][3:v]overlay[c]",
    fade(4, 3.0), fade(5, 6.0), fade(6, 9.0), fade(7, END),
    "[c][o4]overlay[d];[d][o5]overlay[e];[e][o6]overlay[f];[f][o7]overlay,format=yuv420p[v]",
    f"[2:a]apad,atrim=0:{D},afade=t=out:st={D-0.5}:d=0.5[au]"])
img = lambda p: ["-loop", "1", "-framerate", "30", "-t", str(D), "-i", str(W / p)]
cmd = ["ffmpeg", "-v", "error", "-y", *img("bg.png"), "-stream_loop", "-1", "-i", str(W / "left.mp4"), "-i", str(R),
       *img("fg.png"), *img("r1.png"), *img("r2.png"), *img("r3.png"), *img("end.png"), *img("mask.png"),
       "-filter_complex", fc, "-map", "[v]", "-map", "[au]", "-t", str(D), "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
       "-maxrate", "9M", "-bufsize", "18M", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(W / "renders" / "final.mp4")]
(W / "renders").mkdir(exist_ok=True); subprocess.run(cmd, check=True); print("ok")
