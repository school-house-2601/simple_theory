import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./VideoPlayer.css";
import { MOCK_VIDEOS } from "../../mockData";

export default function BrowsePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeInstrument, setActiveInstrument] = useState(null);
  const [currentTab, setCurrentTab] = useState("browse");
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("search");
  const USE_MOCK_DATA = true;
  // 1. Initialize cache from localStorage so it survives refreshes
  const [searchCache, setSearchCache] = useState(() => {
    const savedCache = localStorage.getItem("youtube_cache");
    return savedCache ? JSON.parse(savedCache) : {};
  });

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

  useEffect(() => {
    // If there's no search in the URL and no category selected yet, default to Theory
    if (!queryFromUrl && !activeInstrument) {
      setActiveInstrument("Theory");
      handleSearch("Music Theory for Beginners");
    }
  }, [queryFromUrl, activeInstrument]); // Runs once on mount

  const handleSearch = async (query, setter = setSearchResults) => {
    // NEW: Check if we have already searched for this query in this session
    if (searchCache[query]) {
      console.log(`Loading "${query}" from cache. No credits used!`);
      setter(searchCache[query]);
      return; // Stop here so we don't fetch again
    }

    try {
      const res = await fetch(`/api/lessons/youtube-search?query=${query}`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();

      if (data.items && data.items.length > 0) {
        // 3. Update State AND LocalStorage
        const newCache = { ...searchCache, [query]: data.items };
        setSearchCache(newCache);
        localStorage.setItem("youtube_cache", JSON.stringify(newCache));

        setter(data.items);
      } else {
        setter(MOCK_VIDEOS);
      }
    } catch (err) {
      console.error("Quota exceeded. Using mock data.", err);
      setter(MOCK_VIDEOS);
    }
  };

  return (
    <div className="browse-container">
      {/* MAIN CONTENT AREA */}
      <main className="browse-content">
        {/* NEW HEADER SECTION */}
        <header className="browse-header">
          <h1>Browse Video Knowledge</h1>
          <p>Aggregated tutorials and theory from across the web.</p>
        </header>

        {/* WRAP NAV AND SORT IN A FLEX CONTAINER */}
        <div className="filter-bar">
          <nav className="category-pills">
            <button
              className={activeInstrument === "Theory" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Theory");
                setCurrentTab("browse");
                handleSearch("Music Theory for Beginners");
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
        </div>

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

        {/* MODAL */}
        {selectedVideoId && (
          <div
            className="video-modal-overlay"
            onClick={() => setSelectedVideoId(null)}
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setSelectedVideoId(null)}
              >
                &times;
              </button>
              <div className="video-responsive">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://youtube.com/embed/${selectedVideoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
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
