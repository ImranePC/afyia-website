/**
 * Generates prerender-routes.txt consumed by the Angular build (`prerender.routesFile`).
 *
 * Always emits the static routes for every language. Additionally tries to reach
 * the production API to enumerate product / category detail pages; if the API is
 * unreachable the detail pages simply fall back to client-side rendering.
 *
 * News detail pages (`/:lang/news/:id`) are intentionally NOT prerendered — they
 * change too often and are handled by CSR.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LANGS = ['fr', 'en'];

// Routes without params (mirror of app.routes.ts children).
const STATIC_PATHS = [
  '',
  'about',
  'software',
  'account-request',
  'news',
  'products',
  'legal-mentions',
  'contact',
  'biotechnology',
  'industrial-process',
  'human-health',
];

const API_URL = process.env['PRERENDER_API_URL'] || 'https://afyia-diagnostics.com:3001';
const API_TIMEOUT_MS = 8000;

async function tryFetchJson(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      headers: { 'X-App-Lang': 'fr' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[prerender-routes] skipping ${path}: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const routes = new Set();

  for (const lang of LANGS) {
    for (const p of STATIC_PATHS) {
      routes.add(`/${lang}${p ? `/${p}` : ''}`);
    }
  }

  const products = await tryFetchJson('/products');
  if (Array.isArray(products)) {
    for (const prod of products) {
      const id = prod.product_id ?? prod.id;
      if (!id) continue;
      for (const lang of LANGS) routes.add(`/${lang}/product/${id}`);
    }
    console.log(`[prerender-routes] +${products.length} product pages`);
  }

  const categories = await tryFetchJson('/categories');
  if (Array.isArray(categories)) {
    for (const cat of categories) {
      const id = cat.id ?? cat.category_id;
      if (!id) continue;
      for (const lang of LANGS) routes.add(`/${lang}/products/${id}`);
    }
    console.log(`[prerender-routes] +${categories.length} category pages`);
  }

  const list = [...routes].sort();
  const out = join(process.cwd(), 'prerender-routes.txt');
  writeFileSync(out, list.join('\n') + '\n', 'utf-8');
  console.log(`[prerender-routes] wrote ${list.length} routes to ${out}`);
}

main();
