/**
 * Single source of truth for every business fact and outbound link.
 *
 * Nothing in a component may hardcode a phone number, URL, or address.
 * If it appears in two places, it belongs here.
 */

export const site = {
  name: '150 Coffee Garden',
  legalName: '150 Coffee Garden',
  url: 'https://150coffeegarden.com',
  locale: 'id_ID',
  lang: 'id',
  themeColor: '#0F3B2A',
} as const;

/** NAP — must match Google Business Profile character for character. */
export const nap = {
  street: 'Jl. Sulaksana I No.50',
  village: 'Cicaheum',
  district: 'Kec. Kiaracondong',
  city: 'Kota Bandung',
  region: 'Jawa Barat',
  country: 'ID',
  /** From the Instagram bio: "Jl. Sulaksana No.50, Bandung 40282". */
  postalCode: '40282',
  /** Extracted from the legacy Google Maps embed URL in legacy/index.html. */
  geo: { lat: -6.908794, lng: 107.646954 },
  mapsUrl: 'https://maps.app.goo.gl/9pDv5KraZpMaDauq7',
} as const;

export const addressLine = `${nap.street}, ${nap.village}, ${nap.district}, ${nap.city}`;

/**
 * Opening hours. `close: '24:00'` is the correct schema.org encoding for
 * midnight — do not write '00:00', which means the start of the same day.
 */
export const hours = [
  { label: 'Minggu – Kamis', days: ['Su', 'Mo', 'Tu', 'We', 'Th'], open: '07:00', close: '23:00' },
  { label: 'Jumat – Sabtu', days: ['Fr', 'Sa'], open: '07:00', close: '24:00' },
] as const;

/**
 * WhatsApp numbers, in international format without '+'.
 *
 * NOTE(owner-decision-pending): legacy/wedding/main.js hardcoded `reservasi`
 * for the calendar date-lock message, while every other CTA on that page used
 * `wedding`. One of the two is a bug. Defaulting the lock to `wedding` because
 * it originates on the wedding page and names a wedding date — confirm before
 * launch and change `WEDDING_LOCK_NUMBER` below if wrong.
 */
export const wa = {
  reservasi: '6281222809995', // reservasi umum, event, konvensi
  wedding: '6282295699359', // admin wedding (berbeda orang)
  badminton: '6285171717367',
} as const;

export const WEDDING_LOCK_NUMBER = wa.wedding;

/** Prefill messages. Kept here so tone stays consistent across every CTA. */
export const waMessage = {
  reservasi: 'Halo 150 Coffee Garden, saya mau menanyakan reservasi.',
  event: 'Halo 150 Coffee Garden, saya mau menanyakan sewa tempat untuk acara.',
  weddingUmum: 'Halo 150 Coffee Garden, saya mau menanyakan paket wedding.',
  badminton: 'Halo, saya mau reservasi lapangan 150 Badminton.',
  weddingPaket: (paket: string) =>
    `Halo 150 Coffee Garden, saya tertarik dengan paket wedding "${paket}". Boleh minta detailnya?`,
  weddingKunciTanggal: (tanggal: string) =>
    `Halo 150 Coffee Garden, saya mau cek ketersediaan tanggal ${tanggal} untuk acara pernikahan.`,
} as const;

/** Outbound links. */
export const links = {
  menuPdf:
    'https://drive.google.com/drive/folders/15w5CgRu-aY056zaYyIKZLHD7yZbEchk6?usp=sharing',
  googleReview: 'https://g.page/r/CbcyzuePQ84bEBM/review',
  feedbackForm: 'https://forms.gle/5xENwvj4F87Wv5AV6',
  careerForm: 'https://forms.gle/EWkR8ixe8wasmSH4A',
  instagram: 'https://www.instagram.com/150coffeegarden',
  facebook: 'https://www.facebook.com/150coffeegarden/',
} as const;

/** Meta Pixel — loaded lazily, see src/scripts/pixel.ts. */
export const META_PIXEL_ID = '1019637798400517';

export const nav = [
  { label: 'Beranda', href: '/' },
  { label: 'Wedding and Event', href: '/wedding/', prefetch: true },
  { label: 'Menu', href: links.menuPdf, external: true },
  { label: 'Lokasi', href: '/#lokasi' },
] as const;
