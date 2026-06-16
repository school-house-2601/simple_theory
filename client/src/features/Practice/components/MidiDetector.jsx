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
  const onNoteDetectedRef = useRef(onNoteDetected);

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
          const [status, note, velocity] = event.data;
          // Cover note on messages across all 16 MIDI channels (144-159)
          const isNoteOn = status >= 144 && status <= 159 && velocity > 0;
          if (isNoteOn) {
            const noteName = midiNoteToName(note);
            onNoteDetectedRef.current(noteName, note, velocity);
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
  }, [isListening]); // only re-attach when isListening changes

  return null;
}
