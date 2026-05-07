import "./Landing.css";

export default function App() {
  return (
    <div className="page">
      <main className="hero">
        <div className="icon">〽</div>

        <h1>SimpleTheory</h1>

        <p className="subtitle">
          The focused path to mastering instruments and music production.
        </p>

        <p className="small-text">Learn any instrument. Start playing.</p>

        <button className="enter-button">
          Press Enter <span>›</span>
        </button>

        <p className="hint">↵ to begin your journey</p>
      </main>
    </div>
  );
}
