#!/usr/bin/env bash
# hf/new.sh <name>  -> scratch project hf/work/<name> with house assets, voice (from `videos` branch) and music
set -euo pipefail
N=$1; H=$(cd "$(dirname "$0")" && pwd); W=$H/work/$N
mkdir -p $W/assets $W/renders
cp $H/template/* $W/ && cp $H/assets/* $W/assets/
git -C $H/.. fetch -q origin +videos:refs/remotes/origin/videos
git -C $H/.. show origin/videos:voice-samples/$N.mp3 > $W/assets/voice.mp3
git -C $H/.. show origin/videos:voice-samples/$N.json > $W/assets/voice.json
TR=${MUSIC:-t1}; START=$(python3 -c "import json;print(json.load(open('$H/../video/public/music/tracks.json'))['$TR']['hook_start'])")
ffmpeg -v error -y -ss $START -i $H/../video/public/music/$TR.mp3 -t 60 -af "afade=t=in:d=0.5" $W/assets/music.mp3
echo "ready: $W"
