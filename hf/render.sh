#!/usr/bin/env bash
# hf/render.sh <name>  -> hf/work/<name>/renders/final.mp4 (IG-ready, ~30 MB)
set -euo pipefail
H=$(cd "$(dirname "$0")" && pwd); W=$H/work/$1; cd $W
export HYPERFRAMES_SKIP_SKILLS=1
export HYPERFRAMES_BROWSER_PATH=${HYPERFRAMES_BROWSER_PATH:-$(node -e "console.log(require('playwright').chromium.executablePath())" 2>/dev/null || ls /opt/pw-browsers/chromium-*/chrome-linux64/chrome | head -1)}
npx -y hyperframes@0.8.192 render -q delivery -o renders/raw.mp4 > renders/render.log 2>&1
ffmpeg -v error -y -i renders/raw.mp4 -c:v libx264 -preset medium -crf 22 -maxrate 9M -bufsize 18M -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart renders/final.mp4
rm -f renders/raw.mp4; ls -la renders/final.mp4
