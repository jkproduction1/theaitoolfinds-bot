"""Download generated props, cut out the flat magenta background -> transparent PNG.
Saved into video/public/kit/ (committed: the prop library keeps growing).
Usage: python -m bot.kit jobs/kit.json   ({"name": {"url": ..., "key": true}, ...})"""
import io
import json
import sys
from pathlib import Path

import numpy as np
import requests
from PIL import Image, ImageFilter

from . import config

KIT = config.ROOT / "video" / "public" / "kit"


def cutout(im: Image.Image) -> Image.Image:
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # magenta-ness: red and blue high, green low
    mag = np.clip(((r + b) / 2 - g - 60) / 80, 0, 1)
    alpha = 1 - mag
    am = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    am = am.filter(ImageFilter.GaussianBlur(0.8))
    # de-spill: pull leftover magenta out of the edges
    g2 = np.maximum(g, np.minimum(r, b) * (1 - alpha) + g * alpha)
    rgb = np.stack([np.minimum(r, g2 + 40 + (r - g2) * alpha), g, np.minimum(b, g2 + 40 + (b - g2) * alpha)], -1)
    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")
    out.putalpha(am)
    return out.crop(out.getbbox() or (0, 0, out.width, out.height))


def main(path):
    items = json.loads(Path(path).read_text())
    KIT.mkdir(parents=True, exist_ok=True)
    for name, it in items.items():
        r = requests.get(it["url"], timeout=60)
        r.raise_for_status()
        im = Image.open(io.BytesIO(r.content))
        im.thumbnail((1600, 1600))
        if it.get("key"):
            cutout(im).save(KIT / f"{name}.png")
        else:
            im.convert("RGB").save(KIT / f"{name}.jpg", quality=92)
        print("kit:", name)


if __name__ == "__main__":
    main(sys.argv[1])
