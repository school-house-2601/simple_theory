import { useState, useEffect, useRef } from "react";
import AccuracyMeter from "../components/AccuracyMeter";
import ResultsModal from "../components/ResultsModal";

const BEAT_PATTERN = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,];
const THRESHOLD = 0.15;

export default function DrumDetector() {
    const [isListening, setIsListening] = useState(false);
    const [hits, setHits] = useState(0);
    const [correctHits, setCorrectHits] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [currentBeat, setCurrentBeat] = useState(0);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

    const accuracyScore = hits > 0 ? Math.round((correctHits / hits) * 100) : 0;

    useEffect(() => {
        if (!isListening) {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
            if (audioContextRef.current) audioContextRef.current.close();
            return;
        }

        const startListening = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            const buffer = new Uint8Array(analyser.fftSize);
            let lastHit = 0;

            const detect = () => {
                analyser.getByteTimeDomainData(buffer);
                const max = Math.max(...buffer) / 128 - 1;
                const now = Date.now();

                if (max > THRESHOLD && now - lastHit > 200) {
                    lastHit = now;
                    setHits((prev) => {
                        const beatIndex = prev % BEAT_PATTERN.length;
                        if (BEAT_PATTERN[beatIndex] === 1) {
                            setCorrectHits((c) => c + 1);
                        }
                        setCurrentBeat(beatIndex);
                        return prev + 1;
                    });
                }
                animFrameRef.current = requestAnimationFrame(detect);
            };
            detect();
        };

        startListening();
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [isListening]);

    return (
        <div className="instrument-detector">
            <h2>🥁 Drums - Basic 4/4 Beat</h2>
            <p>Play a kick drum on beats 1, 2, 3, and 4. Keep steady time.</p>
            <div style={{ display: "flex", gap: "8px", margin: "16px 0", flexWrap: "wrap" }}>
                {BEAT_PATTERN.map((beat, i) => (
                    <div key={i} style={{
                        width: "36px", height: "36px", borderRadius: "6px",
                        backgroundColor: beat === 1
                            ? i === currentBeat ? "#ff6b6b" : "#6c63ff"
                            : "#1e1e3a",
                        border: "1px solid #3b3b6b" 
                    }} />
                ))}
            </div>
            <p>Total hits: <strong>{hits}</strong> | Correct: <strong>{correctHits}</strong></p>
            <AccuracyMeter accuracy={accuracyScore} />
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {!isListening
                    ? <button className="start-btn" onClick={() => { setIsListening(true); setHits(0); setCorrectHits(0); setCorrectBeat(0); }}>🎵 Start</button>
                    : <button className="stop-btn" onClick={() => { setIsListening(false); setShowResults(true); }}>⏹ Stop</button>
                }
            </div>
            {showResults && <ResultsModal accuracy={accuracyScore} instrument="Drums" skillCategory="Drums" onClose={() => setShowResults(false)} onRetry={() => { setShowResults(false); setHits(0); setCorrectHits(0); }} />}
        </div>
    );
}