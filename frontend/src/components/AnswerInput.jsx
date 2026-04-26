import { useState } from "react";
import "./AnswerInput.css";

export default function AnswerInput({ question, onSubmit, onBack }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter to submit
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="answer-input animate-in" id="answer-input">
      <button className="btn btn-ghost back-btn" onClick={onBack} id="btn-back-answer">
        ← Geri
      </button>

      {/* Question Reminder */}
      <div className="answer-question-reminder glass-card">
        <span className="reminder-label">Soru</span>
        <p className="reminder-text">{question.question_text}</p>
      </div>

      {/* Answer Area */}
      <div className="answer-area glass-card gradient-border">
        <h2 className="section-title">
          <span className="section-icon">✍️</span>
          Cevabınızı yazın
        </h2>

        <textarea
          className="answer-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cevabınızı buraya yazın..."
          rows={8}
          autoFocus
          id="answer-textarea"
        />

        <div className="answer-footer">
          <span className="char-count">
            {answer.length} karakter
          </span>
          <span className="submit-hint">
            Ctrl+Enter ile gönder
          </span>
        </div>

        <button
          className="btn btn-primary submit-btn"
          onClick={handleSubmit}
          disabled={!answer.trim()}
          id="btn-submit-answer"
        >
          🚀 Değerlendir
        </button>
      </div>
    </div>
  );
}
