import { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import SongBrowser from "./SongBrowser";
import SongPlayer from "./SongPlayer";
import PianoDetector from "./instruments/PianoDetector";
import GuitarDetector from "./instruments/GuitarDetector";
import VocalDetector from "./instruments/VocalDetector";
import DrumDetector from "./instruments/DrumDetector";
import ProductionQuiz from "./instruments/ProductionQuiz";
import "./PracticePage.css";

const INSTRUMENTS = [
  { id: "Piano", icon: "🎹", label: "Piano" },
  { id: "Guitar", icon: "🎸", label: "Guitar" },
  { id: "Vocals", icon: "🎤", label: "Vocals" },
  { id: "Drums", icon: "🥁", label: "Drums" },
  { id: "Production", icon: "🎚️", label: "Production" },
];

export default function PracticePage() {
  const { user } = useAuth();
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  const handleBack = () => {
    setSelectedSong(null);
  };

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h1>Practice Room</h1>
        <p>
          Select your instrument and start playing. We'll listen and score you
          in real time.
        </p>
      </div>

      <div className="instrument-selector">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            className={`instrument-btn ${selectedInstrument === inst.id ? "active" : ""}`}
            onClick={() => {
              setSelectedInstrument(inst.id);
              setSelectedSong(null);
            }}
          >
            <span className="instrument-icon">{inst.icon}</span>
            <span className="instrument-label">{inst.label}</span>
          </button>
        ))}
      </div>

      {selectedInstrument === "Production" && (
        <div className="detector-container">
          <ProductionQuiz />
        </div>
      )}

      {selectedInstrument &&
        selectedInstrument !== "Production" &&
        !selectedSong && (
          <div className="detector-container">
            <SongBrowser
              instrument={selectedInstrument}
              onSelectSong={handleSelectSong}
            />
          </div>
        )}

      {selectedInstrument &&
        selectedInstrument !== "Production" &&
        selectedSong && (
          <div className="detector-container">
            <button className="back-btn" onClick={handleBack}>
              ← Back to Song List
            </button>
            <SongPlayer song={selectedSong} instrument={selectedInstrument} />
          </div>
        )}
    </div>
  );
}
