// Bundles src/hero3d.js (Three.js scene) and inlines it into index.html,
// so the demo stays a single file that works offline and on any host.
//   npm install && npm run build
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const out = await build({
  entryPoints: ['src/hero3d.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  legalComments: 'eof',
  write: false
});
const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const START = '<script id="hero3d">';
const END = '</script><!--/hero3d-->';
let html = readFileSync('index.html', 'utf8');
const i = html.indexOf(START);
const j = html.indexOf(END);
if (i < 0 || j < 0 || j < i) throw new Error('hero3d script markers not found in index.html');
html = html.slice(0, i + START.length) + js + html.slice(j);
writeFileSync('index.html', html);
console.log(`hero3d bundle inlined: ${(js.length / 1024).toFixed(0)} KB`);
