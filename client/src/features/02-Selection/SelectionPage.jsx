import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PathCard from "./PathCard";
import "./selection.css";

const PATHS = [
    {
        level: "Novice",
        icon: "🎵",
        description: "Perfect for those picking up an instrument for the very first time. No theory knowledge required.",
        features: [
            "Basic rhythm and timing",
            "Introduction to sheet music",
            "Instrument specific starter packs",
            "Interactive finger placement guide",
            "5 Daily practice exercises",
        ],
        buttonText: "Start Learning →",
        popular:false
    },
    {
        level: "Intermediate",
        icon: "⚙️",
        title: "Intermediate",
        description: "Bridge the gap between playing and producing. Focus on DAW workflows and sound design.",
        features: [
            "DAW setup & signal routing",
            "Advanced chord progressions",
            "Synthesis & sound design basics",
            "Logic Pro & Ableton templates",
            "Personalized feedback loops"
        ],
        buttonText: "Master the DAW →",
        popular: true
    },
    {
        level: "Professional",
        icon: "⚡",
        title: "Professional",
        description: "For establishes musicians looking to polish their production and music business knowledge.",
        features: [
            "Professional mixing & mastering",
            "Licensing and royalty theory",
            "Artist branding workshop",
            "Direct mentor sessions",
            "Lifetime resource library"
        ],
        buttonText: "Unlock Pro Tools →",
        popular: false
    }
];

export default function SelectionPage() {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (level) => {
        setSelected(level);
        navigate(`/dashboard`, { state: { selectedPath: level } });
    };

    return (
        <main className="selection-page">
            <span className="step-label">Step 1 of 3</span>
            <h1>Choose your learning path</h1>
            <p className="subtitle">Every master was once a beginner. Select the track that best fits your current goals and unlock your musical potential.</p>

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
                    <b>Quick Tip: Save Your Progress</b>
                    <p>Create a free account to sync your learning data across devices and earn exclusive XP rewards as you complete paths.</p>
                </div>
                <button onClick={() => navigate("/auth")}>Learn More</button>
                <button onClick={() => navigate("/auth?mode=register")}>Create Account</button>
            </div>

            <p className="footer-note">ⓘ Not sure which path to choose? You can change your level at any time from your settings.</p>
        </main>
    );
}