/**
 * SmartExamBuilder – API Client
 *
 * Backend (Express.js) ile iletişim için fetch wrapper fonksiyonları.
 */

const API_BASE = "http://localhost:3001/api";

/**
 * Kazanım listesini getirir (kategorilere göre gruplandırılmış).
 */
export async function fetchOutcomes() {
  const res = await fetch(`${API_BASE}/outcomes`);
  if (!res.ok) throw new Error("Kazanımlar yüklenemedi");
  return res.json();
}

/**
 * Writer + Critic döngüsü ile soru üretir.
 *
 * @param {number} outcomeId  - Kazanım numarası (1-14)
 * @param {string} difficulty - Zorluk seviyesi ('kolay', 'orta', 'zor')
 */
export async function generateQuestion(outcomeId, difficulty) {
  const res = await fetch(`${API_BASE}/generate-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outcome_id: outcomeId, difficulty }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Soru üretilemedi");
  return data;
}

/**
 * Öğrenci cevabını değerlendirir.
 *
 * @param {object} question      - Soru objesi
 * @param {string} studentAnswer - Öğrenci cevap metni
 */
export async function evaluateAnswer(question, studentAnswer) {
  const res = await fetch(`${API_BASE}/evaluate-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, student_answer: studentAnswer }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Değerlendirme yapılamadı");
  return data;
}

/**
 * Backend sağlık kontrolü.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
