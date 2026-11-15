/**
 * RSVP undangan The Garden of Wonder -> n8n -> Google Sheet (tab RSVP).
 * Browser lanjut ke WA admin apa pun hasilnya; endpoint ini hanya pencatat.
 */
interface Env {
  JCW_RSVP_URL?: string;
  JCW_N8N_KEY?: string;
  AVAILABILITY_KV?: KVNamespace;
}

const PER_IP_PER_HOUR = 20;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false }, 403);
  if (!env.JCW_RSVP_URL || !env.JCW_N8N_KEY) return json({ ok: false }, 503);

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }
  const s = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);
  const nama = s(b.nama, 80);
  const tanggal = s(b.tanggal, 30);
  const jumlah = s(b.jumlah, 2);
  if (nama.length < 2 || !/^\d{1,2}$/.test(jumlah) || !/Des 2026$/.test(tanggal)) return json({ ok: false }, 400);

  if (env.AVAILABILITY_KV) {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const key = `jcw-rsvp:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
    const n = Number((await env.AVAILABILITY_KV.get(key)) || 0);
    if (n >= PER_IP_PER_HOUR) return json({ ok: false }, 429);
    await env.AVAILABILITY_KV.put(key, String(n + 1), { expirationTtl: 3900 });
  }

  try {
    const res = await fetch(env.JCW_RSVP_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-jcw-key': env.JCW_N8N_KEY },
      body: JSON.stringify({
        nama, tanggal, jumlah,
        email: s(b.email, 80), slug: s(b.slug, 40), namaLink: s(b.namaLink, 80), grup: s(b.grup, 20),
        ua: s(request.headers.get('user-agent'), 160),
      }),
    });
    return json({ ok: res.ok }, res.ok ? 200 : 502);
  } catch {
    return json({ ok: false }, 502);
  }
};
