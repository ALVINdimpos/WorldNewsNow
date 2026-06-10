#!/usr/bin/env node
/**
 * Verify bot prerender endpoints against a running API.
 * Usage: node scripts/verify-prerender.js [baseUrl]
 * Example: node scripts/verify-prerender.js http://localhost:8080
 */
const base = (process.argv[2] || process.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

const CHECKS = [
  { path: '/prerender/home', mustInclude: ['Latest Stories', 'PRIMEWORLDNEWS'] },
  { path: '/prerender/about', mustInclude: ['About PRIMEWORLDNEWS'] },
  { path: '/prerender/privacy', mustInclude: ['Privacy Policy'] },
  { path: '/api/health', mustInclude: ['PRIMEWORLDNEWS'] },
];

async function check({ path, mustInclude }) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, {
      headers: path.startsWith('/prerender') ? { Accept: 'text/html' } : { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    const missing = mustInclude.filter((s) => !body.includes(s));
    if (!res.ok) {
      return { path, ok: false, error: `HTTP ${res.status}` };
    }
    if (missing.length) {
      return { path, ok: false, error: `Missing: ${missing.join(', ')}` };
    }
    return { path, ok: true, bytes: body.length };
  } catch (err) {
    return { path, ok: false, error: err.message };
  }
}

async function checkArticle() {
  try {
    const listRes = await fetch(`${base}/api/articles?limit=1`, { signal: AbortSignal.timeout(15000) });
    const list = await listRes.json();
    const article = list?.data?.[0];
    if (!article) {
      return { path: '/prerender/article/:slug', ok: false, error: 'No published articles in database' };
    }
    const slug = article.slug || article._id;
    const path = `/prerender/article/${slug}`;
    const res = await fetch(`${base}${path}`, {
      headers: { Accept: 'text/html' },
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    if (!res.ok) return { path, ok: false, error: `HTTP ${res.status}` };
    if (!body.includes(article.title)) {
      return { path, ok: false, error: 'Article title not in prerender HTML' };
    }
    if (body.includes('Loading stories')) {
      return { path, ok: false, error: 'Prerender still shows loading shell text' };
    }
    return { path, ok: true, bytes: body.length, slug };
  } catch (err) {
    return { path: '/prerender/article/:slug', ok: false, error: err.message };
  }
}

async function main() {
  console.log(`\nPrerender verification — ${base}\n${'─'.repeat(50)}`);
  const results = [];
  for (const c of CHECKS) results.push(await check(c));
  results.push(await checkArticle());

  let passed = 0;
  for (const r of results) {
    if (r.ok) {
      passed += 1;
      const extra = r.slug ? ` (${r.slug})` : '';
      console.log(`✓ ${r.path}${extra} — ${r.bytes} bytes`);
    } else {
      console.log(`✗ ${r.path} — ${r.error}`);
    }
  }
  console.log(`\n${passed}/${results.length} checks passed\n`);
  process.exit(passed === results.length ? 0 : 1);
}

main();
