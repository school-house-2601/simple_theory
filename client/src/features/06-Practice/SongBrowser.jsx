import { useState, useEffect } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import "./SongBrowser.css";

const INSTRUMENT_FILTERS = {
    Piano: "piano",
    Guitar: "guitar",
    Vocals: "voice",
    Drums: "drums",
    Production: "",
};

export default function SongBrowser({ instrument, onSelectSong }) {
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [flatToken, setFlatToken] = useState(null);

    useEffect(() => {
        if (!user) return;
        const stored = localStorage.getItem(`flat_token_${user.id}`);
        if (stored) setFlatToken(stored);
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const hash = new URLSearchParams(window.location.hash.replace("#", ""));
        const token = hash.get("access_token");
        if (token) {
            localStorage.setItem(`flat_token_${user.id}`, token);
            setFlatToken(token);
            window.history.replaceState({}, "", "/practice");
        }
    }, [user]);

    const handleConnectFlat = () => {
        const clientId = import.meta.env.VITE_FLAT_IO_CLIENT_ID;
        const redirectUri = encodeURIComponent(window.location.origin + "/practice");
        const authUrl = `https://flat.io/auth/oauth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=scores.readonly`;
        window.location.href = authUrl;
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        console.log("Searching with token:", flatToken ? "exists" : "missing");
        console.log("Query:", query);
        setLoading(true);
        setError(null);
        try {
            const instrumentFilter = INSTRUMENT_FILTERS[instrument] || "";
            const res = await fetch (
                `/api/flat/search?query=${encodeURIComponent(query)}&instrument=${instrumentFilter}&token=${flatToken}`
            );
            const text = await res.text();
            console.log("Raw response:", text);
            const data = JSON.parse(text);
            console.log("Response status:", res.status);
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