// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://150coffeegarden.com',
  output: 'static',
  trailingSlash: 'ignore',

  // English is the default locale and is NOT prefixed: it lives at `/`.
  // Indonesian is served from `/id/`. See src/i18n/config.ts for the SEO
  // tradeoff this represents.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: false },
  },

  build: {
    // Directory URLs: /wedding/ emits dist/wedding/index.html, so the legacy
    // /wedding/index.html URL keeps working without a redirect.
    format: 'directory',
    // Total CSS is small enough (budget: 12KB) that inlining removes a
    // render-blocking round-trip entirely. Re-measure at Phase 4 — if the
    // inlined payload passes ~14KB, switch this back to 'auto'.
    inlineStylesheets: 'always',
  },

  image: {
    // Quality is tuned per-slot at the <Picture> call site. Foliage is where
    // AVIF artifacts show first, so hero images run higher than gallery ones.
    responsiveStyles: true,
  },

  // Only the Home -> Wedding link is worth prefetching; it is the main
  // internal conversion path. Opt in per-link with data-astro-prefetch.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', id: 'id-ID' },
      },
      serialize(item) {
        if (/\/(id\/)?$/.test(new URL(item.url).pathname)) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/wedding')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.2;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
