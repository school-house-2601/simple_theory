import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./VideoPlayer.css";
import { MOCK_VIDEOS } from "../../mockData";

export default function BrowsePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [theoryBasics, setTheoryBasics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeInstrument, setActiveInstrument] = useState(null);
  const [currentTab, setCurrentTab] = useState("browse");
  const [vocals, setVocals] = useState([]);
  const [production, setProduction] = useState([]);
  const [otherResults, setOtherResults] = useState([]);
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("search");
  const USE_MOCK_DATA = true;

  const [savedVideos, setSavedVideos] = useState(() => {
    const saved = localStorage.getItem("savedLessons");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveVideo = (video) => {
    let updatedSaved;
    const isAlreadySaved = savedVideos.some(
      (v) => v.id.videoId === video.id.videoId,
    );
    if (isAlreadySaved) {
      updatedSaved = savedVideos.filter(
        (v) => v.id.videoId !== video.id.videoId,
      );
    } else {
      updatedSaved = [...savedVideos, video];
    }
    setSavedVideos(updatedSaved);
    localStorage.setItem("savedLessons", JSON.stringify(updatedSaved));
  };

  useEffect(() => {
    if (queryFromUrl) {
      // When a search comes from the Navbar:
      setCurrentTab("other"); // Switch to the 'Other/Search' tab to show results
      setActiveInstrument(null); // Clear any instrument filters
      handleSearch(queryFromUrl); // Run the actual search
    }
  }, [queryFromUrl]); // The magic happens here: it re-runs whenever the URL updates

  const handleSearch = async (query, setter = setSearchResults) => {
    try {
      const res = await fetch(`/api/lessons/youtube-search?query=${query}`);

      // Check if the response is okay
      if (!res.ok) {
        // If the server returns 403 (Quota Exceeded) or 429 (Too Many Requests)
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setter(data.items);
      } else {
        // If the API returns empty results, you might still want mock data
        console.warn("No results from API, falling back to mock data.");
        setter(MOCK_VIDEOS);
      }
    } catch (err) {
      console.error(
        "Search API failed or quota exceeded. Using mock data.",
        err,
      );
      // FALLBACK: This is where the magic happens
      setter(MOCK_VIDEOS);
    }
  };

  return (
    <div className="browse-container">
      {/* MAIN CONTENT AREA */}
      <main className="browse-content">
        {/* CATEGORY PILL NAVIGATION */}
        <nav className="category-pills">
          <button
            className={activeInstrument === "Theory" ? "pill active" : "pill"}
            onClick={() => {
              setActiveInstrument("Theory");
              setCurrentTab("theory");
              handleSearch("Music Theory for Beginners", setTheoryBasics);
            }}
          >
            🎼 Theory
          </button>

          <button
            className={activeInstrument === "Piano" ? "pill active" : "pill"}
            onClick={() => {
              setActiveInstrument("Piano");
              setCurrentTab("browse");
              handleSearch("Piano tutorials");
            }}
          >
            🎹 Piano
          </button>

          <button
            className={activeInstrument === "Guitar" ? "pill active" : "pill"}
            onClick={() => {
              setActiveInstrument("Guitar");
              setCurrentTab("browse");
              handleSearch("Guitar lessons");
            }}
          >
            🎸 Guitar
          </button>

          <button
            className={activeInstrument === "Drums" ? "pill active" : "pill"}
            onClick={() => {
              setActiveInstrument("Drums");
              setCurrentTab("browse");
              handleSearch("Drum basics");
            }}
          >
            🥁 Drums
          </button>

          <button
            className={activeInstrument === "Vocals" ? "pill active" : "pill"}
            onClick={() => {
              setActiveInstrument("Vocals");
              setCurrentTab("browse");
              handleSearch("Vocal lessons");
            }}
          >
            🎤 Vocals
          </button>

          <button
            className={
              activeInstrument === "Production" ? "pill active" : "pill"
            }
            onClick={() => {
              setActiveInstrument("Production");
              setCurrentTab("browse");
              handleSearch("DAW production tutorials");
            }}
          >
            🎚️ Production
          </button>

          <button
            className={currentTab === "saved" ? "pill active" : "pill"}
            onClick={() => {
              setCurrentTab("saved");
              setActiveInstrument(null);
            }}
          >
            🔖 Saved ({savedVideos.length})
          </button>
        </nav>

        {/* VIDEO GRID SECTION */}
        <div className="results-container">
          {currentTab === "saved" ? (
            <section className="video-section">
              <h2>Your Saved Videos</h2>
              <div className="video-grid">
                {savedVideos.length > 0 ? (
                  savedVideos.map((video) => (
                    <VideoCard
                      key={video.id.videoId}
                      video={video}
                      onSelect={setSelectedVideoId}
                      onSave={toggleSaveVideo}
                      isSaved={true}
                    />
                  ))
                ) : (
                  <p>You haven't saved any...yet.</p>
                )}
              </div>
            </section>
          ) : currentTab === "theory" ? (
            <section className="video-section">
              <h2>Theory Fundamentals</h2>
              <div className="video-grid">
                {theoryBasics.map((video) => (
                  <VideoCard
                    key={video.id.videoId}
                    video={video}
                    onSelect={setSelectedVideoId}
                    onSave={toggleSaveVideo}
                    isSaved={savedVideos.some(
                      (v) => v.id.videoId === video.id.videoId,
                    )}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="video-section">
              <h2>{activeInstrument || "Explore"} Tutorials</h2>
              <div className="video-grid">
                {searchResults.length > 0 ? (
                  searchResults.map((video) => (
                    <VideoCard
                      key={video.id.videoId}
                      video={video}
                      onSelect={setSelectedVideoId}
                      onSave={toggleSaveVideo}
                      isSaved={savedVideos.some(
                        (v) => v.id.videoId === video.id.videoId,
                      )}
                    />
                  ))
                ) : (
                  <p>Select a category to start learning.</p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* MODAL (unchanged) */}
        {selectedVideoId && (
          <div
            className="video-modal-overlay"
            onClick={() => setSelectedVideoId(null)}
          >
            {/* ... Modal Content ... */}
          </div>
        )}
      </main>
    </div>
  );
}

function VideoCard({ video, onSelect, onSave, isSaved }) {
  const videoId = video.id.videoId;

  const decodeHTML = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  return (
    <div
      className="video-card"
      onClick={() => onSelect(videoId)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
      />
      <div className="video-info">
        <h4>{decodeHTML(video.snippet.title)}</h4>
        <p>{video.snippet.channelTitle}</p>
      </div>
      <button
        className={`save-btn ${isSaved ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onSave(video);
        }}
      >
        {isSaved ? "★" : "☆"}
      </button>
    </div>
  );
}
