"""Remove typical "AI sounding" words/phrases and invisible characters.
Word lists from instagram-agent-skill (MIT) - see bot/vendor/LICENSE-instagram-agent-skill.txt"""
import json
import re
from pathlib import Path

LEX = json.loads((Path(__file__).parent / "vendor" / "slop.json").read_text(encoding="utf-8"))


def _chars(spec):
    """'U+200B' -> one char, 'U+E0000-E007F' -> a range of chars."""
    parts = spec.replace("U+", "").split("-")
    a = int(parts[0], 16)
    b = int(parts[-1], 16)
    return [chr(c) for c in range(a, b + 1)]


def _match_case(src, repl):
    if repl and src[:1].isupper():
        return repl[:1].upper() + repl[1:]
    return repl


def humanize(text: str) -> str:
    if not text:
        return text
    for inv in LEX.get("invisible", []):
        for ch in _chars(inv["cp"]):
            text = text.replace(ch, "")
    for t in LEX.get("typographic", []):
        text = text.replace(t["from"], t["to"])
    # longer phrases first so "dive deep into" wins over "dive"
    entries = sorted(LEX.get("phrases", []) + LEX.get("words", []),
                     key=lambda e: -len(e["find"]))
    for e in entries:
        pat = re.compile(r"\b" + re.escape(e["find"]) + r"\b", re.I)
        text = pat.sub(lambda m: _match_case(m.group(0), e["replace"]), text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\s+([,.!?])", r"\1", text)
    text = re.sub(r"(^|[.!?]\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), text)
    return text.strip()
