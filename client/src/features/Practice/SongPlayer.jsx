import { useState, useEffect, useRef } from "react";
import abcjs from "abcjs";
import AccuracyMeter from "./components/AccuracyMeter";
import ResultsModal from "./components/ResultsModal";
import SmartDetector from "./components/SmartDetector";
import "./SongPlayer.css";

const TEMPOS = [
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "Normal", value: 1.0 },
  { label: "125%", value: 1.25 },
];

const MODES = [
  { id: "wait", label: "🐢 Wait Mode", desc: "Song waits for correct note" },
  {
    id: "manual",
    label: "👆 Manual Mode",
    desc: "No mic - click Next when ready",
  },
];

// Maps ABC notation pitch values to MIDI note numbers
const DRUM_MIDI_MAP = {
  0: 36, // Kick drum
  2: 38, // Snare drum
  4: 46, // Hi-Hat
  6: 49, // Crash
  8: 51, // Ride
};

export default function SongPlayer({ song, instrument }) {
  const scoreRef = useRef(null);
  const visualObjRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [mode, setMode] = useState("wait");
  const [tempo, setTempo] = useState(1.0);
  const [correctNotes, setCorrectNotes] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [songNotes, setSongNotes] = useState([]);
  const lastAdvanceTimeRef = useRef(0);

  const accuracyScore =
    totalNotes > 0 ? Math.round((correctNotes / totalNotes) * 100) : 0;

  function pitchToNote(pitch) {
    const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
    if (pitch.pitch === undefined) return null;
    const noteIndex = ((pitch.pitch % 7) + 7) % 7;
    const octave = Math.floor(pitch.pitch / 7) + 4;
    return `${noteNames[noteIndex]}${octave}`;
  }

  useEffect(() => {
    if (!scoreRef.current || !song?.abc) return;

    let abcWithTempo = song.abc;
    const tempoMatch = song.abc.match(/Q:.*=(\d+)/);
    if (tempoMatch) {
      const originalBpm = parseInt(tempoMatch[1]);
      const newBpm = Math.round(originalBpm * tempo);
      abcWithTempo = song.abc.replace(/Q:.*$/m, `Q:1/4=${newBpm}`);
    } else {
      const defaultBpm = Math.round(100 * tempo);
      abcWithTempo = song.abc.replace("K:", `Q:1/4=${defaultBpm}\nK:`);
    }

    const visualObj = abcjs.renderAbc(scoreRef.current, abcWithTempo, {
      responsive: "resize",
      add_classes: true,
      clickListener: () => {},
    });

    visualObjRef.current = visualObj;

    if (visualObj && visualObj[0]) {
      const notes = [];
      const seenElements = new Set();
      const lines = visualObj[0].lines || [];

      lines.forEach((line) => {
        line.staff?.forEach((staff) => {
          staff.voices?.forEach((voice) => {
            voice.forEach((item) => {
              if (item.el_type === "note" && item.pitches) {
                if (instrument === "Drums") {
                  // One entry per beat, store pitch for drum type matching
                  if (!seenElements.has(item)) {
                    seenElements.add(item);
                    const firstPitch = item.pitches[0];
                    notes.push({
                      name: "Drum",
                      pitch: firstPitch?.pitch,
                      element: item,
                    });
                  }
                } else {
                  item.pitches.forEach((pitch) => {
                    const noteName = pitchToNote(pitch);
                    if (noteName) notes.push({ name: noteName, element: item });
                  });
                }
              }
            });
          });
        });
      });
      setSongNotes(notes);
    }
  }, [song, tempo, instrument]);

  useEffect(() => {
    document.querySelectorAll(".abcjs-note_selected").forEach((el) => {
      el.classList.remove("abcjs-note_selected");
    });

    const allNotes = document.querySelectorAll(".abcjs-note");
    if (allNotes[currentNoteIndex]) {
      allNotes[currentNoteIndex].classList.add("abcjs-note_selected");
      allNotes[currentNoteIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentNoteIndex]);

  const handleNoteDetected = (noteName, midiNote) => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 200) return;
    lastAdvanceTimeRef.current = now;
    setDetectedNote(noteName);

    // Drums — check correct drum type using MIDI note number
    if (instrument === "Drums") {
      setCurrentNoteIndex((prevIndex) => {
        const expectedNote = songNotes[prevIndex];
        const expectedMidi = DRUM_MIDI_MAP[expectedNote?.pitch];

        // If no mapping found, accept any hit
        const isCorrect =
          expectedMidi === undefined || expectedMidi === midiNote;

        setTotalNotes((prev) => prev + 1);
        if (isCorrect) setCorrectNotes((prev) => prev + 1);

        if (isCorrect) {
          const next = prevIndex + 1;
          if (next >= songNotes.length) {
            setIsPlaying(false);
            setIsListening(false);
            setShowResults(true);
            return prevIndex;
          }
          return next;
        }
        return prevIndex;
      });
      return;
    }

    // All other instruments — match note names
    setCurrentNoteIndex((prevIndex) => {
      const expectedNote = songNotes[prevIndex];
      if (!expectedNote) return prevIndex;

      const detectedName = noteName
        .replace(/[0-9]/g, "")
        .replace("#", "")
        .replace("b", "");
      const expectedName = expectedNote.name
        .replace(/[0-9]/g, "")
        .replace("#", "")
        .replace("b", "");
      const isCorrect = detectedName === expectedName;

      setTotalNotes((prev) => prev + 1);
      if (isCorrect) setCorrectNotes((prev) => prev + 1);

      if (mode === "wait" && isCorrect) {
        const next = prevIndex + 1;
        if (next >= songNotes.length) {
          setIsPlaying(false);
          setIsListening(false);
          setShowResults(true);
          return prevIndex;
        }
        return next;
      }
      return prevIndex;
    });
  };

  const handleNextNote = () => {
    setTotalNotes((prev) => prev + 1);
    const next = currentNoteIndex + 1;
    if (next >= songNotes.length) {
      setIsPlaying(false);
      setShowResults(true);
    } else {
      setCurrentNoteIndex(next);
    }
  };

  const handleStart = () => {
    setIsPlaying(true);
    setIsListening(mode === "wait");
    setCorrectNotes(0);
    setTotalNotes(0);
    setCurrentNoteIndex(0);
    setDetectedNote(null);
  };

  const handleStop = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    setIsListening(false);
    setShowResults(true);
  };

  return (
    <div className="song-player">
      <div className="song-info">
        <h2>{song.title}</h2>
        <p>{song.artist || "Unknown Artist"}</p>
      </div>

      {!isPlaying && (
        <>
          <div className="mode-selector">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`mode-btn ${mode === m.id ? "active" : ""}`}
                onClick={() => setMode(m.id)}
              >
                <span>{m.label}</span>
                <span className="mode-desc">{m.desc}</span>
              </button>
            ))}
          </div>
          <div className="tempo-selector">
            <span className="tempo-label">Tempo:</span>
            {TEMPOS.map((t) => (
              <button
                key={t.value}
                className={`tempo-btn ${tempo === t.value ? "active" : ""}`}
                onClick={() => setTempo(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {isPlaying && mode === "manual" && songNotes.length > 0 && (
        <div
          style={{
            padding: "20px",
            background: "#12122a",
            border: "1px solid #6c63ff",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#a0a0c0", fontSize: "0.85rem", margin: 0 }}>
            Note {currentNoteIndex + 1} of {songNotes.length}
          </p>
          <div
            style={{ fontSize: "3rem", fontWeight: "800", color: "#6c63ff" }}
          >
            {songNotes[currentNoteIndex]?.name}
          </div>
          <p style={{ color: "#a0a0c0", fontSize: "0.9rem", margin: 0 }}>
            Press this note on your instrument when ready
          </p>
          <button
            className="start-btn"
            onClick={handleNextNote}
            style={{ width: "200px" }}
          >
            ✓ Next Note →
          </button>
        </div>
      )}

      {isPlaying && mode === "wait" && songNotes.length > 0 && (
        <div className="note-progress">
          <span>
            Note {currentNoteIndex + 1} of {songNotes.length}
          </span>
          <span style={{ color: "#6c63ff" }}>
            Next: <strong>{songNotes[currentNoteIndex]?.name}</strong>
          </span>
        </div>
      )}

      <div className="score-container">
        <div ref={scoreRef} className="abc-score" />
      </div>

      {isListening && (
        <div className="detection-display">
          <span className="detection-label">Detected:</span>
          <span className="detection-note">{detectedNote || "-"}</span>
        </div>
      )}

      {mode !== "manual" && <AccuracyMeter accuracy={accuracyScore} />}

      <div className="player-controls">
        {!isPlaying ? (
          <button className="start-btn" onClick={handleStart}>
            🎵 Start Playing
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹ Finish Session
          </button>
        )}
      </div>

      {mode === "wait" && (
        <SmartDetector
          isListening={isListening}
          onNoteDetected={handleNoteDetected}
          instrument={instrument}
        />
      )}

      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument={instrument}
          skillCategory={instrument}
          mode={mode}
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
