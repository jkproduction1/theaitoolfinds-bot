"""Sales page of Viral Styles Launchpad (Gumroad product `viral-styles-launchpad`, custom landing page).

landing.src.html = the page exactly as Jan last published it (D:\\theaitoolfinds\\landing.html). Never edited by hand here.
python3 hf/page/build_landing.py  ->  landing-A.html  (publish now: only the numbers are updated)
                                      landing-B.html  (A + a reviews section; NOT published until there are real reviews)

Jan, 2026-11-18: same design, nothing restyled. A = "1.5M" -> "1.8M" views (Instagram views of the account, data/stats.json) and the
note under the stats (number of reels, date range). B adds a "What buyers say" section between "What's inside" and the FAQ. It is
filled from the REVIEWS list below and stays hidden while the list is empty, so the page never shows an empty or invented review.
Only add what a buyer really wrote, with their OK.
"""
import json
from pathlib import Path

H = Path(__file__).parent
s = (H / "landing.src.html").read_text(encoding="utf-8")

# real reviews go here: {"q": "what they wrote", "n": "First name or @handle", "c": "Country", "u": "https://link-to-their-video (optional)"}
REVIEWS = []

VIEWS, REELS, RANGE = "2M", 56, "Oct 20 – Nov 18, 2026"   # Jan 2026-11-18: IG profile shows 2M; reel count not re-checked, so the note no longer names it   # Instagram, data/stats.json pulled 2026-11-17: 1,893,906 views on 56 reels


def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:70])
    s = s.replace(old, new)


rep('<b class="g">1.5M</b><span>views in our first month</span>', '<b class="g">%s</b><span>views in our first month</span>' % VIEWS)
rep("the same styles behind our 1.5M views in our first month", "the same styles behind our %s views in our first month" % VIEWS)
rep("all 42 reels, Oct 20 – Nov 15, 2026", "all our reels, %s" % RANGE)
assert "1.5M" not in s

# comparison video: if it is slow or fails to load, show a still frame on a solid card instead of the spinning rainbow ring behind it
# (the ring is only meant to be a 3 px border). The poster is the one the hero already uses for the same video file.
import re
m = re.search(r'<video src="https://public-files.gumroad.com/h04j5pb694lso8w7f09i1b85mm54" (poster="data:image/jpeg;base64,[^"]+")', s)
assert m
rep('<video src="https://public-files.gumroad.com/h04j5pb694lso8w7f09i1b85mm54" autoplay muted loop playsinline preload="metadata" aria-label="Video made by Viral Styles Launchpad">',
    '<video src="https://public-files.gumroad.com/h04j5pb694lso8w7f09i1b85mm54" ' + m.group(1) + ' autoplay muted loop playsinline preload="metadata" aria-label="Video made by Viral Styles Launchpad">')
rep(".vring .vsp{border:0;border-radius:26px;box-shadow:none!important}", ".vring .vsp{border:0;border-radius:26px;box-shadow:none!important;background:#150d24}")
# Jan, 2026-11-18: say where the views are from, and put the bees story (flat science) in the middle of the hero instead of the
# paper-collage planes video. Coffee (left) and Venice (right) stay; the planes still show in the styles gallery.
rep('<span>views in our first month</span>', '<span>views in our first month (IG)</span>')
rep("behind our %s views in our first month" % VIEWS, "behind our %s views in our first month (IG)" % VIEWS)
import base64
BEES = "https://public-files.gumroad.com/xqbht7ua8bvhn6adis7pqrvk16me"   # product cover Jan uploaded 2026-11-18 (bees story); pages may only load media from Gumroad
BP = "data:image/jpeg;base64," + base64.b64encode((H / "media" / "bees_poster.jpg").read_bytes()).decode()
m = re.search(r'<video src="https://public-files.gumroad.com/hsld0i22exeuz8q2yjiculhass2y" poster="data:image/jpeg;base64,[^"]+"', s)
assert m
rep(m.group(0), '<video src="%s" poster="%s"' % (BEES, BP))
rep("aria-label=\"Example video: why planes don't fly straight, Paper Collage style. Tap to turn sound on or off\" style=\"background-image:var(--im-planes)\"",
    'aria-label="Example video: how bees make honey, Flat Science style. Tap to turn sound on or off" style="background-image:url(%s)"' % BP)
rep("\"why planes don't fly straight, Paper Collage style\",\"why Venice", '"how bees make honey, Flat Science style","why Venice')
rep("/story why planes don't fly straight", "/story how bees make honey")
# Jan, 2026-11-18: buyers' real fears (a buyer from India: scams, paying abroad in USD, subscriptions, the site vanishing, hidden
# costs) answered where they decide: one trust line under the buy button + four FAQ answers. Everything stated here is true.
rep('<span data-claim="refund">7-day money-back guarantee. Try it risk-free.</span></p>',
    '<span data-claim="refund">7-day money-back guarantee. Try it risk-free.</span>'
    '<span>Secure checkout by Gumroad. Instant download, yours to keep.</span></p>', 2)
TRUST_FAQ = (
    '<details class="rv"><summary>Is it safe to pay? I\'m not in the US.<i aria-hidden="true"></i></summary><p>Yes. You pay through Gumroad, a US platform '
    'for digital products, not to us directly. It accepts international cards and delivers your files the moment you pay, on screen and '
    'with a download link by email. You never wait on us.</p></details>\n'
    '      <details class="rv"><summary>Is it a subscription?<i aria-hidden="true"></i></summary><p>No. It\'s a one-time payment. You download the '
    'files and they\'re yours to keep, even if this page ever goes away. Just keep a backup.</p></details>\n'
    '      <details class="rv"><summary>Are there any other costs?<i aria-hidden="true"></i></summary><p>Nothing more from us. The system runs inside '
    'Claude, so you need Claude Pro ($20/month, paid to Anthropic). A voice from ElevenLabs is optional.</p></details>\n'
    '      <details class="rv"><summary>What if it\'s not for me?<i aria-hidden="true"></i></summary><p>You have 7 days to try it. If it\'s not for '
    'you, message us and you get your money back.</p></details>\n      ')
rep('<details class="rv"><summary>How long does one video take?', TRUST_FAQ + '<details class="rv"><summary>How long does one video take?')
# Jan, 2026-11-18 (funnel simulation): the voice needs your own MP3/ElevenLabs, and Claude Pro must be visible where people decide.
rep('<b>script, animation, captions, voice.</b>', '<b>script, animation, captions.</b> Add a voice in one step.')
rep('One-time payment. Works with Claude Pro on Mac or Windows.', 'One-time payment. Runs in Claude Pro ($20/mo, paid to Anthropic) on Mac or Windows.')
# Jan, 2026-11-18: the package also runs in ChatGPT's Codex app (tested by Jan on the FREE plan: works, simpler animations).
# Said plainly, by app name (beginners don't know what a "model" is); every example on the page was made with Claude.
rep('One-time payment. Runs in Claude Pro ($20/mo, paid to Anthropic) on Mac or Windows.',
    'One-time payment. Runs in Claude Pro ($20/mo) or in ChatGPT, even free, on Mac or Windows.')
rep('<p>Claude Pro</p></div>', '<p>Claude Pro or ChatGPT <small>Claude for the full look, ChatGPT (free works) for simpler videos</small></p></div>')
rep('<p>No manual install. <small>Claude sets it up for you.</small></p>', '<p>No manual install. <small>Your AI app sets it up for you.</small></p>')
rep('<small>Your AI app sets it up for you.</small></p></div>\n    </div>',
    '<small>Your AI app sets it up for you.</small></p></div>\n    </div>\n'
    '    <p class="note" style="max-width:640px;margin:22px auto 0;text-align:center;line-height:1.6"><b>Which app?</b> Claude ($20/month) gives the full look you see '
    'in our videos. ChatGPT works too, even on the free plan, through its Codex app, with simpler animations. Every example on this page was made with Claude.</p>')
rep('You need your own Claude Pro plan.</p>', 'You need Claude Pro, or ChatGPT for simpler videos.</p>')
rep('Nothing more from us. The system runs inside Claude, so you need Claude Pro ($20/month, paid to Anthropic). A voice from ElevenLabs is optional.',
    'Nothing more from us. For the full look you need Claude Pro ($20/month, paid to Anthropic). It also runs in ChatGPT, even on the free plan, with simpler animations. A voice from ElevenLabs is optional.')
rep('<details class="rv"><summary>What if it\'s not for me?',
    '<details class="rv"><summary>I don\'t have Claude. Can I still use it?<i aria-hidden="true"></i></summary><p>Yes. It also runs in ChatGPT through the free '
    'Codex app (Mac or Windows), even on the free ChatGPT plan. The animations are simpler there. You can switch to Claude any time; the same files work in both.</p></details>\n'
    '      <details class="rv"><summary>What if it\'s not for me?')
(H / "landing-A.html").write_text(s, encoding="utf-8")

SECTION = '''<section class="sec alt" id="reviews" aria-labelledby="h-rev" hidden>
  <style>
  #reviews .revs{display:grid;gap:14px;grid-template-columns:1fr;max-width:980px;margin:0 auto}
  @media(min-width:760px){#reviews .revs{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
  #reviews .rev{padding:22px 22px 20px;display:flex;flex-direction:column;gap:14px}
  #reviews .rev .q{margin:0;font-size:17px;line-height:1.5}
  #reviews .rev .by{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--dim);font-size:14px}
  #reviews .rev .by b{color:inherit;font-weight:700}
  #reviews .rev .by a{white-space:nowrap}
  </style>
  <div class="wrap">
    <div class="hd">
      <p class="kick"><span class="spark" aria-hidden="true"></span>Reviews</p>
      <h2 id="h-rev">What buyers <span class="g">say</span></h2>
    </div>
    <div class="revs" id="revs"></div>
    <p class="note">Real messages from buyers, shared with their permission.</p>
  </div>
  <script>
  (function(){var R=__REVIEWS__,sec=document.getElementById('reviews'),box=document.getElementById('revs');
    if(!R.length||!sec||!box)return;
    R.forEach(function(r){var c=document.createElement('div');c.className='card rev';
      var q=document.createElement('p');q.className='q';q.textContent='\\u201c'+r.q+'\\u201d';c.appendChild(q);
      var f=document.createElement('div');f.className='by';var b=document.createElement('span'),n=document.createElement('b');n.textContent=r.n;b.appendChild(n);
      if(r.c)b.appendChild(document.createTextNode(' \\u00b7 '+r.c));f.appendChild(b);
      if(r.u){var a=document.createElement('a');a.href=r.u;a.target='_blank';a.rel='noopener';a.textContent='See their video';f.appendChild(a)}
      c.appendChild(f);box.appendChild(c)});
    sec.hidden=false;var faq=document.getElementById('h-faq');if(faq){var fs=faq.closest('section');if(fs)fs.className='sec'}
  })();
  </script>
</section>

'''.replace("__REVIEWS__", json.dumps(REVIEWS, ensure_ascii=True))
rep('<section class="sec alt" aria-labelledby="h-faq">', SECTION + '<section class="sec alt" aria-labelledby="h-faq">')
(H / "landing-B.html").write_text(s, encoding="utf-8")
print("ok A + B, reviews:", len(REVIEWS))
