// body66 2D helpers (canvas scenes drawn in code)
window.W = 1080; window.H = 1920; window.DUR = 6.33;
window.cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
window.ramp = (t, a, b) => cl((t - a) / (b - a));
window.sm = x => x * x * (3 - 2 * x);
window.eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
window.eout = x => 1 - Math.pow(1 - x, 4);
window.popS = x => { const c1 = 1.70158, c3 = c1 + 1, y = x - 1; return 1 + c3 * y * y * y + c1 * y * y; };
window.mulberry32 = a => function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
document.head.insertAdjacentHTML('beforeend', `<style>
body{margin:0;background:#000;overflow:hidden}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:#05080f;font-family:"Inter",system-ui,Arial,sans-serif}
canvas{position:absolute;inset:0}
#ov{position:absolute;inset:0;pointer-events:none}#ov svg{position:absolute;inset:0}
.pill{position:absolute;left:0;top:0;opacity:0;transform:translate(-50%,-50%);background:rgba(6,14,26,.84);border:2.5px solid rgba(110,210,255,.8);border-radius:18px;padding:10px 28px 14px;color:#fff;white-space:nowrap;box-shadow:0 0 26px rgba(70,180,255,.35),0 8px 30px rgba(0,0,0,.45);font-weight:800;font-size:46px;letter-spacing:-.5px;text-align:center}
.pill small{display:block;font-size:31px;font-weight:600;color:#cfd6e0;margin-top:2px}
.pill.hot{border-color:#ffb547;box-shadow:0 0 30px rgba(255,170,60,.45),0 8px 30px rgba(0,0,0,.45)}
.pill.red{border-color:#ff4a4a;box-shadow:0 0 34px rgba(255,60,60,.55),0 8px 30px rgba(0,0,0,.45)}
.big{position:absolute;left:0;right:0;text-align:center;color:#fff;opacity:0;font-weight:900;letter-spacing:-.04em;text-shadow:0 4px 30px rgba(0,0,0,.8)}
</style>`);
window.LABEL = function (svg, defs, t) { let s = '';
  for (const d of defs) { const a = sm(ramp(t, d.t0, d.t0 + 0.4)) * (d.t1 ? 1 - sm(ramp(t, d.t1, d.t1 + 0.35)) : 1);
    const el = document.getElementById(d.id); const [px, py] = d.pos; el.style.left = px + 'px'; el.style.top = py + 'px'; el.style.opacity = a;
    el.style.transform = `translate(-50%,-50%) scale(${0.86 + 0.14 * popS(ramp(t, d.t0, d.t0 + 0.45))})`;
    if (d.at && a > 0.001) { const [bx, by] = d.at; const hw = el.offsetWidth / 2, hh = el.offsetHeight / 2; let ax = px, ay = py;
      if (Math.abs(by - py) > hh + 20) ay = py + Math.sign(by - py) * hh; else ax = px + Math.sign(bx - px) * hw;
      const col = d.col || '#7fd4ff', k = Math.min(1, a * 1.3);
      s += `<g opacity="${a}"><line x1="${ax}" y1="${ay}" x2="${ax + (bx - ax) * k}" y2="${ay + (by - ay) * k}" stroke="${col}" stroke-width="3.5"/>` + (a > 0.6 ? `<circle cx="${bx}" cy="${by}" r="9" fill="${col}"/><circle cx="${bx}" cy="${by}" r="19" fill="none" stroke="${col}" stroke-width="2.5" opacity=".6"/>` : '') + '</g>'; } }
  svg.innerHTML = s; };
window.READY = function (render) { window.renderAt = render; window.draw = render;
  Promise.race([document.fonts.load('800 46px "Inter"'), new Promise(r => setTimeout(r, 1200))]).then(() => { render(5); requestAnimationFrame(() => document.title = 'ok'); }); };
