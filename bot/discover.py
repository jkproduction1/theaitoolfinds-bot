"""Find candidate AI tools from free public sources (no API keys needed).

Focus niches: video editing / generation, design / images, vibe coding / AI coding agents,
free open-source GitHub repos ("free alternative to a paid tool" goes viral), voice/audio,
agents & automation.

Sources (all best-effort; if one fails the others still work):
  queue        data/queue.txt - URLs you add yourself (always first)
  gh-trending  GitHub Trending (daily + weekly), stars gained today
  gh-search    GitHub search per niche: new repos that got many stars fast
  hf-spaces    Hugging Face trending Spaces (free in-browser AI demos)
  reddit       top posts of the day in AI / creator subreddits
  hackernews   Show HN + front-page AI launches
"""
import html as htmllib
import json
import os
import re
import time
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import requests

from . import config

NICHES = {
    "video": r"video|edit(ing|or)|clip|subtitle|caption|premiere|after effects|davinci|"
             r"animation|motion|youtube|tiktok|reels|lip.?sync|avatar|film",
    "design": r"design|figma|\bui\b|\bux\b|image|photo|logo|thumbnail|illustrat|diffusion|"
              r"flux|comfyui|upscal|background|\b3d\b|render|\bart\b|font|icon",
    "coding": r"cod(e|ing)|vibe|agent|cursor|claude code|copilot|\bide\b|developer|"
              r"app builder|website builder|no.?code|\bmcp\b|\bcli\b|terminal|web app",
    "voice": r"voice|speech|\btts\b|text.to.speech|audio|music|podcast|transcri|dubb|clone",
    "automation": r"automat|workflow|agent|browser|scrap|n8n|zapier|assistant|notion|email",
    "writing": r"writ|copy|blog|\bseo\b|content|script|newsletter",
}
NICHE_RE = {k: re.compile(v, re.I) for k, v in NICHES.items()}
AI_RE = re.compile(
    r"\b(ai|a\.i\.|gpt|llm|llms|agent|agents|claude|gemini|openai|copilot|genai|generative|"
    r"diffusion|flux|whisper|tts|text-to-\w+|model|models|neural|ml|vision|chatbot|rag|mcp)\b",
    re.I)

SKIP_DOMAINS = {
    "youtube.com", "youtu.be", "twitter.com", "x.com", "medium.com", "substack.com",
    "reddit.com", "news.ycombinator.com", "arxiv.org", "linkedin.com", "apps.apple.com",
    "play.google.com", "i.redd.it", "v.redd.it", "imgur.com", "producthunt.com",
}
HEADERS = {"User-Agent": config.USER_AGENT, "Accept-Language": "en-US,en;q=0.9"}


def domain_of(url: str) -> str:
    p = urlparse(url)
    d = p.netloc.lower()
    d = d[4:] if d.startswith("www.") else d
    if d in ("github.com", "huggingface.co"):  # each repo / space counts as its own "site"
        parts = [x for x in p.path.split("/") if x][:3 if d == "huggingface.co" else 2]
        return "/".join([d] + parts).lower()
    return d


def niches_of(text: str) -> list[str]:
    return [k for k, r in NICHE_RE.items() if r.search(text)]


def _get(url, **kw):
    kw.setdefault("timeout", 25)
    kw.setdefault("headers", HEADERS)
    return requests.get(url, **kw)


def _gh_headers():
    h = dict(HEADERS, Accept="application/vnd.github+json")
    if os.getenv("GITHUB_TOKEN"):
        h["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
    return h


def _cand(name, url, desc, source, score, **extra):
    return {"name": (name or "").strip()[:100], "url": url, "desc": (desc or "").strip()[:260],
            "source": source, "score": int(score), **extra}


# ------------------------------------------------------------------ sources
def from_queue():
    path = config.DATA / "queue.txt"
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(maxsplit=1)
        url = parts[0] if parts[0].startswith("http") else "https://" + parts[0]
        out.append(_cand(domain_of(url), url, parts[1] if len(parts) > 1 else "", "queue",
                         100_000, queue_line=line))
    return out


def from_github_trending():
    out = []
    for since in ("daily", "weekly"):
        try:
            r = _get(f"https://github.com/trending?since={since}")
            r.raise_for_status()
            for art in re.findall(r'<article class="Box-row">(.*?)</article>', r.text, re.S):
                m = re.search(r'<h2[^>]*>\s*<a[^>]*href="/([^"]+)"', art)
                if not m:
                    continue
                repo = m.group(1).strip()
                d = re.search(r"<p[^>]*>(.*?)</p>", art, re.S)
                desc = htmllib.unescape(re.sub(r"<[^>]+>|\s+", " ", d.group(1))).strip() if d else ""
                gained = re.search(r"([\d,]+)\s+stars (today|this week)", art)
                g = int(gained.group(1).replace(",", "")) if gained else 0
                if not AI_RE.search(f"{repo} {desc}"):
                    continue
                out.append(_cand(repo.split("/")[-1], f"https://github.com/{repo}", desc,
                                 "gh-trending", g if since == "daily" else g // 4,
                                 stars_gained=f"{g} stars {gained.group(2) if gained else ''}"))
        except Exception as ex:
            print(f"[discover] github trending {since} failed: {ex}")
    return out


GH_QUERIES = [
    "video editing ai", "video generation", "ai video", "subtitles ai", "lip sync",
    "image generation", "design ai", "figma ai", "upscaler", "background removal", "comfyui",
    "vibe coding", "coding agent", "claude code", "mcp server", "app builder ai",
    "text to speech", "voice cloning", "music generation", "ai agent browser",
    "open source alternative",
]


def from_github_search():
    out = []
    since = (datetime.now(timezone.utc) - timedelta(days=21)).strftime("%Y-%m-%d")
    for q in GH_QUERIES:
        try:
            r = _get("https://api.github.com/search/repositories",
                     params={"q": f"{q} created:>{since} stars:>150", "sort": "stars",
                             "order": "desc", "per_page": 8},
                     headers=_gh_headers())
            if r.status_code in (403, 429):  # rate limit -> stop politely
                print("[discover] github search rate-limited")
                break
            r.raise_for_status()
            for repo in r.json().get("items", []):
                text = f"{repo['name']} {repo.get('description') or ''} {' '.join(repo.get('topics', []))}"
                if not AI_RE.search(text):
                    continue
                age = max(1, (datetime.now(timezone.utc) - datetime.fromisoformat(
                    repo["created_at"].replace("Z", "+00:00"))).days)
                out.append(_cand(repo["name"], repo["html_url"], repo.get("description"),
                                 "gh-search", repo["stargazers_count"] / age * 3,
                                 stars=repo["stargazers_count"]))
            time.sleep(2.2)  # search API: 30 requests / minute
        except Exception as ex:
            print(f"[discover] github search '{q}' failed: {ex}")
    return out


def from_hf_spaces():
    out = []
    try:
        r = _get("https://huggingface.co/api/spaces",
                 params={"sort": "trendingScore", "direction": -1, "limit": 60, "full": "true"})
        r.raise_for_status()
        for s in r.json():
            sid = s.get("id", "")
            card = s.get("cardData") or {}
            desc = card.get("short_description") or card.get("title") or ""
            out.append(_cand(card.get("title") or sid.split("/")[-1],
                             f"https://huggingface.co/spaces/{sid}", desc, "hf-spaces",
                             (s.get("trendingScore") or s.get("likes", 0)) * 2,
                             likes=s.get("likes", 0)))
    except Exception as ex:
        print(f"[discover] hf spaces failed: {ex}")
    return out


SUBREDDITS = ["StableDiffusion", "ClaudeAI", "LocalLLaMA", "vibecoding", "aivideo",
              "ChatGPTCoding", "comfyui", "artificial", "SideProject", "VideoEditing"]


def from_reddit():
    out = []
    for sub in SUBREDDITS:
        try:
            r = _get(f"https://www.reddit.com/r/{sub}/top.json",
                     params={"t": "day", "limit": 15},
                     headers={"User-Agent": "theaitoolfinds-bot/1.0 (daily AI tool digest)"})
            if r.status_code != 200:
                print(f"[discover] reddit r/{sub}: HTTP {r.status_code}")
                if r.status_code in (403, 429):
                    break
                continue
            for p in r.json()["data"]["children"]:
                d = p["data"]
                url = d.get("url_overridden_by_dest") or ""
                if not url.startswith("http") or domain_of(url).split("/")[0] in SKIP_DOMAINS:
                    m = re.search(r"https?://[^\s)\]]+", d.get("selftext", ""))
                    url = m.group(0) if m else ""
                if not url or domain_of(url).split("/")[0] in SKIP_DOMAINS:
                    continue
                out.append(_cand(d["title"], url, d.get("selftext", "")[:240], "reddit",
                                 d.get("score", 0) // 3, subreddit=sub))
            time.sleep(1)
        except Exception as ex:
            print(f"[discover] reddit r/{sub} failed: {ex}")
    return out


def from_hackernews():
    out = []
    since = int(time.time()) - 4 * 86400
    for tags, pts in (("show_hn", 15), ("story", 120)):
        try:
            r = _get("https://hn.algolia.com/api/v1/search_by_date",
                     params={"tags": tags, "hitsPerPage": 100,
                             "numericFilters": f"created_at_i>{since},points>={pts}"})
            r.raise_for_status()
            for h in r.json().get("hits", []):
                url, title = h.get("url"), h.get("title", "")
                if not url or not AI_RE.search(title):
                    continue
                if domain_of(url).split("/")[0] in SKIP_DOMAINS:
                    continue
                out.append(_cand(re.sub(r"^Show HN:\s*", "", title), url, "", "hackernews",
                                 h.get("points", 0)))
        except Exception as ex:
            print(f"[discover] hackernews {tags} failed: {ex}")
    return out


# ------------------------------------------------------------------ combine
def load_history():
    path = config.DATA / "history.json"
    return json.loads(path.read_text()) if path.exists() else []


def candidates():
    history = load_history()
    used_domains = {h["domain"] for h in history}
    used_names = {h["name"].lower() for h in history}

    queue = from_queue()
    found = []
    for fn in (from_github_trending, from_github_search, from_hf_spaces, from_reddit,
               from_hackernews):
        got = fn()
        print(f"[discover] {fn.__name__[5:]}: {len(got)}")
        found += got

    best = {}
    for c in found:
        key = domain_of(c["url"])
        if key in used_domains or c["name"].lower() in used_names:
            continue
        c["niches"] = niches_of(f"{c['name']} {c['desc']}")
        # niche bonus: these topics perform best for this account
        bonus = 1.0 + 0.6 * len({"video", "design", "coding"} & set(c["niches"]))
        c["rank_score"] = c["score"] * bonus
        if key not in best or c["rank_score"] > best[key]["rank_score"]:
            best[key] = c

    result = queue + sorted(best.values(), key=lambda c: -c["rank_score"])
    print(f"[discover] {len(queue)} from queue, {len(result)} candidates total")
    return result


if __name__ == "__main__":
    for c in candidates()[:70]:
        print(f"{c.get('rank_score', c['score']):>8.0f}  {c['source']:<11} "
              f"{','.join(c.get('niches', [])):<24} {c['name'][:42]:<42} {c['url']}")
