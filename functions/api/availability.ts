/**
 * GET /api/availability
 *
 * Fronts the Google Apps Script endpoint that holds booked wedding dates.
 *
 * Why this exists: the legacy page called Apps Script directly from the
 * browser with `cache: "no-store"`. Measured cold start is ~4.2s, paid by
 * every visitor on mobile data, and when Apps Script fails the calendar
 * rendered empty with nothing but a console.error.
 *
 * Caching strategy — both layers, each for a different job:
 *   Cache API  hot path. Free, no write limits, colocated with the request.
 *              Per-colo and evictable, which is fine for a 5 minute TTL.
 *   KV         stale fallback only. Globally replicated and survives colo
 *              eviction, which is exactly what a degraded-mode store needs.
 *
 * The response is ALWAYS HTTP 200 with a status field in the body. A 5xx
 * would just make the client fetch throw, giving it less to work with than
 * the degraded payload does.
 */

interface Env {
  AVAILABILITY_UPSTREAM?: string;
  AVAILABILITY_KV?: KVNamespace;
}

const FALLBACK_UPSTREAM =
  'https://script.google.com/macros/s/AKfycbwkoNG1LJ9zjZxCLxjC9NPvWVpV-ZnUnhUFK7FFwRg3m6HeIv_kyY8cUQV_ylHnq3Yy/exec';

/** Measured Apps Script cold start is ~4.2s, so 4s would sever healthy
 *  requests and pin us to stale mode. 8s leaves real headroom. */
const UPSTREAM_TIMEOUT_MS = 8000;
const EDGE_TTL_S = 300;
/** Short edge TTL for stale/degraded replies. Without caching these, an
 *  upstream outage makes EVERY visitor wait out the 8s timeout. */
const FALLBACK_EDGE_TTL_S = 30;
const BROWSER_TTL_S = 60;
const KV_KEY = 'last-good';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface Payload {
  ok: boolean;
  dates: string[];
  updatedAt: string;
  stale?: boolean;
  degraded?: boolean;
}

/**
 * Apps Script can return an HTML error page with HTTP 200, so `res.ok` is
 * not a sufficient trust signal. Everything is validated before use.
 *
 * This also acts as the privacy boundary: only the `date` string is passed
 * through to the client. Verified today the sheet returns nothing else, but
 * it can gain columns at any time without us knowing, so the whitelist is
 * unconditional.
 */
function extractDates(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;

  const dates: string[] = [];
  let rejected = 0;
  for (const item of raw) {
    const value =
      typeof item === 'string'
        ? item
        : item && typeof item === 'object' && 'date' in item
          ? (item as { date: unknown }).date
          : null;

    if (typeof value !== 'string' || !DATE_RE.test(value)) {
      // Skip the row, do not condemn the payload. The upstream is a
      // spreadsheet: a trailing blank row or one date typed 14/06/2026 is
      // routine, and the old client simply ignored those. Rejecting the whole
      // response over one bad row blanks the calendar for everyone.
      rejected += 1;
      continue;
    }
    dates.push(value);
  }

  // If rows came back but none parsed, the payload shape is wrong (not just
  // untidy) — that must still fail, or a garbage response would render as
  // "every date free".
  if (raw.length > 0 && dates.length === 0) return null;
  if (rejected > 0) console.warn(`[availability] skipped ${rejected} unparseable row(s)`);
  return dates;
}

function json(payload: Payload, cacheControl: string, xCache: string): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cacheControl,
      'x-cache': xCache,
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  // Normalize the cache key: query strings are stripped so a cache-busting
  // param cannot stampede the upstream.
  const cacheKey = new Request(new URL('/api/availability', request.url).toString(), {
    method: 'GET',
  });
  const cache = caches.default;

  const hit = await cache.match(cacheKey);
  if (hit) {
    const res = new Response(hit.body, hit);
    res.headers.set('x-cache', 'HIT');
    return res;
  }

  const upstream = env.AVAILABILITY_UPSTREAM || FALLBACK_UPSTREAM;

  try {
    const res = await fetch(upstream, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cf: { cacheTtl: 0 },
      headers: { accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`upstream status ${res.status}`);
    if (!(res.headers.get('content-type') || '').includes('json')) {
      throw new Error('upstream did not return JSON');
    }

    const dates = extractDates(await res.json());
    if (!dates) throw new Error('upstream payload failed validation');

    const payload: Payload = {
      ok: true,
      dates,
      updatedAt: new Date().toISOString(),
    };

    const fresh = json(
      payload,
      `public, max-age=${BROWSER_TTL_S}, s-maxage=${EDGE_TTL_S}`,
      'MISS',
    );

    waitUntil(cache.put(cacheKey, fresh.clone()));
    if (env.AVAILABILITY_KV) {
      waitUntil(env.AVAILABILITY_KV.put(KV_KEY, JSON.stringify(payload)));
    }
    return fresh;
  } catch (err) {
    console.error('[availability] upstream failed:', err);

    // Degraded path: serve the last known good payload if we have one.
    if (env.AVAILABILITY_KV) {
      const cached = await env.AVAILABILITY_KV.get(KV_KEY, 'json').catch(() => null);
      const dates = cached && extractDates((cached as Payload).dates);
      if (dates) {
        const staleRes = json(
          {
            ok: true,
            stale: true,
            dates,
            updatedAt: (cached as Payload).updatedAt,
          },
          // Short TTL so we retry the upstream soon rather than pinning stale,
          // but long enough that an outage does not cost every visitor 8s.
          `public, max-age=${BROWSER_TTL_S}, s-maxage=${FALLBACK_EDGE_TTL_S}`,
          'STALE',
        );
        waitUntil(cache.put(cacheKey, staleRes.clone()));
        return staleRes;
      }
    }

    // Nothing cached anywhere. The client shows a notice and keeps every date
    // selectable — WhatsApp is the real confirmation step, so a human catches
    // any clash. This would NOT be acceptable if booking were self-serve.
    const degraded = json(
      { ok: false, degraded: true, dates: [], updatedAt: new Date().toISOString() },
      `public, max-age=0, s-maxage=${FALLBACK_EDGE_TTL_S}`,
      'DEGRADED',
    );
    waitUntil(cache.put(cacheKey, degraded.clone()));
    return degraded;
  }
};
