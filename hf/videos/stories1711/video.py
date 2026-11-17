"""Story videos: python3 video.py -> story_compare.mp4 (free prompt vs system, from versus46) and story_offer.mp4 (3 launch videos play in the cards)."""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
H = Path(__file__).parent; SRC = Path(sys.argv[1])
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto((H / "stories.html").resolve().as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
    pg.locator("#sc").screenshot(path=str(H / "_sc.png")); pg.locator("#s4").screenshot(path=str(H / "_s4.png")); b.close()
def punch(png, rects, r):
    im = Image.open(png).convert("RGBA"); m = Image.new("L", im.size, 255); d = ImageDraw.Draw(m)
    for x, y, w, h in rects: d.rounded_rectangle([x, y, x + w - 1, y + h - 1], r, fill=0)
    im.putalpha(m); im.save(png)
punch(H / "_sc.png", [(100, 640, 400, 711), (580, 640, 400, 711)], 34)
punch(H / "_s4.png", [(84, 660, 288, 512), (396, 660, 288, 512), (708, 660, 288, 512)], 30)
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart"]
D = 16.4
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC / "versus.mp4"), "-loop", "1", "-i", str(H / "_sc.png"), "-filter_complex",
    f"color=c=black:s=1080x1920:r=30:d={D}[bg];[0:v]split[a][b];[a]crop=400:711:80:478[l];[b]crop=400:711:560:478[r];"
    f"[bg][l]overlay=100:640[x];[x][r]overlay=580:640[y];[y][1:v]overlay=0:0:shortest=1[v];[0:a]afade=t=out:st={D-0.6}:d=0.6[a]",
    "-map", "[v]", "-map", "[a]", "-t", str(D), *ENC, "-c:a", "aac", "-b:a", "160k", str(H / "story_compare.mp4")], check=True)
D = 12
ins = []
for n in ["2026-11-16_0300_launch_planes", "2026-11-16_0301_launch_coffee", "2026-11-16_0301_launch_venice"]: ins += ["-i", str(SRC / f"{n}.mp4")]
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-loop", "1", "-i", str(H / "_s4.png"), "-filter_complex",
    f"color=c=black:s=1080x1920:r=30:d={D}[bg];[0:v]scale=288:512[a];[1:v]scale=288:512[b];[2:v]scale=288:512[c];"
    f"[bg][a]overlay=84:660[x];[x][b]overlay=396:660[y];[y][c]overlay=708:660[z];[z][3:v]overlay=0:0:shortest=1[v]",
    "-map", "[v]", "-an", "-t", str(D), *ENC, str(H / "story_offer.mp4")], check=True)
for f in ["_sc.png", "_s4.png"]: (H / f).unlink()
print("ok")
