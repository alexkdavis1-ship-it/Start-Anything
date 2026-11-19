# GTA 6 faceless shorts

Twelve 9:16 videos: script, voiceover, timed captions. Gameplay footage is the only missing input.

Needs Node 22+, ffmpeg, yt-dlp (`brew install node ffmpeg yt-dlp`).

1. Add links to `urls.txt`, then `./download-clips.sh` (clips land in `footage/pool/`).
   Or drop your own captures into `footage/pool/`, or `footage/<slug>/` for one video only.
2. `npm run build` cuts the footage into a 9:16 bed (a new shot every 1.3 s), mixes voiceover,
   music (`music/bed.mp3`) and sound effects, and writes `videos/<slug>/`.
3. `npm run render` writes `renders/<slug>.mp4`. One video: `./render-all.sh 04-cops`.
4. `npm run preview --video=04-cops` opens the live HyperFrames preview.

Edit words, favoured clips (`footage`) and explainer cards (`inserts`:
stat, compare, list, or a stock clip from `broll/`) in `scripts.json`. The gameplay bed is kept
between builds; run `FRESH_BED=1 npm run build` after changing footage. Changing a spoken line means regenerating that voiceover and
updating its timings in `vo.json`. Caption look and pacing live in `build.mjs`.
