"""LLM steps: pick the best tool, then write the voiceover script + caption."""
import json
import re

from . import config
from .llm import chat_json

ICON_NAMES = [
    "Sparkles", "Video", "Clapperboard", "Film", "Scissors", "Wand", "Clock", "Timer",
    "DollarSign", "BadgeDollarSign", "Gift", "Bot", "Brain", "Cpu", "Code", "Terminal",
    "PenTool", "Palette", "Image", "Images", "Camera", "Mic", "AudioLines", "Zap", "Layers",
    "Rocket", "Globe", "Search", "FileText", "Mail", "MessageSquare", "Calendar", "ChartLine",
    "TrendingUp", "Users", "User", "ShoppingCart", "Smartphone", "Laptop", "Download",
    "Upload", "Share2", "Lock", "ShieldCheck", "Languages", "Captions", "Type", "Workflow",
    "Repeat", "CircleCheck", "Star", "Heart", "Eye", "Lightbulb", "Target", "Megaphone", "Box",
]

AUDIENCE = (
    "Instagram/TikTok audience of creators, freelancers, marketers, designers and "
    "developers who want practical AI tools that save time or make money. Categories: "
    "video editing, design, copywriting, AI coding / vibe coding, AI agents, "
    "productivity, voice, image, automation - anything genuinely useful."
)


CATEGORIES = {
    "video": "AI video editing / video generation / captions / avatars / motion",
    "design": "design & image tools: image generation, UI design, thumbnails, upscaling, 3D",
    "coding": "vibe coding / AI coding agents / app & website builders / Claude Code / MCP",
    "github": "a FREE open-source GitHub repo that replaces a paid tool or blew up this week",
    "useful": "anything that clearly saves creators time or money (voice, automation, writing, "
              "productivity)",
}
ANGLES = ["free-alternative", "trending-repo", "time-saver", "money-saver", "wow-demo"]


def rank(cands: list[dict], recent: list[str], category: str = "") -> list[dict]:
    """Score candidates 1-10. Returns [{"index", "score", "angle", "why"}], best first."""
    lines = [
        f"{i}. {c['name']} | {c['desc'][:170]} | {c['url']} | source={c['source']} "
        f"niches={','.join(c.get('niches', [])) or '-'} "
        f"{c.get('stars_gained') or (str(c['stars']) + ' stars' if c.get('stars') else '')}"
        for i, c in enumerate(cands[:50])
    ]
    cat = (f"TODAY'S CATEGORY: {category} = {CATEGORIES.get(category, '')}. Strongly prefer "
           "candidates that fit it (but a 9+ outside it can still win).\n") if category else ""
    data = chat_json(
        "You are the editor-in-chief of a premium daily 'AI tool find' Reels account. The "
        "account must become the place AI companies WANT to be featured, so only the best, "
        "hottest tools make it. You are strict.",
        f"Audience: {AUDIENCE}\n\n{cat}"
        f"Recently featured (never repeat, avoid near-duplicates): {', '.join(recent[-40:]) or 'none'}\n\n"
        "Candidates:\n" + "\n".join(lines) + "\n\n"
        "Score every promising candidate 1-10 (be honest, most things are 4-6):\n"
        "- WOW: a viewer says 'wait, this exists?!' and the result is visual\n"
        "- MOMENTUM: it is trending right now (stars today, HN points, HF trending)\n"
        "- VALUE: saves real time or money, a creator can try it today (free tier/free repo)\n"
        "- BRAND FIT: polished product or serious project a brand would be proud to be seen with\n"
        "8+ = could go viral, 7 = solid, below 7 = do not post. The tool MUST be AI-powered. "
        "Reject: hardware hacks, research papers without a usable demo, libraries only "
        "engineers understand, crypto, NSFW, shady tools, blogs/newsletters, awesome-lists.\n"
        f"For each pick also choose the best ANGLE: {', '.join(ANGLES)}.\n"
        'Return {"picks": [{"index": 0, "score": 8, "angle": "free-alternative", '
        '"why": "max 15 words IN CZECH: what it does + why it is a good pick"}]} '
        'with your 8 best, best first.',
        temperature=0.3,
    )
    out = []
    for p in data.get("picks", []):
        try:
            i = int(p.get("index"))
        except (TypeError, ValueError):
            continue
        if 0 <= i < len(cands):
            out.append({"index": i, "score": float(p.get("score") or 0),
                        "angle": p.get("angle") if p.get("angle") in ANGLES else "wow-demo",
                        "why": str(p.get("why") or "")[:120]})
    out.sort(key=lambda x: -x["score"])
    return out


HOOKS = json.loads((config.ROOT / "bot" / "vendor" / "hooks.json").read_text(encoding="utf-8"))

SCENE_DOC = """Scene types (pick the one that best SHOWS what the sentence says):
- "title": only for sentence 1 (the hook). props: {}
- "browser": the real website. props: {"motion": "scroll" | "zoom", "focus": "top" | "middle" | "bottom"}
- "icons": 3-6 feature tiles. props: {"title": "max 4 words", "items": [{"icon": ICON, "label": "1-3 words"}]}
- "checklist": props: {"title": "max 4 words", "items": ["2-5 words", ...3 items]}
- "chat": typing a prompt into the tool. props: {"prompt": "realistic user prompt, max 12 words", "reply": "short result description, max 10 words, no invented numbers"}
- "flow": input -> tool -> output. props: {"from": "2-4 words", "from_icon": ICON, "to": "2-4 words", "to_icon": ICON}
- "big": one big stamp. props: {"text": "max 7 chars e.g. FREE, 10x, $0", "sub": "max 6 words"}
- "compare": props: {"before": "old way, max 5 words", "after": "with the tool, max 5 words"}
- "cta": only for the last sentence. props: {}
Use each type at most twice, never the same type two scenes in a row, and use "browser" 1-2 times."""


def write_storyboard(cand: dict, site: dict, has_media: bool = False) -> dict:
    angle = cand.get("angle") or "wow-demo"
    from .humanize import humanize

    hooks = "\n".join(f"- {h['name']}: {h['template']} (e.g. \"{h['example']}\")"
                      for h in HOOKS["hooks"])
    facts = (
        f"Name hint: {cand['name']}\nShort description: {cand['desc']}\n"
        f"URL: {site['url']}\nPage title: {site['title']}\n"
        f"Meta description: {site['description']}\n"
        f"Website text (truncated): {site['text'][:4500]}"
    )
    if site.get("is_repo"):
        facts += (f"\n\nTHIS IS A FREE OPEN-SOURCE GITHUB REPO ({site.get('stars', 0)} stars, "
                  f"license {site.get('license') or 'see repo'}). Lean into it: say it is free "
                  "and open source, mention the star count in words if impressive, and frame "
                  "it as an alternative to paid tools when that is true.")
    angle_doc = {
        "free-alternative": "ANGLE: frame it as a FREE alternative to a well-known paid tool "
                            "(name the paid tool only if the website text supports it).",
        "trending-repo": "ANGLE: this just blew up on GitHub - urgency, 'everyone is "
                         "starring this', say what it replaces.",
        "time-saver": "ANGLE: the hours it saves - old way vs new way.",
        "money-saver": "ANGLE: the money it saves - what you would normally pay.",
        "wow-demo": "ANGLE: lead with the most impressive visual result.",
    }.get(angle, "")
    facts += "\n\n" + angle_doc
    if "huggingface.co/spaces" in site["url"]:
        facts += "\n\nThis is a free demo you can try in the browser on Hugging Face."
    media_doc = ('\n- "media": the REAL demo (video/image of the tool\'s result). props: '
                 '{"label": "2-3 words e.g. Real result"}. Use it 1-2 times, for the '
                 'sentences about what it produces.') if has_media else ""
    data = chat_json(
        "You are the writer + motion designer of a clean, premium Instagram Reels account "
        "that shows one useful AI tool per video (style: white grid background, animated UI "
        "cards, one or two big words on screen at a time). Simple English (B1), short "
        "spoken sentences, confident and specific. Never use hype words (revolutionary, "
        "game-changer, unlock, supercharge, seamless, delve). No emojis in the script.",
        f"{facts}\n\n"
        "HOOK FORMULAS (choose the one that fits this tool best; adapt it, never copy):\n"
        f"{hooks}\n"
        "Hook rules: " + " ".join(HOOKS["rules"]) + "\n\n"
        f"Write a {config.MIN_WORDS}-{config.MAX_WORDS} word voiceover (15-50 seconds). "
        "Pick the length the tool deserves: a simple 'wow' tool = short and punchy (about "
        "40-60 words); a tool with several strong uses or a real how-to = longer (up to "
        f"{config.MAX_WORDS} words, 3-4 concrete use cases or steps). Never pad. The hook must "
        "be specific to THIS tool (a number, a named paid tool, a concrete result) - never "
        "a generic 'this AI tool is amazing'. Each sentence 4-16 words. Sentence 1 = the hook. Then what it does, 2-3 "
        "concrete use cases, pricing ONLY if stated on the website. Never invent features, "
        "prices or numbers that are not in the website text. Say the tool name clearly. "
        "Write numbers as words. The LAST sentence must be exactly: "
        "'Comment KEYWORD and I will send you the link.' (with the real keyword).\n\n"
        f"{SCENE_DOC}{media_doc}\nICON must be one of: {', '.join(ICON_NAMES)}\n\n"
        "Also: a one-word comment KEYWORD (uppercase, related to the tool, e.g. CLIPS), an "
        "Instagram caption whose first line (max 125 chars) is a strong hook, then 2-4 short "
        "value lines, then 'Comment KEYWORD and I will DM you the link.', then 3-4 hashtags (never more than 4); "
        "and a cover: line1 max 2 words, line2 max 3 words (like 'Viral Clips' / 'In One Click').\n"
        "Return JSON: {"
        '"tool_name": "", "category": "1-2 words", "hook_formula": "name", '
        '"keyword": "", "sentences": [{"text": "", "emphasis": ["1-2 key words from this '
        'sentence"], "scene": {"type": "", "props": {}}}], "caption": "", '
        '"hashtags": ["#ai"], "cover": {"line1": "", "line2": ""}, '
        '"summary_cs": "2 short sentences IN CZECH: what the tool does and who it is for"}',
        temperature=0.85,
    )

    sents = data.get("sentences") or []
    if len(sents) < 3:
        raise ValueError("storyboard has too few sentences")
    kw = re.sub(r"[^A-Z0-9]", "", (data.get("keyword") or "LINK").upper())[:12] or "LINK"
    data["keyword"] = kw
    for i, s in enumerate(sents):
        s["text"] = humanize(s.get("text", "")).replace("KEYWORD", kw)
        sc = s.get("scene") or {}
        t = sc.get("type")
        allowed = ("title", "browser", "icons", "checklist", "chat", "flow", "big", "compare",
                   "cta") + (("media",) if has_media else ())
        if t not in allowed:
            sc = {"type": "browser", "props": {"motion": "scroll"}}
        if i == 0:
            sc = {"type": "title", "props": {}}
        elif i == len(sents) - 1:
            sc = {"type": "cta", "props": {}}
        elif sc["type"] in ("title", "cta"):
            sc = {"type": "browser", "props": {"motion": "zoom"}}
        s["scene"] = sc
    if has_media and not any(s["scene"]["type"] == "media" for s in sents):
        for s in sents[1:-1]:  # make sure the real demo is shown at least once
            if s["scene"]["type"] in ("browser", "icons", "big"):
                s["scene"] = {"type": "media", "props": {"label": "Real result"}}
                break
    data["script"] = " ".join(s["text"] for s in sents)
    data["caption"] = humanize(data.get("caption", "")).replace("KEYWORD", kw)
    h = site.get("instagram")
    if h and f"@{h}".lower() not in data["caption"].lower():
        # tag the tool's own account - brands notice (and often repost) when they're featured
        lines = data["caption"].split("\n", 1)
        data["caption"] = lines[0] + f"\n\nTool by @{h}" + ("\n" + lines[1] if len(lines) > 1 else "")
    data["angle"] = angle
    words = len(data["script"].split())
    if not (config.MIN_WORDS - 15 <= words <= config.MAX_WORDS + 25):
        raise ValueError(f"script length {words} words is off target")
    if not data.get("tool_name"):
        raise ValueError("missing tool_name")
    return data
