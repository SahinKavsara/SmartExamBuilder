import "./LoadingSpinner.css";

const AGENT_MESSAGES = {
  writer: {
    title: "Writer Agent",
    icon: "✍️",
    messages: [
      "Kazanıma uygun soru üretiliyor...",
      "RAG bağlamı analiz ediliyor...",
      "Rubrik oluşturuluyor...",
    ],
  },
  critic: {
    title: "Critic Agent",
    icon: "🔍",
    messages: [
      "Soru kalitesi değerlendiriliyor...",
      "Kazanım uyumu kontrol ediliyor...",
      "Rubrik tutarlılığı inceleniyor...",
    ],
  },
  evaluator: {
    title: "Evaluator Agent",
    icon: "🤖",
    messages: [
      "Cevap değerlendiriliyor...",
      "Anahtar kelimeler kontrol ediliyor...",
      "Puan ve geri bildirim hazırlanıyor...",
    ],
  },
};

export default function LoadingSpinner({ agent = "writer", attempt = 1, maxAttempts = 3 }) {
  const agentInfo = AGENT_MESSAGES[agent] || AGENT_MESSAGES.writer;

  return (
    <div className="loading-spinner animate-in" id="loading-spinner">
      <div className="spinner-card glass-card">
        <div className="spinner-orb">
          <div className="orb-ring ring-1"></div>
          <div className="orb-ring ring-2"></div>
          <div className="orb-ring ring-3"></div>
          <div className="orb-center">{agentInfo.icon}</div>
        </div>

        <h3 className="spinner-title gradient-text">{agentInfo.title}</h3>

        <div className="spinner-messages">
          {agentInfo.messages.map((msg, i) => (
            <p
              key={i}
              className="spinner-msg"
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              {msg}
            </p>
          ))}
        </div>

        {agent !== "evaluator" && (
          <div className="spinner-attempt">
            Deneme {attempt}/{maxAttempts}
          </div>
        )}

        <div className="shimmer-bar">
          <div className="shimmer-fill"></div>
        </div>
      </div>
    </div>
  );
}
