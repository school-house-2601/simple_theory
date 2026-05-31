import { useEffect, useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import "./LearningJourney.css";

const CATEGORY_COLORS = {
    Video: "#6c63ff",
    Notation: "#ff6b6b",
    Plugin: "#4caf7d",
};

function timeAgo(dataStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
}

export default function LearningJourney() {
    const { user } = useAuth();
    const [journey, setJourney] = useState([]);

    useEffect(() => {
        if (!user) return;
        fetch(`/api/progress/${user.id}`)
            .then((res) => res.json())
            .then((data) => setJourney(data))
            .catch(() => setJourney([]));
    }, [user]);

    if (journey.length === 0) return null;

    return (
        <div className="learning-journey-card">
            <div className="learning-journey-header">
                <div>
                    <h2>Learning Journey</h2>
                    <p>Recent lessons and milestones completed</p>
                </div>
                <button className="view-all-btn">View All</button>
            </div>
            <div className="journey-list">
                {journey.map((item) => (
                    <div key={item.id} className="journey-item">
                        <div
                            className="journey-dot"
                            style={{ backgroundColor: CATEGORY_COLORS[item.type] || "#6c63ff" }}
                        />
                        <div className="journey-info">
                            <span className="journey-title">{item.title}</span>
                            <div className="journey-meta">
                                <span
                                    className="journey-category"
                                    style={{ color: CATEGORY_COLORS[item.type] || "#6c63ff" }}
                                >
                                {item.type}
                                </span>
                                <span className="journey-xp">⚡ +{item.xp} XP</span>
                            </div>
                        </div>
                        <span className="journey-time">🕐 {timeAgo(item.completed_at)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}