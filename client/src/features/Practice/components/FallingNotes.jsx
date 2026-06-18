import "./FallingNotes.css";

const INSTRUMENT_THEMES = {
  Piano: {
    instruction: "🎹 Play each note on your piano keyboard",
    color: "#6c63ff",
    style: "piano",
  },
  Guitar: {
    instruction: "🎸 Play each open string on your guitar",
    color: "#ff6b6b",
    style: "guitar",
  },
  Vocals: {
    instruction: "🎤 Sing each note and hold for 1 second",
    color: "#00bcd4",
    style: "vocals",
  },
  Drums: {
    instruction: "🥁 Hit on each highlighted beat",
    color: "#f0a500",
    style: "drums",
  },
  Production: {
    instruction: "🎚️ Answer each production question",
    color: "#4caf7d",
    style: "production",
  },
};

const NOTE_LABELS = {
  Piano: (note) => note,
  Guitar: (note) => note.replace(/[0-9]/g, ""),
  Vocals: (note) => note.replace(/[0-9]/g, ""),
  Drums: (note) => note,
};

export default function FallingNotes({
  notes = [],
  currentIndex = 0,
  detectedNote,
  instrument,
}) {
  const theme = INSTRUMENT_THEMES[instrument] || INSTRUMENT_THEMES.Piano;
  const detectedName = detectedNote?.replace(/[0-9]/g, "");
  const getLabel = NOTE_LABELS[instrument] || ((n) => n);

  const renderPianoStyle = () => (
    <div className="piano-keys-track">
      {notes.map((note, i) => {
        const noteName = note.replace(/[0-9]/g, "");
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isDetected = isActive && detectedName === noteName;
        const isSharp = noteName.includes("#");

        return (
          <div
            key={i}
            className={`piano-key ${isSharp ? "black-key" : "white-key"}
                        ${isActive ? "active" : ""}
                        ${isCompleted ? "completed" : ""}
                        ${isDetected ? "detected" : ""}`}
          >
            <span className="key-label">{getLabel(note)}</span>
            {isCompleted && <span className="key-check">✓</span>}
          </div>
        );
      })}
    </div>
  );

  const renderGuitarStyle = () => (
    <div className="guitar-strings-track">
      {notes.map((note, i) => {
        const noteName = note.replace(/[0-9]/g, "");
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isDetected = isActive && detectedName === noteName;

        return (
          <div
            key={i}
            className={`guitar-string-row ${isActive ? "active" : ""}`}
          >
            <div
              className={`string-circle ${isCompleted ? "completed" : ""} ${isDetected ? "detected" : ""}`}
              style={{
                borderColor: theme.color,
                backgroundColor: isCompleted
                  ? "#4caf7d"
                  : isActive
                    ? theme.color
                    : "transparent",
              }}
            >
              {getLabel(note)}
            </div>
            <div
              className="string-line"
              style={{
                backgroundColor: isCompleted
                  ? "#4caf7d"
                  : isActive
                    ? theme.color
                    : "#3b3b6b",
              }}
            />
            {isCompleted && (
              <span style={{ color: "#4caf7d", fontSize: "0.8rem" }}>✓</span>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderVocalsStyle = () => (
    <div className="vocals-track">
      {notes.map((note, i) => {
        const noteName = note.replace(/[0-9]/g, "");
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isDetected = isActive && detectedName === noteName;
        const sizes = { C: 60, D: 65, E: 70, F: 75, G: 80, A: 85, B: 90 };
        const size = sizes[noteName] || 60;

        return (
          <div key={i} className="vocal-bubble-wrapper">
            <div
              className={`vocal-bubble ${isActive ? "active" : ""} ${isDetected ? "detected" : ""} ${isCompleted ? "completed" : ""}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: theme.color,
                backgroundColor: isCompleted
                  ? "#4caf7d"
                  : isActive
                    ? `${theme.color}33`
                    : "transparent",
                boxShadow: isActive ? `0 0 20px ${theme.color}66` : "none",
              }}
            >
              <span className="bubble-note">{getLabel(note)}</span>
            </div>
            {isCompleted && (
              <span style={{ color: "#4caf7d", fontSize: "0.75rem" }}>✓</span>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderDrumsStyle = () => (
    <div className="drums-track">
      {notes.map((beat, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;

        return (
          <div
            key={i}
            className={`drum-pad ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            style={{
              borderColor: isActive ? theme.color : "#3b3b6b",
              backgroundColor: isCompleted
                ? "#4caf7d33"
                : isActive
                  ? `${theme.color}33`
                  : "#1e1e3a",
              boxShadow: isActive ? `0 0 20px ${theme.color}66` : "none",
            }}
          >
            <span className="drum-icon">
              {isCompleted ? "✓" : isActive ? "🥁" : beat}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderTrack = () => {
    switch (instrument) {
      case "Piano":
        return renderPianoStyle();
      case "Guitar":
        return renderGuitarStyle();
      case "Vocals":
        return renderVocalsStyle();
      case "Drums":
        return renderDrumsStyle();
      default:
        return renderPianoStyle();
    }
  };

  return (
    <div className={`falling-notes ${theme.style}`}>
      <p className="instrument-instructin">{theme.instruction}</p>
      {renderTrack()}
      <div
        className="current-note-display"
        style={{ borderColor: `${theme.color}44` }}
      >
        <span className="current-label">
          {instrument === "Vocals"
            ? "Sing:"
            : instrument === "Drums"
              ? "Beat:"
              : "Play:"}
        </span>
        <span className="current-note" style={{ color: theme.color }}>
          {notes[currentIndex]}
        </span>
        {detectedNote && (
          <span className="detected-note">
            Detected:{" "}
            <strong style={{ color: theme.color }}>{detectedNote}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
