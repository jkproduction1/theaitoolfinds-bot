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
# Jan, 2026-11-18 (positioning): sell the whole system, not "make videos": set up once, a new video every day, no work, fast,
# proven styles, everything set up for you. No technical talk in the main part (ElevenLabs/ChatGPT only in the FAQ). True limits
# kept: the system makes the videos, the buyer posts them ("You just post it"); Claude Pro stays visible by the button.
rep('<h1 id="h1">Make videos<br> like <span class="g">this.</span></h1>', '<h1 id="h1">Your faceless channel,<br> on <span class="g">autopilot.</span></h1>')
rep('<p class="sub">Type a topic. Claude builds the video: <b>script, animation, captions.</b> Add a voice in one step.</p>',
    '<p class="sub">Set it up once. Every day AI makes a new video for you, on any topic, in <b>12 styles tuned to get views.</b> You just post it.</p>')
rep('One-time payment. Runs in Claude Pro ($20/mo) or in ChatGPT, even free, on Mac or Windows.', 'One-time payment, no subscription. Runs in Claude Pro on Mac or Windows.')
rep('<b>What you get:</b> a set of skills you add to Claude (an AI app, like ChatGPT) and a guide that starts from zero. Instant download.',
    '<b>What you get:</b> a complete video system for Claude (an AI app, like ChatGPT). One command installs it, then script, animation, captions and voiceover are handled for you. Instant download.')
rep('<p>Claude Pro or ChatGPT <small>Claude for the full look, ChatGPT (free works) for simpler videos</small></p></div>', '<p>Claude Pro <small>the AI app the system runs in</small></p></div>')
rep('<p>Optional voice: ElevenLabs <small>add it whenever you want</small></p>', '<p>Voiceover <small>Claude sets it up with you during install</small></p>')
i = s.index('<p class="note" style="max-width:640px;margin:22px auto 0;text-align:center;line-height:1.6"><b>Which app?</b>'); j = s.index('</p>', i) + 4
s = s[:i] + s[j:]
rep('Voiceover <small class="vsm">(ElevenLabs, free plan works)</small>', 'Voiceover')
rep('<p>Word-synced captions are built in. Want a voiceover too? Drop in an MP3 and every caption syncs to it.</p>',
    '<p>Captions timed to every word are built in. Claude sets up a natural AI voice with you during install, and the captions sync to it.</p>')
# Jan, 2026-11-18 (comprehension test with 3 simulated visitors): one wording for the same thing everywhere, say what the
# buyer physically gets, and say plainly that it does not post for them.
rep('Made with this system: one command, then a round or two of feedback.', 'Made with this system: one typed line, then one round of changes.')
rep('a complete video system for Claude (an AI app, like ChatGPT). One command installs it, then script, animation, captions and voiceover are handled for you. Instant download.',
    'files you add to Claude (an AI app, like ChatGPT). Drop one file in and it sets itself up. From then on the script, animation, captions and voiceover are made for you. Instant download.')
rep('About 30 minutes with one round of feedback.', 'About 30 minutes, including one round of changes you ask for in plain words.')
rep('adds a voice if you want one and hands you a finished MP4.', 'adds the voice and hands you a finished MP4.')
rep('A voice from ElevenLabs is optional.', 'The voice uses a free ElevenLabs account, and Claude helps you create it.')
rep("If it's not for you, message us and you get your money back.", "If it's not for you, message @theaitoolfinds on Instagram within 7 days and you get your money back.")
rep('<details class="rv"><summary>How long does one video take?',
    '<details class="rv"><summary>Is the daily video really automatic?<i aria-hidden="true"></i></summary><p>Yes! Every day Claude prepares a new video for you. '
    'All you do is upload it to Instagram, TikTok or YouTube.</p></details>\n'
    '      <details class="rv"><summary>Who picks the topics?<i aria-hidden="true"></i></summary><p>You can type any topic. Or let the system plan your account: '
    'it suggests a niche and 30 topics, and the daily video works through them.</p></details>\n'
    '      <details class="rv"><summary>How long does one video take?')
# Jan, 2026-11-18: no price of Claude Pro on the page, just "Claude Pro" (it stays clear that it is a separate plan from Anthropic).
rep('For the full look you need Claude Pro ($20/month, paid to Anthropic). It also runs in ChatGPT, even on the free plan, with simpler animations. ',
    'You need a Claude Pro plan from Anthropic, the company behind Claude. ')
assert "$20" not in s, [s[i-60:i+40] for i in range(len(s)) if s.startswith("$20", i)][:3]
# Jan, 2026-11-18: the FAQ looked like a wall to read before buying. Renamed to "Common questions" and merged 14 answers into 6
# (same facts, nothing new claimed). The ChatGPT answer is off the page (it contradicted "What you need: Claude Pro").
rep('<h2 id="h-faq">Before <span class="g">you buy</span></h2>', '<h2 id="h-faq">Common <span class="g">questions</span></h2>')
def _q(q, a): return '<details class="rv"><summary>%s<i aria-hidden="true"></i></summary><p>%s</p></details>' % (q, a)
FAQ = "\n      ".join([
    _q("What do I get?", "Files you add to Claude (an AI app, like ChatGPT). Drop one file in and it sets itself up. Then you type a topic, or let it pick one, "
       "and it makes the whole video: script, animation, captions timed to each word and a voice. You get 12 styles, a daily video, 100 ready topics and templates for hooks and captions."),
    _q("What does it cost?", "$19 once (launch price, then $29). No subscription from us. The system runs in Claude Pro, a plan from Anthropic, the company behind Claude. "
       "The voice uses a free ElevenLabs account, and Claude helps you create it."),
    _q("Is it safe to pay, and can I get my money back?", "Yes. You pay through Gumroad, a US platform for digital products. It accepts international cards and delivers your files "
       "the moment you pay, and they are yours to keep. Not for you? Message <a href=\"https://www.instagram.com/theaitoolfinds/\" target=\"_blank\" rel=\"noopener\">@theaitoolfinds</a> "
       "on Instagram within 7 days and you get your money back."),
    _q("How much work is it?", "Almost none. Yes, the daily video is automatic: every day Claude prepares a new video for you, on your topic or one from your plan. "
       "You watch it, ask for a change in plain words if you want one, and upload it to Instagram, TikTok or YouTube. One video takes about 30 minutes to make."),
    _q("Do I need experience or a special computer?", "No experience. You never open an editor, and Claude does the installing. You need a Mac or Windows computer for the one-time setup. "
       "After that you can also make videos from the Claude app on your phone. Stuck? Tell Claude what you see, or message @theaitoolfinds and we'll help you."),
    _q("Are the videos mine? Will they go viral?", "Every video you make is 100% yours: your channel, your clients, your business. Nobody can promise views. "
       "What you get are the same styles behind our " + VIEWS + " views in our first month (IG)."),
])
i = s.index('<div class="faq">') + len('<div class="faq">'); j = s.rindex('</details>', i, s.index('</section>', i)) + len('</details>')
s = s[:i] + "\n      " + FAQ + s[j:]
rep('in <b>12 styles tuned to get views.</b>', 'in <b>12 styles tuned to grab attention.</b>')
# Jan, 2026-11-18: a video takes about 20 minutes (not 30), and the top video is at 814K views now (his Instagram numbers).
n30 = s.count("~30 min"); assert n30 >= 3, n30
s = s.replace("~30 min", "~20 min").replace('<b class="g">~30<small> min</small></b>', '<b class="g">~20<small> min</small></b>')
rep("count(12,30,8350,1150,", "count(12,20,8350,1150,")
rep("About 30 minutes, including one round of changes", "About 20 minutes, including one round of changes")
rep("One video takes about 30 minutes to make.", "One video takes about 20 minutes to make.")
rep("Times are from our run of the coffee video above and are approximate.", "Times are approximate.")
assert s.count("736K") == 5, s.count("736K"); s = s.replace("736K", "814K")
assert "30 min" not in s and "about 30" not in s.lower()
# Jan, 2026-11-18: "How it works" as the buyer lives it: 1 drop the file into Claude and type one line, 2 Claude sets everything
# up, 3 a finished video every day. (The "type a topic -> video" story stays in the "One line in. A video out." demo above.)
rep('<h2 id="h-steps">Type. Wait. <span class="g">Post.</span></h2>', '<h2 id="h-steps">Set up once. <span class="g">Videos daily.</span></h2>')
rep('<p>One-time setup first. Claude does the installing.</p>', '<p>Three steps. The first two happen only once.</p>')
rep('<h3>Type a topic</h3>\n        <p class="type"><span><span id="typed">/story how bees make honey</span>',
    '<h3>Drop it into Claude</h3>\n        <p>Drag the file you get into Claude and type one line:</p>\n        <p class="type"><span><span id="typed">Set this up</span>')
rep('<h3>Claude builds it</h3>\n        <p>Script, scenes, captions and voice. About 20 minutes, including one round of changes you ask for in plain words.</p>',
    '<h3>Claude sets everything up</h3>\n        <p>It installs everything, sets up your voice with you and makes your first video. Nothing technical for you to do.</p>')
for a, b in (("Script", "Install"), ("Scenes", "12 styles"), ("Captions", "Voice"), ("Voice", "First video")):
    i = s.index('<ul class="ticks"'); j = s.index('</ul>', i); blk = s[i:j]
    assert blk.count('>' + a + '</li>') == 1, (a, blk.count('>' + a + '</li>'))
    s = s[:i] + blk.replace('>' + a + '</li>', '>\x00' + b + '</li>') + s[j:]
s = s.replace('\x00', '')
rep('<h3>Download and post</h3>\n        <p>A 9:16 MP4, ready for Reels, TikTok and Shorts.</p>',
    '<h3>A finished video every day</h3>\n        <p>On any topic you want, in 12 tuned styles. Watch it, download it and post it.</p>')
# Jan, 2026-11-18: he confirmed the daily video arrives with his computer off (the scheduled task runs in Claude's cloud).
rep('On any topic you want, in 12 tuned styles. Watch it, download it and post it.</p>',
    'On any topic you want, in 12 tuned styles. Wake up to a new video, ready to post.</p>')
rep('on your topic or one from your plan. ', 'on your topic or one from your plan, even when your computer is off. ')
# Jan, 2026-11-18: reel badges were stale. From data/stats.json pulled today (Zernio, lags a little behind Instagram):
# explainer-styles reel styles33 = 138,000 (was "131K"), what's-inside reel inside3 = 133,438 (was "129K").
assert s.count("131K") == 6 and s.count("129K") == 4, (s.count("131K"), s.count("129K"))
s = s.replace("131K", "138K").replace("129K", "133K")
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
