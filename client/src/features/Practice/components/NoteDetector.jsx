import { useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";

const INSTRUMENT_RANGES = {
    Piano: { min: 27, max: 4186 },
    Guitar: { min: 82, max: 1175 },
    Vocal: { min: 85, max: 1100},
    Drums: { min: 0, max: 0},
    Production: { min: 0, max: 0},
};

function frequencyToNote(frequency) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const A4 = 440;
    const semitones = Math.round(12 * Math.log2(frequency / A4));
    const noteIndex = ((semitones % 12) + 12) % 12;
    const octave = Math.floor((semitones + 9) / 12) + 4;
    return `${notes[noteIndex]}${octave}`;
}

export default function NoteDetector({ onNoteDetected, isListening, instrument = "Guitar" }) {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);
    const isClosedRef = useRef(false);

    function frequencyToNote(frequency) {
        const notes =["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const A4 = 440;
        const semitones = Math.round(12 * Math.log2(frequency / A4));
        const noteIndex = ((semitones % 12) + 12) % 12;
        const octave = Math.floor((semitones + 9) / 12) + 4;
        return `${notes[noteIndex]}${octave}`;
    }

    useEffect(() => {
        isClosedRef.current = false;

        if (!isListening) {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
            if (audioContextRef.current && !isClosedRef.current) {
                isClosedRef.current = true;
                audioContextRef.current.close();
            }
            return;
        }

        const range = INSTRUMENT_RANGES[instrument] || { min: 60, max: 2000 };

        const startListening = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                    }
                });
                streamRef.current = stream;

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;
                isClosedRef.current = false;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 4096;
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
               
                const detector = PitchDetector.forFloat32Array(analyser.fftSize);
                const buffer = new Float32Array(analyser.fftSize);

                let lastNote = null;
                let noteCount = 0;

                const detect = () => {
                    if (isClosedRef.current) return;
                    analyser.getFloatTimeDomainData(buffer);

                    const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate);

                    if (clarity > 0.92 && frequency >= range.min && frequency <= range.max) {
                        const note = frequencyToNote(frequency);
                        if (note === lastNote) {
                            noteCount++;
                            if (noteCount === 3) {
                                onNoteDetected(note, frequency, clarity);
                            }
                        } else {
                            lastNote = note;
                            noteCount = 1;
                        }
                    }
                    
                    animFrameRef.current = requestAnimationFrame(detect);
                };

                detect();
            } catch (err) {
                console.error("Microphone access denied:", err);
            }
        };

        startListening();

        return () => {
            if(animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if(streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
            if(audioContextRef.current && !isClosedRef.current)  {
                isClosedRef.current = true;
                audioContextRef.current.close();
            }
        };
    }, [isListening]);

    return null;
}