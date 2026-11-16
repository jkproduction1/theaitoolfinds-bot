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
        out.append(" | ".join(str(x) for x in (a.get("name"), a.get("keywords"), [b.get("url") for b in (a.get("buttons") or [])], a.get("isActive"), a.get("updatedAt"), (a.get("stats") or {}).get("dmsSent"), "aud=" + str(a.get("audience")), "gate=" + str(bool(a.get("followGate"))), "gateSent/passed/failed/skipped=" + "/".join(str((a.get("stats") or {}).get(k)) for k in ("followGateSent", "followGatePassed", "followGateFailed", "audienceSkipped")))))
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))
    if apply:
        telegram.notify(f"🤖 Auto-DM: odkaz změněn u {done} automatizací (prompt PDF na Drive)")


def setdm(apply: bool) -> None:
    """Add the "system" button (and our DM texts) to our own Claude prompt/command automations, chosen by where their link goes
    (data/dm_system.json: hosts_full = prompt PDFs, hosts_neutral = Claude docs/app links). Third-party tool automations are skipped.
    Keywords, post binding, audience, follow gate, comment replies and delays stay as they are."""
    cfg = json.loads(Path("data/dm_system.json").read_text())
    data = poster._z("GET", "/comment-automations")
    items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
    out, done, skipped = [f"SETDM {'APPLY' if apply else 'DRY'}: {len(items)} automations"], 0, 0
    cfg["ids"] = []
    for a in items:
        aid = a.get("id") or a.get("_id")
        urls = [b for b in (a.get("buttons") or []) if b.get("type") == "url" and "viral-styles-launchpad" not in (b.get("url") or "")]
        host = (urls[0].get("url") or "").split("/")[2] if urls and "//" in (urls[0].get("url") or "") else ""
        full = host in cfg["hosts_full"]
        if not (full or host in cfg["hosts_neutral"]):
            skipped += 1
            continue
        cfg["ids"].append(aid)
        kw = ((a.get("keywords") or ["dm"])[0] or "dm").lower()
        first = dict(urls[0])
        if full:
            first["title"] = cfg["prompts_title"][:20]
        btns = [first, {"type": "url", "title": cfg["system_title"][:20], "url": cfg["system_url"] + kw}]
        dm = cfg["dm_full"] if full else cfg["dm_neutral"]
        patch = {"buttons": btns, "dmMessage": dm[0], "dmMessageVariations": dm[1:]}
        if not apply:
            out.append(f"would set {'FULL' if full else 'NEUTRAL'} {aid} {a.get('name')}: {first.get('title')!r} + system?utm={kw}")
            continue
        try:
            res = poster._z("PATCH", f"/comment-automations/{aid}", json=patch)
            got = (res.get("automation") or res)
            done += 1
            out.append(f"set {'FULL' if full else 'NEUTRAL'} {aid} {a.get('name')}: {[b.get('title') for b in (got.get('buttons') or [])]} variations={len(got.get('dmMessageVariations') or [])}")
        except Exception as e:
            out.append(f"FAILED {aid} {a.get('name')}: {e}")
    out.append(f"selected {len(cfg['ids'])}, skipped {skipped} (third-party tool links)")
    if apply:
        Path("logs").mkdir(exist_ok=True)
        Path("logs/autodm.log").write_text("\n".join(out))
        print("\n".join(out))
        telegram.notify(f"🤖 Auto-DM: tlačítko „Get the system“ u {done} automatizací")
        return
    for a in items:  # state + latest log entries of the listed automations (read-only)
        aid = a.get("id") or a.get("_id")
        if aid not in cfg["ids"][:3]:
            continue
        out.append(f"STATE {aid} {a.get('name')} active={a.get('isActive')} updated={a.get('updatedAt')} stats={json.dumps(a.get('stats'))}")
        try:
            lg = poster._z("GET", f"/comment-automations/{aid}/logs")
            rows = lg.get("logs") or lg.get("data") or (lg if isinstance(lg, list) else [])
            for r in rows[:8]:
                out.append("  LOG " + json.dumps({k: r.get(k) for k in ("createdAt", "status", "error", "type", "trigger", "commentText", "text", "step") if r.get(k) is not None}, ensure_ascii=False)[:400])
            if not rows:
                out.append("  LOG raw " + json.dumps(lg, ensure_ascii=False)[:600])
        except Exception as e:
            out.append(f"  LOGS failed: {e}")
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))
    if apply:
        telegram.notify(f"🤖 Auto-DM: dvě tlačítka (prompty + systém) u {done} automatizací")


if sys.argv[1] == "setdm":
    setdm(len(sys.argv) > 2 and sys.argv[2] == "apply")
elif sys.argv[1] == "seturl":
    seturl(len(sys.argv) > 2 and sys.argv[2] == "apply")
else:
    pid, name = sys.argv[1], sys.argv[2]
    vb = Path(sys.argv[3] if len(sys.argv) > 3 else "../vb")
    meta = json.loads((vb / name / "meta.json").read_text())
    print("automation", poster.auto_dm(pid, meta))
    telegram.notify(f"🤖 Auto-DM zapnutej pro {meta['tool_name']}: keyword {meta['keyword']}")
