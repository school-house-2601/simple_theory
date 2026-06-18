import { useState } from "react";
import "./SongBrowser.css";

const BUILT_IN_SONGS = [
  // ===== PIANO =====
  {
    id: "piano-ode-to-joy",
    title: "Ode to Joy",
    artist: "Beethoven",
    instrument: ["Piano"],
    difficulty: "Novice",
    abc: `X:1
T:Ode to Joy
C:Beethoven
M:4/4
L:1/4
Q:1/4=100
K:C clef=treble
E E F G|G F E D|C C D E|E3/2 D/ D2|
E E F G|G F E D|C C D E|D3/2 C/ C2|`,
  },
  {
    id: "piano-twinkle",
    title: "Twinkle Twinkle",
    artist: "Traditional",
    instrument: ["Piano"],
    difficulty: "Novice",
    abc: `X:1
T:Twinkle Twinkle Little Star
M:4/4
L:1/4
Q:1/4=100
K:C clef=treble
C C G G|A A G2|F F E E|D D C2|
G G F F|E E D2|G G F F|E E D2|
C C G G|A A G2|F F E E|D D C2|`,
  },
  {
    id: "piano-mary",
    title: "Mary Had a Little Lamb",
    artist: "Traditional",
    instrument: ["Piano"],
    difficulty: "Novice",
    abc: `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
Q:1/4=100
K:C
E D C D|E E E2|D D D2|E G G2|
E D C D|E E E E|D D E D|C4|`,
  },
  {
    id: "piano-fur-elise",
    title: "Für Elise (Opening)",
    artist: "Beethoven",
    instrument: ["Piano"],
    difficulty: "Intermediate",
    abc: `X:1
T:Fur Elise
C:Beethoven
M:3/8
L:1/16
Q:1/4=60
K:Am
e^d e^d e B d c A2|C E A B2 E ^G B c2|
e^d e^d e B d c A2|C E A B2 E c B A2|`,
  },

  // ===== GUITAR =====
  {
    id: "guitar-smoke",
    title: "Smoke on the Water (Riff)",
    artist: "Deep Purple",
    instrument: ["Guitar"],
    difficulty: "Novice",
    abc: `X:1
T:Smoke on the Water
C:Deep Purple
M:4/4
L:1/4
Q:1/4=112
K:G
%%MIDI program 25
G, B, c B,|G, B, ^c B,|G, B, c ^d c|z4|
G, B, c B,|G, B, ^c B,|G, B, c B,|G,4|`,
  },
  {
    id: "guitar-seven-nation",
    title: "Seven Nation Army (Riff)",
    artist: "The White Stripes",
    instrument: ["Guitar"],
    difficulty: "Novice",
    abc: `X:1
T:Seven Nation Army
C:The White Stripes
M:4/4
L:1/8
Q:1/4=120
K:A
%%MIDI program 25
E4 E2 G2|E4 D4|C4 z4|B,,4 z4|`,
  },
  {
    id: "guitar-house",
    title: "House of the Rising Sun",
    artist: "Traditional",
    instrument: ["Guitar"],
    difficulty: "Intermediate",
    abc: `X:1
T:House of the Rising Sun
M:6/8
L:1/8
Q:3/8=69
K:Am
%%MIDI program 25
A, C E A CE|A, C E A2 B|A, C E G CE|E3 D3|
A, C F A CF|A, C F A2 B|A, C E G CE|A,3 z3|`,
  },

  // ===== VOCALS =====
  {
    id: "vocals-happy-birthday",
    title: "Happy Birthday",
    artist: "Traditional",
    instrument: ["Vocals"],
    difficulty: "Novice",
    abc: `X:1
T:Happy Birthday
M:3/4
L:1/4
Q:1/4=100
K:C
w: Hap-py birth-day to you
G/2G/2 A G|c B2|
w: Hap-py birth-day to you
G/2G/2 A G|d c2|
w: Hap-py birth-day dear friend
G/2G/2 g e|c B A|
w: Hap-py birth-day to you
f/2f/2 e c|d c2|`,
  },
  {
    id: "vocals-twinkle",
    title: "Twinkle Twinkle Little Star",
    artist: "Traditional",
    instrument: ["Vocals"],
    difficulty: "Novice",
    abc: `X:1
T:Twinkle Twinkle Little Star
M:4/4
L:1/4
Q:1/4=90
K:C
w: Twin-kle twin-kle lit-tle star
C C G G|A A G2|
w: How I won-der what you are
F F E E|D D C2|
w: Up a-bove the world so high
G G F F|E E D2|
w: Like a dia-mond in the sky
G G F F|E E D2|
w: Twin-kle twin-kle lit-tle star
C C G G|A A G2|
w: How I won-der what you are
F F E E|D D C2|`,
  },
  {
    id: "vocals-jingle-bells",
    title: "Jingle Bells",
    artist: "Traditional",
    instrument: ["Vocals"],
    difficulty: "Novice",
    abc: `X:1
T:Jingle Bells
M:4/4
L:1/4
Q:1/4=120
K:C
w: Jin-gle bells jin-gle bells
E E E2|
w: Jin-gle all the way
E E E2|
w: Oh what fun it is to ride
E G C D|E4|
w: In a one horse o-pen sleigh
F F F F|F E E E|E D D E|D2 G2|`,
  },

  // ===== DRUMS =====
  {
    id: "drums-basic-beat",
    title: "Basic Rock Beat",
    artist: "Drumming 101",
    instrument: ["Drums"],
    difficulty: "Novice",
    abc: `X:1
T:Basic Rock Beat
M:4/4
L:1/8
Q:1/4=90
K:C perc
%%MIDI program 0
%%MIDI drummap C 36
%%MIDI drummap E 38
%%MIDI drummap G 42
[CG][EG][CG][EG]|[CG][EG][CG][EG]|
[CG][EG][CG][EG]|[CG][EG][CG][EG]|`,
  },
  {
    id: "drums-four-four",
    title: "4/4 Kick Snare Pattern",
    artist: "Drumming 101",
    instrument: ["Drums"],
    difficulty: "Novice",
    abc: `X:1
T:4/4 Kick and Snare
M:4/4
L:1/4
Q:1/4=80
K:C perc
C E C E|C E C E|C E C E|C E C E|`,
  },

  // ===== PRODUCTION =====
  {
    id: "prod-c-major",
    title: "C Major Chord Progression",
    artist: "Music Theory",
    instrument: ["Production"],
    difficulty: "Novice",
    abc: `X:1
T:C Major Chord Progression I-IV-V-I
M:4/4
L:1/4
Q:1/4=80
K:C
[CEG]2 [CEG]2|[FAc]2 [FAc]2|[GBd]2 [GBd]2|[CEG]4|`,
  },
  {
    id: "prod-12-bar",
    title: "12 Bar Blues",
    artist: "Music Theory",
    instrument: ["Production"],
    difficulty: "Intermediate",
    abc: `X:1
T:12 Bar Blues in A
M:4/4
L:1/4
Q:1/4=120
K:A
A,2 A,2|A,2 A,2|A,2 A,2|A,2 A,2|
D2 D2|D2 D2|A,2 A,2|A,2 A,2|
E2 D2|A,2 A,2|A,2 E2|A,4|`,
  },
];

const DIFFICULTY_COLORS = {
  Novice: "#4caf7d",
  Intermediate: "#f0a500",
  Professional: "#6c63ff",
};

export default function SongBrowser({ instrument, onSelectSong }) {
  const [activeTab, setActiveTab] = useState("library");
  const [error, setError] = useState(null);

  const filteredSongs = BUILT_IN_SONGS.filter((song) =>
    song.instrument.includes(instrument)
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".abc") && !file.name.endsWith(".txt")) {
      setError("Please upload an ABC notation file (.abc or .txt)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onSelectSong({
        id: file.name,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Your Upload",
        abc: event.target.result,
        difficulty: "Unknown",
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="song-browser">
      <div className="song-browser-header">
        <h3>🎵 Choose a Song</h3>
        <p>Search for songs to play along with on your {instrument}</p>
      </div>

      <div className="browser-tabs">
        <button
          className={`browser-tab ${activeTab === "library" ? "active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          📚 Library
        </button>
        <button
          className={`browser-tab ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          📤 Upload
        </button>
      </div>

      {activeTab === "library" && (
        <div className="song-results">
          {filteredSongs.length === 0 ? (
            <p className="no-results">
              No songs available for {instrument} yet. Try uploading your own!
            </p>
          ) : (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                className="song-card"
                onClick={() => onSelectSong(song)}
              >
                <div className="song-card-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                  <span
                    className="difficulty-badge"
                    style={{
                      backgroundColor:
                        DIFFICULTY_COLORS[song.difficulty] || "#6c63ff",
                    }}
                  >
                    {song.difficulty}
                  </span>
                </div>
                <button className="select-song-btn">Play Along →</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div className="upload-section">
          <div className="upload-box">
            <span className="upload-icon">📄</span>
            <h4>Upload ABC Notation File</h4>
            <p>Supports .abc or .txt format</p>
            <p style={{ fontSize: "0.75rem", color: "#6a6a9a" }}>
              Get free ABC files from{" "}
              <a
                href="https://abcnotation.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#6c63ff" }}
              >
                abcnotation.com
              </a>
            </p>
            <label className="upload-btn">
              Choose File
              <input
                type="file"
                accept=".abc,.txt"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {error && <p className="search-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
