import { useEffect, useRef } from "react";

function midiNoteToName(midiNote) {
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
  const noteName = notes[midiNote % 12];
  const octave = Math.floor(midiNote / 12) - 1;
  return `${noteName}${octave}`;
}

export default function MidiDetector({
  onNoteDetected,
  isListening,
  fireOnPress = false,
}) {
  const midiAccessRef = useRef(null);
  const onNoteDetectedRef = useRef(onNoteDetected);
  const lastNoteTimeRef = useRef({});
  const noteStartTimeRef = useRef({});

  // Always keep ref current without triggering re-attachment
  useEffect(() => {
    onNoteDetectedRef.current = onNoteDetected;
  }, [onNoteDetected]);

  useEffect(() => {
    if (!isListening) return;

    const startMidi = async () => {
      try {
        const midi = await navigator.requestMIDIAccess();
        midiAccessRef.current = midi;

        const handleMessage = (event) => {
          // Guard against clock messages and malformed data
          if (!event.data || event.data.length < 3) return;
          const [status, note, velocity] = event.data;
          if (note === undefined || velocity === undefined) return;

          const isNoteOn = status >= 144 && status <= 159 && velocity > 0;
          const isNoteOff =
            (status >= 128 && status <= 143) ||
            (status >= 144 && status <= 159 && velocity === 0);

          if (isNoteOn) {
            const now = Date.now();
            const lastTime = lastNoteTimeRef.current[note] || 0;

            // Ignore if same note fired within 50ms — prevents double triggers
            if (now - lastTime < 50) return;
            lastNoteTimeRef.current[note] = now;

            if (fireOnPress) {
              // Drums: fire immediately on press, no hold required
              const noteName = midiNoteToName(note);
              onNoteDetectedRef.current(noteName, note, velocity);
            } else {
              // Piano/Guitar/Vocals: record when key was pressed
              noteStartTimeRef.current[note] = now;
            }
          }

          if (!fireOnPress && isNoteOff) {
            const pressedAt = noteStartTimeRef.current[note];
            if (!pressedAt) return;

            const heldMs = Date.now() - pressedAt;
            delete noteStartTimeRef.current[note];

            // Only count if held for at least 150ms
            if (heldMs >= 150) {
              const noteName = midiNoteToName(note);
              onNoteDetectedRef.current(noteName, note, velocity);
            }
          }
        };

        midi.inputs.forEach((input) => {
          input.onmidimessage = handleMessage;
        });

        midi.onstatechange = () => {
          midi.inputs.forEach((input) => {
            input.onmidimessage = handleMessage;
          });
        };
      } catch { /* MIDI access unavailable */ }
    };

    startMidi();

    return () => {
      if (midiAccessRef.current) {
        midiAccessRef.current.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [isListening, fireOnPress]);

  return null;
}
