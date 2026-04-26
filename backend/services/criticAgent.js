/**
 * SmartExamBuilder – Critic Agent
 *
 * Python critic_agent.py mantığının JavaScript karşılığı.
 * Writer Agent'ın ürettiği soruyu kalite açısından değerlendirir.
 */

const { callLLM, extractJSON } = require("./llmService");

const CRITIC_SYSTEM =
  "Sen sınav kalitesi konusunda uzman bir eğitim değerlendirmecisisin.\n" +
  "Sana verilen sınav sorusunu ve rubriğini aşağıdaki kriterlere göre eleştirel biçimde değerlendir:\n\n" +
  "1. Soru, kazanımı doğrudan ve tam olarak ölçüyor mu?\n" +
  "2. Soru metni açık, anlaşılır ve tek yorumlu mu?\n" +
  "3. Rubrik somut, ölçülebilir kriterler içeriyor mu?\n" +
  "4. Beklenen anahtar kelimeler kazanımla gerçekten ilgili mi?\n" +
  "5. Zorluk seviyesi soruya yansımış mı?\n\n" +
  "SADECE aşağıdaki JSON formatında yanıt ver:\n\n" +
  '{\n' +
  '  "quality_score": 7,\n' +
  '  "is_approved": true,\n' +
  '  "issues": ["sorun varsa yaz", "yoksa boş bırak"],\n' +
  '  "suggestions": ["öneri varsa yaz"]\n' +
  '}\n\n' +
  "Not: quality_score 7 ve üzeriyse is_approved true olmalı.";

/**
 * Verilen soruyu kalite açısından değerlendirir.
 *
 * @param {object} question - Writer Agent'tan gelen soru objesi
 * @returns {Promise<object>} - Kalite puanı, onay durumu, sorunlar ve öneriler
 */
async function evaluateQuestion(question) {
  const userPrompt =
    `SORU METNİ:\n${question.question_text}\n\n` +
    `ZORLUK SEVİYESİ: ${question.difficulty}\n` +
    `KAZANIM NO: #${question.learning_outcome_id}\n` +
    `BEKLENEN ANAHTAR KELİMELER: ${question.expected_keywords.join(", ")}\n\n` +
    "RUBRİK:\n" +
    `  • Mükemmel (90-100): ${question.rubric.excellent}\n` +
    `  • İyi      (70-89):  ${question.rubric.good}\n` +
    `  • Yeterli  (50-69):  ${question.rubric.satisfactory}\n` +
    `  • Yetersiz  (0-49):  ${question.rubric.insufficient}\n\n` +
    "Bu soruyu değerlendir.";

  const response = await callLLM(CRITIC_SYSTEM, userPrompt, 0.3);
  const data = extractJSON(response);

  const qualityScore = Math.min(10, Math.max(1, parseInt(data.quality_score) || 5));
  const isApproved = qualityScore >= 7;

  return {
    quality_score: qualityScore,
    is_approved: isApproved,
    issues: data.issues || [],
    suggestions: data.suggestions || [],
  };
}

module.exports = { evaluateQuestion };
