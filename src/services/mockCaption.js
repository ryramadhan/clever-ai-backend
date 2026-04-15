// Fallback responses when AI quota is exhausted
// Indonesian-only, context-aware responses based on keywords

// Expanded Indonesian keyword responses - 50+ topics
const ID_RESPONSES = {
  // Emosi & Perasaan
  galau: "Saya mengerti Anda sedang merasa galau. Emosi ini wajar terjadi. Cobalah lakukan aktivitas yang menyenangkan, berbicara dengan teman, atau luangkan waktu untuk diri sendiri. Ingat, perasaan ini akan berlalu dengan waktu.",
  sedih: "Saya mendengar Anda sedang sedih. Wajar untuk merasa demikian dalam situasi tertentu. Cobalah tulis perasaan Anda dalam jurnal atau lakukan hal-hal kecil yang biasanya membuat Anda tersenyum. Jangan ragu mencari dukungan dari orang terdekat.",
  senang: "Senang mendengar Anda merasa senang! Nikmati momen ini sepenuhnya dan bagikan kebahagiaan Anda dengan orang-orang terdekat. Momen positif layak untuk dirayakan.",
  marah: "Saya mengerti Anda merasa marah. Emosi ini adalah respons alami. Cobalah tarik napas dalam-dalam, hitung sampai 10, dan beri diri Anda waktu sejenak sebelum bereaksi atau mengambil keputusan.",
  cemas: "Kecemasan adalah hal yang umum dialami banyak orang. Cobalah teknik pernapasan 4-7-8: tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik. Lakukan beberapa kali hingga merasa lebih tenang.",
  bosan: "Saat bosan, cobalah hal baru yang sederhana: jalan-jalan singkat di sekitar rumah, baca buku yang sudah lama tidak dibaca, atau coba resep masakan baru. Perubahan kecil bisa membawa semangat baru.",
  lelah: "Istirahatlah sejenak. Tubuh dan pikiran Anda butuh pemulihan. Tidur yang cukup sangat penting untuk kesehatan fisik dan mental. Prioritaskan istirahat sebagai bagian dari produktivitas.",
  stress: "Stres bisa melelahkan baik fisik maupun mental. Identifikasi sumber stres Anda dan lakukan langkah kecil untuk menguranginya. Teknik relaksasi seperti meditasi atau yoga bisa membantu.",
  takut: "Rasa takut adalah mekanisme perlindungan alami. Coba identifikasi sumber ketakutan Anda dan hadapi secara bertahap. Berbicara dengan orang yang dipercaya juga bisa membantu meringankan beban.",
  malas: "Rasa malas terkadang menandakan tubuh butuh istirahat. Namun jika berkepanjangan, coba pecah tugas besar menjadi langkah kecil yang lebih mudah dikerjakan. Mulai dari yang paling sederhana.",
  kecewa: "Kekecewaan adalah bagian dari hidup. Izinkan diri Anda merasakannya, tetapi jangan terlalu lama terjebak di sana. Evaluasi apa yang bisa dipelajari dan fokus pada langkah selanjutnya.",
  bingung: "Kebingungan sering terjadi saat dihadapkan pada banyak pilihan. Coba buat daftar pro-kontra, konsultasikan dengan orang yang berpengalaman, atau beri diri Anda waktu untuk berpikir dengan jernih.",
  kesepian: "Kesepian adalah perasaan yang valid. Cobalah bergabung dengan komunitas atau grup yang memiliki minat serupa, atau hubungi teman lama yang sudah lama tidak Anda kontak.",
  iri: "Rasa iri terkadang muncul tanpa disadari. Alihkan fokus dari orang lain ke diri sendiri. Ingat, setiap orang punya perjalanan dan waktunya masing-masing.",
  cinta: "Cinta adalah perasaan yang indah namun kompleks. Jaga komunikasi yang jujur, saling menghormati, dan memberi ruang untuk masing-masing tumbuh. Hubungan sehat butuh usaha dari kedua belah pihak.",
  putus: "Putus cinta memang menyakitkan. Beri diri Anda waktu untuk berduka dan pulih. Jangan buru-buru melupakan, tapi jangan juga terjebak di masa lalu. Fokus pada perawatan diri dan pertumbuhan pribadi.",
  
  // Kesehatan & Wellness
  sehat: "Kesehatan adalah investasi terbaik jangka panjang. Perhatikan tiga pilar utama: pola makan bergizi, tidur cukup 7-8 jam, dan olahraga teratur minimal 30 menit sehari.",
  sakit: "Saat sakit, prioritaskan istirahat dan pemulihan. Jangan memaksakan diri bekerja atau beraktivitas. Konsumsi makanan bergizi dan cairan yang cukup. Jika gejala berlanjut, segera konsultasikan ke dokter.",
  makan: "Nutrisi yang baik mendukung kesehatan fisik dan mental. Konsumsi makanan bergizi seimbang dengan karbohidrat kompleks, protein, lemak sehat, vitamin, dan mineral. Jangan lupa minum air putih minimal 8 gelas sehari.",
  tidur: "Kualitas tidur mempengaruhi mood, energi, dan fungsi kognitif. Hindari gadget 1 jam sebelum tidur, ciptakan rutinitas menenangkan, dan jaga kamar tidur tetap gelap dan nyaman.",
  olahraga: "Olahraga 30 menit sehari bisa meningkatkan mood, energi, dan kualitas tidur. Pilih aktivitas yang Anda nikmati seperti jalan kaki, bersepeda, yoga, atau berenang. Konsistensi lebih penting dari intensitas.",
  diet: "Diet sehat adalah tentang pola makan berkelanjutan, bukan pembatasan ekstrem. Fokus pada makanan utuh (whole foods), kontrol porsi, dan hindari makanan olahan berlebihan. Perubahan perlahan lebih bertahan lama.",
  gemuk: "Berat badan sehat adalah tentang keseimbangan, bukan angka tertentu. Fokus pada kebiasaan sehat: makan bergizi, olahraga teratur, tidur cukup, dan kelola stres. Hasil akan mengikuti prosesnya.",
  kurus: "Untuk menambah berat badan, fokus pada makanan padat nutrisi dan kalori sehat seperti kacang-kacangan, alpukat, dan protein. Kombinasikan dengan latihan kekuatan untuk membangun massa otot.",
  kulit: "Kesehatan kulit dimulai dari dalam: cukup tidur, minum air, makanan bergizi, dan proteksi sinar matahari. Rutinitas perawatan kulit yang sederhana namun konsisten lebih baik dari produk mahal.",
  mental: "Kesehatan mental sama pentingnya dengan kesehatan fisik. Jangan ragu mencari bantuan profesional jika dibutuhkan. Berbicara dengan psikolog bukan tanda kelemahan, melainkan keberanian.",
  
  // Pekerjaan & Karir
  kerja: "Untuk produktivitas, coba teknik Pomodoro: kerja fokus 25 menit, lalu istirahat 5 menit. Prioritaskan tugas yang paling penting dan sulit di pagi hari ketika energi masih puncak.",
  karir: "Pengembangan karir membutuhkan perencanaan jangka panjang. Identifikasi keahlian yang perlu ditingkatkan, cari mentor, dan jangan takut mengambil tantangan baru untuk pertumbuhan.",
  wawancara: "Persiapan adalah kunci wawancara yang sukses. Riset perusahaan, latih jawaban untuk pertanyaan umum, siapkan pertanyaan untuk pewawancara, dan tampilkan diri yang autentik.",
  resign: "Keputusan resign harus dipertimbangkan matang. Evaluasi alasan Anda, pastikan memiliki rencana keuangan dan rencana selanjutnya. Jaga profesionalisme saat proses pengunduran diri.",
  bisnis: "Membangun bisnis membutuhkan riset pasar, perencanaan finansial, dan kesabaran. Mulailah dari yang kecil, validasi ide Anda, dan siap untuk belajar dari kegagalan.",
  gaji: "Negosiasi gaji adalah hal yang wajar. Siapkan data gaji pasar untuk posisi Anda, highlight pencapaian dan kontribusi Anda, dan pilih waktu yang tepat untuk berdiskusi dengan atasan.",
  atasan: "Menjalin hubungan baik dengan atasan penting untuk karir. Komunikasikan progress secara rutin, minta feedback untuk berkembang, dan tunjukkan sikap proaktif dalam bekerja.",
  
  // Pendidikan & Belajar
  belajar: "Belajar adalah investasi jangka panjang. Fokus pada pemahaman konsep, bukan hanya menghafal. Gunakan teknik aktif recall dan spaced repetition untuk retensi memori yang lebih baik.",
  ujian: "Persiapan ujian sebaiknya dilakukan jauh-jauh hari dengan belajar rutin. Hindari begadang sebelum ujian. Teknik flashcard dan latihan soal bisa membantu memperkuat pemahaman.",
  skripsi: "Penyusunan skripsi butuh manajemen waktu yang baik. Buat timeline dengan milestone jelas, konsultasikan secara rutin dengan dosen pembimbing, dan mulai dari yang paling mudah untuk membangun momentum.",
  kuliah: "Pengalaman kuliah adalah waktu untuk eksplorasi dan pengembangan diri. Selain akademik, ikuti organisasi atau kegiatan ekstrakurikuler untuk membangun soft skill dan relasi.",
  sekolah: "Masa sekolah adalah fondasi penting. Selain nilai, fokus juga pada pembentukan karakter, kebiasaan belajar, dan pengembangan minat. Jangan terlalu tertekan dengan perbandingan dengan teman.",
  bahasa: "Belajar bahasa baru membutuhkan konsistensi. Praktikkan setiap hari meski hanya 15 menit. Gunakan aplikasi, tonton film, atau cari partner bahasa untuk latihan percakapan.",
  
  // Keuangan
  uang: "Kelola keuangan dengan prinsip 50/30/20: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan. Catat pengeluaran harian untuk melihat pola dan area yang bisa dioptimalkan.",
  tabungan: "Menabung sebaiknya dilakukan rutin meski jumlah kecil. Automatisasi transfer ke rekening tabungan setelah gajian. Miliki dana darurat minimal 3-6 bulan pengeluaran.",
  investasi: "Investasi adalah cara membuat uang bekerja untuk Anda. Mulailah dengan risiko rendah seperti reksadana atau obligasi. Pelajari dasar-dasar dan sesuaikan dengan profil risiko Anda.",
  utang: "Kelola utang dengan bijak. Prioritaskan bayar utang dengan bunga tinggi terlebih dahulu. Hindari menambah utang konsumtif. Jika terlilit banyak utang, konsultasikan dengan ahli keuangan.",
  
  // Teknologi
  hp: "Penggunaan gadget yang bijak penting untuk kesehatan. Batasi screen time, gunakan mode gelap, perhatikan jarak pandang ke layar, dan ambil istirahat setiap 20 menit penggunaan.",
  laptop: "Rawat laptop dengan rutin bersihkan debu, update sistem operasi, dan hindari overcharging. Backup data penting secara rutin ke cloud atau external storage.",
  aplikasi: "Pilih aplikasi yang benar-benar membantu produktivitas, bukan malah mengganggu. Review dan hapus aplikasi yang jarang digunakan. Atur notifikasi untuk mengurangi gangguan.",
  
  // Rumah Tangga & Relasi
  hubungan: "Hubungan yang sehat didasari komunikasi terbuka tanpa menuduh, saling menghargai perbedaan, dan memberi ruang untuk masing-masing berkembang. Jangan takut diskusi tentang ekspektasi.",
  pacar: "Dalam pacaran, komunikasi jujur dan trust adalah fondasi. Jangan kehilangan identitas diri dan tetap jalani hobi serta pertemanan di luar hubungan.",
  nikah: "Pernikahan adalah komitmen jangka panjang yang butuh persiapan matang. Selain cinta, pertimbangkan kesesuaian nilai, tujuan hidup, dan kematangan emosional kedua belah pihak.",
  keluarga: "Keluarga adalah dukungan sistem yang penting. Luangkan waktu berkualitas meski sederhana seperti makan bersama. Komunikasi terbuka dengan anggota keluarga perlu dijaga.",
  orangtua: "Menjadi orang tua adalah perjalanan belajar tanpa akhir. Tiap anak unik, jadi hindari perbandingan. Waktu bersama yang berkualitas lebih berharga dari materi.",
  anak: "Pendidikan anak terbaik adalah dengan teladan. Ajarkan nilai-nilai positif, kemandirian, dan empati sejak dini. Dukung minat dan bakat alami mereka tanpa memaksakan.",
  saudara: "Hubungan dengan saudara adalah iklang seumur hidup. Meski ada perbedaan, usahakan menjaga komunikasi dan saling support dalam suka maupun duka.",
  tetangga: "Hubungan baik dengan tetangga menciptakan lingkungan yang nyaman. Hormati privasi masing-masing, tapi tetap sapa dan bantu jika dibutuhkan.",
  teman: "Pertemanan yang tulus saling mendukung tanpa bersyarat. Jaga kontak meski hanya sesekali, dan hadir saat teman membutuhkan. Kualitas lebih penting dari kuantitas.",
  
  // Pengembangan Diri
  motivasi: "Setiap langkah kecil tetaplah kemajuan. Jangan bandingkan diri dengan orang lain karena setiap orang punya timeline berbeda. Fokus pada pertumbuhan dan versi terbaik diri Anda.",
  target: "Tetapkan target SMART: Specific, Measurable, Achievable, Relevant, Time-bound. Pecah target besar menjadi milestone kecil yang bisa diceklist. Rayakan setiap pencapaian.",
  sukses: "Sukses adalah definisi pribadi. Bukan tentang materi atau validasi orang lain, melainkan pencapaian tujuan yang Anda tetapkan dan kebahagiaan dalam prosesnya.",
  bahagia: "Kebahagiaan bukan tujuan akhir melainkan hasil dari kebiasaan positif dan mindset yang tepat. Bersyukur, relasi bermakna, dan hidup sesuai nilai adalah komponen pentingnya.",
  percaya: "Kepercayaan diri dibangun dari pengalaman. Mulailah dengan tantangan kecil, akui kemajuan Anda, dan jangan biarkan kegagalan masa lalu mendefinisikan kemampuan Anda.",
  introvert: "Introvert bukan kelemahan. Anda punya kekuatan dalam mendengarkan, berpikir mendalam, dan membangun relasi bermakna. Honor kebutuhan waktu sendiri untuk recharge.",
  
  // Spiritual & Filosofis
  agama: "Spiritualitas adalah perjalanan pribadi. Dalami ajaran agama Anda dengan hati terbuka, praktikkan nilai-nilai kebaikan, dan hormati perbedaan keyakinan orang lain.",
  makna: "Makna hidup sering ditemukan dalam pelayanan kepada orang lain, pencapaian pribadi, relasi bermakna, atau kreativitas. Eksplorasi apa yang memberi rasa puas bagi Anda.",
  mati: "Pemikiran tentang kematian bisa membuat kita menghargai hidup lebih dalam. Fokus pada apa yang bisa Anda kontrol sekarang: bagaimana Anda hidup dan berdampak pada orang lain.",
  
  // Lainnya
  cuaca: "Cuaca memang bisa mempengaruhi mood. Saat hujan, ciptakan suasana nyaman di rumah dengan minuman hangat dan aktivitas menyenangkan. Saat panas, tetap terhidrasi dan pakai sunscreen.",
  bencana: "Saat menghadapi bencana, prioritaskan keselamatan diri dan keluarga. Ikuti instruksi pihak berwenang, siapkan emergency kit, dan jaga komunikasi dengan keluarga.",
  politis: "Berpartisipasi dalam politik adalah hak dan tanggung jawab warga negara. Pelajari platform kandidat secara objektif, hindari hoax, dan gunakan hak pilih dengan bijak.",
  transport: "Transportasi umum mengurangi kemacetan dan polusi. Rencanakan perjalanan dengan cek rute dan jadwal terlebih dahulu. Selalu prioritaskan keselamatan di jalan.",
  liburan: "Liburan penting untuk recharge dan mendapat perspektif baru. Rencanakan dengan matang, tapi sisakan ruang untuk spontanitas. Dokumentasikan momen indahnya.",
  kado: "Memberi kado adalah ekspresi perhatian. Pilih sesuatu yang personal dan sesuai minat penerima. Bukan tentang harga, melainkan pemikiran di baliknya.",
  
  // Topik Umum Tambahan
  waktu: "Manajemen waktu adalah keterampilan penting. Gunakan teknik time-blocking, prioritaskan tugas berdasarkan urgensi dan kepentingan, dan hindari multitasking yang justru menurunkan efisiensi.",
  skill: "Pengembangan skill membutuhkan 10.000 jam latihan yang terstruktur. Fokus pada deliberate practice: berlatih di zona nyaman Anda, dapatkan feedback, dan perbaiki kelemahan secara spesifik.",
  komunikasi: "Komunikasi efektif melibatkan mendengarkan aktif, berbicara dengan jelas dan singkat, dan memperhatikan bahasa tubuh. Empati adalah fondasi komunikasi yang bermakna.",
  networking: "Membangun networking profesional dimulai dari memberi nilai lebih dulu. Hadir di event industri, gunakan LinkedIn dengan bijak, dan jaga relasi dengan follow-up yang tulus.",
  presentasi: "Presentasi yang baik dimulai dari persiapan matang. Kenali audiens Anda, struktur konten dengan jelas, gunakan visual minimalis, dan latih delivery hingga percaya diri.",
  memasak: "Memasak adalah keterampilan hidup yang berharga. Mulai dengan resep sederhana, investasi pada peralatan dasar berkualitas, dan jangan takut eksperimen dengan bumbu.",
  kopi: "Kopi yang nikmat membutuhkan perhatian pada biji berkualitas, grind size yang tepat, suhu air 90-96°C, dan ratio 1:15. Eksplorasi metode brewing manual untuk pengalaman berbeda.",
  membaca: "Kebiasaan membaca membuka wawasan dan meningkatkan fokus. Tetapkan target realistis, pilih buku sesuai minat, dan gunakan teknik skimming untuk buku non-fiksi.",
  menulis: "Menulis adalah keterampilan yang diasah dengan latihan rutin. Tulis setiap hari meski sedikit, fokus pada clarity bukan perfection, dan baca karya penulis hebat sebagai inspirasi.",
  musik: "Musik memiliki efek terapeutik yang terbukti secara ilmiah. Eksplor berbagai genre, coba belajar alat musik, atau gunakan playlist untuk berbagai aktivitas dan mood.",
  film: "Film adalah medium storytelling yang powerful. Selain hiburan, analisis struktur narasi dan teknik sinematik bisa mengasah apresiasi dan pemahaman visual.",
  fotografi: "Fotografi memadukan teknis dan artistry. Kuasai exposure triangle, komposisi rule of thirds, dan cahaya alami. Latih mata untuk melihat moment yang menarik.",
  traveling: "Traveling mengembangkan empati dan pemahaman budaya. Riset destinasi, respek tradisi lokal, coba kuliner autentik, dan biarkan spontanitas mengarahkan petualangan.",
  hewan: "Memelihara hewan mengajarkan tanggung jawab dan empati. Pahami kebutuhan spesies, siapkan komitmen jangka panjang, dan pertimbangkan adopsi dari shelter.",
  tanaman: "Berkebun mengurangi stres dan menghasilkan oksigen. Pilih tanaman sesuai kondisi cahaya rumah, atur jadwal penyiraman, dan nikmati proses pertumbuhannya.",
  minimalis: "Gaya hidup minimalis bukan tentang membuang segalanya, melainkan menyimpan hanya yang memberi nilai. Mulai dari declutter satu area, tanyakan apakah barang itu dibutuhkan atau disukai.",
  lingkungan: "Aksi kecil berdampak besar bagi lingkungan. Kurangi plastik sekali pakai, pilah sampah, pilih transportasi ramah lingkungan, dan dukung brand dengan praktik berkelanjutan.",
  volunteer: "Volunteer memberi makna dan koneksi komunitas. Pilih organisasi yang sejalan dengan nilai Anda, mulai dengan komitmen kecil, dan lihat dampak positif yang terwujud.",
  hobby: "Hobi penting untuk keseimbangan hidup dan kreativitas. Invest waktu pada aktivitas yang membuat Anda flow, tanpa tekanan untuk sempurna atau menghasilkan.",
  keamanan: "Keamanan digital mulai dari password kuat yang unik tiap akun, aktifkan two-factor authentication, hati-hati phishing, dan update software secara rutin.",
  marah: "Saya mengerti Anda merasa marah. Emosi ini adalah respons alami. Cobalah tarik napas dalam-dalam, hitung sampai 10, dan beri diri Anda waktu sejenak sebelum bereaksi.",
};

function findResponse(context, responses) {
  const lowerContext = context.toLowerCase();
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerContext.includes(keyword)) {
      return response;
    }
  }
  return null;
}

function generateMockCaption({ context }) {
  const cleanedContext = typeof context === "string" ? context.trim() : "";
  
  if (!cleanedContext) {
    return "Silakan ajukan pertanyaan atau ceritakan apa yang Anda butuhkan. Saya siap membantu dengan informasi yang saya miliki.";
  }

  // Cari response berdasarkan keyword
  const matchedResponse = findResponse(cleanedContext, ID_RESPONSES);
  
  if (matchedResponse) {
    return matchedResponse;
  }

  // Template response yang mengakui topik user untuk pertanyaan tidak terduga
  const topicWords = cleanedContext.split(/\s+/).slice(0, 3).join(" ");
  
  // Respons generik tapi kontekstual yang mengakui input user
  const genericResponses = [
    `Terima kasih telah berbagi tentang "${topicWords}". Meski saat ini layanan AI penuh, saya mengerti hal ini penting bagi Anda. Coba telusuri sumber terpercaya atau diskusikan dengan ahli di bidang tersebut.`,
    `Saya memahami Anda bertanya tentang "${topicWords}". Ini adalah topik yang menarik. Saat layanan AI kembali normal, saya bisa memberikan informasi lebih detail. Untuk saat ini, silakan cari referensi dari buku atau artikel terpercaya.`,
    `Anda menanyakan hal yang penting tentang "${topicWords}". Setiap pertanyaan layak mendapat jawaban yang baik. Mohon maaf saat ini sistem dalam mode terbatas. Coba ulangi pertanyaan nanti atau eksplorasi berbagai perspektif tentang topik ini.`,
    `Pertanyaan Anda tentang "${topicWords}" menunjukkan rasa ingin tahu yang bagus. Pengetahuan memang terus berkembang. Saat ini layanan sedang tidak tersedia penuh, tapi jangan berhenti mencari tahu dari sumber lain yang kredibel.`,
  ];
  
  // Pilih respons generik secara random
  const randomIndex = Math.floor(Math.random() * genericResponses.length);
  return genericResponses[randomIndex];
}

module.exports = {
  generateMockCaption,
};

