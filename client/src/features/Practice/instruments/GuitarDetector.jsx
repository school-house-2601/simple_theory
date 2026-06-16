import { useState, useCallback } from "react";
import NoteDetector from "../components/NoteDetector";
import MidiDetector from "../components/MidiDetector";
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

  const handleNoteDetected = useCallback((note) => {
    setDetectedNote(note);

    setCurrentNoteIndex((prevIndex) => {
      const noteName = note.replace(/[0-9]/g, "").replace("#", "");
      const expectedName = GUITAR_NOTES[prevIndex].replace(/[0-9]/g, "");

      setTotalNotes((prev) => prev + 1);

      if (noteName === expectedName) {
        setCorrectNotes((prev) => prev + 1);
        const next = prevIndex + 1;
        if (next >= GUITAR_NOTES.length) {
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
    if (totalNotes > 0) setShowResults(true);
  };

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
          <button className="start-btn" onClick={handleStart}>
            🎵 Start
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Microphone pitch detection */}
      <NoteDetector
        isListening={isListening}
        onNoteDetected={handleNoteDetected}
        instrument="Guitar"
      />

      {/* MIDI keyboard detection */}
      <MidiDetector
        isListening={isListening}
        onNoteDetected={handleNoteDetected}
      />

      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument="Guitar"
          skillCategory="Guitar"
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
