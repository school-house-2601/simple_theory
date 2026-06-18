import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import "./DailyGoals.css";

export default function DailyGoals() {
  const { user, token } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_URL}/stats/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="daily-goals-card">
      <div className="daily-goals-header">
        <span>🎯</span>
        <div>
          <h3>Daily Goals</h3>
          <p>
            {completedCount} of {goals.length} targets completed today
          </p>
        </div>
      </div>

      <div className="goals-list">
        {goals.map((goal) => {
          const percent = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="goal-item">
              <div className="goal-item-top">
                <span className="goal-label">
                  {goal.completed ? "✅" : "⏳"} {goal.goal_label}
                </span>
                <span className="goal-value">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <div className="goal-bar-bg">
                <div
                  className={`goal-bar-fill ${goal.completed ? "completed" : ""}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="goal-bonus">+{goal.bonus_xp} XP bonus</span>
            </div>
          );
        })}
      </div>

      <button className="weekly-challenges-btn">View Weekly Challenges</button>
    </div>
  );
}
