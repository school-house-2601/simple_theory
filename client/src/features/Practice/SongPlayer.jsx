import { useState } from "react";
import NoteDetector from "./components/NoteDetector";
import AccuracyMeter from "./components/AccuracyMeter";
import ResultsModal from "./components/ResultsModal";
import "./SongPlayer.css";

const MODES = [
    { id: "wait", label: "🐢 Wait Mode", desc: "Song waits for correct note" },
    { id: "free", label: "🎵 Free Play", desc: "Play along at your own pace" },
];

const TEMPOS = [0.5, 0.75, 1.0, 1.25];

export default function SongPlayer({ song, instrument }) {
    const [mode, setMode] = useState("wait");
    const [tempo, setTempo] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [detectedNote, setDetectedNote] = useState(null);
    const [accuracy, setAccuracy] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [correctNotes, setCorrectNotes] = useState(0);
    const [totalNotes, setTotalNotes] = useState(0);

    const handleNoteDetected = (note, frequency, clarity) => {
        setDetectedNote(note);
        setTotalNotes((prev) => prev + 1);
    };

    const handleStart = () => {
        setIsPlaying(true);
        setIsListening(true);
        setCorrectNotes(0);
        setTotalNotes(0);
        setDetectedNote(null);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setIsListening(false);
        setShowResults(true);
    };

    const accuracyScore = totalNotes > 0
        ? Math.round((correctNotes / totalNotes) * 100)
        : 0;

    return (
        <div className="song-player">
            <div className="song-info">
                <h2>{song.title}</h2>
                <p>{song.user?.name || "Unknown Artist"}</p>
            </div>

            {!isPlaying && (
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
            )}

            {!isPlaying && (
                <div className="tempo-selector">
                    <span className="tempo-label">Tempo:</span>
                    {TEMPOS.map((t) => (
                        <button
                            key={t}
                            className={`tempo-btn ${tempo === t ? "active" : ""}`}
                            onClick={() => setTempo(t)}
                        >
                            {t === 1.0 ? "Normal" : `${t * 100}%`}
                        </button>
                    ))}
                </div>
            )}

            <div className="score-embed">
                <iframe
                    src={`https://flat.io/embed/${song.id}?jsapi=true&layout=track&zoom=auto&tempoFactor=${tempo}`}
                    width="100%"
                    height="300"
                    title={song.title}
                    allow="midi"
                    style={{ border: "none", borderRadius: "10px" }}
                />
            </div>

            {isListening && (
                <div className="detection-display">
                    <span className="detection-label">Detected:</span>
                    <span className="detection-note">{detectedNote || "-"}</span>
                </div>
            )}

            <AccuracyMeter accuracy={accuracyScore} />

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

            <NoteDetector
                isListening={isListening}
                onNoteDetected={handleNoteDetected}
                instrument={instrument}
            />

            {showResults && (
                <ResultsModal
                    accuracy={accuracyScore}
                    instrument={instrument}
                    skillCategory={instrument}
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