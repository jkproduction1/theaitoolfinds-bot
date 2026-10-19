# theaitoolfinds-bot

Automatický systém pro IG **@theaitoolfinds**: každý den najde zajímavý AI nástroj a udělá o něm 30s vertikální video (anglický voiceover, ukázka webu, titulky).

## Jak to funguje
1. **Hledání** – Product Hunt (AI), Hacker News „Show HN“, nové AI repa na GitHubu + tvoje vlastní `data/queue.txt`
2. **Výběr** – AI vybere tool s největším virálním potenciálem (a nikdy neopakuje stejný – `data/history.json`)
3. **Research** – přečte web toolu, aby skript nevymýšlel funkce
4. **Skript + caption** – jednoduchá angličtina, hook, use-casy, CTA
5. **Screenshot** – headless prohlížeč nafotí celý web
6. **Hlas** – Microsoft Edge TTS (zdarma) + přesné časy slov
7. **Střih** – ffmpeg: pozadí, název, scrollující web v okně prohlížeče, titulky slovo po slovu

## Kdy to běží
Automaticky 2× denně (Actions → *Make AI tool video*). Ručně: **Actions → Make AI tool video → Run workflow** (můžeš zadat konkrétní URL).

Hotové video: v běhu dole v **Artifacts** (video.mp4, caption.txt, cover.jpg).

## Nastavení (Settings → Secrets and variables → Actions)
| Secret | K čemu |
|---|---|
| `GEMINI_API_KEY` | **povinné** (nebo Claude) – zdarma na aistudio.google.com |
| `ANTHROPIC_API_KEY` | nejlepší texty (Claude) |

Hlas, barvy, délka: `bot/config.py`. Hudba: dej `.mp3` do `assets/music/` (jen s licencí!).

Fonty: Inter (SIL Open Font License).
