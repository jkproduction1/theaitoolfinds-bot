"""Print comment automations + their logs (to logs/autodm.log)."""
import json
from pathlib import Path

from . import poster

out = []
data = poster._z("GET", "/comment-automations")
items = data.get("automations") or data.get("data") or (data if isinstance(data, list) else [])
out.append("AUTOMATIONS: " + json.dumps(items, indent=1)[:6000])
for a in items[:5]:
    aid = a.get("_id") or a.get("id")
    try:
        lg = poster._z("GET", f"/comment-automations/{aid}/logs")
        out.append(f"LOGS {aid}: " + json.dumps(lg, indent=1)[:6000])
    except Exception as e:
        out.append(f"LOGS {aid} failed: {e}")
try:
    acc = poster.instagram_account()
    out.append("IG ACCOUNT: " + json.dumps({k: v for k, v in acc.items() if "token" not in k.lower()}, indent=1)[:3000])
except Exception as e:
    out.append(f"account failed {e}")
try:
    post = poster._z("GET", "/posts/6ad776bdf5e93b04321197ea")
    out.append("POST: " + json.dumps(post, indent=1)[:4000])
except Exception as e:
    out.append(f"post failed {e}")
import os
acc_id = "6ad69dcdecad4ce8494e92b1"
for path in ["/inbox/comments", f"/inbox/comments/18086880842695673?accountId={acc_id}"]:
    try:
        out.append(f"{path}: " + json.dumps(poster._z("GET", path), indent=1)[:3000])
    except Exception as e:
        out.append(f"{path} failed {e}")
if os.getenv("AUTODM_PATCH"):  # push the current follow-gate copy to all automations
    for a in items:
        aid = a.get("id") or a.get("_id")
        poster._z("PATCH", f"/comment-automations/{aid}", json={"followGate": poster.FOLLOW_GATE,
                  "dmDelaySeconds": 0, "audience": {"followerStatus": "follower", "whenUnknown": "verify"}})
        out.append(f"patched {aid}")
if os.getenv("AUTODM_FIX"):  # recreate ArtCraft automation bound to the Instagram media id
    for a in items:
        if a.get("postId") == "6ad776bdf5e93b04321197ea" and not a.get("platformPostId"):
            poster._z("DELETE", f"/comment-automations/{a.get('id') or a.get('_id')}")
            out.append("deleted old automation")
    meta = {"keyword": "ARTCRAFT", "tool_name": "ArtCraft", "url": "https://getartcraft.com/apps"}
    out.append("new automation: " + str(poster.auto_dm("6ad776bdf5e93b04321197ea", meta, "18086880842695673")))
Path("logs").mkdir(exist_ok=True)
Path("logs/autodm.log").write_text("\n\n".join(out))
print("\n\n".join(out)[:3000])
