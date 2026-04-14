const BANK = {
  lonely: [
    "Hari ini sunyi, tapi tidak kosong.",
    "Ada jeda yang pelan, dan aku akhirnya mendengar diri sendiri.",
    "Tidak ramai, hanya cukup untuk bernapas.",
  ],
  night: [
    "Malam selalu tahu cara menenangkan yang berisik di kepala.",
    "Lampu kota redup, pikiranku ikut pelan.",
    "Di gelap yang tenang, semuanya terasa lebih jujur.",
  ],
  nostalgic: [
    "Beberapa kenangan datang tanpa mengetuk.",
    "Aku tidak kembali ke masa lalu, hanya menyapanya sebentar.",
    "Yang jauh tetap hangat, meski tidak lagi sama.",
  ],
  lost: [
    "Ada yang hilang, tapi pelan-pelan aku belajar tetap utuh.",
    "Rasa ini belum selesai, tapi aku tidak lagi lari.",
    "Yang pergi tetap tinggal, dalam cara yang berbeda.",
  ],
  calm: [
    "Hari ini biasa saja, dan itu cukup menenangkan.",
    "Tidak semua hal harus dikejar sekarang.",
    "Pelan bukan berarti tertinggal.",
  ],
};

function pickTwo(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 2);
}

function generateMockCaption({ mood, text }) {
  const base = BANK[mood] || BANK.tenang;
  const picked = pickTwo(base);
  const cleanedText = typeof text === "string" ? text.trim() : "";

  if (!cleanedText) {
    return picked.join(" ");
  }

  const safeText = cleanedText.replace(/[.?!]+$/g, "");
  return `${picked[0]} ${safeText}. ${picked[1]}`;
}

module.exports = {
  generateMockCaption,
};

