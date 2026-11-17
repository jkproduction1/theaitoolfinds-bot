"""Free prompts page (Gumroad product `luszgi`, custom landing page).

free-prompts.src.html = the page exactly as Jan last published it (never edited by hand here).
python3 hf/page/build_page.py  -> free-prompts.html (what Jan publishes with the Gumroad CLI) + all-prompts.md (text of the PDF)

Jan, 2026-11-18: same design, nothing restyled. Only these changes, all done as small text replacements (the big VID/IMG data is
not re-written, new videos are inserted as text):
- new videos are added to the VID table, so ?v=<name> works for them;
- the email block (#pack) offers EVERY prompt from all videos; when someone arrives from a DM (video mode) it sits in a compact
  frame at the TOP, then come the 3 prompts of that video, and the system box stays at the very BOTTOM;
- the old top system box is no longer shown in video mode.
"""
import json
from pathlib import Path

H = Path(__file__).parent
s = (H / "free-prompts.src.html").read_text(encoding="utf-8")
dec = json.JSONDecoder()

NEW = {  # videos made after the page was built
    "styles47": [["flat-science", "why chilli burns"], ["scale", "the biggest dinosaur versus you"], ["painted-story", "why Easter Island lost its trees"]],
    "styles48": [["painted-story", "how the Titanic was found"], ["paper-collage", "why Big Ben is leaning"], ["flat-science", "why we get goosebumps"]],
    "inside49": [["explode", "a game controller"], ["x-ray", "a smart lock"], ["explain-3d", "how self-checkout weighs things"]],
    "around51": [["flat-science", "why ice is slippery"], ["paper-collage", "why popcorn pops"], ["painted-story", "why the sea is salty"]],
    "mystery52": [["painted-story", "the mystery of the Mary Celeste"], ["explain-3d", "how the Northern Lights form"], ["zoom-in", "a mosquito bite"]],
}

i = s.index("var VID={") + 8
VID, _ = dec.raw_decode(s[i:])
STY, _ = dec.raw_decode(s[s.index("STY=", i) + 4:])
add = {k: v for k, v in NEW.items() if k not in VID}
VID = {**add, **VID}


def prompt(it):  # the prompt text exactly as the page builds it
    if it[0] == "@":
        return it[1], "Other styles", it[3]
    st = STY[it[0]]
    base = "Make a %s-second vertical %sanimation (1080x1920) as one HTML file%s. " % (st[2], "3D " if st[1] == "3D" else "", " with three.js" if st[1] == "3D" else " I can play")
    return it[1][0].upper() + it[1][1:], st[0], base + "Topic: " + it[1] + ". " + st[3]


groups, seen = {}, set()
for items in VID.values():
    for it in items:
        title, style, text = prompt(it)
        if (style, text) not in seen:
            seen.add((style, text)); groups.setdefault(style, []).append((title, text))
NP, NV = sum(len(g) for g in groups.values()), len(VID)


def rep(old, new):
    global s
    assert s.count(old) == 1, "expected exactly one: " + old[:80]
    s = s.replace(old, new)


if add:  # insert the new videos as text right after `var VID={`
    rep("var VID={", "var VID={" + json.dumps(add, ensure_ascii=True, separators=(",", ":"))[1:-1] + ",")
# email block: every prompt from all videos (same box, same classes)
rep('<h2>Want <em>all 12 styles?</em></h2>', '<h2>Get <em>every prompt</em><br>from our videos. Free.</h2>')
rep('<p>Get the full prompt pack as a PDF you can keep. It has these 8 plus 4 more:</p>',
    '<p>All %d prompts from %d videos in one PDF you can keep.</p>' % (NP, NV))
rep('<ul class="ex"><li><b>Zoom In</b><span>One continuous zoom into the tiny world.</span></li><li><b>Exploded View</b><span>A product flies apart and snaps back.</span></li><li><b>Neon Intro</b><span>An 80s synthwave intro of your name.</span></li><li><b>Kinetic Type</b><span>A punchy text promo.</span></li></ul>',
    '<ul class="ex"><li><b>Every video</b><span>One prompt per video topic.</span></li><li><b>Sorted by style</b><span>Paper Collage, X-Ray, True Scale and more.</span></li><li><b>Copy and paste</b><span>Change the topic line to your own.</span></li><li><b>Works in Claude</b><span>Paste it into the Claude app.</span></li></ul>')
rep('data-gumroad-action="buy">Get all 12 prompts · Free</a>', 'data-gumroad-action="buy">Get every prompt · Free</a>')
# video mode: the email block is visible (compact, without the list) ...
rep(".fp.vm #pack,.fp.vm .nav .btn,", ".fp.vm #pack .btn{margin-top:16px}.fp.vm #pack .ex,.fp.vm .nav .btn,")
rep('data-gumroad-action="buy">Get all 12 free</a>', 'data-gumroad-action="buy">Get every prompt</a>')
# ... and goes to the top, above the 3 prompts; the system box stays last; the old top system box is not shown
rep("pack.parentNode.insertBefore(sell,pack);var pp=pack.querySelector('p');if(pp)pp.textContent='Get all 12 style prompts as a PDF you can keep. It includes:';",
    "var vb=document.getElementById('vidbox');vb.parentNode.insertBefore(pack,vb);pack.className+=' topo';")
rep("var st=document.getElementById('selltop');if(st)st.hidden=false;", "")
(H / "free-prompts.html").write_text(s, encoding="utf-8")

SYS = "https://theaitoolfinds.gumroad.com/l/viral-styles-launchpad/LAUNCH?utm_source=ig&utm_medium=promptsfile&utm_content="
order = [v[0] for v in STY.values() if v[0] in groups]
order += [g for g in groups if g not in order]
out = ["# Every prompt from our videos", "",
       "By @theaitoolfinds. %d prompts from %d videos, sorted by style." % (NP, NV), "",
       "CTA: These prompts make one scene. Our system makes the whole video: script, every scene, captions timed to each word, MP4. | See the system | " + SYS + "top", "",
       "How to use one: open Claude (claude.ai), paste the prompt, and change the Topic line to your own. Each prompt draws one short "
       "vertical animation in code. It can take a round or two of feedback to get the look you want. That's normal.", ""]
for g in order:
    out += ["", "## %s (%d)" % (g, len(groups[g])), ""]
    for title, text in groups[g]:
        out += ["### " + title, "", text.strip(), ""]
out += ["", "CTA: You've got the scenes. Want the whole video? Type one line and Claude writes the script, builds every scene, times the captions and exports the MP4. 7-day money-back guarantee. | See the system | " + SYS + "bottom", ""]
(H / "all-prompts.md").write_text("\n".join(out), encoding="utf-8")
print("videos", NV, "unique prompts", NP, "added", list(add))
