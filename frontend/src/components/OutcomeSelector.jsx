import { useState } from "react";
import "./OutcomeSelector.css";

export default function OutcomeSelector({ categories, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.category || ""
  );

  return (
    <div className="outcome-selector animate-in" id="outcome-selector">
      <h2 className="section-title">
        <span className="section-icon">📚</span>
        Hangi kazanım için soru üretilsin?
      </h2>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.category}
            className={`category-tab ${
              activeCategory === cat.category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.category)}
            id={`tab-${cat.category.toLowerCase().replace(/\s/g, "-")}`}
          >
            <span className="tab-icon">{cat.icon}</span>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Outcome Cards */}
      <div className="outcome-grid">
        {categories
          .find((c) => c.category === activeCategory)
          ?.outcomes.map((outcome, idx) => (
            <button
              key={outcome.id}
              className="outcome-card glass-card gradient-border"
              onClick={() => onSelect(outcome)}
              style={{ animationDelay: `${idx * 0.08}s` }}
              id={`outcome-${outcome.id}`}
            >
              <div className="outcome-id">#{outcome.id}</div>
              <p className="outcome-text">{outcome.text}</p>
              <div className="outcome-arrow">→</div>
            </button>
          ))}
      </div>
    </div>
  );
}
