// Deploys index.html to Netlify through the REST API.
//   NETLIFY_AUTH_TOKEN=<personal access token> npm run deploy
// First run creates a new site with a random *.netlify.app name and prints its id;
// set NETLIFY_SITE_ID to that id to redeploy to the same URL later.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const token = process.env.NETLIFY_AUTH_TOKEN;
if (!token) throw new Error('Set NETLIFY_AUTH_TOKEN (a Netlify personal access token).');
const API = 'https://api.netlify.com/api/v1';
const auth = { Authorization: `Bearer ${token}` };

async function call(path, opts = {}) {
  const res = await fetch(API + path, { ...opts, headers: { ...auth, ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  const type = res.headers.get('content-type') || '';
  return type.includes('json') ? res.json() : res.text();
}

let siteId = process.env.NETLIFY_SITE_ID;
if (!siteId) {
  const site = await call('/sites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  siteId = site.id;
  console.log(`Created site ${site.name} (NETLIFY_SITE_ID=${site.id})`);
}

const html = readFileSync(new URL('./index.html', import.meta.url));
const sha1 = createHash('sha1').update(html).digest('hex');
const deploy = await call(`/sites/${siteId}/deploys`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ files: { '/index.html': sha1 } })
});
if ((deploy.required || []).includes(sha1)) {
  await call(`/deploys/${deploy.id}/files/index.html`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: html });
}

for (let i = 0; i < 60; i++) {
  const d = await call(`/deploys/${deploy.id}`);
  if (d.state === 'ready') {
    console.log(`Live: ${d.ssl_url || d.url}`);
    process.exit(0);
  }
  if (d.state === 'error') throw new Error('Deploy failed: ' + (d.error_message || 'unknown error'));
  await new Promise((r) => setTimeout(r, 2000));
}
throw new Error('Timed out waiting for the deploy to go live.');
