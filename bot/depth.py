"""Depth maps for kit plates (free local model, runs in CI once per plate).
Writes video/public/kit/depth/<name>.png  (white = near, black = far), used by the 3D camera."""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline

KIT = Path(__file__).resolve().parent.parent / "video" / "public" / "kit"


def main(names=None):
    cat = json.loads((KIT / "catalog.json").read_text())
    out = KIT / "depth"
    out.mkdir(exist_ok=True)
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Base-hf", device="cpu")
    for name, it in cat.items():
        if it.get("kind") != "background" or (names and name not in names):
            continue
        if (out / f"{name}.png").exists() and not names:
            continue
        img = Image.open(KIT / it["file"]).convert("RGB")
        res = pipe(img)
        d = np.array(res["depth"].convert("F"), dtype=np.float32)
        lo, hi = np.percentile(d, 1), np.percentile(d, 99)
        d = np.clip((d - lo) / max(1e-6, hi - lo), 0, 1)
        im = Image.fromarray((d * 255).astype(np.uint8)).resize(img.size, Image.BICUBIC)
        im = im.filter(ImageFilter.GaussianBlur(1.2))  # soft edges -> fewer stretched seams
        im.save(out / f"{name}.png")
        it["depth"] = f"depth/{name}.png"
        print("depth:", name, flush=True)
    (KIT / "catalog.json").write_text(json.dumps(cat, indent=1))


if __name__ == "__main__":
    main([a for a in sys.argv[1:] if a] or None)
