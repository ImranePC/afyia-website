/**
 * Generates two build inputs from a single list of pages:
 *
 *  - prerender-routes.txt : consumed by the Angular build (`prerender.routesFile`)
 *  - src/sitemap.xml      : shipped as an asset, served at /sitemap.xml
 *
 * Static routes are hard-coded (mirror of app.routes.ts). Product / category
 * detail pages are pulled from the production API; if it is unreachable they are
 * simply left out (prerender falls back to CSR, sitemap omits them).
 *
 * News detail pages (`/:lang/news/:id`) are intentionally excluded — CSR only.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LANGS = ['fr', 'en'];
const SITE_URL = 'https://www.afyia-diagnostics.com';

// Language-neutral page paths (mirror of app.routes.ts children).
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

// Prerendered but kept out of the sitemap (noindex pages the web server can use
// as its 404 document, e.g. Apache `ErrorDocument 404 /fr/404/index.html`).
const EXTRA_PRERENDER_PATHS = ['/404'];

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
    console.warn(`[gen-routes] skipping ${path}: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Collect the language-neutral page paths (with leading slash). */
async function collectPaths() {
  const paths = new Set(STATIC_PATHS.map((p) => (p ? `/${p}` : '/')));

  const products = await tryFetchJson('/products');
  if (Array.isArray(products)) {
    for (const prod of products) {
      const id = prod.product_id ?? prod.id;
      if (id) paths.add(`/product/${id}`);
    }
    console.log(`[gen-routes] +${products.length} product pages`);
  }

  const categories = await tryFetchJson('/categories');
  if (Array.isArray(categories)) {
    for (const cat of categories) {
      const id = cat.id ?? cat.category_id;
      if (id) paths.add(`/products/${id}`);
    }
    console.log(`[gen-routes] +${categories.length} category pages`);
  }

  return [...paths].sort();
}

function writePrerenderRoutes(paths) {
  const routes = [...paths, ...EXTRA_PRERENDER_PATHS].flatMap((p) =>
    LANGS.map((l) => `/${l}${p === '/' ? '' : p}`),
  );
  const out = join(process.cwd(), 'prerender-routes.txt');
  writeFileSync(out, routes.join('\n') + '\n', 'utf-8');
  console.log(`[gen-routes] wrote ${routes.length} routes to ${out}`);
}

function writeSitemap(paths) {
  const url = (lang, p) => `${SITE_URL}/${lang}${p === '/' ? '' : p}`;
  const entries = paths.flatMap((p) =>
    LANGS.map((lang) => {
      const alternates = [
        ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, p)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url('fr', p)}"/>`,
      ].join('\n');
      return `  <url>\n    <loc>${url(lang, p)}</loc>\n${alternates}\n  </url>`;
    }),
  );

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  const out = join(process.cwd(), 'src', 'sitemap.xml');
  writeFileSync(out, xml, 'utf-8');
  console.log(`[gen-routes] wrote ${entries.length} urls to ${out}`);
}

const paths = await collectPaths();
writePrerenderRoutes(paths);
writeSitemap(paths);
