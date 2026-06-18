import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/AuthContext";
import { STEPS, FEATURES, PATHS } from "../../data/howItWorksData";
import "./HowItWorks.css";

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <div className="hiw-page">
      <div className="hiw-inner">
        {/* HERO */}
        <section className="hiw-hero">
          <p className="hiw-badge">✦ SIMPLE BY DESIGN</p>
          <h1 className="hiw-title">How SimpleTheory works</h1>
          <p className="hiw-subtitle">
            A focused system built to take you from your first chord to a
            professional sound — one video, one goal, one level at a time.
          </p>
        </section>

        {/* STEP BY STEP */}
        <section className="hiw-section">
          <h2 className="hiw-section-title">The flow</h2>
          <div className="hiw-steps">
            {STEPS.map((step, i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-step-number">{step.number}</div>
                <div className="hiw-step-icon">{step.icon}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
                {i < STEPS.length - 1 && <div className="hiw-step-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* LEARNING PATHS */}
        <section className="hiw-section">
          <h2 className="hiw-section-title">Three paths, one destination</h2>
          <p className="hiw-section-sub">
            Every master was once a beginner. Pick where you are now.
          </p>
          <div className="hiw-paths">
            {PATHS.map((path, i) => (
              <div key={i} className={`hiw-path-card hiw-path-${path.color}`}>
                <div className="hiw-path-icon">{path.icon}</div>
                <h3 className="hiw-path-level">{path.level}</h3>
                <p className="hiw-path-desc">{path.description}</p>
                <ul className="hiw-path-list">
                  {path.includes.map((item, j) => (
                    <li key={j}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="hiw-section">
          <h2 className="hiw-section-title">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="hiw-features">
            {FEATURES.map((feat, i) => (
              <div key={i} className="hiw-feature-card">
                <div className="hiw-feature-icon">{feat.icon}</div>
                <h3 className="hiw-feature-title">{feat.title}</h3>
                <p className="hiw-feature-desc">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="hiw-cta">
          <h2>Ready to start?</h2>
          <p>
            Your first lesson is one click away. No credit card, no commitment.
          </p>
          <div className="hiw-cta-buttons">
            {!token && (
              <button
                className="hiw-cta-primary"
                onClick={() => navigate("/register")}
              >
                Create free account →
              </button>
            )}
            <button
              className="hiw-cta-secondary"
              onClick={() => navigate("/selection")}
            >
              Browse paths
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
