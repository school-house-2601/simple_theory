import { useEffect, useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./RecommendedCard.css";

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
            <div className="recommended-thumbnail">
                <div className="thumbnail-placeholder">🎵</div>
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