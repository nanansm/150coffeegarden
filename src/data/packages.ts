/**
 * Wedding packages.
 *
 * `startPrice` feeds both the visible copy and the AggregateOffer JSON-LD,
 * so the page text and the structured data can never drift apart.
 */

export const START_PRICE_IDR = 17_000_000;

export interface WeddingPackage {
  name: string;
  priceLabel: string;
  includes: string[];
  featured?: boolean;
}

export const packages: WeddingPackage[] = [
  {
    name: 'Basic Garden',
    priceLabel: 'Mulai 17 juta',
    includes: ['Venue area garden', 'Setup dasar', 'Durasi sesuai jadwal'],
  },
  {
    name: 'Signature',
    priceLabel: 'Paling banyak dipilih',
    includes: ['Venue + pengaturan layout', 'Pendampingan koordinasi', 'Add-on opsional'],
    featured: true,
  },
  {
    name: 'Custom',
    priceLabel: 'Sesuai permintaan',
    includes: ['Konsep & kebutuhan khusus', 'Kolaborasi dengan vendor', 'Setup fleksibel'],
  },
];
