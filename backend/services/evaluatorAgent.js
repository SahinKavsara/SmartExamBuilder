/**
 * SmartExamBuilder – Evaluator Agent
 *
 * Python evaluator_agent.py mantığının JavaScript karşılığı.
 * Öğrencinin cevabını rubriğe göre puanlar ve geri bildirim üretir.
 */

const { callLLM, extractJSON } = require("./llmService");

const EVALUATOR_SYSTEM =
  "Sen bir eğitim değerlendirme uzmanısın. Öğrencinin verdiği cevabı, " +
  "sorunun puanlama rubriğine göre adil ve detaylı biçimde değerlendiriyorsun.\n\n" +
  "Değerlendirirken:\n" +
  "- Rubriği tam olarak uygula\n" +
  "- Beklenen anahtar kelimelerin cevaba yansımasına bak\n" +
  "- Öğrencinin anladığı ve anlamadığı yönleri analiz et\n" +
  "- Yapıcı ve motive edici bir dil kullan\n\n" +
  "SADECE aşağıdaki JSON formatında yanıt ver:\n\n" +
  "{\n" +
  '  "score": 75,\n' +
  '  "grade_level": "İyi",\n' +
  '  "feedback": "Detaylı geri bildirim metni (Türkçe)",\n' +
  '  "strong_points": ["güçlü yön 1", "güçlü yön 2"],\n' +
  '  "improvement_areas": ["geliştirilecek alan 1"]\n' +
  "}\n\n" +
  "Puan-Kademe eşleşmesi: 90-100→Mükemmel | 70-89→İyi | 50-69→Yeterli | 0-49→Yetersiz";

/**
 * Öğrencinin cevabını rubriğe göre puanlar.
 *
 * @param {object} question      - Soru objesi (rubrik dahil)
 * @param {string} studentAnswer - Öğrencinin cevap metni
 * @returns {Promise<object>}    - Puan, kademe, geri bildirim, güçlü/zayıf yönler
 */
async function evaluateStudentAnswer(question, studentAnswer) {
  const userPrompt =
    `SORU: ${question.question_text}\n\n` +
    `BEKLENEN ANAHTAR KELİMELER: ${question.expected_keywords.join(", ")}\n\n` +
    "PUANLAMA RUBRİĞİ:\n" +
    `  • Mükemmel (90-100): ${question.rubric.excellent}\n` +
    `  • İyi      (70-89):  ${question.rubric.good}\n` +
    `  • Yeterli  (50-69):  ${question.rubric.satisfactory}\n` +
    `  • Yetersiz  (0-49):  ${question.rubric.insufficient}\n\n` +
    `ÖĞRENCİNİN CEVABI:\n${studentAnswer}\n\n` +
    "Bu cevabı değerlendir ve JSON formatında döndür.";

  const response = await callLLM(EVALUATOR_SYSTEM, userPrompt, 0.2);
  const data = extractJSON(response);

  const score = Math.min(100, Math.max(0, parseInt(data.score) || 0));

  let gradeLevel;
  if (score >= 90) gradeLevel = "Mükemmel";
  else if (score >= 70) gradeLevel = "İyi";
  else if (score >= 50) gradeLevel = "Yeterli";
  else gradeLevel = "Yetersiz";

  return {
    question,
    student_answer: studentAnswer,
    score,
    grade_level: gradeLevel,
    feedback: data.feedback || "",
    strong_points: data.strong_points || [],
    improvement_areas: data.improvement_areas || [],
  };
}

module.exports = { evaluateStudentAnswer };
