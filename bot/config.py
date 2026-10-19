"""Central settings. Change values here (or via env vars) instead of in the code."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ASSETS = ROOT / "assets"
FONTS = ASSETS / "fonts"
MUSIC = ASSETS / "music"
OUT = ROOT / "out"

BRAND = os.getenv("BRAND_HANDLE", "@theaitoolfinds")

# Video format: vertical 9:16 for Reels / TikTok
W, H, FPS = 1080, 1920, 30

# Layout (pixels). The website "card" sits in the middle of the frame.
CARD_X, CARD_Y, CARD_W, CARD_H = 60, 520, 960, 1060
BAR_H = 56  # fake browser top bar drawn above the card

# Colors
BG_TOP = (10, 10, 18)
BG_BOTTOM = (28, 14, 52)
ACCENT = (255, 225, 77)  # yellow highlight used for active subtitle word
TEXT = (255, 255, 255)
MUTED = (170, 170, 190)

# Voice (Microsoft Edge TTS, free). Other good options:
# en-US-ChristopherNeural, en-US-GuyNeural, en-US-AriaNeural
VOICE = os.getenv("TTS_VOICE", "en-US-AndrewNeural")
VOICE_RATE = os.getenv("TTS_RATE", "+8%")

# Script length: 10-30 s of speech, the AI picks what fits the tool
MIN_WORDS, MAX_WORDS = 28, 85

# How many seconds the top of the website stays still before scrolling starts
HOLD_SECONDS = 2.5
TAIL_SECONDS = 1.2

FONT_BLACK = FONTS / "Inter-Black.otf"
FONT_BOLD = FONTS / "Inter-Bold.otf"
FONT_SEMI = FONTS / "Inter-SemiBold.otf"
FONT_MEDIUM = FONTS / "Inter-Medium.otf"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)
