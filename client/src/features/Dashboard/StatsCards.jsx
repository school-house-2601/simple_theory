import "./StatsCards.css";

const XP_THRESHOLDS = {
    Novice: 3000,
    Intermediate: 5000,
    Professional: Infinity,
};

const LEVEL_LABELS = {
    Novice: "Intermediate",
    Intermediate: "Professional",
    Professional: null,
};

export default function StatsCards({ stats }) {
    if (!stats) return null;

    const xpToNext = stats.xp_to_next_level;
    const nextLevel = LEVEL_LABELS[stats.current_level];
    const levelMax = XP_THRESHOLDS[stats.current_level];
    const levelMin = stats.current_level === "Novice" ? 0
        : stats.current_level === "Intermediate" ? 3000 : 5000;
    const progressPercent = levelMax === Infinity ? 100
        : Math.round(((stats.total_xp - levelMin) / (levelMax - levelMin)) * 100);

    const cards = [
        {
            label: "Current Level",
            value: stats.current_level,
            sub: nextLevel
             ? `${xpToNext} XP to reach ${nextLevel}`
             : "Max level reached!",
            Icon: "🏆",
        },
        {
            label: "Total XP",
            value: stats.total_xp?.toLocaleString(),
            sub: `${progressPercent}% progress to ${nextLevel || "max"}`,
            icon: "⚡",
        },
        {
            label: "Current Streak",
            value: `${stats.current_streak} Day${stats.current_streak !== 1 ? "s" : ""}`,
            sub: stats.current_streak > 0
                ? `Keep it up! Log in daily to grow your streak`
                : "Log in daily to start a streak!",
            icon: "🔥",
        },
        {
            label: "Selected Path",
            value: stats.selected_path,
            sub: stats.selected_path === stats.current_level
                ? "You are on your chosen path"
                : `Leveled up from ${stats.selected_path}!`,
            icon: "🎵",
        },
    ];

    return (
        <div className="stats-cards">
            {cards.map((card) => (
                <div key={card.label} className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-label">{card.label}</span>
                        <span className="stat-icon">{card.icon}</span>
                    </div>
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-sub">{card.sub}</div>
                </div>
            ))}
        </div>
    );
}