/**
 * POST /api/jcw-surat
 *
 * Receives the Surat Sayembara form on /jcw and forwards it to the seasonal
 * n8n workflow, which assigns the letter code and appends the row to the
 * "jacoweek" Google Sheet tab. The n8n webhook URL and its shared key stay
 * server-side (JCW_N8N_URL / JCW_N8N_KEY) so the browser never sees them.
 *
 * Rate limiting reuses the `AVAILABILITY_KV` binding (per-IP-per-hour) when it
 * is present; without the binding the endpoint still works.
 */

interface Env {
  JCW_N8N_URL: string;
  JCW_N8N_KEY: string;
  AVAILABILITY_KV?: KVNamespace;
}

const DAYS = ['Fri, 4 Dec', 'Sat, 5 Dec', 'Sun, 6 Dec'];
const PER_IP_PER_HOUR = 8;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false }, 403);
  if (!env.JCW_N8N_URL || !env.JCW_N8N_KEY) return json({ ok: false }, 503);

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const nama = String(b.nama ?? '').trim().slice(0, 60);
  const wa = String(b.wa ?? '').replace(/[\s-]/g, '');
  const kota = String(b.kota ?? '').trim().slice(0, 40);
  const hari = String(b.hari ?? '');
  const sumber = String(b.sumber ?? '').slice(0, 120);
  if (nama.length < 2 || !/^(\+62|62|0)8\d{7,12}$/.test(wa) || !kota || !DAYS.includes(hari)) {
    return json({ ok: false }, 400);
  }

  if (env.AVAILABILITY_KV) {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const key = `jcw-surat:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
    const n = Number((await env.AVAILABILITY_KV.get(key)) || 0);
    if (n >= PER_IP_PER_HOUR) return json({ ok: false }, 429);
    await env.AVAILABILITY_KV.put(key, String(n + 1), { expirationTtl: 3900 });
  }

  try {
    const res = await fetch(env.JCW_N8N_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-jcw-key': env.JCW_N8N_KEY },
      body: JSON.stringify({ nama, wa, kota, hari, sumber }),
    });
    // n8n answers 200 with an empty body when the workflow errors, so the
    // code in the body is the only proof the row was written.
    const out = (await res.json().catch(() => null)) as { ok?: boolean; code?: string } | null;
    if (!res.ok || !out?.ok || !out.code) return json({ ok: false }, 502);
    return json({ ok: true, code: out.code });
  } catch {
    return json({ ok: false }, 502);
  }
};
