// Fallback responses when AI quota is exhausted
// Provides context-aware responses based on keywords

// Indonesian keyword responses
const ID_RESPONSES = {
  galau: "Saya mengerti Anda sedang merasa galau. Cobalah lakukan aktivitas yang menyenangkan, berbicara dengan teman, atau luangkan waktu untuk diri sendiri. Ingat, perasaan ini akan berlalu.",
  sedih: "Saya mendengar Anda sedang sedih. Wajar untuk merasa demikian. Cobalah tulis perasaan Anda atau lakukan hal-hal kecil yang biasanya membuat Anda tersenyum.",
  senang: "Senang mendengar Anda merasa senang! Nikmati momen ini dan bagikan kebahagiaan Anda dengan orang-orang terdekat.",
  marah: "Saya mengerti Anda merasa marah. Cobalah tarik napas dalam-dalam dan beri diri Anda waktu sejenak sebelum bereaksi.",
  cemas: "Kecemasan adalah hal yang umum. Cobalah teknik pernapasan: tarik napas 4 detik, tahan 4 detik, hembuskan 4 detik.",
  bosan: "Saat bosan, coba hal baru yang sederhana: jalan-jalan singkat, baca buku, atau coba resep baru.",
  lelah: "Istirahatlah sejenak. Tubuh Anda butuh pemulihan. Tidur yang cukup sangat penting untuk kesehatan mental.",
  stress: "Stres bisa melelahkan. Identifikasi sumber stres dan lakukan langkah kecil untuk menguranginya. Jangan ragu meminta bantuan.",
  cinta: "Cinta adalah perasaan yang indah dan kompleks. Jaga komunikasi yang jujur dan saling menghormati.",
  motivasi: "Setiap langkah kecil tetaplah kemajuan. Jangan bandingkan diri Anda dengan orang lain. Fokus pada pertumbuhan Anda sendiri.",
  kerja: "Untuk produktivitas, coba teknik Pomodoro: kerja 25 menit, istirahat 5 menit. Prioritaskan tugas yang paling penting.",
  belajar: "Belajar adalah proses seumur hidup. Fokus pada pemahaman, bukan hanya menghafal. Istirahat juga penting untuk retensi memori.",
  sehat: "Kesehatan adalah investasi terbaik. Perhatikan pola makan, tidur cukup, dan olahraga teratur.",
  uang: "Kelola keuangan dengan mencatat pengeluaran, membuat anggaran, dan menabung rutin meski sedikit.",
  makan: "Nutrisi yang baik mendukung kesehatan fisik dan mental. Konsumsi makanan bergizi dan cukup air putih.",
  tidur: "Kualitas tidur mempengaruhi mood dan energi. Hindari gadget 1 jam sebelum tidur dan ciptakan rutinitas yang menenangkan.",
  olahraga: "Olahraga 30 menit sehari bisa meningkatkan mood dan energi. Pilih aktivitas yang Anda nikmati.",
  hubungan: "Hubungan yang sehat didasari komunikasi terbuka, saling menghargai, dan memberi ruang untuk masing-masing.",
  keluarga: "Keluarga adalah dukungan penting. Luangkan waktu berkualitas meski sederhana, seperti makan bersama.",
  teman: "Pertemanan yang tulus saling mendukung. Jaga kontak dan hadir saat teman membutuhkan.",
};

// English keyword responses
const EN_RESPONSES = {
  sad: "I hear that you're feeling sad. It's okay to feel this way. Try writing down your feelings or doing small things that usually make you smile.",
  happy: "I'm glad to hear you're feeling happy! Enjoy this moment and share your joy with people close to you.",
  angry: "I understand you're feeling angry. Try taking deep breaths and give yourself a moment before reacting.",
  anxious: "Anxiety is common. Try the breathing technique: inhale 4 seconds, hold 4 seconds, exhale 4 seconds.",
  bored: "When bored, try something simple and new: a short walk, reading a book, or trying a new recipe.",
  tired: "Please take a rest. Your body needs recovery. Adequate sleep is very important for mental health.",
  stress: "Stress can be exhausting. Identify the source and take small steps to reduce it. Don't hesitate to ask for help.",
  love: "Love is a beautiful and complex feeling. Maintain honest communication and mutual respect.",
  motivation: "Every small step is still progress. Don't compare yourself to others. Focus on your own growth.",
  work: "For productivity, try the Pomodoro technique: work 25 minutes, rest 5 minutes. Prioritize the most important tasks.",
  study: "Learning is a lifelong process. Focus on understanding, not just memorizing. Rest is also important for memory retention.",
  health: "Health is the best investment. Pay attention to diet, adequate sleep, and regular exercise.",
  money: "Manage finances by tracking expenses, making a budget, and saving regularly even if it's a small amount.",
  food: "Good nutrition supports physical and mental health. Consume nutritious foods and drink enough water.",
  sleep: "Sleep quality affects mood and energy. Avoid gadgets 1 hour before bed and create a calming routine.",
  exercise: "30 minutes of exercise a day can improve mood and energy. Choose activities you enjoy.",
  relationship: "Healthy relationships are based on open communication, mutual respect, and giving space to each other.",
  family: "Family is important support. Spend quality time together even if simple, like eating together.",
  friends: "True friendships support each other. Keep in contact and be present when friends need you.",
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
    return "Silakan ajukan pertanyaan atau ceritakan apa yang Anda butuhkan.";
  }

  // Simple language detection
  const isEnglish = /^[a-zA-Z0-9\s.,!?;:()"'-]+$/.test(cleanedContext) && 
    cleanedContext.length > 3 &&
    !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]/.test(cleanedContext);

  const responses = isEnglish ? EN_RESPONSES : ID_RESPONSES;
  const matchedResponse = findResponse(cleanedContext, responses);
  
  if (matchedResponse) {
    return matchedResponse;
  }

  // Generic helpful responses when no keyword matches
  const genericID = "Terima kasih telah berbagi. Saya memahami apa yang Anda sampaikan. Jika Anda membutuhkan bantuan lebih lanjut, jangan ragu untuk bertanya.";
  const genericEN = "Thank you for sharing. I understand what you've conveyed. If you need further assistance, please don't hesitate to ask.";
  
  return isEnglish ? genericEN : genericID;
}

module.exports = {
  generateMockCaption,
};

