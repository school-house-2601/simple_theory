import { useEffect, useRef } from "react";
import aubio from "aubiojs";

const INSTRUMENT_RANGES = {
  Piano: { min: 27, max: 4186 },
  Guitar: { min: 82, max: 1175 },
  Vocals: { min: 85, max: 1100 },
  Drums: { min: 0, max: 0 },
  Production: { min: 0, max: 0 },
};

function frequencyToNote(frequency) {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const A4 = 440;
  const semitones = Math.round(12 * Math.log2(frequency / A4));
  const noteIndex = ((semitones % 12) + 12) % 12;
  const octave = Math.floor((semitones + 9) / 12) + 4;
  return `${notes[noteIndex]}${octave}`;
}

export default function NoteDetector({
  onNoteDetected,
  isListening,
  instrument = "Piano",
}) {
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const isClosedRef = useRef(false);
  const pitchDetectorRef = useRef(null);
  const onNoteDetectedRef = useRef(onNoteDetected);

  // Always keep ref current without triggering re-attachment
  useEffect(() => {
    onNoteDetectedRef.current = onNoteDetected;
  }, [onNoteDetected]);

  useEffect(() => {
    isClosedRef.current = false;

    if (!isListening) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current && !isClosedRef.current) {
        isClosedRef.current = true;
        audioContextRef.current.close().catch(() => {});
      }
      return;
    }

    const range = INSTRUMENT_RANGES[instrument] || { min: 60, max: 2000 };
    const bufferSize = 4096;
    const hopSize = 512;

    const startListening = async () => {
      try {
        const { Pitch } = await aubio();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        streamRef.current = stream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        isClosedRef.current = false;

        const pitchDetector = new Pitch(
          "yin",
          bufferSize,
          hopSize,
          audioContext.sampleRate
        );
        pitchDetector.setTolerance(0.8);
        pitchDetectorRef.current = pitchDetector;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = bufferSize;
        analyser.smoothingTimeConstant = 0.8;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const buffer = new Float32Array(bufferSize);
        let lastNote = null;
        let noteCount = 0;

        const detect = () => {
          if (isClosedRef.current) return;

          analyser.getFloatTimeDomainData(buffer);

          let rms = 0;
          for (let i = 0; i < buffer.length; i++) {
            rms += buffer[i] * buffer[i];
          }
          rms = Math.sqrt(rms / buffer.length);

          if (rms > 0.03) {
            const frequencyRaw = pitchDetector.do(buffer);

            if (frequencyRaw > 0) {
              const candidates = [
                frequencyRaw,
                frequencyRaw / 2,
                frequencyRaw / 3,
                frequencyRaw / 4,
              ].filter((f) => f >= range.min && f <= range.max);

              if (candidates.length > 0) {
                const frequency = Math.min(...candidates);
                const note = frequencyToNote(frequency);

                if (note === lastNote) {
                  noteCount += 1;
                  if (noteCount === 5) {
                    onNoteDetectedRef.current(note, frequency);
                    noteCount = 0;
                  }
                } else {
                  lastNote = note;
                  noteCount = 1;
                }
              }
            }
          } else {
            lastNote = null;
            noteCount = 0;
          }

          animFrameRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error("Audio detection error:", err);
      }
    };

    startListening();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current && !isClosedRef.current) {
        isClosedRef.current = true;
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isListening, instrument]);

  return null;
}
