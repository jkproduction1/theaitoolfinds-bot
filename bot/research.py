"""Open the tool's website and pull out real text, so the script is based on facts
(not on what the AI imagines the tool does)."""
import re
from html.parser import HTMLParser
from urllib.parse import urlparse, urlunparse

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


def fetch(url: str) -> dict:
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
    return {
        "url": final,
        "title": title,
        "description": p.meta.get("og:description") or p.meta.get("description", ""),
        "site_name": p.meta.get("og:site_name", ""),
        "og_image": p.meta.get("og:image", ""),
        "text": text[:6000],
    }
