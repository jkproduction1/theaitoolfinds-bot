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


def screen_rect(im: Image.Image):
    """Largest near-black region (the blank screen) as fractions [x, y, w, h]."""
    from scipy import ndimage
    a = np.asarray(im.convert("RGBA"))
    dark = (a[..., :3].max(-1) < 40) & (a[..., 3] > 200)
    dark = ndimage.binary_closing(dark, structure=np.ones((9, 9)))
    lab, n = ndimage.label(dark)
    if n < 1:
        return None
    sizes = ndimage.sum(dark, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    if sizes[k - 1] < 0.03 * a.shape[0] * a.shape[1]:
        return None
    ys, xs = np.where(lab == k)
    W, H = a.shape[1], a.shape[0]
    return [round(xs.min() / W, 4), round(ys.min() / H, 4),
            round((xs.max() - xs.min()) / W, 4), round((ys.max() - ys.min()) / H, 4)]


def main(path):
    items = json.loads(Path(path).read_text())
    KIT.mkdir(parents=True, exist_ok=True)
    cat_path = KIT / "catalog.json"
    catalog = json.loads(cat_path.read_text()) if cat_path.exists() else {}
    for name, it in items.items():
        r = requests.get(it["url"], timeout=60)
        r.raise_for_status()
        im = Image.open(io.BytesIO(r.content))
        im.thumbnail((1600, 1600))
        if it.get("key"):                      # flat magenta background -> our keyer
            im = cutout(im)
        elif it.get("rembg"):                  # free local AI background removal (u2net)
            from rembg import remove
            im = remove(im.convert("RGB"))
            im = im.crop(im.getbbox() or (0, 0, im.width, im.height))
        elif it.get("alpha"):                  # already transparent (Higgsfield bg remover)
            im = im.convert("RGBA")
            im = im.crop(im.getbbox() or (0, 0, im.width, im.height))
        if im.mode == "RGBA":
            fn = f"{name}.png"
            im.save(KIT / fn)
        else:
            fn = f"{name}.jpg"
            im.convert("RGB").save(KIT / fn, quality=92)
        entry = {"file": fn, "kind": it.get("kind", "prop"), "tags": it.get("tags", []),
                 "w": im.width, "h": im.height}
        if it.get("screen"):
            entry["screen"] = screen_rect(im)
        catalog[name] = entry
        print("kit:", name, entry.get("screen", ""))
    cat_path.write_text(json.dumps(catalog, indent=1))


if __name__ == "__main__":
    main(sys.argv[1])
