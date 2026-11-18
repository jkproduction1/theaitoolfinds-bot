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

VIEWS, REELS, RANGE = "1.8M", 56, "Oct 20 – Nov 17, 2026"   # Instagram, data/stats.json pulled 2026-11-17: 1,893,906 views on 56 reels


def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:70])
    s = s.replace(old, new)


rep('<b class="g">1.5M</b><span>views in our first month</span>', '<b class="g">%s</b><span>views in our first month</span>' % VIEWS)
rep("the same styles behind our 1.5M views in our first month", "the same styles behind our %s views in our first month" % VIEWS)
rep("all 42 reels, Oct 20 – Nov 15, 2026", "all %d reels, %s" % (REELS, RANGE))
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
