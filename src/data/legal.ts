/**
 * Legal copy, carried over verbatim from the pages the old site published at
 * /privacypolicy.html and /termsofservice.html.
 *
 * Indonesian only, and deliberately so: this is the operative text the
 * business already published. Machine-translating legal terms would create a
 * second version that says something subtly different, so both locales link
 * to these same pages.
 */

export interface LegalBlock {
  type: 'p' | 'li';
  text: string;
}

export interface LegalSection {
  heading: string;
  body: LegalBlock[];
}

export const legal: Record<'privacy' | 'terms', LegalSection[]> =
{
  "privacy": [
    {
      "heading": "1. Pendahuluan",
      "body": [
        {
          "type": "p",
          "text": "Selamat datang di situs web 150 Coffee Garden Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi yang Anda berikan saat menggunakan situs kami maupun ketika berinteraksi dengan layanan kami."
        },
        {
          "type": "p",
          "text": "Dengan mengakses dan menggunakan situs ini, Anda dianggap telah membaca, memahami, dan menyetujui ketentuan dalam Kebijakan Privasi ini."
        }
      ]
    },
    {
      "heading": "2. Data yang Kami Kumpulkan",
      "body": [
        {
          "type": "p",
          "text": "Kami dapat mengumpulkan beberapa jenis informasi berikut:"
        },
        {
          "type": "p",
          "text": "Data ini diperoleh ketika Anda mengisi formulir, melakukan reservasi, atau menghubungi kami melalui WhatsApp, media sosial, atau kanal komunikasi lain. Contohnya:"
        },
        {
          "type": "li",
          "text": "Nama lengkap"
        },
        {
          "type": "li",
          "text": "Nomor telepon atau akun WhatsApp"
        },
        {
          "type": "li",
          "text": "Alamat email (jika diberikan)"
        },
        {
          "type": "li",
          "text": "Detail reservasi (tanggal, jumlah tamu, jenis acara, kebutuhan khusus)"
        },
        {
          "type": "li",
          "text": "Informasi lain yang Anda sampaikan secara sukarela"
        },
        {
          "type": "p",
          "text": "Saat Anda mengunjungi situs kami, sistem dapat mengumpulkan data tertentu secara otomatis, seperti:"
        },
        {
          "type": "li",
          "text": "Alamat IP"
        },
        {
          "type": "li",
          "text": "Jenis browser dan perangkat"
        },
        {
          "type": "li",
          "text": "Halaman yang diakses, durasi kunjungan, dan waktu akses"
        },
        {
          "type": "li",
          "text": "Referer (sumber dari mana Anda mengakses situs)"
        },
        {
          "type": "p",
          "text": "Kami dapat menerima informasi tambahan dari platform pihak ketiga yang terhubung dengan kami, seperti:"
        },
        {
          "type": "li",
          "text": "Platform pemesanan dan reservasi"
        },
        {
          "type": "li",
          "text": "Platform ulasan (misalnya Google Reviews)"
        },
        {
          "type": "li",
          "text": "Media sosial (Instagram, TikTok, Facebook, dan lainnya)"
        }
      ]
    },
    {
      "heading": "3. Untuk Apa Data Anda Digunakan?",
      "body": [
        {
          "type": "p",
          "text": "Kami menggunakan data yang kami kumpulkan untuk tujuan berikut:"
        },
        {
          "type": "li",
          "text": "Memproses dan mengonfirmasi reservasi atau pemesanan acara"
        },
        {
          "type": "li",
          "text": "Menjawab pertanyaan, permintaan, atau masukan dari Anda"
        },
        {
          "type": "li",
          "text": "Meningkatkan pengalaman pengguna di situs dan di lokasi 150 Coffee Garden"
        },
        {
          "type": "li",
          "text": "Mengirimkan informasi terkait promosi, event, atau update khusus (hanya jika Anda menyetujuinya)"
        },
        {
          "type": "li",
          "text": "Menganalisis performa situs dan memahami preferensi pengunjung"
        },
        {
          "type": "li",
          "text": "Menjaga keamanan situs, mencegah aktivitas yang tidak sah, dan memenuhi ketentuan hukum yang berlaku"
        }
      ]
    },
    {
      "heading": "4. Cookies dan Teknologi Pelacakan",
      "body": [
        {
          "type": "p",
          "text": "Situs ini dapat menggunakan cookies atau teknologi serupa untuk meningkatkan pengalaman Anda, seperti mengingat preferensi bahasa atau membantu kami memahami bagaimana situs digunakan."
        },
        {
          "type": "p",
          "text": "Anda dapat mengatur browser untuk menolak cookies atau memberikan notifikasi ketika cookies dikirimkan. Namun, beberapa bagian situs mungkin tidak berfungsi dengan optimal tanpa cookies."
        }
      ]
    },
    {
      "heading": "5. Berbagi Data dengan Pihak Ketiga",
      "body": [
        {
          "type": "p",
          "text": "Kami tidak menjual data pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan data Anda dengan pihak ketiga tepercaya dalam kondisi berikut:"
        },
        {
          "type": "li",
          "text": "Penyedia layanan teknologi (misalnya hosting, analitik, atau sistem pemesanan)"
        },
        {
          "type": "li",
          "text": "Mitra event, wedding organizer, atau vendor lain yang terlibat dalam acara Anda (dengan persetujuan)"
        },
        {
          "type": "li",
          "text": "Penegak hukum atau otoritas pemerintah jika diwajibkan oleh peraturan perundang-undangan atau proses hukum"
        },
        {
          "type": "p",
          "text": "Pihak ketiga tersebut hanya akan mendapatkan data yang diperlukan dan diharuskan menjaga kerahasiaan data tersebut."
        }
      ]
    },
    {
      "heading": "6. Penyimpanan dan Keamanan Data",
      "body": [
        {
          "type": "p",
          "text": "Kami berupaya melindungi data pribadi Anda dengan langkah keamanan yang wajar dan sesuai praktik umum, untuk mencegah akses, pengubahan, pengungkapan, atau perusakan yang tidak sah."
        },
        {
          "type": "p",
          "text": "Namun, tidak ada metode transmisi data melalui internet atau penyimpanan elektronik yang sepenuhnya aman. Kami tidak dapat menjamin keamanan absolut, tetapi akan terus meningkatkan upaya perlindungan data."
        }
      ]
    },
    {
      "heading": "7. Hak Anda atas Data Pribadi",
      "body": [
        {
          "type": "p",
          "text": "Bergantung pada hukum yang berlaku, Anda dapat memiliki hak-hak berikut terkait data pribadi Anda:"
        },
        {
          "type": "li",
          "text": "Hak untuk mengakses data yang kami simpan tentang Anda"
        },
        {
          "type": "li",
          "text": "Hak untuk meminta perbaikan jika data Anda tidak akurat atau tidak lengkap"
        },
        {
          "type": "li",
          "text": "Hak untuk meminta penghapusan data tertentu (subject to ketentuan hukum)"
        },
        {
          "type": "li",
          "text": "Hak untuk menarik persetujuan atas penggunaan data untuk keperluan marketing"
        },
        {
          "type": "p",
          "text": "Untuk menggunakan hak-hak tersebut, Anda dapat menghubungi kami melalui kanal resmi yang tertera pada bagian Cara Menghubungi Kami."
        }
      ]
    },
    {
      "heading": "8. Tautan ke Situs atau Layanan Pihak Ketiga",
      "body": [
        {
          "type": "p",
          "text": "Situs kami dapat berisi tautan ke situs lain, seperti layanan pemesanan, peta lokasi, atau media sosial. Kami tidak bertanggung jawab atas kebijakan privasi atau konten di situs pihak ketiga tersebut. Kami menyarankan Anda untuk membaca kebijakan privasi masing-masing situs sebelum memberikan data pribadi."
        }
      ]
    },
    {
      "heading": "9. Privasi Anak",
      "body": [
        {
          "type": "p",
          "text": "Situs ini tidak secara khusus ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak secara sadar mengumpulkan informasi pribadi dari anak-anak. Jika kami mengetahui bahwa data anak-anak dikumpulkan tanpa persetujuan orang tua/wali, kami akan berupaya menghapusnya."
        }
      ]
    },
    {
      "heading": "10. Perubahan atas Kebijakan Privasi",
      "body": [
        {
          "type": "p",
          "text": "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan perubahan layanan, teknologi, maupun peraturan. Perubahan akan diumumkan melalui pembaruan tanggal pada bagian “Terakhir diperbarui” di bagian atas halaman ini."
        },
        {
          "type": "p",
          "text": "Kami menganjurkan Anda untuk meninjau halaman ini secara berkala agar tetap mengetahui bagaimana kami melindungi data pribadi Anda."
        }
      ]
    },
    {
      "heading": "11. Cara Menghubungi Kami",
      "body": [
        {
          "type": "p",
          "text": "Jika Anda memiliki pertanyaan, permintaan, atau keluhan terkait Kebijakan Privasi ini, Anda dapat menghubungi kami melalui:"
        },
        {
          "type": "li",
          "text": "Alamat: Jl. Sulaksana I No.50, Cicaheum, Kec. Kiaracondong, Kota Bandung, Jawa Barat"
        },
        {
          "type": "li",
          "text": "Kanal resmi (WhatsApp, formulir, dan media sosial) yang tercantum di situs 150coffeegarden.com"
        },
        {
          "type": "p",
          "text": "Kami akan berupaya merespons permintaan Anda dalam jangka waktu yang wajar."
        }
      ]
    }
  ],
  "terms": [
    {
      "heading": "1. Penerimaan Syarat",
      "body": [
        {
          "type": "p",
          "text": "Dengan mengakses situs web 150coffeegarden.com, melakukan reservasi, atau menggunakan layanan kami, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju, harap tidak melanjutkan penggunaan situs atau layanan kami."
        }
      ]
    },
    {
      "heading": "2. Ruang Lingkup Layanan",
      "body": [
        {
          "type": "p",
          "text": "150 Coffee Garden menyediakan layanan terkait:"
        },
        {
          "type": "li",
          "text": "Penyediaan makanan dan minuman di lokasi"
        },
        {
          "type": "li",
          "text": "Reservasi meja dan area café"
        },
        {
          "type": "li",
          "text": "Penyewaan venue untuk acara (wedding, gathering, komunitas)"
        },
        {
          "type": "li",
          "text": "Kolaborasi event dan aktivitas komunitas"
        },
        {
          "type": "li",
          "text": "Informasi mengenai menu, promosi, dan aktivitas kami"
        },
        {
          "type": "p",
          "text": "Kami berhak mengubah atau menghentikan layanan tertentu kapan pun, dengan atau tanpa pemberitahuan."
        }
      ]
    },
    {
      "heading": "3. Reservasi & Kebijakan Penggunaan Venue",
      "body": [
        {
          "type": "li",
          "text": "Reservasi hanya dapat dilakukan melalui kanal resmi kami."
        },
        {
          "type": "li",
          "text": "Kami berhak menolak atau membatalkan reservasi jika diperlukan."
        },
        {
          "type": "li",
          "text": "DP (uang muka) tidak dapat dikembalikan, kecuali kondisi khusus."
        },
        {
          "type": "li",
          "text": "Jadwal event wajib dikonfirmasi minimal 7 hari sebelumnya."
        },
        {
          "type": "li",
          "text": "Penyewa bertanggung jawab atas kerusakan fasilitas selama acara."
        },
        {
          "type": "li",
          "text": "Penggunaan pihak ketiga (WO, vendor dekor, fotografer) wajib koordinasi dengan tim kami."
        }
      ]
    },
    {
      "heading": "4. Perilaku Pengguna",
      "body": [
        {
          "type": "p",
          "text": "Anda setuju untuk tidak melakukan tindakan yang dapat merugikan situs atau pengalaman pengunjung lain, termasuk:"
        },
        {
          "type": "li",
          "text": "Melakukan spam atau penyalahgunaan sistem reservasi"
        },
        {
          "type": "li",
          "text": "Mengakses data yang bukan untuk konsumsi publik"
        },
        {
          "type": "li",
          "text": "Melakukan aktivitas ilegal di area 150 Coffee Garden"
        },
        {
          "type": "li",
          "text": "Menyalahgunakan fasilitas internet, listrik, atau ruang komunitas"
        }
      ]
    },
    {
      "heading": "5. Informasi & Konten di Situs",
      "body": [
        {
          "type": "p",
          "text": "Kami berusaha memberikan informasi yang akurat dan terbaru. Namun, kami tidak menjamin bahwa:"
        },
        {
          "type": "li",
          "text": "Semua informasi selalu bebas kesalahan"
        },
        {
          "type": "li",
          "text": "Menu, harga, atau promo selalu up-to-date"
        },
        {
          "type": "li",
          "text": "Tidak terjadi perubahan mendadak pada layanan"
        },
        {
          "type": "p",
          "text": "Kami berhak memperbarui konten, harga, atau informasi kapan saja."
        }
      ]
    },
    {
      "heading": "6. Pembayaran & Kebijakan Refund",
      "body": [
        {
          "type": "li",
          "text": "Semua pembayaran yang dilakukan melalui reservasi atau penyewaan bersifat final."
        },
        {
          "type": "li",
          "text": "Refund hanya dapat diberikan jika terjadi kesalahan dari pihak kami."
        },
        {
          "type": "li",
          "text": "Untuk acara berskala besar, ketentuan refund mengikuti kontrak tertulis."
        }
      ]
    },
    {
      "heading": "7. Tanggung Jawab Pengguna",
      "body": [
        {
          "type": "p",
          "text": "Pengguna bertanggung jawab atas:"
        },
        {
          "type": "li",
          "text": "Kebenaran informasi yang diberikan saat reservasi"
        },
        {
          "type": "li",
          "text": "Kepatuhan terhadap kebijakan operasional di lokasi"
        },
        {
          "type": "li",
          "text": "Kerusakan fasilitas akibat penggunaan yang tidak wajar"
        }
      ]
    },
    {
      "heading": "8. Batasan Tanggung Jawab Kami",
      "body": [
        {
          "type": "p",
          "text": "150 Coffee Garden tidak bertanggung jawab atas:"
        },
        {
          "type": "li",
          "text": "Kehilangan barang pribadi pengunjung"
        },
        {
          "type": "li",
          "text": "Gangguan layanan akibat keadaan di luar kendali (cuaca, listrik, vendor pihak ketiga)"
        },
        {
          "type": "li",
          "text": "Keterlambatan atau pembatalan event yang disebabkan oleh faktor eksternal"
        }
      ]
    },
    {
      "heading": "9. Kebijakan Perubahan Layanan",
      "body": [
        {
          "type": "p",
          "text": "Kami dapat mengubah, menunda, atau menghentikan bagian mana pun dari layanan tanpa pemberitahuan lebih lanjut. Kami akan berusaha memberikan informasi jika ada perubahan besar."
        }
      ]
    },
    {
      "heading": "10. Hak Kekayaan Intelektual",
      "body": [
        {
          "type": "li",
          "text": "Logo, konten, foto, dan desain milik 150 Coffee Garden dilindungi hak cipta."
        },
        {
          "type": "li",
          "text": "Dilarang menyalin atau menggunakan aset visual kami tanpa izin tertulis."
        }
      ]
    },
    {
      "heading": "11. Tautan ke Pihak Ketiga",
      "body": [
        {
          "type": "p",
          "text": "Situs kami mungkin mengarah ke layanan atau situs pihak ketiga. Kami tidak bertanggung jawab atas konten atau kebijakan mereka. Pengguna wajib membaca syarat layanan tiap situs terkait."
        }
      ]
    },
    {
      "heading": "12. Penyelesaian Sengketa",
      "body": [
        {
          "type": "p",
          "text": "Sengketa yang timbul dari penggunaan situs atau layanan 150 Coffee Garden akan diselesaikan melalui musyawarah terlebih dahulu. Jika tidak tercapai kesepakatan, maka berlaku hukum di Indonesia."
        }
      ]
    },
    {
      "heading": "13. Perubahan Syarat dan Ketentuan",
      "body": [
        {
          "type": "p",
          "text": "Kami dapat memperbarui Terms of Service ini sewaktu-waktu. Perubahan akan diumumkan melalui tanggal pembaruan di bagian atas halaman ini. Pengguna dianggap menyetujui perubahan tersebut jika tetap menggunakan layanan kami setelah revisi berlaku."
        }
      ]
    },
    {
      "heading": "14. Kontak Kami",
      "body": [
        {
          "type": "p",
          "text": "Untuk pertanyaan atau kebutuhan informasi terkait Syarat dan Ketentuan ini, hubungi kami melalui:"
        },
        {
          "type": "li",
          "text": "Alamat: Jl. Sulaksana I No.50, Cicaheum, Bandung – Jawa Barat"
        },
        {
          "type": "li",
          "text": "Website: 150coffeegarden.com"
        },
        {
          "type": "li",
          "text": "WhatsApp & kontak resmi lain di halaman utama"
        }
      ]
    }
  ]
};
