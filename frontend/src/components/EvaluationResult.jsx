import "./EvaluationResult.css";

const GRADE_CONFIG = {
  Mükemmel: { emoji: "🏆", color: "var(--color-excellent)", className: "excellent" },
  İyi: { emoji: "🥈", color: "var(--color-good)", className: "good" },
  Yeterli: { emoji: "🥉", color: "var(--color-satisfactory)", className: "satisfactory" },
  Yetersiz: { emoji: "❌", color: "var(--color-insufficient)", className: "insufficient" },
};

export default function EvaluationResult({ result, onNewExam }) {
  const grade = GRADE_CONFIG[result.grade_level] || GRADE_CONFIG["Yeterli"];
  const scorePercent = Math.min(100, Math.max(0, result.score));

  return (
    <div className="evaluation-result animate-in" id="evaluation-result">
      {/* Score Hero */}
      <div className={`score-hero glass-card gradient-border ${grade.className}`}>
        <div className="score-emoji">{grade.emoji}</div>
        <div className="score-grade">{result.grade_level}</div>
        <div className="score-number">
          <span className="score-value">{result.score}</span>
          <span className="score-max">/100</span>
        </div>
        <div className="score-bar-container">
          <div
            className="score-bar-fill"
            style={{
              width: `${scorePercent}%`,
              "--bar-color": grade.color,
            }}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="feedback-section glass-card">
        <h3 className="feedback-title">💬 Geri Bildirim</h3>
        <p className="feedback-text">{result.feedback}</p>
      </div>

      {/* Strong Points */}
      {result.strong_points && result.strong_points.length > 0 && (
        <div className="points-section glass-card strong-points">
          <h3 className="points-title">✅ Güçlü Yönler</h3>
          <ul className="points-list">
            {result.strong_points.map((point, i) => (
              <li key={i} className="point-item" style={{ animationDelay: `${i * 0.1}s` }}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Areas */}
      {result.improvement_areas && result.improvement_areas.length > 0 && (
        <div className="points-section glass-card improvement-areas">
          <h3 className="points-title">📈 Geliştirilmesi Gereken Alanlar</h3>
          <ul className="points-list">
            {result.improvement_areas.map((area, i) => (
              <li key={i} className="point-item" style={{ animationDelay: `${i * 0.1}s` }}>
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* New Exam Button */}
      <button className="btn btn-primary new-exam-btn" onClick={onNewExam} id="btn-new-exam">
        🎓 Yeni Soru Üret
      </button>
    </div>
  );
}
