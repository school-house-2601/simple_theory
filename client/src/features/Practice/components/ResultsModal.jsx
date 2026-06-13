import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import "./ResultsModal.css";

const BASE_XP = 50;

export default function ResultsModal({
  accuracy,
  instrument,
  skillCategory,
  onClose,
  onRetry,
}) {
  const { user, token } = useAuth();
  const [xpAwarded, setXpAwarded] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  const bonusXP = Math.round(accuracy * 0.5);
  const totalXP = BASE_XP + bonusXP;

  useEffect(() => {
    if (!user) return;
    const awardXP = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/progress/video-complete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: user.id,
              videoId: `practice-${instrument}-${Date.now()}`,
              xpEarned: totalXP,
              skillCategory,
              accuracyScore: accuracy,
            }),
          },
        );
        const data = await res.json();
        setXpAwarded(totalXP);
        if (data.leveledUp) {
          setLeveledUp(true);
          setNewLevel(data.newLevel);
        }
      } catch (err) {
        console.error("Failed to award XP", err);
      }
    };
    awardXP();
  }, []);

  const getGrade = () => {
    if (accuracy >= 90) return { grade: "S", color: "#f0a500" };
    if (accuracy >= 80) return { grade: "A", color: "#4caf7d" };
    if (accuracy >= 60) return { grade: "B", color: "#6c63ff" };
    if (accuracy >= 40) return { grade: "C", color: "#ff9800" };
    return { grade: "D", color: "#ff6b6b" };
  };

  const { grade, color } = getGrade();

  return (
    <div className="results-overlay">
      <div className="results-modal">
        {leveledUp && (
          <div className="level-up-banner">
            🎉 Level Up! You are now {newLevel}!
          </div>
        )}
        <h2>Session Complete!</h2>
        <div className="results-grade" style={{ color }}>
          {grade}
        </div>
        <div className="results-accuracy">{accuracy}% Accuracy</div>
        <div className="results-xp">
          <div className="xp-row">
            <span>Base XP</span>
            <span>+{BASE_XP}</span>
          </div>
          <div className="xp-row bonus">
            <span>Accuracy Bonus</span>
            <span>+{bonusXP}</span>
          </div>
          <div className="xp-row total">
            <span>Total XP Earned</span>
            <span>+{totalXP}</span>
          </div>
        </div>
        <div className="results-actions">
          <button className="retry-btn" onClick={onRetry}>
            🔄 Try Again
          </button>
          <button className="close-btn" onClick={onClose}>
            ✅ Done
          </button>
        </div>
      </div>
    </div>
  );
}
