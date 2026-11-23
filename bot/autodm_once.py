"""Turn on auto-DM for an already scheduled/published post:
python -m bot.autodm_once <zernio_post_id> <videos-branch folder> [<vb dir>]

Change the link button of existing automations (Jan, 2026-11-16: prompt PDFs on Drive for the top videos):
python -m bot.autodm_once seturl dry|apply     reads data/dm_links.json = {"<automation name: tool (KEYWORD)>": "<new url>"}
Only the url of url-buttons changes; texts, keywords, post binding and audience stay as they are. Log: logs/autodm.log

Story replies (Jan, 2026-11-17): python -m bot.autodm_once story dry|apply <KEYWORD>
Creates ONE Zernio automation with trigger "story_reply" (any story, no post binding) that answers the keyword with a DM and a
"Get the system" button. Existing automations are only read, never changed; if a story_reply automation with that keyword exists,
nothing is created.

DM video (Jan, 2026-11-18): python -m bot.autodm_once media dry|apply <automation id|all>
Adds the "free prompt vs system" video (data/dm_system.json dm_media_file, uploaded to Zernio once, url cached as dm_media_url)
as a second DM message, the new dm_full texts and a click tag, to our own prompt automations (hosts_full). Buttons, keywords,
post binding, audience and follow gate stay as they are. Start with ONE id, check its logs (mediaError), then "all"."""
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
        mine = [b for b in btns if b.get("type") == "url" and "viral-styles-launchpad" not in (b.get("url") or "")]  # never the system button
        old = [b.get("url") for b in mine]
        tag = f"{aid} {a.get('name')} keywords={a.get('keywords')}"
        if not old:
            out.append(f"SKIP (no url button) {tag}")
            continue
        if all(u == url for u in old):
            out.append(f"already set {tag}")
            continue
        for b in mine:
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


def story(apply: bool, kw: str) -> None:
    cfg = json.loads(Path("data/dm_system.json").read_text())
    data = poster._z("GET", "/comment-automations")
    items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
    out = [f"STORY {'APPLY' if apply else 'DRY'} keyword={kw}: {len(items)} automations exist"]
    same = [a for a in items if kw.lower() in [str(k).lower() for k in (a.get("keywords") or [])]]
    for a in same:
        out.append(f"has keyword: {a.get('id') or a.get('_id')} {a.get('name')} trigger={a.get('trigger')} active={a.get('isActive')} dms={a.get('alsoMatchInDms')}")
    acc = poster.instagram_account()
    prof = acc.get("profileId")
    prof = prof.get("_id") if isinstance(prof, dict) else prof
    body = {
        "profileId": prof, "accountId": acc.get("_id") or acc.get("id"), "name": f"Story reply ({kw})",
        "trigger": "story_reply", "keywords": [kw, kw.lower()], "matchMode": "word", "typoTolerance": True,
        "dmMessage": "Here's the system 👇\nType a topic and Claude builds the whole video: script, animation, captions.",
        "dmMessageVariations": ["Here you go 👇\nOne line in, finished video out. No editing, no camera, no face.",
                                "As promised 👇\nThe same styles as my videos, on any topic you type."],
        "buttons": [{"type": "url", "title": cfg["system_title"][:20],
                     "url": "https://theaitoolfinds.gumroad.com/l/viral-styles-launchpad/LAUNCH?utm_source=ig&utm_medium=story&utm_content=reply_" + kw.lower()}],
    }
    shown = {k: v for k, v in body.items() if k not in ("profileId", "accountId")}
    if any(a.get("trigger") == "story_reply" for a in same):
        out.append("story_reply automation with this keyword already exists: nothing created")
    elif not apply:
        out.append("would create: " + json.dumps(shown, ensure_ascii=False))
    else:
        try:
            res = poster._z("POST", "/comment-automations", json=body)
            got = res.get("automation") or res
            out.append(f"created {got.get('_id') or got.get('id')} trigger={got.get('trigger')} keywords={got.get('keywords')} active={got.get('isActive')} buttons={[b.get('url') for b in (got.get('buttons') or [])]}")
        except Exception as e:
            out.append(f"FAILED: {e}")
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))


def media(apply: bool, which: str) -> None:
    cfg_p = Path("data/dm_system.json")
    cfg = json.loads(cfg_p.read_text())
    url = cfg.get("dm_media_url") or ""
    out = [f"MEDIA {'APPLY' if apply else 'DRY'} target={which}"]
    if apply and not url:
        url = poster.upload(Path(cfg["dm_media_file"]), "video/mp4")
        cfg["dm_media_url"] = url
        cfg_p.write_text(json.dumps(cfg, indent=1, ensure_ascii=False))
        out.append(f"uploaded {cfg['dm_media_file']} -> {url}")
    data = poster._z("GET", "/comment-automations")
    items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
    done = 0
    for a in items:
        aid = a.get("id") or a.get("_id")
        if which != "all" and aid != which:
            continue
        urls = [b for b in (a.get("buttons") or []) if b.get("type") == "url" and "viral-styles-launchpad" not in (b.get("url") or "")]
        host = (urls[0].get("url") or "").split("/")[2] if urls and "//" in (urls[0].get("url") or "") else ""
        if host not in cfg["hosts_full"] or a.get("trigger") not in (None, "comment"):
            if which != "all":
                out.append(f"SKIP {aid} {a.get('name')}: not one of our prompt automations (host={host}, trigger={a.get('trigger')})")
            continue
        patch = {"dmMedia": {"type": "video", "url": url or "<uploaded on apply>"}, "linkTracking": True, "clickTag": cfg.get("click_tag", "dm_click"),
                 "dmMessage": cfg["dm_full"][0], "dmMessageVariations": cfg["dm_full"][1:]}
        if not apply:
            out.append(f"would set {aid} {a.get('name')} active={a.get('isActive')} stats={json.dumps(a.get('stats'))[:160]}")
            continue
        try:
            got = poster._z("PATCH", f"/comment-automations/{aid}", json=patch)
            got = got.get("automation") or got
            done += 1
            out.append(f"set {aid} {a.get('name')}: dmMedia={json.dumps(got.get('dmMedia'))[:120]} clickTag={got.get('clickTag')} linkTracking={got.get('linkTracking')}")
        except Exception as e:
            out.append(f"FAILED {aid} {a.get('name')}: {e}")
    if which != "all":  # latest log rows of the tested automation (mediaError shows here)
        try:
            lg = poster._z("GET", f"/comment-automations/{which}/logs")
            rows = lg.get("logs") or lg.get("data") or (lg if isinstance(lg, list) else [])
            keys = ("createdAt", "commenterUsername", "status", "error", "audienceOutcome", "mediaError", "mediaStatus", "platformError")
            for r in rows[:15]:
                out.append("  LOG " + json.dumps({k: r.get(k) for k in keys if r.get(k) is not None}, ensure_ascii=False)
                           + " | media: " + json.dumps({k: v for k, v in r.items() if "media" in k.lower()}, ensure_ascii=False)[:200])
        except Exception as e:
            out.append(f"  LOGS failed: {e}")
    out.append(f"changed {done}")
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))


def ig(apply: bool, code: str, kw: str) -> None:
    """Auto-DM for a reel Jan posted himself (not via Zernio), Jan 2026-11-23:
    python -m bot.autodm_once ig dry|apply <reel shortcode> <KEYWORD>
    Finds the reel's Instagram media id in Zernio /analytics (source=all) by its URL, bound via platformPostId.
    DM = "Get the prompts" (data/dm_manual.json[<shortcode>].prompts_url) + "Get the system" (utm_content=<keyword>),
    same dm_full texts / DM video as our own prompt automations. dry = only look up and print, nothing is created."""
    out = [f"IG {'APPLY' if apply else 'DRY'} code={code} kw={kw}"]
    cfg = json.loads(Path("data/dm_system.json").read_text())
    manual = json.loads(Path("data/dm_manual.json").read_text()) if Path("data/dm_manual.json").exists() else {}
    hit, page = None, 1
    while not hit and page <= 4:
        d = poster._z("GET", "/analytics", params={"source": "all", "limit": 50, "page": page, "sort_by": "date"})
        for p in d.get("posts") or []:
            for x in p.get("platforms") or []:
                if code in (x.get("platformPostUrl") or ""):
                    hit = (p, x)
        if not d.get("posts"):
            break
        page += 1
    if not hit:  # fallback: Zernio inbox lists the account's posts with comments (permalink + IG media id)
        try:
            acc_id = poster.instagram_account().get("_id")
            d = poster._z("GET", "/inbox/comments", params={"accountId": acc_id, "limit": 50})
            rows = d.get("data") or d.get("posts") or d.get("comments") or (d if isinstance(d, list) else [])
            for r in rows:
                if code in json.dumps(r):
                    hit = ({"content": r.get("caption") or r.get("content") or ""},
                           {**r, "platformPostId": r.get("platformPostId") or r.get("postId") or r.get("id")})
                    break
            if not hit:
                out.append("inbox sample: " + json.dumps(rows[:2], ensure_ascii=False)[:1200])
        except Exception as e:
            out.append(f"inbox lookup failed: {e}")
    if not hit:
        out.append("reel NOT found in /analytics or /inbox/comments; nothing created")
    else:
        p, x = hit
        mid = x.get("platformPostId") or x.get("postId") or x.get("id")
        out.append("found: " + json.dumps({k: v for k, v in x.items() if k != "analytics"}, ensure_ascii=False)[:600])
        out.append("caption: " + (p.get("content") or "")[:600])
        data = poster._z("GET", "/comment-automations")
        items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
        clash = [a.get("name") for a in items if kw.lower() in [k.lower() for k in (a.get("keywords") or [])]]
        out.append(f"keyword {kw} already used by: {clash}")
        purl = (manual.get(code) or {}).get("prompts_url")
        out.append(f"media id={mid} prompts_url={purl}")
        if apply and mid and purl:  # clash only warned: comments are bound to the post; DMs stay with the older automation
            acc = poster.instagram_account()
            prof = acc.get("profileId")
            prof = prof.get("_id") if isinstance(prof, dict) else prof
            c = poster.dm_copy(code, kw, "Claude prompts")
            body = {"profileId": prof, "accountId": acc.get("_id") or acc.get("id"), "platformPostId": str(mid),
                    "postTitle": f"Manual reel {code}", "name": f"Manual reel {code} ({kw})",
                    "trigger": "comment", "keywords": [kw, kw.lower()], "matchMode": "word", "typoTolerance": True,
                    "alsoMatchInDms": not clash, **{k: v for k, v in c.items() if k != "btn"},
                    "dmMessage": cfg["dm_full"][0], "dmMessageVariations": cfg["dm_full"][1:],
                    "buttons": [{"type": "url", "title": cfg["prompts_title"][:20], "url": purl},
                                {"type": "url", "title": cfg["system_title"][:20], "url": cfg["system_url"] + kw.lower()}],
                    "audience": {"followerStatus": "follower", "whenUnknown": "verify"}}
            if cfg.get("dm_media_url"):
                body["dmMedia"] = {"type": "video", "url": cfg["dm_media_url"]}
                body["linkTracking"], body["clickTag"] = True, cfg.get("click_tag", "dm_click")
            res = poster._z("POST", "/comment-automations", json=body)
            out.append("CREATED " + json.dumps(res.get("automation") or res, ensure_ascii=False)[:500])
        elif apply:
            out.append("NOT created (missing media id or prompts_url)")
    Path("logs").mkdir(exist_ok=True)
    Path("logs/autodm.log").write_text("\n".join(out))
    print("\n".join(out))


if sys.argv[1] == "ig":
    ig(sys.argv[2] == "apply", sys.argv[3], sys.argv[4])
elif sys.argv[1] == "setdm":
    setdm(len(sys.argv) > 2 and sys.argv[2] == "apply")
elif sys.argv[1] == "seturl":
    seturl(len(sys.argv) > 2 and sys.argv[2] == "apply")
elif sys.argv[1] == "media":
    media(len(sys.argv) > 2 and sys.argv[2] == "apply", sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith(".") else "none")
elif sys.argv[1] == "story":
    story(len(sys.argv) > 2 and sys.argv[2] == "apply", sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith(".") else "SYSTEM")
else:
    pid, name = sys.argv[1], sys.argv[2]
    vb = Path(sys.argv[3] if len(sys.argv) > 3 else "../vb")
    meta = json.loads((vb / name / "meta.json").read_text())
    print("automation", poster.auto_dm(pid, meta))
    telegram.notify(f"🤖 Auto-DM zapnutej pro {meta['tool_name']}: keyword {meta['keyword']}")
