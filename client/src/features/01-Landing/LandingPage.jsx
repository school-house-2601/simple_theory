import "./landing.css";

export default function App() {
  return (
    <div className="page">
      <main className="hero">
        <div className="icon">〽</div>

        <h1>SimpleTheory</h1>

        <p className="subtitle">
          The focused path to mastering instruments and music production.
        </p>

        <p className="small-text">
          Learn any instrument. Start playing.
        </p>

        <button className="enter-button">
          Press Enter <span>›</span>
        </button>

        <p className="hint">↵ to begin your journey</p>
      </main>

      <footer className="footer">
        <div className="brand">
          <h2><span>〽</span> SimpleTheory</h2>
          <p>
            Master your instrument with data-driven theory and interactive
            practice.
          </p>
        </div>

        <div>
          <h3>Learning</h3>
          <p>Novice Path</p>
          <p>Intermediate DAW</p>
          <p>Music Theory 101</p>
        </div>

        <div>
          <h3>Platform</h3>
          <p>How it works</p>
          <p>Library</p>
          <p>Pricing</p>
        </div>

        <div>
          <h3>Support</h3>
          <p>About Us</p>
          <p>Contact</p>
          <p>Account</p>
        </div>
      </footer>
    </div>
  );
}