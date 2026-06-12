import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { user, token, fetchUser } = useAuth();
  const [instrument, setInstrument] = useState("Guitar");
  const [path, setPath] = useState("Novice");
  const [saved, setSaved] = useState(false);

  // Pre-fill with current user data
  useEffect(() => {
    if (user) {
      setPath(user.selected_path || "Novice");
      if (user.interests?.[0]) setInstrument(user.interests[0]);
    }
  }, [user]);

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

      await fetch(`${import.meta.env.VITE_API_URL}/users/interests`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: [instrument] }),
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
            <option value="Guitar">Guitar</option>
            <option value="Piano">Piano</option>
            <option value="Bass">Bass</option>
            <option value="Drums">Drums</option>
            <option value="Vocals">Vocals</option>
            <option value="Production">Production</option>
          </select>

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
