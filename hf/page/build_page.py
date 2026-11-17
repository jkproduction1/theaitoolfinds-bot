"""Free prompts page (Gumroad product `luszgi`, custom landing page). Source of truth: free-prompts.html in this folder.

python3 hf/page/build_page.py   -> updates free-prompts.html in place (idempotent) and writes all-prompts.md

What it does (Jan, 2026-11-17):
- adds new videos to the VID table (so ?v=<name> works and they count as "all prompts");
- the email block (#pack) now offers EVERY prompt from all videos (count is computed from VID) and is shown in video mode too,
  below the system box that follows the prompts; the top system box and its A/B/C text test are untouched;
- the two system buttons get a position marker (utm_campaign=pos_top / pos_below) so sales show which one was used;
- all-prompts.md = the same prompts as the page builds them (style template + topic), grouped by style: the file for the free product.
Jan publishes the html with the Gumroad CLI, as before.
"""
import json
from pathlib import Path

H = Path(__file__).parent
P = H / "free-prompts.html"
s = P.read_text()
dec = json.JSONDecoder()

NEW = {  # videos made after the page was built
    "styles47": [["flat-science", "why chilli burns"], ["scale", "the biggest dinosaur versus you"], ["painted-story", "why Easter Island lost its trees"]],
    "styles48": [["painted-story", "how the Titanic was found"], ["paper-collage", "why Big Ben is leaning"], ["flat-science", "why we get goosebumps"]],
    "inside49": [["explode", "a game controller"], ["x-ray", "a smart lock"], ["explain-3d", "how self-checkout weighs things"]],
    "around51": [["flat-science", "why ice is slippery"], ["paper-collage", "why popcorn pops"], ["painted-story", "why the sea is salty"]],
    "mystery52": [["painted-story", "the mystery of the Mary Celeste"], ["explain-3d", "how the Northern Lights form"], ["zoom-in", "a mosquito bite"]],
}

i = s.index("var VID=") + 8
VID, e = dec.raw_decode(s[i:])
for k, v in NEW.items():
    VID.setdefault(k, v)
s = s[:i] + json.dumps(VID, ensure_ascii=False, separators=(",", ":")) + s[i + e:]
j = s.index("STY=", i) + 4
STY, _ = dec.raw_decode(s[j:])
NV = len(VID)


# --- all-prompts.md: the prompts exactly as the page builds them
def prompt(it):
    if it[0] == "@":
        return it[1], it[2], "Other styles", it[3]
    st = STY[it[0]]
    base = "Make a %s-second vertical %sanimation (1080x1920) as one HTML file%s. " % (st[2], "3D " if st[1] == "3D" else "", " with three.js" if st[1] == "3D" else " I can play")
    return it[1][0].upper() + it[1][1:], st[1], st[0], base + "Topic: " + it[1] + ". " + st[3]


groups, seen = {}, set()
for vid, items in VID.items():
    for it in items:
        title, kind, style, text = prompt(it)
        if (style, text) in seen:
            continue
        seen.add((style, text))
        groups.setdefault(style, []).append((title, kind, text))
NP = sum(len(g) for g in groups.values())  # unique prompts = what the file holds


def rep(old, new, must=True):
    global s
    if old in s:
        s = s.replace(old, new)
    elif must and new not in s:
        raise SystemExit("pattern not found: " + old[:70])


# --- email block: every prompt from all videos
rep('<h2>Want <em>all 12 styles?</em></h2>', '<h2>Want <em>every prompt</em><br>from our videos?</h2>')
rep('<p>Get the full prompt pack as a PDF you can keep. It has these 8 plus 4 more:</p>',
    '<p id="packp">All <b id="packn">%d</b> prompts from <b id="packv">%d</b> videos in one file you can keep, plus the 12 style prompts as a PDF.</p>' % (NP, NV))
rep('<ul class="ex"><li><b>Zoom In</b><span>One continuous zoom into the tiny world.</span></li><li><b>Exploded View</b><span>A product flies apart and snaps back.</span></li><li><b>Neon Intro</b><span>An 80s synthwave intro of your name.</span></li><li><b>Kinetic Type</b><span>A punchy text promo.</span></li></ul>',
    '<ul class="ex"><li><b>Every video</b><span>One prompt per video topic, sorted by style.</span></li><li><b>Copy and paste</b><span>Change the topic line to your own.</span></li><li><b>12 style prompts</b><span>One for each of our video styles.</span></li><li><b>New ones by email</b><span>We send new styles when we share them.</span></li></ul>')
rep('data-gumroad-action="buy">Get all 12 prompts · Free</a>', 'data-gumroad-action="buy">Get every prompt · Free</a>')
rep("We'll also email you when we share new styles. Unsubscribe anytime.", "We'll also email you when we share new styles. Unsubscribe anytime.")
# --- video mode: show the email block (it was hidden), keep its own text
rep(".fp.vm #pack,.fp.vm .nav .btn,", ".fp.vm .nav .btn,")
rep("var pp=pack.querySelector('p');if(pp)pp.textContent='Get all 12 style prompts as a PDF you can keep. It includes:';", "")
# --- position markers on the two system buttons (top box / box below the prompts)
rep("function(x){x.href=x.href+(x.href.indexOf('?')<0?'?':'&')+'utm_source=ig&utm_medium=prompts&utm_content='+tag});",
    "function(x){x.href=x.href+(x.href.indexOf('?')<0?'?':'&')+'utm_source=ig&utm_medium=prompts&utm_content='+tag+'&utm_campaign='+(x.closest&&x.closest('#selltop')?'pos_top':'pos_below')});")
P.write_text(s)


order = [v[0] for v in STY.values() if v[0] in groups] + [g for g in groups if g not in [v[0] for v in STY.values()]]
out = ["# Every prompt from our videos", "",
       "By @theaitoolfinds. %d prompts from %d videos, sorted by style." % (sum(len(g) for g in groups.values()), NV), "",
       "How to use one: open Claude (claude.ai), paste the prompt, and change the Topic line to your own. Each prompt draws one short "
       "vertical animation in code. It can take a round or two of feedback to get the look you want. That's normal.", "",
       "These prompts make one scene. Want the whole video (script, every scene, captions timed to each word, MP4)? "
       "See Viral Styles Launchpad: https://theaitoolfinds.gumroad.com/l/viral-styles-launchpad/LAUNCH?utm_source=ig&utm_medium=promptsfile", ""]
for g in order:
    out += ["", "## %s (%d)" % (g, len(groups[g])), ""]
    for title, kind, text in groups[g]:
        out += ["### " + title, "", text.strip(), ""]
(H / "all-prompts.md").write_text("\n".join(out))
print("videos", NV, "unique prompts", NP, "styles", len(groups))
