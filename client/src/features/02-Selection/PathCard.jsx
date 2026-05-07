export default function PathCard({ icon, title, description, features, buttonText, popular, onSelect }) {
    return (
        <div className={`path-card ${popular ? "popular" : ""}`}>
            {popular && <span className="badge">MOST POPULAR</span>}
            <div className="card-icon">{icon}</div>
            <h2>{title}</h2>
            <p>{description}</p>
            <b>INCLUDES:</b>
            <ul>
                {features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                ))}
            </ul>
            <button onClick={onSelect}>{buttonText}</button>
        </div>
    );
}