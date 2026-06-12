import "./AccuracyMeter.css";

export default function AccuracyMeter({ accuracy }) {
    const getColor = () => {
        if (accuracy >= 80) return "#4caf7d";
        if (accuracy >= 50) return "#f0a500";
        return "#ff6b6b";
    };

    return (
        <div className="accuracy-meter">
            <div className="accuracy-label">Accuracy</div>
            <div className="accuracy-bar-bg">
                <div className="accuracy-bar-fill"
                    style={{
                        width: `${accuracy}%`,
                        backgroundColor: getColor(),
                        transition: "width 0.3s ease"
                    }}
                />
            </div>
            <div className="accuracy-value" style={{ color: getColor() }}>
                {accuracy}%
            </div>
        </div>
    )
}