import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedItems.css";

export default function SavedItems() {
    const [saved, setSaved] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {    
            const savedLessons = localStorage.getItem("savedLessons");
            if (savedLessons) {
                setSaved(JSON.parse(savedLessons).slice(0, 3));
            }
        } catch {
            setSaved([]);
        }
    }, []);

    const goToSaved = () => {
        navigate("/browse?tab=saved");
    };

    if (saved.length === 0) return null;

    return (
        <div className="saved-items-card">
            <div className="saved-items-header">
                <h3>Saved for Later</h3>
            </div>
            <div className="saved-list">
                {saved.map((video) => (
                    <div 
                    key={video.id.videoId} 
                    className="saved-item" 
                    onClick={goToSaved}>
                    <div className="saved-icon">
                        <img
                            src={video.snippet.thumbnails.default.url}
                            alt={video.snippet.title}
                            style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                        />
                    </div>
                    <div className="saved-info">
                        <span className="saved-title">
                            {video.snippet.title.length > 40
                                ? video.snippet.title.slice(0, 40) + "..."
                                : video.snippet.title}
                            </span>
                        <span className="saved-type">{video.snippet.channelTitle}</span>
                    </div>
                    <span className="saved-arrow">›</span>
                </div>
                ))}
            </div>
            <button className="saved-view-all" onClick={goToSaved}>
                View All
            </button>
        </div>
    )
}

