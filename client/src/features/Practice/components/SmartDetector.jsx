import { useState, useEffect } from "react";
import MidiDetector from "./MidiDetector";
import NoteDetector from "./NoteDetector";

export default function SmartDetector({
  onNoteDetected,
  isListening,
  instrument,
}) {
  const [midiStatus, setMidiStatus] = useState("checking");
  const [midiDeviceName, setMidiDeviceName] = useState("");
  const [userProceededWithMic, setUserProceededWithMic] = useState(false);

  useEffect(() => {
    const checkMidi = async () => {
      try {
        const midi = await navigator.requestMIDIAccess();
        const updateStatus = () => {
          if (midi.inputs.size > 0) {
            const firstDevice = midi.inputs.values().next().value;
            setMidiDeviceName(firstDevice?.name || "MIDI Device");
            setMidiStatus("connected");
          } else {
            setMidiStatus("none");
          }
        };
        updateStatus();
        midi.onstatechange = updateStatus;
      } catch {
        setMidiStatus("none");
      }
    };
    checkMidi();
  }, []);

  if (midiStatus === "checking") {
    return (
      <p style={{ color: "#a0a0c0", fontSize: "0.85rem" }}>
        🔍 Checking for MIDI devices...
      </p>
    );
  }

  if (midiStatus === "connected") {
    return (
      <>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#4caf7d",
            padding: "4px 8px",
            background: "#0a2e1a",
            borderRadius: "6px",
            display: "inline-block",
            marginBottom: "8px",
          }}
        >
          🎹 MIDI Connected: {midiDeviceName} — Perfect Detection
        </div>
        <MidiDetector
          isListening={isListening}
          onNoteDetected={onNoteDetected}
          fireOnPress={instrument === "Drums"}
        />
      </>
    );
  }

  if (!userProceededWithMic) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#1a1a00",
          border: "1px solid #f0a500",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <b style={{ color: "#f0a500" }}>⚠️ No MIDI Device Detected</b>
          <p
            style={{
              color: "#a0a0c0",
              fontSize: "0.85rem",
              margin: "8px 0 0 0",
            }}
          >
            {instrument === "Piano"
              ? "For accurate piano detection, connect your keyboard via USB and refresh. Microphone is significantly less accurate for piano."
              : `Microphone detection for ${instrument} is available but may not be 100% accurate. Connect a MIDI device for best results.`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "8px 16px",
              background: "#6c63ff",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
            onClick={() => window.location.reload()}
          >
            🔌 I Connected My Device — Refresh
          </button>
          <button
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #f0a500",
              borderRadius: "8px",
              color: "#f0a500",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
            onClick={() => setUserProceededWithMic(true)}
          >
            🎤 Continue with Microphone
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#f0a500",
          padding: "4px 8px",
          background: "#2e1a00",
          borderRadius: "6px",
          display: "inline-block",
          marginBottom: "8px",
        }}
      >
        ⚠️ Microphone Mode — May not be 100% accurate
      </div>
      <NoteDetector
        isListening={isListening}
        onNoteDetected={onNoteDetected}
        instrument={instrument}
      />
    </>
  );
}
