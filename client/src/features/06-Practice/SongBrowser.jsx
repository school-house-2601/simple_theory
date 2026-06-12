import { useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import "./SongBrowser.css";

const BUILT_IN_SONGS = [
    {
        id: "Ode-to-joy",
        title: "Ode to Joy",
        artist: "Beethoven",
        instrument: ["Piano", "Vocals"],
        difficulty: "Novice",
        xmlUrl: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/test/data/MuzikaFestivale2011_Schmid.xml",
    },
    {
        id: "twinkle",
        title: "Twinkle Twinkle Little Star",
        artist: "Traditional",
        instrument: ["Piano", "Vocals", "Guitar"],
        difficulty: "Novice",
        xmlUrl: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/test/data/Haydn_Menuet.xml",
    },
    {
        id: "happy-birthday",
        title: "Happy Birthday",
        artist: "Traditional",
        instrument: ["Piano", "Vocals", "Guitar"],
        difficulty: "Novice",
        xmlUrl: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/test/data/ActorPreludeSample.xml",
    },
];

const DIFFICULTY_COLORS = {
    Novice: "#4caf7d",
    Intermediate: "#f0a500",
    Professional: "#6c63ff",
};

export default function SongBrowser({ instrument, onSelectSong }) {
    const { user } = useAuth();
    const [activeTab, setActoveTab] = useState("library");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const filteredSongs = BUILT_IN_SONGS.filter(
        (song) => song.instrument.include(instrument)
    );

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch (
                `/api/musescore/search?query=${encodeURIComponent(query)}&instrument=${instrument}`,
            );
            const text = await res.text();
            console.log("Raw Flat.io response:", text);
            console.log("Status:", res.status);

            if (!res.ok) {
                const err = await res.json();
                setError("Session expired. Please reconect Flat.io.");
                setFlatToken(null);
                localStorage.removeItem(`flat_token_${user?.id}`);
                return;
            }

            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to search songs. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!flatToken) {
        return (
            <div className="flat-connect">
                <div className="flat-connect-icon">🎵</div>
                <h3>Connect Flat.io to search songs</h3>
                <p>Flat.io has thousands of songs for every instrument and skill level.</p>
                <button className="connect-flat-btn" onClick={handleConnectFlat}>
                    Connect Flat.io Account
                </button>
            </div>
        );
    }

    return (
        <div className="song-browser">
            <div className="song-browser-header">
                <h3>🎵 Choose a Song</h3>
                <p>Search for songs to play along with on your {instrument}</p>
                <button
                    className="disconnect-btn"
                    onClick={() => {
                    localStorage.removeItem(`flat_token_${user?.id}`);
                    setFlatToken(null);
                    }}
                >
                    Disconnect Flat.io
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder={`Search ${instrument} songs...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="search-error">{error}</p>}

            <div className="song-results">
                {results.length === 0 && !loading && (
                    <p className="no-results">Search for a song to get started</p>
                )}
                {results.map((song) => (
                    <div key={song.id} className="song-card" onClick={() => onSelectSong(song)}>
                        <div className="song-card-info">
                            <h4>{song.title}</h4>
                            <p>{song.user?.name || "Unknown Artist"}</p>
                            <div className="song-tags">
                                {song.instruments?.map((inst, i) => (
                                    <span key={i} className="song-tag">{inst}</span>
                                ))}
                            </div>
                        </div>
                        <button className="select-song-btn">Play Along →</button>
                    </div>
                ))}
            </div>
        </div>
    );
}