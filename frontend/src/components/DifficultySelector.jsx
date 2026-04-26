import "./DifficultySelector.css";

const DIFFICULTIES = [
  {
    key: "kolay",
    label: "Kolay",
    icon: "⚡",
    color: "var(--color-easy)",
    description: "Temel bilgi ve kavram düzeyi",
  },
  {
    key: "orta",
    label: "Orta",
    icon: "⚖️",
    color: "var(--color-medium)",
    description: "Analiz ve uygulama düzeyi",
  },
  {
    key: "zor",
    label: "Zor",
    icon: "🔥",
    color: "var(--color-hard)",
    description: "Sentez ve değerlendirme düzeyi",
  },
];

export default function DifficultySelector({ selectedOutcome, onSelect, onBack }) {
  return (
    <div className="difficulty-selector animate-in" id="difficulty-selector">
      <button className="btn btn-ghost back-btn" onClick={onBack} id="btn-back-difficulty">
        ← Geri
      </button>

      <div className="selected-outcome-preview glass-card">
        <span className="preview-label">Seçilen Kazanım</span>
        <p className="preview-text">{selectedOutcome.text}</p>
      </div>

      <h2 className="section-title">
        <span className="section-icon">📊</span>
        Zorluk seviyesini seçin
      </h2>

      <div className="difficulty-grid">
        {DIFFICULTIES.map((diff, idx) => (
          <button
            key={diff.key}
            className="difficulty-card glass-card gradient-border"
            onClick={() => onSelect(diff.key)}
            style={{ animationDelay: `${idx * 0.1}s` }}
            id={`difficulty-${diff.key}`}
          >
            <div className="diff-icon" style={{ "--diff-color": diff.color }}>
              {diff.icon}
            </div>
            <div className="diff-label">{diff.label}</div>
            <div className="diff-description">{diff.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
