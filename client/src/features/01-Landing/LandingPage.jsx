import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { PiMicrophoneStageThin } from "react-icons/pi";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <main className="hero">
        <div className="music-symbol">♫</div>

        <PiMicrophoneStageThin className="mic-symbol" />

        <p className="landing-badge">✦ THE FUTURE OF MUSIC LEARNING</p>

        <h1 className="landing-title">SimpleTheory</h1>

        <p className="subtitle">
          The focused path to mastering instruments and music production.
        </p>

        <p className="small-text">Learn any instrument. Start playing.</p>

        <button className="enter-button" onClick={() => navigate("/selection")}>
          Press Enter <span>›</span>
        </button>

        <p className="hint">↵ to begin your journey</p>
      </main>
    </div>
  );
}
