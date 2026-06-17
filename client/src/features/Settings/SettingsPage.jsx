import { useState, useEffect, use } from "react";
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (user && !saved) {
      // don't reset if just saved
      setPath(user.selected_path || "Novice");
      if (user.interests && user.interests[0]) {
        setInstrument(user.interests[0]);
      }
      if (user.interests && user.interests.length > 1) {
        setAlsoPlays(user.interests.slice(1));
      }
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

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/reset`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUser();
      setShowResetConfirm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* MAIN SETTINGS CARD */}
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

        {/* DANGER ZONE CARD */}
        <div
          className="settings-card"
          style={{ marginTop: "16px", borderColor: "#ff6b6b" }}
        >
          <h3 style={{ color: "#ff6b6b" }}>⚠️ Danger Zone</h3>
          <p style={{ color: "#a0a0c0", fontSize: "0.85rem" }}>
            This will reset all your progress, XP, streak, and skill
            distribution back to Novice. This cannot be undone.
          </p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid #ff6b6b",
                borderRadius: "8px",
                color: "#ff6b6b",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              Reset All Progress
            </button>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <p style={{ color: "#ff6b6b", fontWeight: "600" }}>
                Are you sure? This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  style={{
                    padding: "10px 20px",
                    background: "#ff6b6b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {resetting ? "Resetting..." : "Yes, Reset Everything"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    border: "1px solid #3b3b6b",
                    borderRadius: "8px",
                    color: "#a0a0c0",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
