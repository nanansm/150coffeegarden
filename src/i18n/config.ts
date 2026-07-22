/**
 * i18n configuration.
 *
 * English is the default locale and lives at the root (`/`, `/wedding/`).
 * Indonesian is prefixed (`/id/`, `/id/wedding/`).
 *
 * SEO note for whoever maintains this: the traffic that actually walks into
 * the café comes from Indonesian queries ("kafe bandung timur", "venue
 * wedding bandung"). English-at-root is a deliberate owner decision, so the
 * Indonesian pages carry full hreflang, sit in the sitemap, and are written
 * as native copy rather than translated strings — otherwise they would lose
 * the local search that matters most.
 */

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  en: { label: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
  id: { label: 'ID', htmlLang: 'id', ogLocale: 'id_ID' },
};

/** Read the active locale from a URL pathname. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(segment as Locale) ? (segment as Locale) : DEFAULT_LOCALE;
}

/**
 * Build a path for a given locale.
 * `localizedPath('/wedding/', 'id')` -> `/id/wedding/`
 * `localizedPath('/wedding/', 'en')` -> `/wedding/`
 */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return `/${locale}${clean === '/' ? '/' : clean}`;
}

/** Strip the locale prefix, giving the canonical route key. */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (LOCALES.includes(parts[0] as Locale) && parts[0] !== DEFAULT_LOCALE) parts.shift();
  return `/${parts.join('/')}${parts.length ? '/' : ''}`;
}
