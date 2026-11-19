#!/usr/bin/env node
// Builds one HyperFrames project per script in scripts.json:
//   videos/<slug>/index.html      captions + hook + progress bar, timed to the voiceover
//   videos/<slug>/assets/mix.mp3  voiceover + music bed + whoosh/impact effects
//   videos/<slug>/assets/bg.mp4   9:16 gameplay bed, hard cut every CUT_SECONDS
//
// Footage: put clips in footage/<slug>/ (used only for that video) or footage/pool/ (shared).
// A script's "footage" list names clips (by part of the filename) to favour for that video.
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
const CUT_SECONDS = 1.3; // length of each gameplay shot
const HEAD_TRIM = 2; // skip rating cards at the start of a clip
const TAIL_TRIM = 0.24; // skip end slates: this share of each clip's tail
const MUSIC_VOLUME = 0.2;
// Boxed layout: sharp gameplay in a band, a blurred copy of it filling the rest of the frame.
const BOX_Y = 450;
const BOX_H = 1020;
const TAIL = 0.4; // hold after the last word

const scripts = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts.json"), "utf8"));
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "vo.json"), "utf8"));
const only = process.argv.slice(2);

// Spoken phrase -> what the caption shows. Timing still uses the spoken length.
const DISPLAY = [
  ["thirty frames per second", "30 FPS"],
  ["six stars", "6 stars"],
  ["six star", "6 star"],
  ["five stars", "5 stars"],
  ["Five levels", "5 levels"],
  ["chapter one", "chapter 1"],
  ["four rockets", "4 rockets"],
  ["thirty five dollars", "$35"],
  ["thirty five bucks", "$35"],
  ["S O S", "SOS"],
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

const STAMPS = { one: "#1", two: "#2", three: "#3", four: "#4", five: "#5", six: "#6", bonus: "BONUS" };
const STAMP = /^(one|two|three|four|five|six|bonus)\.$/i;
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
      out.push({ start: t, duration: dur, words: c.map((x) => x.show), weights: c.map((x) => x.weight) });
      t += dur;
    }
  });
  return out;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r = (n) => Math.round(n * 1000) / 1000;

// Explainer cards (stats, comparisons, lists, stock b-roll) shown above the captions during a line.
function insertsFor(video, timing, caps, D, hookEnd) {
  return (video.inserts ?? []).map((ins, k) => {
    const lineStart = timing.starts[ins.line];
    const lastLine = ins.line + (ins.lines ?? 1);
    const lineEnd = lastLine < timing.starts.length ? timing.starts[lastLine] : D - 0.15;
    let start = lineStart + 0.45;
    if (ins.line === 0) start = Math.max(start, hookEnd);
    // Wait for a "#1"-style stamp to clear before the card lands.
    const first = caps.find((c) => Math.abs(c.start - lineStart) < 0.01);
    if (first && first.words.length === 1 && STAMP.test(first.words[0])) start = Math.max(start, first.start + first.duration + 0.05);
    const end = lineEnd - 0.08;
    const sized = (t) => (t.length <= 4 ? 210 : t.length <= 7 ? 160 : t.length <= 10 ? 128 : 100);
    let body = "";
    if (ins.kind === "stat") {
      body = `<div class="big" style="font-size:${sized(ins.big)}px">${esc(ins.big)}</div><div class="label">${esc(ins.label)}</div>`;
    } else if (ins.kind === "compare") {
      const col = (c, cls) => `<div class="col ${cls}"><div class="top">${esc(c.top)}</div><div class="big" style="font-size:${Math.min(130, sized(c.big))}px">${esc(c.big)}</div></div>`;
      body = `<div class="cols">${col(ins.left, "")}<div class="join">${esc(ins.joiner ?? "VS")}</div>${col(ins.right, "win")}</div>`;
    } else if (ins.kind === "list") {
      // Long lists get smaller rows so the card never reaches the captions.
      const dense = ins.items.length > 4 ? ' style="font-size:40px;padding:6px 20px;margin:6px auto"' : "";
      body = `<div class="title">${esc(ins.title)}</div>` + ins.items.map((it, j) => `<div class="item" id="i${k}_${j}"${dense}>${esc(it)}</div>`).join("");
    } else if (ins.kind === "broll") {
      body = `<video class="clip" data-start="${r(start)}" data-duration="${r(end - start)}" data-track-index="${6 + k}" src="assets/${ins.clip}.mp4" muted playsinline></video>` +
        (ins.label ? `<div class="label">${esc(ins.label)}</div>` : "");
    } else {
      throw new Error(`${video.slug}: unknown insert kind "${ins.kind}"`);
    }
    return { k, start: r(start), end: r(end), items: ins.items?.length ?? 0, clip: ins.clip,
      html: `      <div class="ins ${ins.kind}" id="i${k}">${body}</div>` };
  });
}

function html(video, timing, caps) {
  const D = r(timing.duration + TAIL);
  const hookEnd = r(Math.min(timing.starts[1] ?? 3, 4.5));
  const inserts = insertsFor(video, timing, caps, D, hookEnd);
  const wordTimes = [];
  const capHtml = caps
    .map((c, i) => {
      const total = c.weights.reduce((n, x) => n + x, 0);
      let at = c.start;
      const words = c.words
        .flatMap((w, j) => {
          const parts = w.split(" ");
          const each = (c.duration * c.weights[j]) / total / parts.length;
          return parts.map((part) => {
            const t = at;
            at += each;
            return { text: part.replace(/[.,?!]/g, ""), t };
          });
        })
        .filter((w) => w.text)
        .map((w, j) => {
          wordTimes.push([`c${i}w${j}`, r(w.t)]);
          return `<span class="w" id="c${i}w${j}">${esc(w.text)}</span>`;
        })
        .join(" ");
      const stamp = c.words.length === 1 && STAMP.test(c.words[0]);
      if (stamp) return `      <div class="clip cap stamp" id="c${i}" data-start="${r(c.start)}" data-duration="${r(c.duration)}" data-track-index="3">${esc(STAMPS[c.words[0].replace(/\W/g, "").toLowerCase()])}</div>`;
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
    <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:wght@500;700;800&family=Montserrat:wght@700;800&display=block" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      :root { --ink: #ffffff; --hot: #ffe14a; --ground: #07070b; --font: "TikTok Sans", "Montserrat", sans-serif; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--ground); }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: var(--font); color: var(--ink); }
      #bgwrap { position: absolute; inset: 0; transform-origin: 50% 50%; }
      #bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .label, .title, .item, #hook span { font-family: var(--font); font-weight: 700; background: #fff; color: #111; border-radius: 18px;
             box-decoration-break: clone; -webkit-box-decoration-break: clone; }
      #hook { position: absolute; left: 70px; right: 70px; top: 170px; text-align: center; font-size: 58px; line-height: 1.52; }
      #hook span { padding: 8px 24px; }
      .cap { position: absolute; left: 60px; right: 60px; top: 1270px; text-align: center; font-size: 84px; font-weight: 800; line-height: 1.12;
             -webkit-text-stroke: 12px #000; paint-order: stroke fill; text-shadow: 0 6px 14px rgba(0,0,0,.55); }
      .cap .w { display: inline-block; margin: 0 0.13em; }
      .cap.stamp { top: 780px; font-size: 300px; }
      .ins { position: absolute; left: 50px; right: 50px; top: 130px; visibility: hidden; text-align: center; }
      .ins .big { font-weight: 800; color: #fff; line-height: 1.05; -webkit-text-stroke: 14px #000; paint-order: stroke fill; }
      .ins .label { display: inline-block; font-size: 46px; line-height: 1.25; padding: 10px 24px; margin-top: 12px; }
      .ins .title { display: inline-block; font-size: 46px; font-weight: 800; padding: 10px 26px; margin-bottom: 8px; background: #111; color: #fff; }
      .ins .item { display: table; margin: 10px auto; font-size: 48px; line-height: 1.2; padding: 10px 24px; }
      .ins .cols { display: flex; align-items: center; justify-content: center; gap: 30px; }
      .ins .col .top { font-size: 38px; font-weight: 700; -webkit-text-stroke: 8px #000; paint-order: stroke fill; }
      .ins .join { font-size: 70px; font-weight: 800; -webkit-text-stroke: 10px #000; paint-order: stroke fill; }
      .ins.broll video { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 26px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
      <div id="bgwrap">
        <video id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0" src="assets/bg.mp4" muted playsinline></video>
      </div>
      <div id="hook" class="clip" data-start="0" data-duration="${hookEnd}" data-track-index="2"><span>${esc(video.sticker ?? video.hook)}</span></div>
${inserts.map((x) => x.html).join("\n")}
${capHtml}
      <audio id="mix" data-start="0" data-duration="${D}" data-track-index="4" data-volume="1" src="assets/mix.mp3"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const caps = ${JSON.stringify(caps.map((c) => r(c.start)))};
      const beats = ${JSON.stringify(timing.starts.map(r))};
      tl.fromTo("#hook", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)" }, 0);
      tl.to("#hook", { scale: 0.9, opacity: 0, duration: 0.12, ease: "power2.in" }, ${r(hookEnd - 0.12)});
      caps.forEach((t, i) => {
        const el = document.getElementById("c" + i);
        const stamp = el.classList.contains("stamp");
        const tilt = stamp ? -6 : i % 2 ? 2 : -2;
        tl.fromTo(el, { scale: stamp ? 2.2 : 0.6, opacity: 0, rotation: tilt * 3 }, { scale: 1, opacity: 1, rotation: tilt, duration: stamp ? 0.14 : 0.1, ease: stamp ? "power4.out" : "back.out(2.6)" }, t);
      });
      const words = ${JSON.stringify(wordTimes)};
      words.forEach(([id, t], n) => {
        const el = "#" + id;
        const sameChunk = n + 1 < words.length && words[n + 1][0].split("w")[0] === id.split("w")[0];
        tl.set(el, { color: "#ffe14a" }, t);
        tl.fromTo(el, { scale: 1.1, y: -12 }, { scale: 1, y: 0, duration: 0.14, ease: "power3.out" }, t);
        if (sameChunk) tl.set(el, { color: "#ffffff" }, words[n + 1][1]);
      });
      const inserts = ${JSON.stringify(inserts.map(({ k, start, end, items }) => ({ k, start, end, items })))};
      inserts.forEach((x) => {
        const el = "#i" + x.k;
        tl.fromTo(el, { autoAlpha: 0, y: 90, scale: 0.82 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(1.9)" }, x.start);
        const step = x.items ? Math.min(0.5, (x.end - x.start - 0.5) / x.items) : 0;
        for (let j = 0; j < x.items; j++) {
          tl.fromTo(el + "_" + j, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.14, ease: "back.out(2)" }, x.start + 0.15 + j * step);
        }
        tl.to(el, { autoAlpha: 0, scale: 0.9, duration: 0.1, ease: "power2.in" }, x.end - 0.1);
      });
      // A small punch-in on every spoken line.
      beats.forEach((t, i) => {
        const next = i + 1 < beats.length ? beats[i + 1] : ${D};
        tl.fromTo("#bgwrap", { scale: 1.05 }, { scale: 1, duration: 0.28, ease: "power3.out" }, t);
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

function buildBed(slug, duration, outFile, prefer = [], only = false) {
  let clips = listClips(path.join(ROOT, "footage", slug));
  if (!clips.length) clips = listClips(path.join(ROOT, "footage", "pool"));
  if (!clips.length) {
    ff(["-f", "lavfi", "-i", `gradients=s=${W}x${H}:c0=0x1a0b2e:c1=0x06060a:c2=0x3a1030:x0=0:y0=0:x1=${W}:y1=${H}:speed=0.02:r=${FPS}`,
      "-t", String(duration), "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "20", "-g", String(FPS), outFile]);
    return "placeholder (no footage found)";
  }
  const tmp = fs.mkdtempSync(path.join(path.dirname(outFile), "seg-"));
  const info = clips
    .map((f) => {
      const d = probe(f);
      const head = Math.min(HEAD_TRIM, d * 0.1);
      return { f, head, span: d * (1 - TAIL_TRIM) - head - CUT_SECONDS };
    })
    .filter((c) => c.span > 0);
  if (!info.length) throw new Error(`footage for ${slug} is too short for ${CUT_SECONDS}s shots`);
  const isPreferred = (c) => prefer.some((p) => path.basename(c.f).includes(p));
  const fav = info.filter(isPreferred);
  // Each video starts its other clips at a different clip and a different point, so two videos
  // never share the same run of shots.
  const seed = [...slug].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const others = info.filter((c) => !isPreferred(c));
  const rest = only && fav.length ? [] : others.map((_, i) => others[(i + seed) % others.length]);
  const n = Math.ceil(duration / CUT_SECONDS);
  const used = new Map();
  const list = [];
  let fi = 0;
  let ri = 0;
  for (let i = 0; i < n; i++) {
    // Favoured clips take the opening shots and every other shot after that.
    const useFav = fav.length && (i < 2 || i % 2 === 0 || !rest.length);
    const c = useFav ? fav[fi++ % fav.length] : rest[ri++ % rest.length];
    const k = used.get(c.f) ?? 0;
    used.set(c.f, k + 1);
    // Step through each clip shot by shot so repeat visits land on unseen footage.
    const base = isPreferred(c) ? 0 : ((seed % 97) / 97) * c.span;
    const offset = (c.head + ((base + k * CUT_SECONDS) % c.span)).toFixed(2);
    const seg = path.join(tmp, `s${String(i).padStart(3, "0")}.mp4`);
    ff(["-ss", offset, "-t", String(CUT_SECONDS), "-i", c.f, "-an",
      "-filter_complex", `[0:v]fps=${FPS},split[a][b];` +
        `[a]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=28:3,eq=brightness=-0.1[bg];` +
        `[b]scale=${W}:${BOX_H}:force_original_aspect_ratio=increase,crop=${W}:${BOX_H}[fg];[bg][fg]overlay=0:${BOX_Y},setsar=1`,
      "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "fast", "-crf", "17", "-g", String(FPS), seg]);
    list.push(`file '${seg.replace(/'/g, "'\\''")}'`);
  }
  const listFile = path.join(tmp, "list.txt");
  fs.writeFileSync(listFile, list.join("\n"));
  ff(["-f", "concat", "-safe", "0", "-i", listFile, "-t", String(duration), "-c", "copy", outFile]);
  fs.rmSync(tmp, { recursive: true, force: true });
  return `${n} cuts from ${(fav.length && only ? fav : info).length} clip(s)`;
}

// Voiceover + looped music bed + a whoosh on every new line + an impact on the hook and each stamp.
function buildMix(slug, timing, caps, duration, outFile) {
  const voFile = path.join(ROOT, "voiceovers", `${slug}.mp3`);
  const music = path.join(ROOT, "music", "bed.mp3");
  const hasMusic = fs.existsSync(music);
  const whooshes = timing.starts.slice(1);
  const hits = [0, ...caps.filter((c) => c.words.length === 1 && STAMP.test(c.words[0])).map((c) => c.start)];
  const args = ["-i", voFile];
  if (hasMusic) args.push("-stream_loop", "-1", "-i", music);
  const base = hasMusic ? 2 : 1;
  args.push("-f", "lavfi", "-i", "anoisesrc=d=0.42:c=white:a=0.7:r=44100", "-f", "lavfi", "-i", "sine=f=52:d=0.7:r=44100");
  const fx = [];
  const outs = ["[v]"];
  fx.push(`[0:a]aresample=44100,volume=1.5[v]`);
  if (hasMusic) {
    fx.push(`[1:a]aresample=44100,volume=${MUSIC_VOLUME},atrim=0:${duration},afade=t=out:st=${(duration - 0.6).toFixed(2)}:d=0.6[m]`);
    outs.push("[m]");
  }
  fx.push(`[${base}:a]highpass=f=900,lowpass=f=7000,afade=t=in:d=0.3:curve=qua,afade=t=out:st=0.3:d=0.12,volume=0.3,asplit=${Math.max(1, whooshes.length)}${whooshes.map((_, i) => `[w${i}]`).join("") || "[w0]"}`);
  fx.push(`[${base + 1}:a]afade=t=out:st=0.03:d=0.67:curve=exp,volume=2.2,asplit=${hits.length}${hits.map((_, i) => `[h${i}]`).join("")}`);
  whooshes.forEach((t, i) => {
    fx.push(`[w${i}]adelay=${Math.max(0, Math.round((t - 0.3) * 1000))}:all=1[wd${i}]`);
    outs.push(`[wd${i}]`);
  });
  if (!whooshes.length) fx.push("[w0]anullsink");
  hits.forEach((t, i) => {
    fx.push(`[h${i}]adelay=${Math.round(t * 1000)}:all=1[hd${i}]`);
    outs.push(`[hd${i}]`);
  });
  fx.push(`${outs.join("")}amix=inputs=${outs.length}:normalize=0:duration=longest,alimiter=limit=0.95,atrim=0:${duration}[out]`);
  ff([...args, "-filter_complex", fx.join(";"), "-map", "[out]", "-b:a", "192k", outFile]);
}

for (const video of scripts.videos) {
  if (only.length && !only.includes(video.slug)) continue;
  const timing = vo[video.slug];
  if (!timing) throw new Error(`no voiceover timing for ${video.slug}`);
  if (timing.starts.length !== video.lines.length) throw new Error(`${video.slug}: ${video.lines.length} lines but ${timing.starts.length} timings`);
  const dir = path.join(ROOT, "videos", video.slug);
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  const caps = captionsFor(video, timing);
  buildMix(video.slug, timing, caps, timing.duration + TAIL, path.join(dir, "assets", "mix.mp3"));
  // The gameplay bed is slow to cut; keep the existing one unless asked for a fresh cut (FRESH_BED=1).
  const bedFile = path.join(dir, "assets", "bg.mp4");
  const bed = fs.existsSync(bedFile) && !process.env.FRESH_BED
    ? "kept existing bed"
    : buildBed(video.slug, timing.duration + TAIL, bedFile, video.footage, video.footageOnly);
  for (const ins of video.inserts ?? []) {
    if (ins.kind !== "broll") continue;
    const src = path.join(ROOT, "broll", `${ins.clip}.mp4`);
    if (!fs.existsSync(src)) throw new Error(`${video.slug}: missing broll/${ins.clip}.mp4`);
    fs.copyFileSync(src, path.join(dir, "assets", `${ins.clip}.mp4`));
  }
  fs.writeFileSync(path.join(dir, "index.html"), html(video, timing, caps));
  fs.writeFileSync(path.join(dir, "hyperframes.json"), JSON.stringify({
    $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
    registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
    paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
    media: { autoProxy: true },
  }, null, 2) + "\n");
  console.log(`${video.slug}: ${caps.length} captions, ${(timing.duration + TAIL).toFixed(1)}s, bed = ${bed}`);
}
