/**
 * Wedding FAQ. Feeds BOTH the <details> accordion and the FAQPage JSON-LD,
 * so the visible answer and the structured answer can never diverge.
 *
 * Editorial rule (owner decision, 21 Jul): specifics like exact capacity,
 * DP amount and rain policy are handled by the wedding admin over WhatsApp,
 * not published here. So each answer LEADS with the part that does not change
 * — the concept, what is included, how booking works — and then routes to WA
 * for the part that must be quoted per event.
 *
 * A pure "chat WA ya" answer is avoided deliberately: search engines and AI
 * assistants cannot cite a non-answer, and a couple comparing three venues
 * late at night picks the one whose page actually tells them something.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: 'Kapasitas tamunya berapa?',
    a: 'Areanya taman terbuka, jadi kapasitas menyesuaikan konsep acara — akad, resepsi, atau intimate wedding punya kebutuhan ruang yang berbeda. Tim wedding kami menghitungkan kapasitas sesuai layout yang kamu mau, termasuk area kursi tamu, pelaminan, dan katering. Kirim perkiraan jumlah tamu lewat WhatsApp, nanti langsung dibantu rekomendasinya.',
  },
  {
    q: 'Konsepnya outdoor semua atau ada area teduh?',
    a: 'Konsep utamanya outdoor garden — area hijau luas dengan kolam dan pepohonan, yang memang jadi kekuatan tempat ini untuk foto dan suasana. Untuk pengaturan area teduh dan penyesuaian tata letak, tim kami bahas bersama kamu sesuai tanggal dan konsep acaranya.',
  },
  {
    q: 'Kalau turun hujan bagaimana?',
    a: 'Kami siapkan opsi rencana cadangan berupa penyesuaian layout dan area. Bentuk persisnya bergantung pada tanggal, jumlah tamu, dan susunan acara kamu, jadi ini selalu dibahas langsung dengan tim wedding sebelum kesepakatan — bukan dijawab seragam.',
  },
  {
    q: 'Boleh bawa vendor atau wedding organizer sendiri?',
    a: 'Boleh. Vendor dan WO dari luar diperbolehkan, tinggal koordinasi teknis dengan tim 150 supaya pemasangan, akses masuk, dan jadwal loading aman dan rapi.',
  },
  {
    q: 'Bagaimana cara booking dan mengunci tanggal?',
    a: 'Tiga langkah: cek dulu tanggal yang masih kosong di kalender ketersediaan pada halaman ini, lalu tekan tombol kunci tanggal yang otomatis mengirim tanggal pilihan kamu ke WhatsApp admin wedding. Admin akan konfirmasi ketersediaan, menjelaskan detail paket dan tanda jadi, lalu tanggal dikunci sesuai kesepakatan.',
  },
  {
    q: 'Kalender di halaman ini real-time?',
    a: 'Ya, kalender menarik data tanggal yang sudah dipesan langsung dari jadwal internal kami dan diperbarui berkala. Tetap konfirmasi lewat WhatsApp sebelum memutuskan, karena tanggal bisa berubah saat ada pemesanan yang sedang berjalan.',
  },
];
