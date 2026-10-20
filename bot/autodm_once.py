"""Turn on auto-DM for an already scheduled/published post:
python -m bot.autodm_once <zernio_post_id> <videos-branch folder> [<vb dir>]"""
import json
import sys
from pathlib import Path

from . import poster, telegram

pid, name = sys.argv[1], sys.argv[2]
vb = Path(sys.argv[3] if len(sys.argv) > 3 else "../vb")
meta = json.loads((vb / name / "meta.json").read_text())
print("automation", poster.auto_dm(pid, meta))
telegram.notify(f"🤖 Auto-DM zapnutej pro {meta['tool_name']}: keyword {meta['keyword']}")
