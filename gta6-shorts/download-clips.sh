#!/usr/bin/env bash
# Run on your Mac. Downloads every URL in urls.txt into footage/pool/ at the best
# quality available (up to 4K), video only needed, no subtitles or thumbnails.
# Works with YouTube, TikTok and Instagram links.
#
#   brew install yt-dlp ffmpeg      # one time
#   ./download-clips.sh             # all URLs -> footage/pool/
#   ./download-clips.sh 04-cops     # all URLs -> footage/04-cops/ (footage for one video only)
#
# Instagram and age-gated videos need your login. Use the browser you are signed in with:
#   BROWSER=chrome ./download-clips.sh
set -euo pipefail
cd "$(dirname "$0")"
dest="footage/${1:-pool}"
mkdir -p "$dest"
args=(
  --batch-file urls.txt
  --download-archive footage/.downloaded.txt
  --no-playlist
  -f "bv*[height<=2160]+ba/b"
  -S "res,fps,vcodec:h264"
  --merge-output-format mp4
  --no-write-subs --no-write-auto-subs --no-write-thumbnail
  -o "$dest/%(uploader)s-%(id)s.%(ext)s"
)
if [ -n "${BROWSER:-}" ]; then args+=(--cookies-from-browser "$BROWSER"); fi
yt-dlp "${args[@]}"
echo "Done. Clips are in $dest. Next: npm run build && npm run render"
