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


def rank(cands: list[dict], recent: list[str]) -> list[int]:
    """Return candidate indexes, best first."""
    lines = [
        f"{i}. {c['name']} | {c['desc'][:160]} | source={c['source']} score={c['score']}"
        for i, c in enumerate(cands[:45])
    ]
    data = chat_json(
        "You are the editor of a viral daily 'AI tool find' Reels account.",
        f"Audience: {AUDIENCE}\n\n"
        f"Recently featured (avoid similar tools): {', '.join(recent[-30:]) or 'none'}\n\n"
        "Candidates:\n" + "\n".join(lines) + "\n\n"
        "Pick the 5 candidates most likely to make people say 'wait, this exists?!' and "
        "save/share the video. The tool MUST be AI-powered (uses AI/LLMs/generative models). Prefer: real usable products with a website, clear visual "
        "result, free tier or cheap, broad appeal to NON-technical creators. Strongly prefer "
        "polished consumer products with their own website (Product Hunt style). Avoid: "
        "hardware hacks, dev libraries/CLIs only engineers understand, crypto, NSFW, shady "
        "tools, plain newsletters/blogs.\n"
        'Return {"ranked": [index, ...], "why": "short"}',
        temperature=0.4,
    )
    out = [int(i) for i in data.get("ranked", []) if str(i).isdigit() and int(i) < len(cands)]
    return out or list(range(min(5, len(cands))))


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


def write_storyboard(cand: dict, site: dict) -> dict:
    from .humanize import humanize

    hooks = "\n".join(f"- {h['name']}: {h['template']} (e.g. \"{h['example']}\")"
                      for h in HOOKS["hooks"])
    facts = (
        f"Name hint: {cand['name']}\nShort description: {cand['desc']}\n"
        f"URL: {site['url']}\nPage title: {site['title']}\n"
        f"Meta description: {site['description']}\n"
        f"Website text (truncated): {site['text'][:4500]}"
    )
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
        f"Write a {config.MIN_WORDS}-{config.MAX_WORDS} word voiceover split into 6-9 "
        "sentences (each 5-16 words). Sentence 1 = the hook. Then what it does, 2-3 "
        "concrete use cases, pricing ONLY if stated on the website. Never invent features, "
        "prices or numbers that are not in the website text. Say the tool name clearly. "
        "Write numbers as words. The LAST sentence must be exactly: "
        "'Comment KEYWORD and I will send you the link.' (with the real keyword).\n\n"
        f"{SCENE_DOC}\nICON must be one of: {', '.join(ICON_NAMES)}\n\n"
        "Also: a one-word comment KEYWORD (uppercase, related to the tool, e.g. CLIPS), an "
        "Instagram caption whose first line (max 125 chars) is a strong hook, then 2-4 short "
        "value lines, then 'Comment KEYWORD and I will DM you the link.', then 6-8 hashtags; "
        "and a cover: line1 max 2 words, line2 max 3 words (like 'Viral Clips' / 'In One Click').\n"
        "Return JSON: {"
        '"tool_name": "", "category": "1-2 words", "hook_formula": "name", '
        '"keyword": "", "sentences": [{"text": "", "emphasis": ["1-2 key words from this '
        'sentence"], "scene": {"type": "", "props": {}}}], "caption": "", '
        '"hashtags": ["#ai"], "cover": {"line1": "", "line2": ""}}',
        temperature=0.85,
    )

    sents = data.get("sentences") or []
    if len(sents) < 4:
        raise ValueError("storyboard has too few sentences")
    kw = re.sub(r"[^A-Z0-9]", "", (data.get("keyword") or "LINK").upper())[:12] or "LINK"
    data["keyword"] = kw
    for i, s in enumerate(sents):
        s["text"] = humanize(s.get("text", "")).replace("KEYWORD", kw)
        sc = s.get("scene") or {}
        t = sc.get("type")
        if t not in ("title", "browser", "icons", "checklist", "chat", "flow", "big",
                     "compare", "cta"):
            sc = {"type": "browser", "props": {"motion": "scroll"}}
        if i == 0:
            sc = {"type": "title", "props": {}}
        elif i == len(sents) - 1:
            sc = {"type": "cta", "props": {}}
        elif sc["type"] in ("title", "cta"):
            sc = {"type": "browser", "props": {"motion": "zoom"}}
        s["scene"] = sc
    data["script"] = " ".join(s["text"] for s in sents)
    data["caption"] = humanize(data.get("caption", "")).replace("KEYWORD", kw)
    words = len(data["script"].split())
    if not (config.MIN_WORDS - 15 <= words <= config.MAX_WORDS + 25):
        raise ValueError(f"script length {words} words is off target")
    if not data.get("tool_name"):
        raise ValueError("missing tool_name")
    return data
