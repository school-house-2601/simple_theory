import { useState, useCallback } from "react";
import NoteDetector from "../components/NoteDetector";
import AccuracyMeter from "../components/AccuracyMeter";
import ResultsModal from "../components/ResultsModal";
import { useAuth } from "../../Auth/AuthContext";
import FallingNotes from "../components/FallingNotes";

const EXERCISE_NOTES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

export default function PianoDetector() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [correctNotes, setCorrectNotes] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

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
        if (next >= EXERCISE_NOTES.length) {
          setSessionComplete(true);
          setIsListening(false);
          setShowResults(true);
        } else {
          setCurrentNoteIndex(nextIndex);
        }
      }
    },
    [currentNoteIndex]
  );

  const handleStart = () => {
    setIsListening(true);
    setCurrentNoteIndex(0);
    setCorrectNotes(0);
    setTotalNotes(0);
    setSessionComplete(false);
    setDetectedNote(null);
  };

  const handleStop = () => {
    setIsListening(false);
    if (totalNotes > 0) setShowResults(true);
  };

  return (
    <div className="instrument-detector">
      <div className="detector-header">
        <h2>🎹 Piano - C Major Scale</h2>
        <p>Play each note in order. We'll detect what you play in real time.</p>
      </div>

      <FallingNotes
        notes={EXERCISE_NOTES}
        currentIndex={currentNoteIndex}
        detectedNotes={detectedNote}
        instrument="Piano"
      />

      <AccuracyMeter accuracy={accuracyScore} />

      <div className="detector-controls">
        {!isListening ? (
          <button className="start-btn" onClick={handleStart}>
            🎵 Start Practice
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹ stop
          </button>
        )}
      </div>

      <NoteDetector
        isListening={isListening}
        onNoteDetected={handleNoteDetected}
      />

      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument="Piano"
          skillCategory="Piano"
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
