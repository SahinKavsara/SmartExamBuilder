"""
SmartExamBuilder – Ana Orkestratör (CLI)

Kullanım:
    python main.py

Akış:
    1. Kullancı kazanım seçer
    2. Kullancı zorluk seviyesi seçer
    3. Writer Agent → soru + rubrik üretir
    4. Critic Agent → kalite kontrol (gerekirse Writer yeniden çalışır)
    5. Kullanıcı soruyu görür ve cevabını yazar
    6. Evaluator Agent → cevabı değerlendirir, puan + geri bildirim verir
"""

import os
import sys
from dotenv import load_dotenv

# .env yükle
load_dotenv()

# Proje kökünü Python path'e ekle (modüll importları için)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.agents.writer_agent import generate_question
from src.agents.critic_agent import evaluate_question
from src.agents.evaluator_agent import evaluate_student_answer

# ───────────────────────────── Sabitler ──────────────────────────────

OUTCOMES = [
    # ── Matematik ──
    "Günlük hayatta temel dört işlem (toplama, çıkarma, çarpma, bölme) becerilerini kullanır.",
    "Basit geometrik şekilleri (kare, dikdörtgen, üçgen, daire) tanır ve temel özelliklerini ifade eder.",
    "Günlük hayatta karşılaşılan kesir kavramlarını (yarım, çeyrek, tam) tanımlar ve kullanır.",
    "Saat okumayı (tam, buçuk, çeyrek geçe) bilir ve zaman ölçülerini (gün, hafta, ay, yıl) hesaplar.",
    "Standart uzunluk ölçülerini (metre, santimetre) tanır ve günlük nesnelerin boyunu tahmin eder.",

    # ── Tarih ──
    "Türkiye Cumhuriyeti'nin kuruluş sürecini ve Atatürk'ün önderliğini temel düzeyde bilir.",
    "İlk insanların yerleşik hayata geçmesi ve tarımın başlaması gibi en temel tarihi olayları açıklar.",
    "Türklerin Anadolu'ya girişini temsil eden Malazgirt Meydan Muharebesi'nin (1071) önemini belirtir.",
    "İnsanlık tarihini değiştiren önemli icatları (yazı, tekerlek, pusula) kimlerin bulduğunu söyler.",
    "İstanbul'un Fethi'nin dünya tarihi açısından (Orta Çağ'ın bitişi) genel önemini açıklar.",

    # ── Türkçe ──
    "Büyük harflerin kullanıldığı temel yerleri (özel isimler, cümle başı) hatasız kullanır.",
    "Okuduğu kısa ve sade bir metnin ana fikrini tek cümleyle ifade eder.",
    "Günlük hayatta sık kullanılan zıt anlamlı (siyah-beyaz) ve eş anlamlı (yıl-sene) kelimeleri ayırt eder.",
    "Nokta (.) ve soru işareti (?) gibi en temel noktalama işaretlerinin işlevlerini doğru kullanır.",
    "Bir olayı oluş sırasına göre mantıklı bir şekilde sıralar.",

    # ── Coğrafya ──
    "Ana yönleri (Kuzey, Güney, Doğu, Batı) bilir ve çevre yönlendirmelerinde kullanır.",
    "Dünyadaki kıtaların ve okyanusların isimlerini temel düzeyde söyler.",
    "Dünyanın şeklinin küreye benzediğini ve gece/gündüzün nasıl oluştuğunu kavrar.",
    "Mevsimlerin genel özelliklerini, aylara göre sıralanışını ve doğaya etkisini açıklar.",
    "Çevresinde gördüğü doğal (dağ, orman) ve yapay (bina, köprü) unsurları birbirinden ayırt eder.",

    # ── Genel Kültür ──
    "Dünyanın ve Türkiye'nin en bilinen coğrafi yapılarını (en yüksek dağ, en uzun nehir vs.) bilir.",
    "Türkiye'nin genel geçer sembollerini (bayrak, başkent, milli marş) açıklar.",
    "Güneş sistemindeki gezegenleri temel düzeyde tanır ve Güneş'in bir yıldız olduğunu bilir.",
    "Sağlıklı bir yaşam için temelde gereken besinleri ve kişisel temizlik kurallarını açıklar.",
    "Teknolojinin doğru/güvenli kullanımı ile internette kişisel bilgi paylaşmamanın önemini belirtir.",
]

DIFFICULTY_OPTIONS = {"1": "kolay", "2": "orta", "3": "zor"}
DIFFICULTY_LABELS  = {"kolay": "⚡ Kolay", "orta": "⚖️  Orta", "zor": "🔥 Zor"}


# ─────────────────────────── Yardımcı Fonksiyonlar ───────────────────────────

def line(char: str = "═", width: int = 62) -> str:
    return char * width


def header():
    print()
    print(line())
    print("  🎓  SMART EXAM BUILDER  –  LLM + Multi-Agent + RAG")
    print("       Matematik & Tarih & Türkçe & Coğrafya & Kültür")
    print("       Writer ▸ Critic ▸ Evaluator")
    print(line())


def select_outcome() -> tuple[int, str]:
    n = len(OUTCOMES)
    print("\n📚  Hangi kazanım için soru üretilsin?\n")
    print("  ── Matematik ──")
    for i, o in enumerate(OUTCOMES, 1):
        if i == 6:
            print("  ── Tarih ──")
        elif i == 11:
            print("  ── Türkçe ──")
        elif i == 16:
            print("  ── Coğrafya ──")
        elif i == 21:
            print("  ── Genel Kültür ──")
        # Uzun metni kır
        words = o.split()
        line1, line2 = "", ""
        for w in words:
            if len(line1) + len(w) + 1 <= 70:
                line1 += (" " if line1 else "") + w
            else:
                line2 += (" " if line2 else "") + w
        print(f"  {i}. {line1}")
        if line2:
            print(f"     {line2}")
        print()

    valid = [str(i) for i in range(1, n + 1)]
    while True:
        # Kullanıcının seçmek istediği kazanım numarasını (1-14 arası) girdiği kısım
        ch = input(f"  Seçim (1-{n}): ").strip()
        if ch in valid:
            idx = int(ch) - 1
            return idx, OUTCOMES[idx]
        print(f"  ❌ 1-{n} arasında bir sayı girin.\n")


def select_difficulty() -> str:
    print("\n📊  Zorluk seviyesi:\n")
    print("  1. ⚡ Kolay")
    print("  2. ⚖️  Orta")
    print("  3. 🔥 Zor\n")
    while True:
        # Kullanıcının sorunun zorluk derecesini (1, 2 veya 3) belirlediği kısım
        ch = input("  Seçim (1-3): ").strip()
        if ch in DIFFICULTY_OPTIONS:
            return DIFFICULTY_OPTIONS[ch]
        print("  ❌ 1-3 arasında bir sayı girin.\n")


def writer_critic_loop(
    outcome_idx: int,
    outcome: str,
    difficulty: str,
    max_attempts: int = 3
):
    """Writer → Critic döngüsü. Onaylanana kadar en fazla max_attempts kez tekrar."""
    question = None
    for attempt in range(1, max_attempts + 1):
        try:
            print(f"\n  ✍️  Writer Agent çalışıyor... (Deneme {attempt}/{max_attempts})")
            question = generate_question(outcome, outcome_idx + 1, difficulty)

            print("  🔍 Critic Agent kalite kontrolü yapıyor...")
            feedback = evaluate_question(question)

            stars = "★" * feedback.quality_score + "☆" * (10 - feedback.quality_score)
            status = "✅ ONAYLANDI" if feedback.is_approved else "❌ REDDEDİLDİ"
            print(f"     Kalite: {stars} ({feedback.quality_score}/10)  {status}")

            if feedback.is_approved:
                break

            if feedback.issues:
                print("     Sorunlar: " + " | ".join(feedback.issues))
            if attempt < max_attempts:
                print("     → Writer yeniden çalışıyor...\n")
        except Exception as e:
            print(f"\n  ⚠️  Hata oluştu (Deneme {attempt}/{max_attempts}): {e}")
            if attempt < max_attempts:
                print("     → Tekrar deneniyor...\n")
            question = None

    return question


def show_question(question):
    print()
    print(line("─"))
    print("  📝  ÜRETİLEN SORU")
    print(line("─"))
    print()
    print(f"  {question.question_text}")
    print()
    print(f"  Zorluk   : {DIFFICULTY_LABELS[question.difficulty.value]}")
    print(f"  Kazanım  : #{question.learning_outcome_id}")
    print(f"  Anahtar  : {', '.join(question.expected_keywords)}")
    print()
    print(line("─"))


def get_student_answer() -> str:
    print("\n  📝  Cevabınızı yazın.")
    print("  (Bitirmek için boş satırda ENTER'a basın)\n")
    lines = []
    while True:
        # Öğrencinin açık uçlu soruya verdiği cevabı satır satır girdiği döngü
        row = input("  > ")
        if row == "" and lines:
            break
        lines.append(row)
    return "\n".join(lines)


def show_evaluation(result):
    print()
    print(line())
    print("  📊  DEĞERLENDİRME SONUCU")
    print(line())

    # Puan görseli
    score = result.score
    bar_full = int(score / 5)
    bar_empty = 20 - bar_full
    bar = "█" * bar_full + "░" * bar_empty
    emoji = "🏆" if score >= 90 else ("🥈" if score >= 70 else ("🥉" if score >= 50 else "❌"))
    print(f"\n  {emoji}  {result.grade_level}  –  {score}/100")
    print(f"  [{bar}] {score}%\n")

    # Geri bildirim
    print("  💬 Geri Bildirim:")
    for sentence in result.feedback.split(". "):
        if sentence.strip():
            print(f"     {sentence.strip()}{'.' if not sentence.endswith('.') else ''}")
    print()

    # Güçlü yönler
    if result.strong_points:
        print("  ✅ Güçlü Yönler:")
        for pt in result.strong_points:
            print(f"     • {pt}")
        print()

    # Geliştirilecek alanlar
    if result.improvement_areas:
        print("  📈 Geliştirilmesi Gereken Alanlar:")
        for area in result.improvement_areas:
            print(f"     • {area}")
        print()

    print(line())


# ──────────────────────────────── Ana Akış ───────────────────────────────────

def main():
    header()

    # API anahtarı kontrolüne gerek yok (LM Studio)
    print("\n  ✅ LM Studio Local Server (http://localhost:1234/v1) bağlantısı hazır.")
    print("  👉 Lütfen LM Studio üzerinden bir LLM modelinin yüklü ve Local Server'ın AÇIK (Start) olduğundan emin olun!\n")

    while True:
        # 1. Kazanım seç
        outcome_idx, outcome = select_outcome()

        # 2. Zorluk seç
        difficulty = select_difficulty()

        # 3. Writer → Critic döngüsü
        question = writer_critic_loop(outcome_idx, outcome, difficulty)
        if question is None:
            print("\n  ❌ Soru üretilemedi. Tekrar deneyin.")
            continue

        # 4. Soruyu göster
        show_question(question)

        # 5. Öğrenci cevabı
        student_answer = get_student_answer()
        if not student_answer.strip():
            print("\n  ⚠️  Boş cevap girildi, değerlendirme atlandı.")
        else:
            print("\n  🤖 Evaluator Agent cevabınızı değerlendiriyor...")
            result = evaluate_student_answer(question, student_answer)
            show_evaluation(result)

        # 6. Tekrar?
        # Uygulamanın en sonunda, kullanıcının yeni bir soruyla devam edip etmeyeceğini seçtiği alan
        print("\n  Yeni soru üretmek ister misiniz? (e/h): ", end="")
        if input().strip().lower() != "e":
            print("\n  👋 İyi çalışmalar!\n")
            break


if __name__ == "__main__":
    main()
