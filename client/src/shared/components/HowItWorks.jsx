import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const STEPS = [
  {
    number: "01",
    title: "Choose your path",
    description:
      "Pick the learning track that matches where you are — Novice, Intermediate, or Professional. Each path is tailored to your skill level with curated content and goals.",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Watch & learn",
    description:
      "Browse thousands of video tutorials organized by instrument and skill. Theory, Piano, Guitar, Drums, Vocals, and Production — all in one place.",
    icon: "🎬",
  },
  {
    number: "03",
    title: "Practice with sheet music",
    description:
      "Open interactive Flat.io notation directly in the app. Play along with real sheet music, pause, rewind, and practice at your own pace.",
    icon: "🎼",
  },
  {
    number: "04",
    title: "Earn XP & level up",
    description:
      "Every video you watch and lesson you complete earns XP. Hit milestones to unlock new levels — from Novice all the way to Professional.",
    icon: "⚡",
  },
];

const FEATURES = [
  {
    icon: "📊",
    title: "Personal dashboard",
    description:
      "Track your XP history, skill distribution across instruments, and daily goals — all in one visual dashboard built around your progress.",
  },
  {
    icon: "🎯",
    title: "Daily goals",
    description:
      "Fresh challenges every day. Watch videos, hit XP targets, and focus on your weakest skill to earn bonus XP rewards.",
  },
  {
    icon: "🔖",
    title: "Save for later",
    description:
      "Bookmark any video to your saved list and come back to it whenever you're ready. Your library, your pace.",
  },
  {
    icon: "🤖",
    title: "Smart recommendations",
    description:
      "SimpleTheory analyzes your watch history and skill gaps to surface the exact tutorial you need next.",
  },
  {
    icon: "🔥",
    title: "Login streaks",
    description:
      "Log in daily to build your streak. Consistency is the fastest path to mastery — we make sure you come back.",
  },
  {
    icon: "🔐",
    title: "Google sign-in",
    description:
      "Jump in instantly with your Google account. No passwords to remember, no friction between you and the music.",
  },
];

const PATHS = [
  {
    level: "Novice",
    icon: "🎵",
    color: "novice",
    description: "First time picking up an instrument. No theory required.",
    includes: [
      "Basic rhythm & timing",
      "Intro to sheet music",
      "Starter packs by instrument",
      "5 daily practice exercises",
    ],
  },
  {
    level: "Intermediate",
    icon: "⚙️",
    color: "intermediate",
    description: "Bridge the gap between playing and producing.",
    includes: [
      "DAW setup & routing",
      "Advanced chord progressions",
      "Logic Pro & Ableton templates",
      "Sound design basics",
    ],
  },
  {
    level: "Professional",
    icon: "⚡",
    color: "professional",
    description: "Polish your production and music business knowledge.",
    includes: [
      "Professional mixing & mastering",
      "Licensing & royalty theory",
      "Artist branding workshop",
      "Lifetime resource library",
    ],
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

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
            Everything you need, nothing you don't
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
            <button
              className="hiw-cta-primary"
              onClick={() => navigate("/register")}
            >
              Create free account →
            </button>
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
