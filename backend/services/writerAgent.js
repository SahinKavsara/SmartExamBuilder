/**
 * SmartExamBuilder – Writer Agent
 *
 * Python writer_agent.py mantığının JavaScript karşılığı.
 * Ders kazanımı ve RAG bağlamını kullanarak açık uçlu sınav sorusu üretir.
 */

const { callLLM, extractJSON } = require("./llmService");
const { retrieveContext } = require("./ragService");

/**
 * Writer Agent için sistem promptu oluşturur.
 */
function buildSystemPrompt(outcomeId, difficulty) {
  return (
    "Sen deneyimli bir eğitim uzmanısın. Verilen ders kazanımına ve bağlamına göre " +
    "yüksek kaliteli, Türkçe açık uçlu bir sınav sorusu ve detaylı puanlama rubriği üretiyorsun.\n\n" +
    "DİKKAT: JSON formatındaki örnek değerleri AYNEN YAZMA! Lütfen üretilmiş kendi gerçek sorunu ve rubriğini yaz.\n" +
    "SADECE aşağıdaki JSON yapısında yanıt ver, başka hiçbir şey yazma:\n\n" +
    "{\n" +
    '  "question_text": "<ÜRETTİĞİNİZ_GERÇEK_SORU_METNİ>",\n' +
    '  "question_type": "acik_uclu",\n' +
    `  "learning_outcome_id": ${outcomeId},\n` +
    `  "difficulty": "${difficulty}",\n` +
    '  "expected_keywords": ["<anahtar_1>", "<anahtar_2>"],\n' +
    '  "rubric": {\n' +
    '    "excellent": "<90-100 puanlık çok iyi cevabın içeriği>",\n' +
    '    "good": "<70-89 puanlık iyi cevabın içeriği>",\n' +
    '    "satisfactory": "<50-69 puanlık yeterli cevabın içeriği>",\n' +
    '    "insufficient": "<0-49 puanlık yetersiz cevabın içeriği>",\n' +
    '    "max_points": 100\n' +
    "  }\n" +
    "}\n\n" +
    "Önemli kurallar:\n" +
    "- Soru doğrudan kazanımı ölçmeli.\n" +
    "- Rubrik somut ve ölçülebilir kriterler içermeli.\n" +
    "- Beklenen anahtar kelimeler teknik ve anlamlı olmalı.\n" +
    "- Geri dönüş sadece geçerli bir JSON objesi olmalı."
  );
}

/**
 * Verilen kazanım için soru üretir.
 *
 * @param {string} learningOutcome - Kazanım metni
 * @param {number} outcomeId       - Kazanım numarası (1-14)
 * @param {string} difficulty      - Zorluk seviyesi ('kolay', 'orta', 'zor')
 * @returns {Promise<object>}      - Üretilen soru objesi
 */
async function generateQuestion(learningOutcome, outcomeId, difficulty = "orta") {
  // RAG bağlamını al
  const context = retrieveContext(outcomeId);

  const systemPrompt = buildSystemPrompt(outcomeId, difficulty);
  const userPrompt =
    `Ders Bağlamı (RAG'dan çekildi):\n${context}\n\n` +
    `Kazanım: ${learningOutcome}\n` +
    `Zorluk: ${difficulty}\n\n` +
    "Bu kazanıma uygun bir soru ve rubrik üret.";

  const response = await callLLM(systemPrompt, userPrompt, 0.7);
  const data = extractJSON(response);

  // Geçerli enum değerlerini kontrol et
  const validTypes = ["acik_uclu", "coktan_secmeli"];
  const validDifficulties = ["kolay", "orta", "zor"];

  return {
    question_text: data.question_text,
    question_type: validTypes.includes(data.question_type) ? data.question_type : "acik_uclu",
    learning_outcome_id: data.learning_outcome_id || outcomeId,
    difficulty: validDifficulties.includes(data.difficulty) ? data.difficulty : difficulty,
    expected_keywords: data.expected_keywords || [],
    rubric: {
      excellent: data.rubric?.excellent || "",
      good: data.rubric?.good || "",
      satisfactory: data.rubric?.satisfactory || "",
      insufficient: data.rubric?.insufficient || "",
      max_points: data.rubric?.max_points || 100,
    },
  };
}

module.exports = { generateQuestion };
