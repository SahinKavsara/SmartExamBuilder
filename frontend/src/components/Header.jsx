import "./Header.css";

export default function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header-content">
        <div className="header-logo-area">
          <div className="header-icon">🎓</div>
          <div>
            <h1 className="header-title">
              <span className="gradient-text">Smart Exam Builder</span>
            </h1>
            <p className="header-subtitle">LLM + Multi-Agent + RAG</p>
          </div>
        </div>
        <div className="header-agents">
          <div className="agent-badge writer">
            <span className="agent-dot"></span>
            Writer
          </div>
          <span className="agent-arrow">▸</span>
          <div className="agent-badge critic">
            <span className="agent-dot"></span>
            Critic
          </div>
          <span className="agent-arrow">▸</span>
          <div className="agent-badge evaluator">
            <span className="agent-dot"></span>
            Evaluator
          </div>
        </div>
      </div>
    </header>
  );
}
