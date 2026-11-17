"""python3 hf/page/build_pdf.py -> every-prompt.pdf (the file of the free Gumroad product), in the SAME design as the free prompts page
(dark purple, Outfit + Inter, cards, orange system button). Source: all-prompts.json written by build_page.py (run that first).
Jan, 2026-11-18: same look as the page, a proper contents table, and a much stronger link to the paid system (cover, between
sections, last page)."""
import html, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

H = Path(__file__).parent
ROOT = H.parent.parent
src = (H / "free-prompts.src.html").read_text(encoding="utf-8")
STY, _ = json.JSONDecoder().raw_decode(src[src.index("STY=", src.index("var VID={")) + 4:])
KIND = {v[0]: v[1] for v in STY.values()}
SYS = "https://theaitoolfinds.gumroad.com/l/viral-styles-launchpad/LAUNCH?utm_source=ig&utm_medium=promptsfile&utm_content="
E = html.escape

D = json.loads((H / "all-prompts.json").read_text(encoding="utf-8"))
sections = [{"name": x["name"], "items": [tuple(i) for i in x["items"]]} for x in D["sections"]]
NP, NS, NV = sum(len(s["items"]) for s in sections), len(sections), D["videos"]

SPARK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z"/></svg>'
CK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
IMG = [(ROOT / "hf/videos/stories1711/img" / f).resolve().as_uri() for f in ("web_planes.jpg", "web_coffee.jpg", "web_venice.jpg")]


def tag(kind):
    return f'<span class="tag t{kind}">{kind}</span>' if kind else '<span class="tag tX">MORE</span>'


def big_cta(pos, h2, extra=""):
    thumbs = "".join(f'<img src="{u}" alt="">' for u in IMG)
    return f'''<div class="box sell cta">
<h2>{h2}</h2>
<p>These prompts make <b>one scene</b>. Our system makes the <b>whole video</b> from one typed line.</p>
<div class="vs"><div class="col no"><i>A free prompt</i><span>One scene</span><span>No voice</span><span>No captions</span></div>
<div class="col yes"><i>The system</i><span>{CK}Full story, every scene</span><span>{CK}Captions timed to each word</span><span>{CK}Voiceover ready</span><span>{CK}MP4 export, 1080×1920</span></div></div>
<div class="thumbs">{thumbs}</div><p class="cap">Full videos made with the system</p>{extra}
<a class="btn" href="{SYS}{pos}">See the system · <s>$29</s> $19</a>
<p class="fine"><b>$19 once. No subscription.</b> Launch price for the first 50 buyers, then $29.</p>
<p class="fine">7-day money-back guarantee. Works with Claude Pro.</p>
</div>'''


def slim_cta(pos):
    return f'''<div class="slim"><div><b>Want the whole video, not one scene?</b><span>Type one line. Claude writes the script, builds every scene and times the captions.</span></div><a class="btn sm" href="{SYS}{pos}">See the system · $19</a></div>'''


toc = "".join(f'<a class="trow" href="#s{i}">{tag(KIND.get(s["name"]))}<b>{E(s["name"])}</b><em>{len(s["items"])} prompt{"s" if len(s["items"]) != 1 else ""}</em></a>' for i, s in enumerate(sections))
body = [f'''<section class="cover">
<div class="nav"><span class="brand"><span class="logo">{SPARK}</span>@theaitoolfinds</span></div>
<div class="hero"><span class="pill">Free prompts</span>
<h1>Every prompt from <em>our videos.</em></h1>
<p class="sub">{NP} prompts from {NV} videos, sorted by style.</p>
<div class="how"><div><b>1</b>Open Claude (claude.ai).</div><div><b>2</b>Copy a prompt and paste it in.</div><div><b>3</b>Change the <u>Topic</u> line to your own.</div></div>
<p class="note">Each prompt draws one short vertical animation in code. It can take a round or two of feedback to get the look you want. That's normal.</p></div>
</section>''',
        '<section class="pg">' + big_cta("cover", "You've got the scenes.<br><em>Want the whole video?</em>") + '</section>',
        f'<section class="pg"><h2 class="sec">Find <em>your style</em></h2><p class="secp">{NS} styles. Tap one to jump to its prompts.</p><div class="toc">{toc}</div></section>']
for i, s in enumerate(sections):
    cards = "".join(f'<article class="card"><h3>{E(t)}</h3><div class="pr">{E(x)}</div></article>' for t, x in s["items"])
    body.append(f'<section class="st" id="s{i}"><div class="sth">{tag(KIND.get(s["name"]))}<h2>{E(s["name"])}</h2><em>{len(s["items"])} prompt{"s" if len(s["items"]) != 1 else ""}</em></div>{cards}{slim_cta("mid_" + re.sub("[^a-z0-9]", "", s["name"].lower())) if i % 2 == 0 else ""}</section>')
body.append('<section class="pg last">' + big_cta("end", "This is how we make<br><em>our videos.</em>", '<p class="one">Set up in 2 steps in the Claude app. It can draft a new video for you every day.</p>') + '<p class="foot">Made by @theaitoolfinds · instagram.com/theaitoolfinds<br>Not affiliated with or endorsed by Anthropic.</p></section>')

F = (ROOT / "hf/videos/stories1711/fonts").resolve().as_uri(); FI = (ROOT / "assets/fonts").resolve().as_uri()
CSS = f"""
@font-face{{font-family:Outfit;font-weight:700;src:url({F}/outfit-latin-700-normal.woff2)}}
@font-face{{font-family:Outfit;font-weight:800;src:url({F}/outfit-latin-800-normal.woff2)}}
@font-face{{font-family:Inter;font-weight:500;src:url({FI}/Inter-Medium.otf)}}
@font-face{{font-family:Inter;font-weight:600;src:url({FI}/Inter-SemiBold.otf)}}
@font-face{{font-family:Inter;font-weight:700;src:url({FI}/Inter-Bold.otf)}}
@page{{size:148mm 263mm;margin:0}}
*{{box-sizing:border-box}}
html,body{{margin:0;background:#0c0714;color:#f6f1ff;font:500 10.5pt/1.5 Inter,sans-serif;-webkit-print-color-adjust:exact}}
section{{padding:11mm 10mm 0;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
section.cover,section.pg{{break-after:page;min-height:262mm;padding-bottom:10mm;background:radial-gradient(150mm 90mm at 50% -14mm,rgba(139,77,255,.55),transparent 70%) no-repeat}}
section.st{{break-before:page;padding-bottom:6mm}}
em{{font-style:normal}} h1 em,h2 em{{color:#b08cff}}
.nav{{padding:0 0 10mm}} .brand{{display:flex;align-items:center;gap:8px;font:700 12pt Outfit}} .logo{{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#a56bff,#6f35e8);display:grid;place-items:center}}
.hero{{text-align:center;padding-top:26mm}}
.pill{{display:inline-block;padding:4pt 13pt;border-radius:999px;border:1.2pt solid rgba(180,140,255,.55);background:rgba(160,110,255,.14);color:#cdb3ff;font-weight:600;font-size:10pt}}
h1{{font:800 38pt/1 Outfit;letter-spacing:-.03em;margin:12pt 0 0}}
.sub{{color:#b8acd0;font-size:13pt;margin:10pt 0 0}}
.how{{display:grid;gap:6pt;margin:16mm 0 8pt;text-align:left}} .how div{{background:#150d24;border:1pt solid #3a2a5e;border-radius:11pt;padding:8pt 12pt;color:#d9d0ee;font-size:11.5pt;display:flex;gap:10pt;align-items:baseline}} .how b{{font:800 15pt Outfit;color:#a56bff}}
.note{{color:#8f83a8;font-size:9.5pt;margin:10pt 4mm 0}}
h2{{font:800 24pt/1.05 Outfit;letter-spacing:-.02em;margin:0}}
h2.sec{{text-align:center;margin:8mm 0 4pt}} .secp{{text-align:center;color:#b8acd0;margin:0 0 12pt}}
.toc{{display:grid;grid-template-columns:1fr 1fr;gap:6pt}}
.trow{{display:flex;align-items:center;gap:7pt;background:#150d24;border:1pt solid #3a2a5e;border-radius:11pt;padding:8pt 10pt;color:#f6f1ff;text-decoration:none}}
.trow b{{font:700 11pt Outfit;flex:1;line-height:1.15}} .trow em{{color:#8f83a8;font-size:8.5pt;white-space:nowrap}}
.tag{{display:inline-block;font:700 7.5pt Outfit;letter-spacing:.1em;padding:2pt 7pt;border-radius:999px;flex:none}}
.t2D{{background:rgba(111,240,196,.14);color:#7ff0c9;border:1pt solid rgba(111,240,196,.4)}} .t3D{{background:rgba(255,160,90,.14);color:#ffb37a;border:1pt solid rgba(255,160,90,.4)}} .tX{{background:rgba(165,107,255,.16);color:#e3d2ff;border:1pt solid rgba(165,107,255,.4)}}
.sth{{display:flex;align-items:center;gap:9pt;margin:0 0 10pt;padding-bottom:8pt;border-bottom:1pt solid #3a2a5e}} .sth h2{{font-size:22pt;flex:1}} .sth em{{color:#8f83a8;font-size:9.5pt}}
.card{{background:#150d24;border:1pt solid #3a2a5e;border-radius:15pt;padding:12pt;margin-bottom:9pt;break-inside:avoid}}
h3{{font:800 14.5pt/1.12 Outfit;letter-spacing:-.02em;margin:0 0 8pt}}
.pr{{background:#090511;border:1pt solid #4a3780;border-radius:10pt;padding:9pt 11pt;font-size:10pt;line-height:1.5;color:#fff;white-space:pre-line}}
.btn{{display:inline-flex;align-items:center;justify-content:center;min-height:38pt;padding:0 22pt;border-radius:999px;background:#ff4b1f;color:#fff;font:700 14pt Outfit;text-decoration:none;box-shadow:0 8pt 22pt -8pt rgba(255,75,31,.9)}} .btn s{{opacity:.6;margin:0 5pt}}
.btn.sm{{min-height:30pt;padding:0 14pt;font-size:10.5pt;white-space:nowrap;flex:none}}
.box{{border-radius:20pt;padding:20pt 16pt;text-align:center;border:1pt solid rgba(255,75,31,.6);background:radial-gradient(110mm 60mm at 50% 0,rgba(255,75,31,.24),rgba(139,77,255,.12))}}
.box.cta{{margin-top:10mm}} .box p{{color:#d9d0ee;margin:9pt auto 0;font-size:11.5pt}} .box p b{{color:#fff}}
.vs{{display:grid;grid-template-columns:.8fr 1.25fr;gap:7pt;margin:13pt 0 0;text-align:left}}
.col{{background:rgba(9,5,17,.62);border:1pt solid #3a2a5e;border-radius:12pt;padding:10pt 11pt;display:grid;gap:5pt;align-content:start}}
.col i{{font:700 8pt Outfit;font-style:normal;letter-spacing:.1em;text-transform:uppercase;color:#8f83a8}} .col span{{font-size:10pt;font-weight:600;display:flex;gap:6pt;align-items:flex-start;line-height:1.25}}
.col.no span{{color:#8f83a8}} .col.yes{{border-color:rgba(255,75,31,.55)}} .col.yes i{{color:#ffb37a}} .col svg{{width:11pt;height:11pt;flex:none;color:#7ff0c9;margin-top:1pt}}
.thumbs{{display:flex;gap:8pt;justify-content:center;margin:14pt 0 0}} .thumbs img{{width:27mm;height:48mm;object-fit:cover;border-radius:11pt;border:1.5pt solid rgba(210,185,255,.8);box-shadow:0 12pt 26pt -8pt rgba(139,77,255,.9)}}
.box p.cap{{font-size:8pt;letter-spacing:.08em;text-transform:uppercase;color:#b8acd0;margin:7pt 0 14pt}} .box p.one{{font-weight:600;color:#fff;margin:0 0 14pt}}
.box p.fine{{font-size:9.5pt;color:#b8acd0;margin-top:9pt}}
.slim{{display:flex;align-items:center;gap:10pt;border-radius:15pt;padding:11pt 12pt;border:1pt solid rgba(255,75,31,.6);background:linear-gradient(100deg,rgba(255,75,31,.2),rgba(139,77,255,.14));margin:4pt 0 0;break-inside:avoid}}
.slim b{{display:block;font:800 12pt/1.15 Outfit}} .slim span{{display:block;font-size:8.8pt;color:#d9d0ee;margin-top:3pt;line-height:1.35}}
.foot{{text-align:center;color:#8f83a8;font-size:8.5pt;margin-top:9mm}}
"""
(H / "_all.html").write_text(f'<!doctype html><meta charset="utf-8"><style>{CSS}</style>' + "\n".join(body), encoding="utf-8")
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(); pg.goto((H / "_all.html").resolve().as_uri()); pg.evaluate("document.fonts.ready")
    pg.pdf(path=str(H / "every-prompt.pdf"), width="148mm", height="263mm", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}); b.close()
(H / "_all.html").unlink()
print("ok", NP, "prompts", NS, "styles")
