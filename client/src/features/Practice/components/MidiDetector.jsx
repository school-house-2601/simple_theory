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

export default function MidiDetector({ onNoteDetected, isListening }) {
  const midiAccessRef = useRef(null);

  useEffect(() => {
    if (!isListening) return;

    const startMidi = async () => {
      try {
        const midi = await navigator.requestMIDIAccess();
        midiAccessRef.current = midi;

        const handleMessage = (event) => {
          const [status, note, velocity] = event.data;

          if (status === 144 && velocity > 0) {
            const noteName = midiNoteToName(note);
            onNoteDetected(noteName, note, velocity);
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

        console.log("MIDI connected:", midi.inputs.size, "device(s)");
      } catch (err) {
        console.log("MIDI not available:", err);
      }
    };

    startMidi();

    return () => {
      if (midiAccessRef.current) {
        midiAccessRef.current.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [isListening]);

  return null;
}
