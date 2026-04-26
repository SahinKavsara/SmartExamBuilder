/**
 * SmartExamBuilder – LLM Service
 *
 * LM Studio'nun OpenAI-uyumlu API'sine bağlantı sağlar.
 * Tüm agent'lar bu servis üzerinden LLM çağrısı yapar.
 */

const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "lm-studio",
});

/**
 * LLM'e mesaj gönderir ve yanıt döndürür.
 *
 * @param {string} systemPrompt - Sistem mesajı
 * @param {string} userPrompt   - Kullanıcı mesajı
 * @param {number} temperature  - Yaratıcılık seviyesi (0-1)
 * @returns {Promise<string>}   - LLM'den gelen ham yanıt
 */
async function callLLM(systemPrompt, userPrompt, temperature = 0.7) {
  const response = await openai.chat.completions.create({
    model: "local-model",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
  });

  return response.choices[0].message.content;
}

/**
 * LLM çıktısından JSON bloğunu güvenli şekilde çıkarır.
 * Python'daki _extract_json fonksiyonunun JS karşılığı.
 *
 * @param {string} text - LLM'den gelen ham metin
 * @returns {object}    - Parse edilmiş JSON objesi
 */
function extractJSON(text) {
  text = text.trim();

  // ```json ... ``` blokları içinden JSON çıkar
  if (text.includes("```")) {
    const parts = text.split("```");
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        const content = parts[i].replace(/^json\s*/i, "").trim();
        try {
          return JSON.parse(content);
        } catch {
          continue;
        }
      }
    }
  }

  // Doğrudan JSON parse dene
  try {
    return JSON.parse(text);
  } catch {
    // Son çare: Metindeki ilk {...} bloğunu bul
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("LLM çıktısından JSON çıkarılamadı");
  }
}

module.exports = { callLLM, extractJSON };
