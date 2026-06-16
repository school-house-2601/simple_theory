import { useState, useCallback } from "react";
import NoteDetector from "../components/NoteDetector";
import AccuracyMeter from "../components/AccuracyMeter";
import ResultsModal from "../components/ResultsModal";

const VOCAL_NOTES = ["C4", "E4", "G4", "C5"];

export default function VocalDetector() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [correctNotes, setCorrectNotes] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const accuracyScore =
    totalNotes > 0 ? Math.round((correctNotes / totalNotes) * 100) : 0;

  const handleNoteDetected = useCallback((note) => {
    setDetectedNote(note);

    setCurrentNoteIndex((prevIndex) => {
      const noteName = note.replace(/[0-9]/g, "").replace("#", "");
      const expectedName = VOCAL_NOTES[prevIndex].replace(/[0-9]/g, "");

      setTotalNotes((prev) => prev + 1);

      if (noteName === expectedName) {
        setCorrectNotes((prev) => prev + 1);
        const next = prevIndex + 1;
        if (next >= VOCAL_NOTES.length) {
          setIsListening(false);
          setShowResults(true);
          return prevIndex;
        }
        return next;
      }
      return prevIndex;
    });
  }, []);

  const handleStart = () => {
    setIsListening(true);
    setCurrentNoteIndex(0);
    setCorrectNotes(0);
    setTotalNotes(0);
    setShowResults(false);
    setDetectedNote(null);
  };

  const handleStop = () => {
    setIsListening(false);
    setShowResults(true);
  };

  return (
    <div className="instrument-detector">
      <h2>🎤 Vocals - C Major Arpeggio</h2>
      <p>Sing each note: C E G C. Hold each note for 1 second.</p>

      <div
        className="notes-track"
        style={{ display: "flex", gap: "8px", margin: "16px 0" }}
      >
        {VOCAL_NOTES.map((note, i) => (
          <div
            key={i}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "10px",
              border: "2px solid #00bcd4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                i < currentNoteIndex
                  ? "#4caf7d"
                  : i === currentNoteIndex
                    ? "#00bc44"
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
        Sing: <strong>{VOCAL_NOTES[currentNoteIndex]}</strong> | Detected:{" "}
        <strong>{detectedNote || "-"}</strong>
      </p>

      <AccuracyMeter accuracy={accuracyScore} />

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {!isListening ? (
          <button className="start-btn" onClick={handleStart}>
            🎵 Start
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Microphone pitch detection only — no MIDI needed for vocals */}
      <NoteDetector
        isListening={isListening}
        onNoteDetected={handleNoteDetected}
        instrument="Vocals"
      />

      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument="Vocals"
          skillCategory="Vocals"
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false);
            handleStart();
          }}
        />
      )}
    </div>
  );
}
