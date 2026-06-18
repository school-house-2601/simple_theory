import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import StatsCards from "./StatsCards";
import "./StatsCards.css";
import XPChart from "./XPChart";
import "./XPChart.css";
import SkillRadar from "./SkillRadar";
import "./SkillRadar.css";
import DailyGoals from "./DailyGoals";
import RecommendedCard from "./RecommendedCard";
import "./DailyGoals.css";
import "./RecommendedCard.css";
import LearningJourney from "./LearningJourney";
import "./LearningJourney.css";
import SavedItems from "./SavedItems";
import "./SavedItems.css";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Your Progress</h1>
            <p>
              Keep up the great work! You&apos;re in the top 5% of learners this
              week.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/lessons")}
            >
              Continue Learning →
            </button>
          </div>
        </div>
        <StatsCards stats={stats} />
        <XPChart />
        <SkillRadar />
        <LearningJourney />
      </main>
      <aside className="right-sidebar">
        <DailyGoals />
        <RecommendedCard />
        <SavedItems />
      </aside>
    </div>
  );
}
