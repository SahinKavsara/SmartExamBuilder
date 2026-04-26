/**
 * SmartExamBuilder – Exam API Routes
 *
 * Sınav akışı için REST API endpointleri:
 *   GET  /api/outcomes          → Kazanım listesi
 *   POST /api/generate-question → Soru üretimi (Writer + Critic döngüsü)
 *   POST /api/evaluate-answer   → Cevap değerlendirme
 */

const express = require("express");
const router = express.Router();

const { OUTCOMES, DIFFICULTY_OPTIONS } = require("../data/outcomes");
const { generateQuestion } = require("../services/writerAgent");
const { evaluateQuestion } = require("../services/criticAgent");
const { evaluateStudentAnswer } = require("../services/evaluatorAgent");

/**
 * GET /api/outcomes
 * Kazanım listesini kategorilere göre gruplandırılmış döndürür.
 */
router.get("/outcomes", (req, res) => {
  // Kategorilere göre grupla
  const grouped = {};
  for (const outcome of OUTCOMES) {
    if (!grouped[outcome.category]) {
      grouped[outcome.category] = {
        category: outcome.category,
        icon: outcome.icon,
        outcomes: [],
      };
    }
    grouped[outcome.category].outcomes.push({
      id: outcome.id,
      text: outcome.text,
    });
  }

  res.json({
    categories: Object.values(grouped),
    difficulties: DIFFICULTY_OPTIONS,
  });
});

/**
 * POST /api/generate-question
 * Writer → Critic döngüsünü çalıştırarak soru üretir.
 *
 * Body: { outcome_id: number, difficulty: string }
 */
router.post("/generate-question", async (req, res) => {
  try {
    const { outcome_id, difficulty = "orta" } = req.body;

    // Validasyon
    if (!outcome_id || outcome_id < 1 || outcome_id > OUTCOMES.length) {
      return res.status(400).json({
        error: `Geçersiz kazanım numarası. 1-${OUTCOMES.length} arasında olmalı.`,
      });
    }

    const validDifficulties = ["kolay", "orta", "zor"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: "Geçersiz zorluk seviyesi. kolay/orta/zor olmalı.",
      });
    }

    const outcome = OUTCOMES.find((o) => o.id === outcome_id);
    const maxAttempts = 3;
    let question = null;
    let criticFeedback = null;
    const attempts = [];

    // Writer → Critic döngüsü
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`  ✍️  Writer Agent çalışıyor... (Deneme ${attempt}/${maxAttempts})`);
      question = await generateQuestion(outcome.text, outcome_id, difficulty);

      console.log("  🔍 Critic Agent kalite kontrolü yapıyor...");
      criticFeedback = await evaluateQuestion(question);

      const status = criticFeedback.is_approved ? "✅ ONAYLANDI" : "❌ REDDEDİLDİ";
      console.log(`     Kalite: ${criticFeedback.quality_score}/10 ${status}`);

      attempts.push({
        attempt,
        quality_score: criticFeedback.quality_score,
        is_approved: criticFeedback.is_approved,
        issues: criticFeedback.issues,
      });

      if (criticFeedback.is_approved) break;

      if (attempt < maxAttempts) {
        console.log("     → Writer yeniden çalışıyor...");
      }
    }

    if (!question) {
      return res.status(500).json({ error: "Soru üretilemedi." });
    }

    res.json({
      question,
      critic_feedback: criticFeedback,
      attempts,
    });
  } catch (error) {
    console.error("Soru üretim hatası:", error.message);

    // LM Studio bağlantı hatası tespiti
    if (error.message.includes("ECONNREFUSED") || error.message.includes("fetch")) {
      return res.status(503).json({
        error: "LM Studio bağlantısı kurulamadı. Lütfen LM Studio'nun açık ve bir modelin yüklü olduğundan emin olun.",
      });
    }

    res.status(500).json({
      error: "Soru üretilirken bir hata oluştu: " + error.message,
    });
  }
});

/**
 * POST /api/evaluate-answer
 * Öğrencinin cevabını değerlendirir.
 *
 * Body: { question: object, student_answer: string }
 */
router.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, student_answer } = req.body;

    if (!question || !student_answer || !student_answer.trim()) {
      return res.status(400).json({
        error: "Soru ve öğrenci cevabı gereklidir.",
      });
    }

    console.log("  🤖 Evaluator Agent cevabı değerlendiriyor...");
    const result = await evaluateStudentAnswer(question, student_answer);

    res.json(result);
  } catch (error) {
    console.error("Değerlendirme hatası:", error.message);

    if (error.message.includes("ECONNREFUSED") || error.message.includes("fetch")) {
      return res.status(503).json({
        error: "LM Studio bağlantısı kurulamadı.",
      });
    }

    res.status(500).json({
      error: "Değerlendirme sırasında bir hata oluştu: " + error.message,
    });
  }
});

module.exports = router;
