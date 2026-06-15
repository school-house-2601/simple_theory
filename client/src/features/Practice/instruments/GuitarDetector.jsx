import NoteDetector from "../components/NoteDetector";
import { useState, useCallback } from "react";
import AccuracyMeter from "../components/AccuracyMeter";
import ResultsModal from "../components/ResultsModal";

const GUITAR_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"];

export default function GuitarDetector() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [correctNotes, setCorrectNotes] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const accuracyScore =
    totalNotes > 0 ? Math.round((correctNotes / totalNotes) * 100) : 0;

  const handleNoteDetected = useCallback(
    (note) => {
      setDetectedNote(note);
      const noteName = note
        .replace(/[0-9]/g, "")
        .replace("#", "")
        .replace("b", "");
      const expectedName = EXERCISE_NOTES[currentNoteIndex]
        .replace(/[0-9]/g, "")
        .replace("b", "");
      setTotalNotes((prev) => prev + 1);
      if (noteName === expectedName) {
        setCorrectNotes((prev) => prev + 1);
        const next = currentNoteIndex + 1;
        if (next >= GUITAR_NOTES.length) {
          setIsListening(false);
          setShowResults(true);
        } else {
          setCurrentNoteIndex(next);
        }
      }
    },
    [currentNoteIndex]
  );

  return (
    <div className="instrument-detector">
      <h2>🎸 Guitar - Open Strings</h2>
      <p>Play each open string in order: E A D G B E</p>
      <div
        className="notes-track"
        style={{ display: "flex", gap: "8px", margin: "16px 0" }}
      >
        {GUITAR_NOTES.map((note, i) => (
          <div
            key={i}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "10px",
              border: "2px solid #6c63ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                i < currentNoteIndex
                  ? "#4caf7d"
                  : i === currentNoteIndex
                    ? "#6c63ff"
                    : "#1e1e3a",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {note.replace(/[0-9]/g, "")}
          </div>
        ))}
      </div>
      <p>
        Now playing: <strong>{GUITAR_NOTES[currentNoteIndex]}</strong> |
        Detected: <strong>{detectedNote || "-"}</strong>
      </p>
      <AccuracyMeter accuracy={accuracyScore} />
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {!isListening ? (
          <button
            className="start-btn"
            onClick={() => {
              setIsListening(true);
              setCurrentNoteIndex(0);
              setCorrectNotes(0);
              setTotalNotes(0);
            }}
          >
            🎵 Start
          </button>
        ) : (
          <button
            className="stop-btn"
            onClick={() => {
              setIsListening(false);
              setShowResults(true);
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>
      <NoteDetector
        isListening={isListening}
        onNoteDetected={handleNoteDetected}
        instrument="Guitar"
      />
      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument="Guitar"
          skillCategory="Guitar"
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false);
            setIsListening(true);
            setCorrectNotes(0);
            setTotalNotes(0);
          }}
        />
      )}
    </div>
  );
}
