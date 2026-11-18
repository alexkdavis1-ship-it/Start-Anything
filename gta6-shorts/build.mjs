#!/usr/bin/env node
// Builds one HyperFrames project per script in scripts.json:
//   videos/<slug>/index.html      captions + hook + progress bar, timed to the voiceover
//   videos/<slug>/assets/vo.mp3   voiceover
//   videos/<slug>/assets/bg.mp4   9:16 gameplay bed, hard cut every CUT_SECONDS
//
// Footage: put clips in footage/<slug>/ (used only for that video) or footage/pool/ (shared).
// With no footage a dark placeholder bed is generated so the edit can still be previewed.
//
// Usage: node build.mjs [slug ...]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const W = 1080;
const H = 1920;
const FPS = 30;
const CUT_SECONDS = 2.4; // length of each gameplay shot
const TAIL = 0.4; // hold after the last word

const scripts = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts.json"), "utf8"));
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "vo.json"), "utf8"));
const only = process.argv.slice(2);

// Spoken phrase -> what the caption shows. Timing still uses the spoken length.
const DISPLAY = [
  ["thirty frames per second", "30 FPS"],
  ["fourteen forty p", "1440p"],
  ["Seven twenty p", "720p"],
  ["ten eighty", "1080p"],
  ["four K", "4K"],
  ["a hundred dollars", "$100"],
  ["eighty bucks", "$80"],
  ["Ultimate is a hundred", "Ultimate is $100"],
  ["That extra twenty", "That extra $20"],
  ["sixteen items", "16 items"],
  ["ninety-five", "'95"],
  ["ten hours", "10 hours"],
  ["in the twenties", "in the 20s"],
  ["around twenty", "around 20"],
  ["hold thirty", "hold 30"],
  ["five outfits", "5 outfits"],
  ["two seconds", "2 seconds"],
  ["over a hundred and thirty hours", "130+ hours"],
  ["sixty percent", "60%"],
  ["sixty to eighty hours", "60 to 80 hours"],
  ["A full hundred percent", "A full 100%"],
  ["up to three hundred", "up to 300"],
  ["Six things", "6 things"],
  ["Six regions", "6 regions"],
  ["twice the size", "2x the size"],
];

const HOT = /^(\$?\d[\d,.]*(\+|%|p|K|x|s)?|'95|FPS|GTA|broke|free|gone|removed|never|limited|hard)$/i;

function tokenize(line) {
  // Split the line into tokens, each carrying the spoken length it stands for.
  let parts = [{ text: line, spoken: null }];
  for (const [say, show] of DISPLAY) {
    parts = parts.flatMap((p) => {
      if (p.spoken !== null) return [p];
      const out = [];
      let rest = p.text;
      for (;;) {
        const i = rest.toLowerCase().indexOf(say.toLowerCase());
        if (i < 0) break;
        if (i > 0) out.push({ text: rest.slice(0, i), spoken: null });
        out.push({ text: show, spoken: say.length });
        rest = rest.slice(i + say.length);
      }
      if (rest) out.push({ text: rest, spoken: null });
      return out;
    });
  }
  const tokens = [];
  for (const p of parts) {
    if (p.spoken !== null) {
      tokens.push({ show: p.text, weight: p.spoken + 1, glue: false });
      continue;
    }
    const startsWithPunct = /^[.,?!]/.test(p.text);
    p.text.split(/\s+/).filter(Boolean).forEach((w, i) => {
      if (i === 0 && startsWithPunct && tokens.length) {
        // Punctuation that followed a replaced phrase sticks to it.
        const m = w.match(/^[.,?!]+/)[0];
        tokens[tokens.length - 1].show += m;
        w = w.slice(m.length);
        if (!w) return;
      }
      tokens.push({ show: w, weight: w.length + 1 });
    });
  }
  // A sentence end costs a short pause in the read.
  for (const t of tokens) if (/[.?!]$/.test(t.show)) t.weight += 4;
  return tokens;
}

function chunk(tokens) {
  const chunks = [];
  let cur = [];
  const flush = () => {
    if (cur.length) chunks.push(cur);
    cur = [];
  };
  for (const t of tokens) {
    const len = cur.reduce((n, x) => n + x.show.length + 1, 0) + t.show.length;
    if (cur.length >= 3 || (cur.length && len > 16)) flush();
    cur.push(t);
    if (/[.?!,]$/.test(t.show)) flush();
  }
  flush();
  return chunks;
}

function captionsFor(video, timing) {
  const out = [];
  video.lines.forEach((line, i) => {
    const start = timing.starts[i];
    const end = i + 1 < timing.starts.length ? timing.starts[i + 1] : timing.duration;
    const chunks = chunk(tokenize(line));
    const total = chunks.flat().reduce((n, t) => n + t.weight, 0);
    let t = start;
    for (const c of chunks) {
      const dur = ((end - start) * c.reduce((n, x) => n + x.weight, 0)) / total;
      out.push({ start: t, duration: dur, words: c.map((x) => x.show) });
      t += dur;
    }
  });
  return out;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r = (n) => Math.round(n * 1000) / 1000;

function html(video, timing, caps) {
  const D = r(timing.duration + TAIL);
  const hookEnd = r(Math.min(timing.starts[1] ?? 3, 3.2));
  const capHtml = caps
    .map((c, i) => {
      const words = c.words
        .flatMap((w) => w.split(" "))
        .map((w) => {
          const bare = w.replace(/[.,?!]+$/, "");
          return HOT.test(bare) ? `<span class="hot">${esc(w)}</span>` : esc(w);
        })
        .join(" ");
      return `      <div class="clip cap" id="c${i}" data-start="${r(c.start)}" data-duration="${r(c.duration)}" data-track-index="3">${words}</div>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>${esc(video.title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=block" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      :root { --ink: #ffffff; --hot: #ffe14a; --ground: #07070b; --font: "Anton", "Impact", sans-serif; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--ground); }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: var(--font); color: var(--ink); }
      #bgwrap { position: absolute; inset: 0; transform-origin: 50% 55%; }
      #bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      #shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 48%, rgba(0,0,0,.6) 100%); }
      #bar { position: absolute; left: 0; top: 0; height: 10px; width: 100%; background: var(--hot); transform-origin: 0 50%; }
      #hook { position: absolute; left: 60px; right: 60px; top: 250px; text-align: center; font-size: 112px; line-height: 1.42; text-transform: uppercase; letter-spacing: .01em; }
      #hook span { background: var(--hot); color: #0a0a0a; padding: 6px 22px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
      .cap { position: absolute; left: 70px; right: 70px; top: 1130px; text-align: center; font-size: 112px; line-height: 1.08; text-transform: uppercase; letter-spacing: .01em;
             -webkit-text-stroke: 14px #000; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(0,0,0,.55); }
      .cap .hot { color: var(--hot); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
      <div id="bgwrap">
        <video id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0" src="assets/bg.mp4" muted playsinline></video>
      </div>
      <div id="shade"></div>
      <div id="bar"></div>
      <div id="hook" class="clip" data-start="0" data-duration="${hookEnd}" data-track-index="2"><span>${esc(video.hook)}</span></div>
${capHtml}
      <audio id="vo" data-start="0" data-duration="${r(timing.duration)}" data-track-index="4" data-volume="1" src="assets/vo.mp3"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const caps = ${JSON.stringify(caps.map((c) => r(c.start)))};
      const beats = ${JSON.stringify(timing.starts.map(r))};
      tl.fromTo("#bar", { scaleX: 0 }, { scaleX: 1, duration: ${D}, ease: "none" }, 0);
      tl.fromTo("#hook", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.out" }, 0);
      tl.to("#hook", { scale: 0.9, opacity: 0, duration: 0.12, ease: "power2.in" }, ${r(hookEnd - 0.12)});
      caps.forEach((t, i) => {
        tl.fromTo("#c" + i, { scale: 0.72, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1, ease: "back.out(2.4)" }, t);
      });
      // Punch-in on the gameplay at the start of every spoken line.
      beats.forEach((t) => {
        tl.fromTo("#bgwrap", { scale: 1.09 }, { scale: 1, duration: 0.45, ease: "power3.out" }, t);
      });
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
}

const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const probe = (f) =>
  parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const VIDEO_EXT = /\.(mp4|mov|mkv|webm|m4v)$/i;
const listClips = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => VIDEO_EXT.test(f)).sort().map((f) => path.join(dir, f)) : [];

function buildBed(slug, duration, outFile) {
  let clips = listClips(path.join(ROOT, "footage", slug));
  if (!clips.length) clips = listClips(path.join(ROOT, "footage", "pool"));
  if (!clips.length) {
    ff(["-f", "lavfi", "-i", `gradients=s=${W}x${H}:c0=0x1a0b2e:c1=0x06060a:c2=0x3a1030:x0=0:y0=0:x1=${W}:y1=${H}:speed=0.02:r=${FPS}`,
      "-t", String(duration), "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "20", "-g", String(FPS), outFile]);
    return "placeholder (no footage found)";
  }
  const tmp = fs.mkdtempSync(path.join(path.dirname(outFile), "seg-"));
  const info = clips.map((f) => ({ f, d: probe(f) })).filter((c) => c.d > CUT_SECONDS + 0.5);
  if (!info.length) throw new Error(`footage for ${slug} is shorter than ${CUT_SECONDS}s per clip`);
  const n = Math.ceil(duration / CUT_SECONDS);
  const used = new Map();
  const list = [];
  for (let i = 0; i < n; i++) {
    const c = info[i % info.length];
    const k = used.get(c.f) ?? 0;
    used.set(c.f, k + 1);
    // Walk through each clip in strides so repeat visits land on unseen footage.
    const span = c.d - CUT_SECONDS - 0.2;
    const offset = (0.1 + ((k * 0.381966) % 1) * span).toFixed(2);
    const seg = path.join(tmp, `s${String(i).padStart(3, "0")}.mp4`);
    ff(["-ss", offset, "-t", String(CUT_SECONDS), "-i", c.f, "-an",
      "-vf", `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},setsar=1`,
      "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "fast", "-crf", "17", "-g", String(FPS), seg]);
    list.push(`file '${seg.replace(/'/g, "'\\''")}'`);
  }
  const listFile = path.join(tmp, "list.txt");
  fs.writeFileSync(listFile, list.join("\n"));
  ff(["-f", "concat", "-safe", "0", "-i", listFile, "-t", String(duration), "-c", "copy", outFile]);
  fs.rmSync(tmp, { recursive: true, force: true });
  return `${n} cuts from ${info.length} clip(s)`;
}

for (const video of scripts.videos) {
  if (only.length && !only.includes(video.slug)) continue;
  const timing = vo[video.slug];
  if (!timing) throw new Error(`no voiceover timing for ${video.slug}`);
  if (timing.starts.length !== video.lines.length) throw new Error(`${video.slug}: ${video.lines.length} lines but ${timing.starts.length} timings`);
  const dir = path.join(ROOT, "videos", video.slug);
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "voiceovers", `${video.slug}.mp3`), path.join(dir, "assets", "vo.mp3"));
  const bed = buildBed(video.slug, timing.duration + TAIL, path.join(dir, "assets", "bg.mp4"));
  const caps = captionsFor(video, timing);
  fs.writeFileSync(path.join(dir, "index.html"), html(video, timing, caps));
  fs.writeFileSync(path.join(dir, "hyperframes.json"), JSON.stringify({
    $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
    registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
    paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
    media: { autoProxy: true },
  }, null, 2) + "\n");
  console.log(`${video.slug}: ${caps.length} captions, ${(timing.duration + TAIL).toFixed(1)}s, bed = ${bed}`);
}
