import { useState } from "react";
import "./Settings.css";

export default function SettingsPage() {
  const [instrument, setInstrument] = useState("Guitar");
  const [path, setPath] = useState("Novice");

  const handleSave = async () => {
    try {
      console.log({
        instrument,
        path,
      });

      alert("Settings saved!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

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

        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
        >
          <option value="Novice">Novice</option>
          <option value="Intermediate">
            Intermediate
          </option>
          <option value="Professional">
            Professional
          </option>
        </select>

        <button onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}