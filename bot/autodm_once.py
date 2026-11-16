"""Turn on auto-DM for an already scheduled/published post:
python -m bot.autodm_once <zernio_post_id> <videos-branch folder> [<vb dir>]

Change the link button of existing automations (Jan, 2026-11-16: prompt PDFs on Drive for the top videos):
python -m bot.autodm_once seturl dry|apply     reads data/dm_links.json = {"<automation name: tool (KEYWORD)>": "<new url>"}
Only the url of url-buttons changes; texts, keywords, post binding and audience stay as they are. Log: logs/autodm.log"""
import json
import sys
from pathlib import Path

from . import poster, telegram


def seturl(apply: bool) -> None:
    links = json.loads(Path("data/dm_links.json").read_text())
    data = poster._z("GET", "/comment-automations")
    items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
    out, done, seen = [f"SETURL {'APPLY' if apply else 'DRY'}: {len(items)} automations, {len(links)} links"], 0, set()
    for a in items:
        aid = a.get("id") or a.get("_id")
        title = (a.get("name") or "").strip()  # exact automation name "<tool> (<KEYWORD>)": tool names are shared by many posts
        url = links.get(title)
        if not url:
            continue
        seen.add(title)
        btns = a.get("buttons") or []
        old = [b.get("url") for b in btns if b.get("type") == "url"]
        tag = f"{aid} {a.get('name')} keywords={a.get('keywords')}"
        if not old:
            out.append(f"SKIP (no url button) {tag}")
            continue
        if all(u == url for u in old):
            out.append(f"already set {tag}")
            continue
        for b in btns:
            if b.get("type") == "url":
                b["url"] = url
        if not apply:
            out.append(f"would change {tag}: {old} -> {url}")
            continue
        try:
            poster._z("PATCH", f"/comment-automations/{aid}", json={"buttons": btns})
            done += 1
            out.append(f"changed {tag}: {old} -> {url}")
        except Exception as e:
            out.append(f"FAILED {tag}: {e}")
    for t in links:
        if t not in seen:
            out.append(f"NOT FOUND: no automation named '{t}'")
    out.append("ALL:")
    for a in items:
        out.append(" | ".join(str(x) for x in (a.get("name"), a.get("keywords"), [b.get("url") for b in (a.get("buttons") or [])], a.get("isActive"), a.get("updatedAt"), (a.get("stats") or {}).get("dmsSent"))))
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))
    if apply:
        telegram.notify(f"🤖 Auto-DM: odkaz změněn u {done} automatizací (prompt PDF na Drive)")


if sys.argv[1] == "seturl":
    seturl(len(sys.argv) > 2 and sys.argv[2] == "apply")
else:
    pid, name = sys.argv[1], sys.argv[2]
    vb = Path(sys.argv[3] if len(sys.argv) > 3 else "../vb")
    meta = json.loads((vb / name / "meta.json").read_text())
    print("automation", poster.auto_dm(pid, meta))
    telegram.notify(f"🤖 Auto-DM zapnutej pro {meta['tool_name']}: keyword {meta['keyword']}")
