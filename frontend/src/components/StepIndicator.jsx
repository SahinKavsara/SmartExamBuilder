import "./StepIndicator.css";

const STEPS = [
  { id: 1, label: "Kazanım", icon: "📚" },
  { id: 2, label: "Zorluk", icon: "📊" },
  { id: 3, label: "Soru", icon: "📝" },
  { id: 4, label: "Cevap", icon: "✍️" },
  { id: 5, label: "Sonuç", icon: "🏆" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator" id="step-indicator">
      <div className="step-track">
        <div
          className="step-fill"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="steps-row">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`step-item ${
              currentStep === step.id
                ? "active"
                : currentStep > step.id
                ? "completed"
                : "upcoming"
            }`}
          >
            <div className="step-circle">
              {currentStep > step.id ? (
                <span className="step-check">✓</span>
              ) : (
                <span className="step-icon">{step.icon}</span>
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
