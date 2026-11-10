"""Hand-drawn sketch helpers for the Sketch -> Motion format (viewBox 330 x 590): jittered strokes + Caveat text."""
import math, random
R = random.Random(7)
def _j(a=1.6): return R.uniform(-a, a)
def line(x1, y1, x2, y2, a=1.4):
    n = max(3, int(math.hypot(x2 - x1, y2 - y1) / 28))
    ox, oy = _j(3), _j(3)
    pts = [(x1 - ox * 0.6 + _j(), y1 - oy * 0.6 + _j())]
    for i in range(1, n + 1):
        t = i / n; pts.append((x1 + (x2 - x1) * t + _j(a), y1 + (y2 - y1) * t + _j(a)))
    pts[-1] = (pts[-1][0] + ox * 0.5, pts[-1][1] + oy * 0.5)
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
def rect(x, y, w, h): return [line(x, y, x + w, y), line(x + w, y, x + w, y + h), line(x + w, y + h, x, y + h), line(x, y + h, x, y)]
def circ(cx, cy, r, turns=1.08):
    n = 26; pts = []
    a0 = R.uniform(0, 6.28)
    for i in range(int(n * turns) + 1):
        a = a0 + i / n * 6.283; rr = r * (1 + _j(0.04))
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * 0.98))
    return ["M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)]
def squig(x, y, w):
    pts = [(x + i * w / 14, y + math.sin(i * 1.7) * 2.2 + _j(0.8)) for i in range(15)]
    return ["M" + " L".join(f"{a:.1f} {b:.1f}" for a, b in pts)]
def arrow(x1, y1, x2, y2):
    a = math.atan2(y2 - y1, x2 - x1)
    return [line(x1, y1, x2, y2), line(x2, y2, x2 - 12 * math.cos(a - 0.5), y2 - 12 * math.sin(a - 0.5)),
            line(x2, y2, x2 - 12 * math.cos(a + 0.5), y2 - 12 * math.sin(a + 0.5))]
def txt(x, y, s, size=24, anchor="start"): return ("T", x, y, s, size, anchor)
def heart(cx, cy, s):
    p = [(cx, cy + s)]
    for i in range(21):
        t = i / 20 * 6.283
        p.append((cx + s * 0.06 * 16 * math.sin(t) ** 3, cy - s * 0.06 * (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))))
    return ["M" + " L".join(f"{a + _j(0.6):.1f} {b + _j(0.6):.1f}" for a, b in p[1:])]

def sketch_svg(k, items):
    out, i = [], 0
    for it in items:
        if isinstance(it, tuple):
            _, x, y, s, size, anc = it
            out.append(f'<text class="hw sk{k}" x="{x}" y="{y}" font-size="{size}" text-anchor="{anc}">{s}</text>')
        else:
            out.append(f'<path class="sp sk{k}" pathLength="1" d="{it}"/>')
        i += 1
    return f'<svg class="skt" id="sk{k}" viewBox="0 0 330 590">{"".join(out)}</svg>'

