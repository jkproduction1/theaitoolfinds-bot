"""Read-only: pull per-post analytics from Zernio into data/stats.json (for the learning loop in BRAIN.md).

GET /v1/analytics (Zernio API): views, likes, comments, shares, saves, reach, avg watch time,
Reels skip rate (first 3 s), TikTok completion rate, retention curve where the platform reports it.
Never posts or changes anything. Uses the existing ZERNIO_API_KEY secret.
"""
import json
import os
from datetime import date, timedelta

import requests

from . import config

ZERNIO = "https://zernio.com/api/v1"
OUT = config.DATA / "stats.json"
KEEP = ("views", "reach", "impressions", "likes", "comments", "shares", "saves", "follows", "reposts",
        "ig_reels_avg_watch_time", "reels_skip_rate", "completion_rate", "video_duration_seconds",
        "engagement_rate", "retention_curve", "profile_views")


def _get(path, params):
    r = requests.get(ZERNIO + path, params=params, timeout=120,
                     headers={"Authorization": f"Bearer {os.environ['ZERNIO_API_KEY']}"})
    if r.status_code >= 400:
        raise RuntimeError(f"Zernio {path} HTTP {r.status_code}: {r.text[:300]}")
    return r.json()


def _pick(a):
    return {k: a[k] for k in KEEP if isinstance(a, dict) and a.get(k) is not None}


def main():
    posted = json.loads((config.DATA / "posted.json").read_text()) if (config.DATA / "posted.json").exists() else []
    name_of = {p.get("post_id"): p.get("name") for p in posted}
    frm = (date.today() - timedelta(days=120)).isoformat()
    rows, page, access = [], 1, None
    while True:
        d = _get("/analytics", {"source": "all", "from_date": frm, "limit": 50, "page": page, "sort_by": "date"})
        access = d.get("hasAnalyticsAccess", access)
        posts = d.get("posts") or []
        for p in posts:
            pid = p.get("latePostId") or p.get("_id")
            rows.append({
                "name": name_of.get(pid) or name_of.get(p.get("_id")),
                "post_id": pid,
                "published_at": p.get("publishedAt"),
                "status": p.get("status"),
                "hook": (p.get("content") or "").split("\n")[0][:200],
                "total": _pick(p.get("analytics") or {}),
                "platforms": [dict(platform=x.get("platform"), url=x.get("platformPostUrl"), **_pick(x.get("analytics") or {}))
                              for x in (p.get("platforms") or [])],
            })
        pg = d.get("pagination") or {}
        if not posts or page >= (pg.get("pages") or pg.get("totalPages") or 1):
            break
        page += 1
    OUT.write_text(json.dumps({"updated": date.today().isoformat(), "analytics_access": access, "posts": rows},
                              indent=1, ensure_ascii=False))
    print(f"stats: {len(rows)} posts, analytics access: {access}")


if __name__ == "__main__":
    main()
