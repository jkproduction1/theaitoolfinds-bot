"""python3 hf/page/build_pdf.py -> every-prompt.pdf from all-prompts.md (the file for the free Gumroad product)."""
import html, re
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent
out, toc = [], []
for line in (H / "all-prompts.md").read_text().split("\n"):
    if line.startswith("# "): out.append(f"<h1>{html.escape(line[2:])}</h1>")
    elif line.startswith("## "):
        t = line[3:]; i = len(toc); toc.append(t); out.append(f'<h2 id="s{i}">{html.escape(t)}</h2>')
    elif line.startswith("### "): out.append(f"<h3>{html.escape(line[4:])}</h3>")
    elif line.strip():
        t = html.escape(line); t = re.sub(r"(https://\S+)", r'<a href="\1">Viral Styles Launchpad</a>', t) if "https://" in t and "See Viral" in t else t
        cls = ' class="pr"' if line.startswith("Make a") else ""
        out.append(f"<p{cls}>{t}</p>")
body = "\n".join(out)
tocs = "".join(f'<a href="#s{i}">{html.escape(t)}</a>' for i, t in enumerate(toc))
body = body.replace("<h2 id=\"s0\">", f'<div class="toc">{tocs}</div><h2 id="s0">', 1)
page = f"""<!doctype html><meta charset="utf-8"><style>
@page{{size:A5;margin:14mm 12mm}}
body{{font:10.5pt/1.5 Inter,Helvetica,Arial,sans-serif;color:#17131f}}
h1{{font-size:24pt;line-height:1.05;margin:0 0 6pt;letter-spacing:-.02em}}
h2{{font-size:16pt;margin:18pt 0 6pt;padding:6pt 10pt;background:#6f35e8;color:#fff;border-radius:8pt;break-after:avoid}}
h3{{font-size:11.5pt;margin:12pt 0 3pt;break-after:avoid}}
p{{margin:0 0 6pt}} a{{color:#6f35e8}}
p.pr{{background:#f4f0fb;border:1px solid #d9cdf3;border-radius:8pt;padding:8pt 10pt;break-inside:avoid;white-space:pre-line}}
.toc{{display:flex;flex-wrap:wrap;gap:4pt;margin:10pt 0}} .toc a{{font-size:8.5pt;text-decoration:none;border:1px solid #c9b8f0;border-radius:99pt;padding:2pt 8pt}}
</style>{body}"""
(H / "_all.html").write_text(page)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); pg.goto((H / "_all.html").resolve().as_uri())
    pg.pdf(path=str(H / "every-prompt.pdf"), format="A5", print_background=True, margin={"top": "14mm", "bottom": "14mm", "left": "12mm", "right": "12mm"}); b.close()
(H / "_all.html").unlink(); print("ok")
