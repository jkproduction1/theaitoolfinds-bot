"""LLM steps: pick the best tool, then write the voiceover script + caption."""
import json

from . import config
from .llm import chat_json

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
        "save/share the video. Prefer: real usable products with a website, clear visual "
        "result, free tier or cheap, broad appeal. Avoid: dev libraries only engineers "
        "understand, crypto, NSFW, shady tools, plain newsletters/blogs.\n"
        'Return {"ranked": [index, ...], "why": "short"}',
        temperature=0.4,
    )
    out = [int(i) for i in data.get("ranked", []) if str(i).isdigit() and int(i) < len(cands)]
    return out or list(range(min(5, len(cands))))


def write_script(cand: dict, site: dict) -> dict:
    facts = (
        f"Name hint: {cand['name']}\nShort description: {cand['desc']}\n"
        f"URL: {site['url']}\nPage title: {site['title']}\n"
        f"Meta description: {site['description']}\n"
        f"Website text (truncated): {site['text'][:4500]}"
    )
    data = chat_json(
        "You write voiceovers for a fast, punchy vertical-video account that shows one "
        "useful AI tool per video. Simple English (B1 level), short sentences, natural "
        "spoken flow, no hype words like 'revolutionary' or 'game-changer', no emojis "
        "in the script.",
        f"{facts}\n\n"
        f"Write a {config.MIN_WORDS}-{config.MAX_WORDS} word voiceover (~30-35 seconds).\n"
        "Structure:\n"
        "1) HOOK (max 10 words): a curiosity or benefit hook, e.g. 'This free AI tool "
        "turns any photo into a 3D model.'\n"
        "2) What it does, in plain words.\n"
        "3) Two or three concrete use cases / how you use it.\n"
        "4) Pricing ONLY if the website text states it (e.g. free tier). Never invent "
        "features, prices or numbers that are not in the website text.\n"
        "5) End exactly with: 'Follow for a new AI tool every day.'\n"
        "Say the tool name clearly at least once. Write numbers as words when spoken "
        "(e.g. 'ten', not '10').\n\n"
        "Also write an Instagram caption: hook line, 2-4 short lines with value, a line "
        "'Link: <domain>' and a line 'Save this for later'. Then 6-8 relevant hashtags.\n"
        "Return JSON: {"
        '"tool_name": "", "category": "one or two words e.g. Video editing", '
        '"hook": "", "script": "full voiceover text including hook", '
        '"title_on_screen": "max 4 words, usually the tool name", '
        '"caption": "", "hashtags": ["#ai", ...]}',
        temperature=0.8,
    )
    words = len(data.get("script", "").split())
    if not (config.MIN_WORDS - 15 <= words <= config.MAX_WORDS + 25):
        raise ValueError(f"script length {words} words is off target")
    for k in ("tool_name", "script", "caption"):
        if not data.get(k):
            raise ValueError(f"missing {k} in LLM output: {json.dumps(data)[:200]}")
    return data
