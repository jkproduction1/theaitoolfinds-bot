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
    """Key out magenta incl. its darker shadow tones (hue ~280-325 deg, saturated)."""
    hsv = np.asarray(im.convert("RGB").convert("HSV")).astype(np.float32)
    h, sat, v = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    hue_in = np.clip(1 - np.maximum(np.maximum(275 - h, h - 330), 0) / 12, 0, 1)
    key = hue_in * np.clip((sat - 0.22) / 0.2, 0, 1)
    alpha = 1 - key
    am = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    am = am.filter(ImageFilter.GaussianBlur(0.7))
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    # de-spill: on semi-transparent edges, clamp red/blue down toward green
    k = (1 - alpha)[..., None]
    g = rgb[..., 1:2]
    rgb = rgb * (1 - k) + np.concatenate([np.minimum(rgb[..., :1], g + 20), g, np.minimum(rgb[..., 2:], g + 20)], -1) * k
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
