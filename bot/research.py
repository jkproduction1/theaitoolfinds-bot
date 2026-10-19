"""Open the tool's website and pull out real text, so the script is based on facts
(not on what the AI imagines the tool does)."""
import os
import re
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, urlunparse

import requests

from . import config

BLOCKED_MARKERS = ("just a moment", "verify you are human", "attention required", "access denied")


class _Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts, self.skip = [], 0
        self.title, self.meta = "", {}
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "noscript", "svg"):
            self.skip += 1
        if tag == "title":
            self._in_title = True
        if tag == "meta":
            key = (a.get("property") or a.get("name") or "").lower()
            if key in ("description", "og:description", "og:title", "og:image", "og:site_name"):
                self.meta[key] = a.get("content", "")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "svg") and self.skip:
            self.skip -= 1
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif not self.skip:
            t = data.strip()
            if t:
                self.parts.append(t)


def clean_url(url: str) -> str:
    p = urlparse(url)
    return urlunparse((p.scheme, p.netloc, p.path or "/", "", "", ""))


def fetch_github(owner: str, repo: str) -> dict:
    """Use the GitHub API: clean README text + stars + demo media links."""
    from .media import readme_media_urls

    h = {"User-Agent": config.USER_AGENT, "Accept": "application/vnd.github+json"}
    if os.getenv("GITHUB_TOKEN"):
        h["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
    info = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=h, timeout=30)
    info.raise_for_status()
    info = info.json()
    rd = requests.get(f"https://api.github.com/repos/{owner}/{repo}/readme",
                      headers=dict(h, Accept="application/vnd.github.raw"), timeout=30)
    readme = rd.text if rd.status_code == 200 else ""
    text = re.sub(r"<[^>]+>|!\[[^\]]*\]\([^)]*\)|\s+", " ", readme)
    return {
        "url": f"https://github.com/{owner}/{repo}",
        "title": f"{info.get('full_name')} - {info.get('description') or ''}",
        "description": info.get("description") or "",
        "site_name": "GitHub",
        "og_image": "",
        "homepage": (info.get("homepage") or "").strip(),
        "stars": info.get("stargazers_count", 0),
        "license": (info.get("license") or {}).get("spdx_id", ""),
        "is_repo": True,
        "media_urls": readme_media_urls(owner, repo, readme),
        "text": text[:6000],
    }


def fetch(url: str) -> dict:
    p0 = urlparse(url)
    parts = [x for x in p0.path.split("/") if x]
    if p0.netloc.endswith("github.com") and len(parts) >= 2:
        return fetch_github(parts[0], parts[1])

    """Follow redirects (Product Hunt links redirect to the real site) and read the page."""
    r = requests.get(url, headers={"User-Agent": config.USER_AGENT}, timeout=30,
                     allow_redirects=True)
    r.raise_for_status()
    final = clean_url(r.url)
    p = _Text()
    p.feed(r.text)
    text = re.sub(r"\s+", " ", " ".join(p.parts))
    title = re.sub(r"\s+", " ", p.title).strip()
    if any(m in (title + text[:300]).lower() for m in BLOCKED_MARKERS):
        raise RuntimeError("site is behind a bot wall")
    ig = None
    for h in re.findall(r"instagram\.com/([A-Za-z0-9_.]{2,30})/?[\"'?]", r.text):
        if h.lower() not in ("p", "reel", "reels", "explore", "accounts", "stories", "tv",
                             "instagram", "share", "direct"):
            ig = h.strip(".")
            break
    return {
        "instagram": ig,
        "url": final,
        "title": title,
        "description": p.meta.get("og:description") or p.meta.get("description", ""),
        "site_name": p.meta.get("og:site_name", ""),
        "og_image": urljoin(final, p.meta.get("og:image", "")) if p.meta.get("og:image") else "",
        "media_urls": [],
        "text": text[:6000],
    }
