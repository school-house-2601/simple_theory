import { useEffect, useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./RecommendedCard.css";

const SKILL_GRADIENTS = {
    Piano: "linear-gradient(135deg, #1a1a4e, #6c63ff)",
    Guitar: "linear-gradient(135deg, #2d1b00, #ff6b35)",
    Drums: "linear-gradient(135deg, #1a0030, #9c27b0)",
    Vocals: "linear-gradient(135deg, #001a2e, #00bcd4)",
    Production: "linear-gradient(135deg, #0a2e1a, #4caf50)",
    Theory: "linear-gradient(135deg, #1a1a2e, #3f51b5)",
};

const SKILL_ICONS = {
    Piano: "🎹",
    Guitar: "🎸",
    Drums: "🥁",
    Vocals: "🎤",
    Production: "🎚️",
    Theory: "🎼",
 };

export default function RecommendedCard() {
    const { user } = useAuth();
    const [rec, setRec] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        fetch (`/api/stats/recommendations/${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Recommendation data:", data);
                setRec(data);
            })
            .catch(() => {});
    }, [user]);

    if (!rec) return null;

    const handleStart = () => {
        navigate(`/browse?search=${encodeURIComponent(rec.searchQuery)}`);
    };

    return (
        <div className="recommended-card">
            <div className="recommended-thumbnail"
                style={{ background: SKILL_GRADIENTS[rec.focusSkill] || "linear-gradient(135deg, #1a1a2e, #6c63ff)"}}
            >
                <div className="thumbnail-placeholder">
                    {SKILL_ICONS[rec.focusSkill] || "🎵"}
                </div>
            </div>
            <div className="recommended-info">
                <span className="rec-badge">{rec.badge}</span>
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <div className="recommended-meta">
                    <span>🕐 {rec.duration}</span>
                </div>
                <button className="start-tutorial-btn" onClick={handleStart}>Start Tutorial</button>
            </div>
        </div>
    );
}