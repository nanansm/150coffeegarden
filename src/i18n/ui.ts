/**
 * All user-facing copy, per locale.
 *
 * These are NOT machine translations of each other. Indonesian copy is
 * written for people searching in Indonesian; English copy is written for
 * visitors who do not read Indonesian. They carry the same meaning, not the
 * same sentences.
 *
 * Editorial rule (owner decision, 21 Jul): specifics like exact capacity,
 * deposit amount and rain policy are quoted by the wedding admin over
 * WhatsApp, not published. Each FAQ answer therefore leads with what does
 * not change and routes to WhatsApp for what must be quoted per event.
 */
import type { Locale } from './config';

export interface FaqItem {
  q: string;
  a: string;
}

export interface PackageItem {
  name: string;
  priceLabel: string;
  includes: string[];
  featured?: boolean;
}

export const START_PRICE_IDR = 17_000_000;

export const ui = {
  en: {
    nav: {
      home: 'Home',
      wedding: 'Wedding & Events',
      feedback: 'Give Us Your Feedback',
      menu: 'Menu',
      location: 'Location',
      reserve: 'Reserve',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      skip: 'Skip to content',
      langLabel: 'Language',
      navLabel: 'Main navigation',
      drawerLabel: 'Navigation menu',
    },
    common: {
      whatsapp: 'WhatsApp',
      viewMenu: 'View Menu',
      openInMaps: 'Open in Google Maps',
      openingHours: 'Opening hours',
      contact: 'Contact',
      follow: 'Follow',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      brandTagline: 'Outdoor garden café & venue · Cicaheum, Bandung',
      reviewOnGoogle: 'Review us on Google',
      hoursLabels: ['Sunday – Thursday', 'Friday – Saturday'],
    },
    home: {
      title: '150 Coffee Garden — Outdoor Garden Café in East Bandung',
      description:
        'A cool, green garden café on Jl. Sulaksana, Cicaheum, Bandung. Shade trees, a pond, and room to sit for hours. Open daily from 7am. Also a venue for gatherings, events and weddings.',
      eyebrow: 'Cicaheum, Bandung',
      h1: 'A green garden in the middle of Bandung.',
      lead: 'Old shade trees, a pond, and an afternoon breeze. Room to sit for hours without rushing, right inside Bandung and close to the city centre.',
      ctaReserve: 'Reserve via WhatsApp',
      openNow: 'Open daily from 07.00',

      factHours: 'Open daily',
      factHoursValue: '07.00 – 23.00',
      factArea: 'Setting',
      factAreaValue: 'Open garden, plenty of shade',
      factParking: 'Where',
      factParkingValue: 'Cicaheum, East Bandung',

      doTitle: 'Come for one thing, stay for another',
      doLead: 'Four quite different reasons people end up here.',
      doCafe: 'Coffee & working',
      doCafeBody:
        'Wooden pavilions with long tables and deep shade. People settle in from opening and lose the morning here.',
      doCafeCta: 'See the menu',
      doGather: 'Family & picnics',
      doGatherBody:
        'Mats on the grass, space for kids to run, and a kids menu. Sundays fill up with whole families.',
      doGatherCta: 'Ask about a booking',
      doEvent: 'Gatherings & events',
      doEventBody:
        'Community meetups, campus events, office gatherings and small exhibitions have all run on this lawn.',
      doEventCta: 'Ask about the venue',
      doWedding: 'Weddings',
      doWeddingBody:
        'Outdoor ceremonies and receptions under the trees, from IDR 17 million, with a live availability calendar.',
      doWeddingCta: 'See wedding venue',

      foodEyebrow: 'The kitchen',
      foodTitle: 'The pasta is what people come back for.',
      foodLead: 'Cooked to order, so it still reaches the table hot.',
      foodItems: [
        'Spicy creamy chicken pasta, the one people order most',
        'Cranberry Sunkist: coconut water, cranberry and citrus',
        'A separate menu for kids',
      ],
      heroVideoLabel: 'Play the garden video',
      videosTitle: 'More from the kitchen',
      videosNote: 'Tap to play. Nothing downloads until you do.',
      videoPlayLabel: 'Play video',
      videoPasta: 'Making the pasta',
      videoHiddenGem: 'A hidden spot in the middle of the city',
      foodCta: 'Open the full menu',

      locationTitle: 'Where to find us',
      locationLead: 'In Cicaheum, East Bandung. Tap the address to open it in Maps.',
      addressLabel: 'Address',
      hoursLabel: 'Hours',

      galleryTitle: 'The place',
      galleryLead: 'Photographs from ordinary days and event days.',

      storyEyebrow: 'Wedding venue',
      storyTitle: 'A lot of people arrive for coffee and leave asking about weddings.',
      storyBody:
        'It happens often enough that we gave it its own name. The same trees, the same lawn, the same quiet — set up for a ceremony instead of an afternoon. Outdoor weddings from IDR 17 million, and you can check which dates are still open yourself.',
      storyCta: 'See the wedding venue',

      homeFaqTitle: 'Good to know',
      homeFaq: [
        {
          q: 'What are the opening hours?',
          a: 'Open every day from 07.00 to 23.00, and until 24.00 on Friday and Saturday.',
        },
        {
          q: 'Do I need to book, or can I just come?',
          a: 'Just come — seating is walk-in. For a large group or an event, message us on WhatsApp first so we can set the space aside.',
        },
        {
          q: 'Is it a good place to work or study?',
          a: 'Yes. There are wooden pavilions with long tables and deep shade, and mornings are quiet, so a lot of people settle in from opening.',
        },
        {
          q: 'Is it family and kid friendly?',
          a: 'Very. There is a wide lawn for children to run around and a kids menu, and weekends fill up with families.',
        },
        {
          q: 'Is everything outdoors, and what about rain?',
          a: 'The concept is an open garden with plenty of shade, and there are covered pavilion areas to move into if it rains.',
        },
        {
          q: 'Can it host a gathering or an event?',
          a: 'Yes. The lawn is used for office gatherings, community meetups, birthdays and small exhibitions. Ask about it on WhatsApp.',
        },
      ] as FaqItem[],

      moreTitle: 'Links you need',
      menuCta: 'Menu (PDF)',
      reviewCta: 'Give us your feedback',
      badmintonCta: '150 Badminton',
      careerCta: 'Careers at 150',

      stickyAnchor: 'Location',
    },
    wedding: {
      title: 'Outdoor Wedding Venue in Bandung — 150 Wedding Venue',
      description:
        'An outdoor garden wedding venue in Cicaheum, Bandung. From IDR 17 million. Check which dates are still open on the calendar, then lock yours over WhatsApp.',
      eyebrow: 'Cicaheum, Bandung',
      h1: 'Get married in a garden, not a ballroom.',
      lead: 'Cool, green grounds with tall trees and a pond in Cicaheum, East Bandung. Right for the ceremony, the reception, or something intimate. See which dates are still open, then lock yours over WhatsApp.',
      priceBadge: 'From IDR 17 million',
      heroChips: ['Outdoor garden', 'Ceremony & reception', 'Up to ~1,000 guests'],
      ctaCheckDate: 'Check Dates',
      ctaChat: 'Ask the Wedding Admin',

      whyTitle: 'Why couples choose it',
      whyList: [
        'The mood is calm and green, a world away from a stiff ballroom.',
        'Natural light and open greenery make the photographs come alive.',
        'One place for both the ceremony and the reception, no moving guests around.',
        'The process is simple: check the calendar, chat, lock the date.',
      ],
      whyCaption: 'Natural light, clean setup, garden surroundings',

      filmTitle: 'See it for yourself',
      filmLead: 'A few moments from ceremonies and receptions in the garden. Tap a clip to play.',

      galleryTitle: 'The setting',
      galleryLead: 'A few setups and moments across the garden.',

      packagesTitle: 'Packages',
      packagesLead:
        'A starting picture. What each package includes, capacity, and add-ons are matched to your concept — the wedding admin walks you through it on WhatsApp.',
      packagesNote:
        'Prices may change. A formal quote is confirmed by the wedding admin over WhatsApp.',
      packagesCta: (name: string) => `Ask about ${name}`,

      calendarTitle: 'Availability calendar',
      calendarLead:
        'Crossed-out dates are taken. Pick an open date and lock it over WhatsApp — your chosen date is sent along automatically.',

      eventTitle: 'Not only weddings',
      eventLead:
        'The same grounds host office gatherings, family get-togethers, birthdays, community meetups, and small exhibitions. A different admin handles non-wedding bookings.',
      eventCta: 'Ask about booking for an event',
      eventUses: [
        'Office gatherings',
        'Family get-togethers',
        'Birthdays',
        'Community meetups',
        'Exhibitions & small markets',
      ],

      faqTitle: 'Questions we get often',
      closingTitle: 'Ready to check your date?',
      closingLead:
        'Send us the date you have in mind and our wedding admin will check it and walk you through the details.',
      closingCta: 'Chat with the Wedding Admin',
      closingSecondary: 'View calendar',
      stickyAnchor: 'Calendar',
    },
    calendar: {
      loading: 'Loading…',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      available: 'Available',
      booked: 'Booked',
      pickFirst: 'Pick a date to continue.',
      selectionTaken: 'That date was just booked. Please pick another one.',
      selectedPrefix: 'Selected date:',
      lock: 'Lock This Date via WhatsApp',
      gridLabel: 'Availability calendar',
      dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      suffixBooked: ' — booked',
      suffixPast: ' — in the past',
      suffixFree: ' — available',
      noticeDegraded:
        'Live availability is unavailable right now. Please confirm your date over WhatsApp.',
      noticeStale:
        'Availability may not be fully up to date. Please confirm your date over WhatsApp before deciding.',
    },
    gallery: {
      zoom: (alt: string) => `Enlarge photo: ${alt}`,
      preview: 'Photo preview',
      close: 'Close preview',
      prev: 'Previous photo',
      next: 'Next photo',
    },
    photos: {
      kidsGarden: { alt: 'Children exploring the wide lawn during a weekend activity session', caption: 'Weekend sessions on the lawn' },
      kidsActivity: { alt: 'A mentor guiding a small child through an activity on the grass', caption: 'Guided play, close at hand' },
      familyMats: { alt: 'Families sitting together on picnic mats across the grass', caption: 'Mats out on a Sunday morning' },
      lawnWide: { alt: 'The wide lawn at 150 Coffee Garden framed by tall trees', caption: 'The lawn on a quiet afternoon' },
      gardenChairs: { alt: 'Guests sitting in garden chairs under a large shade tree', caption: 'Deep shade, all afternoon' },
      lawnPeople: { alt: 'Guests spread across the lawn with the café building behind', caption: 'Room for everyone' },
      icedCoffee: { alt: 'An iced coffee served in a glass on a concrete table', caption: 'Cold brew, mid-afternoon' },
      pasta: { alt: 'A plate of spicy creamy chicken pasta', caption: 'Spicy creamy chicken pasta' },
      picnicFood: { alt: 'Food and iced drinks laid out on a checked picnic mat on the grass', caption: 'Lunch on the grass' },
      nightSparkler: { alt: 'Guests holding sparklers at night under warm hanging lights', caption: 'After dark' },
      decorChandelier: { alt: 'Wedding decor with chandeliers and white arches on the lawn', caption: 'Chandeliers on the lawn' },
      decorGarden: { alt: 'Floral wedding decor set among the garden trees', caption: 'Decor among the trees' },
      floralArch: { alt: 'A floral arch over a wooden walkway leading into the garden', caption: 'The walkway in' },
      procession: {
        alt: 'The couple walking in under a gold ceremonial umbrella as guests look on',
        caption: 'The couple arriving',
      },
      ceremonyDancers: {
        alt: 'Traditional dancers performing in front of the couple at the floral stage',
        caption: 'Traditional dance before the stage',
      },
      receptionStage: {
        alt: 'The floral reception stage on the lawn with the couple seated and dancers performing',
        caption: 'The stage set on the grass',
      },
      home: {
        gardenSeating: {
          alt: 'Garden seating under mature shade trees at 150 Coffee Garden',
          caption: 'Seating under the old trees',
        },
        lawnPicnic: {
          alt: 'Picnic mats spread across the wide lawn with guests sitting in groups',
          caption: 'The lawn on a busy afternoon',
        },
        pavilionWork: {
          alt: 'Guests working on laptops at long wooden tables in the pavilion',
          caption: 'Long tables in the wooden pavilion',
        },
        eventLawn: {
          alt: 'A flower-arranging class held on the lawn with dozens of guests',
          caption: 'A workshop on the lawn',
        },
        familyPicnic: {
          alt: 'Families picnicking on the grass with children playing nearby',
          caption: 'Families settling in for the afternoon',
        },
      },
      weddingStage: {
        alt: 'A white and sage draped altar dressed with flowers on the lawn',
        caption: 'Draped altar on the grass',
      },
      intimateStage: {
        alt: 'A garden altar with wooden chairs and long benches set out for guests',
        caption: 'The altar and guest benches',
      },
      coupleJoy: {
        alt: 'A newly married couple walking across the lawn under a gold ceremonial umbrella as guests look on',
        caption: 'A real day in the garden',
      },
      gardenSetup: {
        alt: 'The garden at 150 Coffee Garden set up for a wedding reception',
        caption: 'The garden set for a reception',
      },
      aisle: {
        alt: 'An aisle running between green borders towards the altar',
        caption: 'The aisle across open ground',
      },
      reception: {
        alt: 'A wedding reception underway in the garden at 150 Coffee Garden',
        caption: 'A reception in the late afternoon',
      },
      heroWedding: 'The open garden at 150 Coffee Garden arranged for a wedding',
    },
    faq: [
      {
        q: 'How many guests does it hold?',
        a: 'The grounds hold up to about 1,000 guests, and the workable number follows the shape of your day — a ceremony, a full reception, and an intimate wedding each need the space differently. Our wedding team works the number out against the layout you want, including guest seating, the altar, and catering. Send your rough guest count over WhatsApp and they will come back with a recommendation.',
      },
      {
        q: 'Is it entirely outdoors, or is there shade?',
        a: 'The concept is outdoor garden — wide greenery, a pond and mature trees, which is exactly what makes the photographs and the atmosphere work. Shaded areas and layout adjustments are planned with you around your date and your concept.',
      },
      {
        q: 'What happens if it rains?',
        a: 'We prepare a fallback using layout and area adjustments. What that looks like in practice depends on your date, guest count and run of show, so it is always discussed directly with the wedding team before anything is agreed — never answered with a blanket policy.',
      },
      {
        q: 'Can we bring our own vendors or wedding organiser?',
        a: 'Yes. Outside vendors and organisers are welcome. It only needs technical coordination with the 150 team so load-in, access and setup timing stay safe and orderly.',
      },
      {
        q: 'How do we book and lock a date?',
        a: 'Three steps. Check which dates are still open on the availability calendar on this page, then press the lock button, which sends your chosen date straight to the wedding admin on WhatsApp. The admin confirms availability, explains the package and the deposit, and the date is held on the terms you agree.',
      },
      {
        q: 'Is the calendar on this page live?',
        a: 'Yes — it reads booked dates directly from our internal schedule and refreshes regularly. Still confirm over WhatsApp before you decide, since dates can change while a booking is in progress.',
      },
    ] as FaqItem[],
    packages: [
      {
        name: 'Basic Garden',
        priceLabel: 'From IDR 17 million',
        includes: ['Garden grounds', 'Basic setup', 'Duration as scheduled'],
      },
      {
        name: 'Signature',
        priceLabel: 'Most chosen',
        includes: ['Grounds + layout planning', 'Coordination support', 'Optional add-ons'],
        featured: true,
      },
      {
        name: 'Custom',
        priceLabel: 'On request',
        includes: ['Bespoke concept & requirements', 'Vendor collaboration', 'Flexible setup'],
      },
    ] as PackageItem[],
    /**
     * NOTE: WhatsApp prefills stay INDONESIAN on both locales (owner decision,
     * 21 Jul). The UI language is for the visitor; the chat message is for the
     * admin who answers it, and they work in Indonesian. Opening an English
     * thread would just force them to translate before replying.
     */
    wa: {
      reservasi: 'Halo 150 Coffee Garden, saya mau menanyakan reservasi.',
      event: 'Halo 150 Coffee Garden, saya mau menanyakan sewa tempat untuk acara.',
      weddingUmum: 'Halo 150 Coffee Garden, saya mau menanyakan paket wedding.',
      badminton: 'Halo, saya mau reservasi lapangan 150 Badminton.',
      weddingPaket: (name: string) =>
        `Halo 150 Coffee Garden, saya tertarik dengan paket wedding "${name}". Boleh minta detailnya?`,
      weddingKunciTanggal: (date: string) =>
        `Halo 150 Wedding Venue, saya mau cek ketersediaan tanggal ${date} untuk acara pernikahan.\n\nApakah tanggal ini masih tersedia? Terima kasih.`,
    },
  },

  id: {
    nav: {
      home: 'Beranda',
      wedding: 'Wedding & Acara',
      feedback: 'Beri Masukan',
      menu: 'Menu',
      location: 'Lokasi',
      reserve: 'Reservasi',
      openMenu: 'Buka menu',
      closeMenu: 'Tutup menu',
      skip: 'Lompat ke konten',
      langLabel: 'Bahasa',
      navLabel: 'Navigasi utama',
      drawerLabel: 'Menu navigasi',
    },
    common: {
      whatsapp: 'WhatsApp',
      viewMenu: 'Lihat Menu',
      openInMaps: 'Buka di Google Maps',
      openingHours: 'Jam buka',
      contact: 'Hubungi',
      follow: 'Ikuti',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Layanan',
      brandTagline: 'Kafe taman terbuka & tempat acara · Cicaheum, Bandung',
      reviewOnGoogle: 'Ulas kami di Google',
      hoursLabels: ['Minggu – Kamis', 'Jumat – Sabtu'],
    },
    home: {
      title: '150 Coffee Garden · Kafe Taman Terbuka di Bandung Timur',
      description:
        'Kafe taman yang adem dan asri di Jl. Sulaksana, Cicaheum, Bandung. Pohon rindang, kolam, dan tempat duduk berjam-jam. Buka tiap hari dari jam 7 pagi. Bisa juga untuk gathering, acara, dan wedding.',
      eyebrow: 'Cicaheum, Bandung',
      h1: 'Taman yang asri di tengah Kota Bandung.',
      lead: 'Pohon-pohon besar, kolam, dan angin sore. Tempat buat duduk lama tanpa buru-buru, masih di dalam Kota Bandung dan nggak jauh dari pusat kota.',
      ctaReserve: 'Reservasi via WhatsApp',
      openNow: 'Buka tiap hari dari 07.00',

      factHours: 'Buka tiap hari',
      factHoursValue: '07.00 – 23.00',
      factArea: 'Suasana',
      factAreaValue: 'Taman terbuka, banyak teduh',
      factParking: 'Lokasi',
      factParkingValue: 'Cicaheum, Bandung Timur',

      doTitle: 'Datang buat satu hal, betah karena hal lain',
      doLead: 'Empat alasan yang beda-beda kenapa orang berakhir di sini.',
      doCafe: 'Ngopi & kerja',
      doCafeBody:
        'Saung kayu, meja panjang, dan teduh yang tebal. Banyak yang datang pas buka lalu kehabisan pagi di sini.',
      doCafeCta: 'Lihat menu',
      doGather: 'Keluarga & piknik',
      doGatherBody:
        'Tikar digelar di rumput, anak-anak bebas lari, dan ada menu khusus anak. Hari Minggu penuh sama keluarga.',
      doGatherCta: 'Tanya reservasi',
      doEvent: 'Gathering & acara',
      doEventBody:
        'Kumpul komunitas, acara kampus, gathering kantor, sampai exhibition kecil pernah jalan di halaman ini.',
      doEventCta: 'Tanya sewa tempat',
      doWedding: 'Wedding',
      doWeddingBody:
        'Akad dan resepsi outdoor di bawah pohon, mulai 17 juta, lengkap dengan kalender ketersediaan tanggal.',
      doWeddingCta: 'Lihat venue wedding',

      foodEyebrow: 'Dapur',
      foodTitle: 'Pasta-nya yang bikin orang balik lagi.',
      foodLead: 'Dimasak setelah dipesan, jadi waktu sampai meja masih anget.',
      foodItems: [
        'Spicy Creamy Chicken Pasta, yang paling sering dipesan',
        'Cranberry Sunkist, air kelapa dicampur cranberry dan jeruk',
        'Ada menu sendiri buat anak',
      ],
      heroVideoLabel: 'Putar video taman',
      videosTitle: 'Lihat lebih dekat',
      videosNote: 'Ketuk untuk memutar. Sebelum diketuk, tidak ada yang diunduh.',
      videoPlayLabel: 'Putar video',
      videoPasta: 'Proses bikin pasta',
      videoHiddenGem: 'Tempat tersembunyi di tengah kota',
      foodCta: 'Buka menu lengkap',

      locationTitle: 'Lokasinya di mana',
      locationLead: 'Di Cicaheum, Bandung Timur. Ketuk alamatnya untuk buka di Maps.',
      addressLabel: 'Alamat',
      hoursLabel: 'Jam buka',

      galleryTitle: 'Suasananya',
      galleryLead: 'Foto dari hari biasa dan hari ada acara.',

      storyEyebrow: 'Venue wedding',
      storyTitle: 'Banyak yang datang buat ngopi, pulangnya malah nanya soal nikahan.',
      storyBody:
        'Saking seringnya, kami kasih nama sendiri. Pohon yang sama, halaman yang sama, tenang yang sama, cuma ditata buat akad. Wedding outdoor mulai 17 juta, dan tanggal kosongnya bisa kamu cek sendiri.',
      storyCta: 'Lihat venue wedding',

      homeFaqTitle: 'Sering ditanya',
      homeFaq: [
        {
          q: 'Jam bukanya kapan?',
          a: 'Buka tiap hari jam 07.00 sampai 23.00, dan sampai 24.00 di hari Jumat dan Sabtu.',
        },
        {
          q: 'Perlu reservasi atau bisa langsung datang?',
          a: 'Bisa langsung datang, tempat duduk sistem walk-in. Buat rombongan atau acara, chat dulu via WhatsApp biar tempatnya kami siapkan.',
        },
        {
          q: 'Cocok nggak buat kerja atau nugas?',
          a: 'Cocok. Ada saung dengan meja panjang dan area teduh, paginya juga tenang, jadi banyak yang betah dari jam buka.',
        },
        {
          q: 'Ramah anak dan keluarga?',
          a: 'Ramah banget. Ada rumput luas buat anak main dan menu anak, dan akhir pekan ramai keluarga.',
        },
        {
          q: 'Semua area outdoor? Kalau hujan gimana?',
          a: 'Konsepnya taman terbuka dengan banyak area teduh, dan ada saung beratap yang bisa dipakai kalau hujan.',
        },
        {
          q: 'Bisa buat gathering atau acara?',
          a: 'Bisa. Area rumput dipakai buat gathering kantor, kumpul komunitas, ulang tahun, sampai exhibition kecil. Tanya aja via WhatsApp.',
        },
      ] as FaqItem[],

      moreTitle: 'Tautan yang kamu butuhkan',
      menuCta: 'Menu (PDF)',
      reviewCta: 'Beri masukan kamu',
      badmintonCta: '150 Badminton',
      careerCta: 'Karier di 150',

      stickyAnchor: 'Lokasi',
    },
    wedding: {
      title: 'Venue Wedding Outdoor Bandung · 150 Wedding Venue',
      description:
        'Venue pernikahan konsep taman terbuka di Cicaheum, Bandung. Mulai 17 juta. Cek tanggal yang masih tersedia lewat kalender, lalu kunci tanggal via WhatsApp.',
      eyebrow: 'Cicaheum, Bandung',
      h1: 'Nikah di taman, bukan di dalam gedung.',
      lead: 'Taman hijau yang adem dengan pohon-pohon tinggi dan kolam di Cicaheum, Bandung Timur. Cocok buat akad, resepsi, atau intimate wedding. Cek tanggal yang masih kosong di kalender, lalu kunci lewat WhatsApp.',
      priceBadge: 'Mulai 17 juta',
      heroChips: ['Outdoor garden', 'Akad & resepsi', 'Sampai ±1.000 tamu'],
      ctaCheckDate: 'Cek Tanggal',
      ctaChat: 'Tanya Admin Wedding',

      whyTitle: 'Kenapa banyak yang pilih di sini',
      whyList: [
        'Suasananya adem dan asri, beda dari ballroom yang kaku.',
        'Area hijau dan cahaya alami bikin hasil foto lebih hidup.',
        'Satu tempat buat akad sekaligus resepsi, tamu nggak perlu pindah.',
        'Prosesnya ringkas: cek kalender, chat, kunci tanggal.',
      ],
      whyCaption: 'Cahaya alami, penataan bersih, suasana taman',

      filmTitle: 'Lihat langsung suasananya',
      filmLead: 'Beberapa momen akad dan resepsi di taman. Ketuk klip untuk memutar.',

      galleryTitle: 'Suasana acara',
      galleryLead: 'Beberapa penataan dan momen di area taman.',

      packagesTitle: 'Paket',
      packagesLead:
        'Gambaran awal. Detail isi paket, kapasitas, dan add-on disesuaikan sama konsep acara kamu, dan dijelaskan langsung sama admin wedding lewat WhatsApp.',
      packagesNote:
        'Harga dapat berubah. Penawaran resmi dikonfirmasi lewat WhatsApp admin wedding.',
      packagesCta: (name: string) => `Tanya paket ${name}`,

      calendarTitle: 'Kalender ketersediaan',
      calendarLead:
        'Tanggal yang dicoret sudah dipesan. Pilih tanggal yang masih kosong, lalu kunci lewat WhatsApp. Tanggal pilihan kamu otomatis ikut terkirim.',

      eventTitle: 'Nggak cuma buat wedding',
      eventLead:
        'Area yang sama dipakai untuk gathering kantor, arisan, ulang tahun, pertemuan komunitas, sampai exhibition kecil. Untuk acara non-pernikahan, admin yang menangani berbeda.',
      eventCta: 'Tanya sewa tempat untuk acara',
      eventUses: [
        'Gathering & acara kantor',
        'Arisan & kumpul keluarga',
        'Ulang tahun',
        'Pertemuan komunitas',
        'Exhibition & bazaar kecil',
      ],

      faqTitle: 'Pertanyaan yang sering masuk',
      closingTitle: 'Siap cek tanggal acara kamu?',
      closingLead:
        'Kirim tanggal yang kamu incar, admin wedding kami bantu cek dan jelaskan detailnya.',
      closingCta: 'Chat Admin Wedding',
      closingSecondary: 'Lihat kalender',
      stickyAnchor: 'Kalender',
    },
    calendar: {
      loading: 'Memuat…',
      prevMonth: 'Bulan sebelumnya',
      nextMonth: 'Bulan berikutnya',
      available: 'Tersedia',
      booked: 'Sudah dipesan',
      pickFirst: 'Pilih tanggal dulu untuk melanjutkan.',
      selectionTaken: 'Tanggal itu ternyata sudah dipesan. Silakan pilih tanggal lain.',
      selectedPrefix: 'Tanggal dipilih:',
      lock: 'Kunci Tanggal via WhatsApp',
      gridLabel: 'Kalender ketersediaan',
      dow: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      suffixBooked: ', sudah dipesan',
      suffixPast: ', sudah lewat',
      suffixFree: ', tersedia',
      noticeDegraded:
        'Ketersediaan real-time sedang tidak tersedia. Silakan konfirmasi tanggal via WhatsApp.',
      noticeStale:
        'Data ketersediaan mungkin belum yang terbaru. Konfirmasi tanggal via WhatsApp sebelum memutuskan.',
    },
    gallery: {
      zoom: (alt: string) => `Perbesar foto: ${alt}`,
      preview: 'Pratinjau foto',
      close: 'Tutup pratinjau',
      prev: 'Foto sebelumnya',
      next: 'Foto berikutnya',
    },
    photos: {
      kidsGarden: { alt: 'Anak-anak bereksplorasi di halaman rumput luas saat kegiatan akhir pekan', caption: 'Kegiatan akhir pekan di rumput' },
      kidsActivity: { alt: 'Mentor mendampingi anak kecil dalam sebuah aktivitas di rumput', caption: 'Main terpandu, tetap di dekat' },
      familyMats: { alt: 'Keluarga duduk bersama di atas tikar piknik di halaman rumput', caption: 'Tikar digelar Minggu pagi' },
      lawnWide: { alt: 'Hamparan rumput luas di 150 Coffee Garden dikelilingi pohon-pohon tinggi', caption: 'Halaman rumput di sore yang tenang' },
      gardenChairs: { alt: 'Tamu duduk di kursi taman di bawah pohon besar yang rindang', caption: 'Teduh sepanjang sore' },
      lawnPeople: { alt: 'Tamu tersebar di halaman rumput dengan bangunan kafe di belakang', caption: 'Muat buat banyak orang' },
      icedCoffee: { alt: 'Es kopi disajikan dalam gelas di atas meja beton', caption: 'Es kopi, tengah hari' },
      pasta: { alt: 'Sepiring spicy creamy chicken pasta', caption: 'Spicy creamy chicken pasta' },
      picnicFood: { alt: 'Makanan dan minuman dingin digelar di atas tikar piknik kotak-kotak', caption: 'Makan siang di rumput' },
      nightSparkler: { alt: 'Tamu memegang kembang api di malam hari di bawah lampu gantung hangat', caption: 'Setelah gelap' },
      decorChandelier: { alt: 'Dekorasi wedding dengan lampu kristal dan gerbang putih di atas rumput', caption: 'Lampu kristal di atas rumput' },
      decorGarden: { alt: 'Dekorasi bunga pernikahan ditata di antara pepohonan taman', caption: 'Dekorasi di antara pohon' },
      floralArch: { alt: 'Gerbang bunga di atas jalan kayu menuju area taman', caption: 'Jalan masuk' },
      procession: {
        alt: 'Pengantin berjalan masuk di bawah payung kehormatan emas disaksikan para tamu',
        caption: 'Pengantin memasuki area',
      },
      ceremonyDancers: {
        alt: 'Penari tradisional membawakan tarian di depan pelaminan berhias bunga',
        caption: 'Tarian tradisional di depan pelaminan',
      },
      receptionStage: {
        alt: 'Pelaminan berhias bunga di atas rumput dengan pengantin duduk dan penari tampil',
        caption: 'Pelaminan ditata di atas rumput',
      },
      home: {
        gardenSeating: {
          alt: 'Area duduk taman di bawah pohon-pohon besar di 150 Coffee Garden',
          caption: 'Area duduk di bawah pohon besar',
        },
        lawnPicnic: {
          alt: 'Tikar piknik digelar di hamparan rumput luas dengan tamu duduk berkelompok',
          caption: 'Halaman rumput di sore yang ramai',
        },
        pavilionWork: {
          alt: 'Tamu bekerja dengan laptop di meja kayu panjang di area saung',
          caption: 'Meja panjang di saung kayu',
        },
        eventLawn: {
          alt: 'Kelas merangkai bunga di halaman rumput dengan puluhan peserta',
          caption: 'Workshop di halaman rumput',
        },
        familyPicnic: {
          alt: 'Keluarga piknik di rumput dengan anak-anak bermain di dekatnya',
          caption: 'Keluarga menghabiskan sore',
        },
      },
      weddingStage: {
        alt: 'Pelaminan draperi putih dan hijau sage berhias bunga di atas rumput',
        caption: 'Pelaminan di atas rumput',
      },
      intimateStage: {
        alt: 'Pelaminan taman dengan kursi kayu dan bangku panjang untuk tamu',
        caption: 'Pelaminan dan bangku tamu',
      },
      coupleJoy: {
        alt: 'Pasangan pengantin berjalan di rumput di bawah payung kehormatan emas disaksikan para tamu',
        caption: 'Hari nyata di taman',
      },
      gardenSetup: {
        alt: 'Area taman 150 Coffee Garden ditata untuk resepsi pernikahan',
        caption: 'Penataan taman untuk resepsi',
      },
      aisle: {
        alt: 'Jalur pengantin di antara area hijau menuju pelaminan',
        caption: 'Jalur pengantin di area terbuka',
      },
      reception: {
        alt: 'Suasana resepsi pernikahan di taman 150 Coffee Garden',
        caption: 'Suasana resepsi menjelang sore',
      },
      heroWedding: 'Taman terbuka 150 Coffee Garden ditata untuk acara pernikahan',
    },
    faq: [
      {
        q: 'Kapasitas tamunya berapa?',
        a: 'Areanya menampung sampai sekitar 1.000 tamu, dan angka nyamannya menyesuaikan konsep acara. Akad, resepsi, sama intimate wedding punya kebutuhan ruang yang beda. Tim wedding kami menghitungkan kapasitas sesuai layout yang kamu mau, termasuk area kursi tamu, pelaminan, dan katering. Kirim perkiraan jumlah tamu lewat WhatsApp, nanti langsung dibantu rekomendasinya.',
      },
      {
        q: 'Konsepnya outdoor semua atau ada area teduh?',
        a: 'Konsep utamanya outdoor garden, area hijau luas dengan kolam dan pepohonan, yang memang jadi kekuatan tempat ini buat foto dan suasana. Untuk pengaturan area teduh dan penyesuaian tata letak, tim kami bahas bersama kamu sesuai tanggal dan konsep acaranya.',
      },
      {
        q: 'Kalau turun hujan bagaimana?',
        a: 'Kami siapkan opsi rencana cadangan berupa penyesuaian layout dan area. Bentuk persisnya bergantung sama tanggal, jumlah tamu, dan susunan acara kamu, jadi ini selalu dibahas langsung sama tim wedding sebelum kesepakatan. Bukan dijawab seragam.',
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
    ] as FaqItem[],
    packages: [
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
    ] as PackageItem[],
    wa: {
      reservasi: 'Halo 150 Coffee Garden, saya mau menanyakan reservasi.',
      event: 'Halo 150 Coffee Garden, saya mau menanyakan sewa tempat untuk acara.',
      weddingUmum: 'Halo 150 Coffee Garden, saya mau menanyakan paket wedding.',
      badminton: 'Halo, saya mau reservasi lapangan 150 Badminton.',
      weddingPaket: (name: string) =>
        `Halo 150 Coffee Garden, saya tertarik dengan paket wedding "${name}". Boleh minta detailnya?`,
      weddingKunciTanggal: (date: string) =>
        `Halo 150 Wedding Venue, saya mau cek ketersediaan tanggal ${date} untuk acara pernikahan.\n\nApakah tanggal ini masih tersedia? Terima kasih.`,
    },
  },
} as const;

export type UI = (typeof ui)[Locale];

export function t(locale: Locale): UI {
  return ui[locale];
}
