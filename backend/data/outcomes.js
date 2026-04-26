/**
 * SmartExamBuilder – Kazanım Verileri
 *
 * Her kazanım bir kategori (ders) bilgisi ile birlikte tutulur.
 */

const OUTCOMES = [
  // ── Matematik ──
  {
    id: 1,
    category: "Matematik",
    icon: "📐",
    text: "Günlük hayatta temel dört işlem (toplama, çıkarma, çarpma, bölme) becerilerini kullanır.",
  },
  {
    id: 2,
    category: "Matematik",
    icon: "📐",
    text: "Basit geometrik şekilleri (kare, dikdörtgen, üçgen, daire) tanır ve temel özelliklerini ifade eder.",
  },
  {
    id: 3,
    category: "Matematik",
    icon: "📐",
    text: "Günlük hayatta karşılaşılan kesir kavramlarını (yarım, çeyrek, tam) tanımlar ve kullanır.",
  },
  {
    id: 4,
    category: "Matematik",
    icon: "📐",
    text: "Saat okumayı (tam, buçuk, çeyrek geçe) bilir ve zaman ölçülerini (gün, hafta, ay, yıl) hesaplar.",
  },
  {
    id: 5,
    category: "Matematik",
    icon: "📐",
    text: "Standart uzunluk ölçülerini (metre, santimetre) tanır ve günlük nesnelerin boyunu tahmin eder.",
  },

  // ── Tarih ──
  {
    id: 6,
    category: "Tarih",
    icon: "📜",
    text: "Türkiye Cumhuriyeti'nin kuruluş sürecini ve Atatürk'ün önderliğini temel düzeyde bilir.",
  },
  {
    id: 7,
    category: "Tarih",
    icon: "📜",
    text: "İlk insanların yerleşik hayata geçmesi ve tarımın başlaması gibi en temel tarihi olayları açıklar.",
  },
  {
    id: 8,
    category: "Tarih",
    icon: "📜",
    text: "Türklerin Anadolu'ya girişini temsil eden Malazgirt Meydan Muharebesi'nin (1071) önemini belirtir.",
  },
  {
    id: 9,
    category: "Tarih",
    icon: "📜",
    text: "İnsanlık tarihini değiştiren önemli icatları (yazı, tekerlek, pusula) kimlerin bulduğunu söyler.",
  },
  {
    id: 10,
    category: "Tarih",
    icon: "📜",
    text: "İstanbul'un Fethi'nin dünya tarihi açısından (Orta Çağ'ın bitişi) genel önemini açıklar.",
  },

  // ── Türkçe ──
  {
    id: 11,
    category: "Türkçe",
    icon: "🖋️",
    text: "Büyük harflerin kullanıldığı temel yerleri (özel isimler, cümle başı) hatasız kullanır.",
  },
  {
    id: 12,
    category: "Türkçe",
    icon: "🖋️",
    text: "Okuduğu kısa ve sade bir metnin ana fikrini tek cümleyle ifade eder.",
  },
  {
    id: 13,
    category: "Türkçe",
    icon: "🖋️",
    text: "Günlük hayatta sık kullanılan zıt anlamlı (siyah-beyaz) ve eş anlamlı (yıl-sene) kelimeleri ayırt eder.",
  },
  {
    id: 14,
    category: "Türkçe",
    icon: "🖋️",
    text: "Nokta (.) ve soru işareti (?) gibi en temel noktalama işaretlerinin işlevlerini doğru kullanır.",
  },
  {
    id: 15,
    category: "Türkçe",
    icon: "🖋️",
    text: "Bir olayı oluş sırasına göre mantıklı bir şekilde sıralar.",
  },

  // ── Coğrafya ──
  {
    id: 16,
    category: "Coğrafya",
    icon: "🌍",
    text: "Ana yönleri (Kuzey, Güney, Doğu, Batı) bilir ve çevre yönlendirmelerinde kullanır.",
  },
  {
    id: 17,
    category: "Coğrafya",
    icon: "🌍",
    text: "Dünyadaki kıtaların ve okyanusların isimlerini temel düzeyde söyler.",
  },
  {
    id: 18,
    category: "Coğrafya",
    icon: "🌍",
    text: "Dünyanın şeklinin küreye benzediğini ve gece/gündüzün nasıl oluştuğunu kavrar.",
  },
  {
    id: 19,
    category: "Coğrafya",
    icon: "🌍",
    text: "Mevsimlerin genel özelliklerini, aylara göre sıralanışını ve doğaya etkisini açıklar.",
  },
  {
    id: 20,
    category: "Coğrafya",
    icon: "🌍",
    text: "Çevresinde gördüğü doğal (dağ, orman) ve yapay (bina, köprü) unsurları birbirinden ayırt eder.",
  },

  // ── Genel Kültür ──
  {
    id: 21,
    category: "Genel Kültür",
    icon: "💡",
    text: "Dünyanın ve Türkiye'nin en bilinen coğrafi yapılarını (en yüksek dağ, en uzun nehir vs.) bilir.",
  },
  {
    id: 22,
    category: "Genel Kültür",
    icon: "💡",
    text: "Türkiye'nin genel geçer sembollerini (bayrak, başkent, milli marş) açıklar.",
  },
  {
    id: 23,
    category: "Genel Kültür",
    icon: "💡",
    text: "Güneş sistemindeki gezegenleri temel düzeyde tanır ve Güneş'in bir yıldız olduğunu bilir.",
  },
  {
    id: 24,
    category: "Genel Kültür",
    icon: "💡",
    text: "Sağlıklı bir yaşam için temelde gereken besinleri ve kişisel temizlik kurallarını açıklar.",
  },
  {
    id: 25,
    category: "Genel Kültür",
    icon: "💡",
    text: "Teknolojinin doğru/güvenli kullanımı ile internette kişisel bilgi paylaşmamanın önemini belirtir.",
  },
];

const DIFFICULTY_OPTIONS = {
  kolay: { label: "Kolay", icon: "⚡" },
  orta: { label: "Orta", icon: "⚖️" },
  zor: { label: "Zor", icon: "🔥" },
};

module.exports = { OUTCOMES, DIFFICULTY_OPTIONS };
