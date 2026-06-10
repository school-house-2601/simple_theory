import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../05-Auth/AuthContext";
import PathCard from "./PathCard";
import "./Selection.css";

const PATHS = [
  {
    level: "Novice",
    icon: "🎵",
    title: "Novice",
    description:
      "Perfect for those picking up an instrument for the very first time. No theory knowledge required.",
    features: [
      "Basic rhythm and timing",
      "Introduction to sheet music",
      "Instrument specific starter packs",
      "Interactive finger placement guide",
      "5 Daily practice exercises",
    ],
    buttonText: "Start Learning →",
    popular: true,
  },
  {
    level: "Intermediate",
    icon: "⚙️",
    title: "Intermediate",
    description:
      "Bridge the gap between playing and producing. Focus on DAW workflows and sound design.",
    features: [
      "DAW setup & signal routing",
      "Advanced chord progressions",
      "Synthesis & sound design basics",
      "Logic Pro & Ableton templates",
      "Personalized feedback loops",
    ],
    buttonText: "Master the DAW →",
    popular: false,
  },
  {
    level: "Professional",
    icon: "⚡",
    title: "Professional",
    description:
      "For establishes musicians looking to polish their production and music business knowledge.",
    features: [
      "Professional mixing & mastering",
      "Licensing and royalty theory",
      "Artist branding workshop",
      "Direct mentor sessions",
      "Lifetime resource library",
    ],
    buttonText: "Unlock Pro Tools →",
    popular: false,
  },
];

export default function SelectionPage() {
  const [selected, setSelected] = useState(null);
  const [isProcessingToken, setIsProcessingToken] = useState(() => {
    return new URLSearchParams(window.location.search).has("token");
  });
  const navigate = useNavigate();
  const { token, loginWithGoogle } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${urlToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          loginWithGoogle(data, urlToken);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          loginWithGoogle(null, urlToken);
        })
        .finally(() => {
          setIsProcessingToken(false);
          window.history.replaceState({}, "", "/selection");
          navigate("/dashboard");
        });
    }
  }, []);

  // Render nothing while processing the Google OAuth token
  if (isProcessingToken)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0d1a",
          zIndex: 9999,
        }}
      />
    );

  const handleSelect = (level) => {
    setSelected(level);
    if (
      level === "Novice" ||
      level === "Intermediate" ||
      level === "Professional"
    ) {
      navigate("/lessons", { state: { selectedPath: level } });
    } else {
      navigate(`/dashboard`, { state: { selectedPath: level } });
    }
  };

  return (
    <main className="selection-page">
      <h1>Choose your learning path</h1>
      <p className="subtitle">
        Every master was once a beginner. Select the track that best fits your
        current goals and unlock your musical potential.
      </p>

      <section className="cards-container">
        {PATHS.map((path) => (
          <PathCard
            key={path.level}
            {...path}
            onSelect={() => handleSelect(path.level)}
          />
        ))}
      </section>

      <div className="quick-tip">
        <span>⭐</span>
        <div>
          <b>
            {token ? "Unsure where to start?" : "Quick Tip: Save Your Progress"}
          </b>
          <p>
            {token
              ? "You can always switch paths later. Your XP and progress are tracked globally."
              : "Create a free account to sync your learning data across devices and earn exclusive XP rewards as you complete paths."}
          </p>
        </div>
        <button onClick={() => navigate("/howitworks")}>Learn More</button>
        {!token && (
          <button onClick={() => navigate("/register")}>Create Account</button>
        )}
      </div>

      <p className="footer-note">
        ⓘ Not sure which path to choose? You can change your level at any time
        from your settings.
      </p>
    </main>
  );
}
