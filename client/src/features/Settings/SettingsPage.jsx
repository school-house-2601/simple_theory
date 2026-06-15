import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import "./SettingsPage.css";

const INSTRUMENTS = [
  "Piano",
  "Guitar",
  "Bass",
  "Drums",
  "Vocals",
  "Production",
];

export default function SettingsPage() {
  const { user, token, fetchUser } = useAuth();
  const [instrument, setInstrument] = useState("Guitar");
  const [path, setPath] = useState("Novice");
  const [alsoPlays, setAlsoPlays] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setPath(user.selected_path || "Novice");
      if (user.interests?.[0]) setInstrument(user.interests[0]);
      if (user.interests?.length > 1) setAlsoPlays(user.interests.slice(1));
    }
  }, [user]);

  const toggleAlsoPlays = (item) => {
    setAlsoPlays((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/path`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path }),
      });

      const updatedInterests = [
        instrument,
        ...alsoPlays.filter((i) => i !== instrument),
      ];

      await fetch(`${import.meta.env.VITE_API_URL}/users/interests`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: updatedInterests }),
      });

      await fetchUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-card">
          <label>Primary Instrument</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            <option value="">Select Instrument</option>
            {INSTRUMENTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <label style={{ marginTop: "16px", display: "block" }}>
            Also Plays
          </label>
          <p
            style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}
          >
            Select all that apply
          </p>
          <div
            className="also-plays-pills"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {INSTRUMENTS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleAlsoPlays(item)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: alsoPlays.includes(item)
                    ? "1px solid #6366f1"
                    : "1px solid #2a2b45",
                  background: alsoPlays.includes(item)
                    ? "#6366f1"
                    : "transparent",
                  color: alsoPlays.includes(item) ? "white" : "#94a3b8",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <label>Learning Path</label>
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            <option value="Novice">Novice</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>

          <button onClick={handleSave}>Save Settings</button>
          {saved && (
            <p style={{ color: "#22c55e", marginTop: "10px" }}>
              ✓ Settings saved!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
