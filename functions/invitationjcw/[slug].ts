/**
 * Tamu baru dari Google Sheet (n8n tulis jcw/guests.json + MP3 ke R2).
 * Tamu lama tetap halaman statis; selain itu pakai template _tamu diisi data R2.
 */
interface Env { ASSETS: Fetcher; TTS_R2: R2Bucket }
type Guest = { slug: string; nama: string; panggilan: string; grup: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const slug = String(params.slug || '').toLowerCase();
  const asset = await env.ASSETS.fetch(request);
  if (asset.status !== 404) return asset;

  const obj = await env.TTS_R2.get('jcw/guests.json');
  const g = obj ? ((await obj.json()) as Guest[]).find((x) => x.slug === slug) : undefined;
  if (!g) return asset;

  const tpl = await env.ASSETS.fetch(new URL('/invitationjcw-tpl/', request.url));
  const html = (await tpl.text())
    .replaceAll('__SLUG__', esc(g.slug))
    .replaceAll('__NAMA__', esc(g.nama))
    .replace('HELLO, __PANGGILAN__', 'HELLO, ' + esc(g.panggilan.toUpperCase()))
    .replaceAll('__PANGGILAN__', esc(g.panggilan))
    .replaceAll('__GRUP__', esc(g.grup));
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
};
