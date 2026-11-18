#!/usr/bin/env bash
# Renders every built video to renders/<slug>.mp4 (1080x1920, 30 fps).
#   ./render-all.sh              all videos
#   ./render-all.sh 04-cops      one video
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p renders
for dir in videos/*/; do
  slug="$(basename "$dir")"
  if [ $# -gt 0 ] && [[ ! " $* " =~ " $slug " ]]; then continue; fi
  (cd "$dir" && npx --yes hyperframes@0.9.68 render -o "../../renders/$slug.mp4" -f 30 -q high --quiet)
  echo "rendered renders/$slug.mp4"
done
