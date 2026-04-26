import "./QuestionDisplay.css";

const DIFFICULTY_LABELS = {
  kolay: { label: "Kolay", icon: "⚡", className: "easy" },
  orta: { label: "Orta", icon: "⚖️", className: "medium" },
  zor: { label: "Zor", icon: "🔥", className: "hard" },
};

export default function QuestionDisplay({ question, criticFeedback, onContinue, onBack }) {
  const diff = DIFFICULTY_LABELS[question.difficulty] || DIFFICULTY_LABELS.orta;
  const stars = "★".repeat(criticFeedback.quality_score) +
                "☆".repeat(10 - criticFeedback.quality_score);

  return (
    <div className="question-display animate-in" id="question-display">
      <button className="btn btn-ghost back-btn" onClick={onBack} id="btn-back-question">
        ← Geri
      </button>

      {/* Critic Summary */}
      <div className="critic-summary glass-card">
        <div className="critic-header">
          <span className="critic-icon">🔍</span>
          <span className="critic-label">Critic Agent</span>
          <span className={`critic-status ${criticFeedback.is_approved ? "approved" : "rejected"}`}>
            {criticFeedback.is_approved ? "✅ Onaylandı" : "❌ Reddedildi"}
          </span>
        </div>
        <div className="critic-stars">{stars}</div>
        <div className="critic-score">
          Kalite Puanı: {criticFeedback.quality_score}/10
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card glass-card gradient-border">
        <div className="question-header">
          <h2 className="question-title">📝 Üretilen Soru</h2>
          <div className="question-meta">
            <span className={`diff-badge ${diff.className}`}>
              {diff.icon} {diff.label}
            </span>
            <span className="outcome-badge">
              Kazanım #{question.learning_outcome_id}
            </span>
          </div>
        </div>

        <p className="question-text">{question.question_text}</p>

        {/* Keywords */}
        <div className="keywords-section">
          <span className="keywords-label">Anahtar Kelimeler:</span>
          <div className="keywords-list">
            {question.expected_keywords.map((kw, i) => (
              <span key={i} className="keyword-tag">{kw}</span>
            ))}
          </div>
        </div>

        {/* Rubric */}
        <details className="rubric-details">
          <summary className="rubric-summary">📋 Puanlama Rubriğini Göster</summary>
          <div className="rubric-grid">
            <div className="rubric-item excellent">
              <div className="rubric-level">🏆 Mükemmel (90-100)</div>
              <p>{question.rubric.excellent}</p>
            </div>
            <div className="rubric-item good">
              <div className="rubric-level">🥈 İyi (70-89)</div>
              <p>{question.rubric.good}</p>
            </div>
            <div className="rubric-item satisfactory">
              <div className="rubric-level">🥉 Yeterli (50-69)</div>
              <p>{question.rubric.satisfactory}</p>
            </div>
            <div className="rubric-item insufficient">
              <div className="rubric-level">❌ Yetersiz (0-49)</div>
              <p>{question.rubric.insufficient}</p>
            </div>
          </div>
        </details>
      </div>

      <button className="btn btn-primary continue-btn" onClick={onContinue} id="btn-answer-question">
        ✍️ Cevabımı Yazacağım
      </button>
    </div>
  );
}
