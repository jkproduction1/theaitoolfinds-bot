"""Find candidate AI tools from free public sources (no API keys needed).

Sources:
  1. data/queue.txt   - URLs you add yourself (always used first)
  2. Product Hunt     - AI category feed
  3. Hacker News      - "Show HN" posts about AI
  4. GitHub           - fast-growing new AI repos (agents, coding tools...)
"""
import html
import json
import os
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import requests

from . import config

AI_WORDS = re.compile(
    r"\b(ai|a\.i\.|gpt|llm|agent|agents|claude|gemini|copilot|chatbot|genai|"
    r"generat\w*|text-to-\w+|voice|video|image|avatar|transcri\w*|automat\w*|"
    r"vibe|coding|code|design|copywrit\w*|ml|model|diffusion|prompt)\b",
    re.I,
)
SKIP_DOMAINS = {
    "github.com", "youtube.com", "youtu.be", "twitter.com", "x.com",
    "medium.com", "substack.com", "reddit.com", "news.ycombinator.com",
    "arxiv.org", "huggingface.co", "linkedin.com", "apps.apple.com", "play.google.com",
}
HEADERS = {"User-Agent": config.USER_AGENT}


def domain_of(url: str) -> str:
    p = urlparse(url)
    d = p.netloc.lower()
    d = d[4:] if d.startswith("www.") else d
    if d == "github.com":  # each repo counts as its own "site"
        parts = [x for x in p.path.split("/") if x][:2]
        return "/".join([d] + parts).lower()
    return d


def _get(url, **kw):
    kw.setdefault("timeout", 25)
    kw.setdefault("headers", HEADERS)
    return requests.get(url, **kw)


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
        out.append({
            "name": domain_of(url), "url": url,
            "desc": parts[1] if len(parts) > 1 else "",
            "source": "queue", "score": 10_000, "queue_line": line,
        })
    return out


def from_producthunt():
    out = []
    try:
        r = _get("https://www.producthunt.com/feed?category=artificial-intelligence")
        r.raise_for_status()
        ns = {"a": "http://www.w3.org/2005/Atom"}
        root = ET.fromstring(r.content)
        for e in root.findall("a:entry", ns)[:40]:
            title = (e.findtext("a:title", "", ns) or "").strip()
            content = html.unescape(e.findtext("a:content", "", ns) or "")
            tagline = re.sub(r"<[^>]+>", " ", content)
            tagline = re.sub(r"\s+", " ", tagline).replace("Discussion | Link", "").strip()
            link = re.search(r'href="(https://www\.producthunt\.com/r/[^"]+)"', content)
            page = e.find("a:link", ns)
            out.append({
                "name": title, "desc": tagline[:240],
                "url": link.group(1) if link else (page.get("href") if page is not None else ""),
                "source": "producthunt", "score": 50,
            })
    except Exception as ex:
        print(f"[discover] producthunt failed: {ex}")
    return out


def from_hackernews():
    out = []
    try:
        since = int(time.time()) - 4 * 86400
        r = _get(
            "https://hn.algolia.com/api/v1/search_by_date",
            params={"tags": "show_hn", "numericFilters": f"created_at_i>{since},points>=15",
                    "hitsPerPage": 100},
        )
        r.raise_for_status()
        for h in r.json().get("hits", []):
            url, title = h.get("url"), h.get("title", "")
            if not url or not AI_WORDS.search(title):
                continue
            out.append({
                "name": re.sub(r"^Show HN:\s*", "", title)[:120], "url": url, "desc": "",
                "source": "hackernews", "score": h.get("points", 0),
            })
    except Exception as ex:
        print(f"[discover] hackernews failed: {ex}")
    return out


def from_github():
    out = []
    try:
        since = (datetime.now(timezone.utc) - timedelta(days=10)).strftime("%Y-%m-%d")
        headers = dict(HEADERS)
        if os.getenv("GITHUB_TOKEN"):
            headers["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
        r = _get(
            "https://api.github.com/search/repositories",
            params={"q": f"created:>{since} stars:>300", "sort": "stars", "order": "desc",
                    "per_page": 50},
            headers=headers,
        )
        r.raise_for_status()
        for repo in r.json().get("items", []):
            text = f"{repo['name']} {repo.get('description') or ''} {' '.join(repo.get('topics', []))}"
            if not AI_WORDS.search(text):
                continue
            home = (repo.get("homepage") or "").strip()
            # only repos with a real product website (GitHub pages look boring on video)
            if not home.startswith("http") or "github.com" in home:
                continue
            out.append({
                "name": repo["name"], "desc": (repo.get("description") or "")[:240],
                "url": home,
                "source": "github", "score": repo.get("stargazers_count", 0) // 10,
            })
    except Exception as ex:
        print(f"[discover] github failed: {ex}")
    return out


def load_history():
    path = config.DATA / "history.json"
    return json.loads(path.read_text()) if path.exists() else []


def candidates():
    history = load_history()
    used_domains = {h["domain"] for h in history}
    used_names = {h["name"].lower() for h in history}

    queue = from_queue()
    found = from_producthunt() + from_hackernews() + from_github()

    seen, result = set(), []
    for c in queue + sorted(found, key=lambda c: -c["score"]):
        if not c.get("url"):
            continue
        d = domain_of(c["url"])
        key = c["name"].lower()
        if c["source"] != "queue":
            if d in used_domains or key in used_names:
                continue
            if d in SKIP_DOMAINS and c["source"] != "github":
                continue
        if (d, key) in seen:
            continue
        seen.add((d, key))
        result.append(c)
    print(f"[discover] {len(queue)} from queue, {len(result)} candidates total")
    return result
