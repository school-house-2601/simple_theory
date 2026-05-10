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
    handleSearch("Music Theory for Beginners", setTheoryBasics);
    handleSearch("Vocal warmup and singing techniques", setVocals);
    handleSearch("Music production and DAW tutorials", setProduction);
  }, []);

  useEffect(() => {
    if (queryFromUrl) {
      // When a search comes from the Navbar:
      setCurrentTab("other"); // Switch to the 'Other/Search' tab to show results
      setActiveInstrument(null); // Clear any instrument filters
      handleSearch(queryFromUrl); // Run the actual search
    }
  }, [queryFromUrl]); // The magic happens here: it re-runs whenever the URL updates

  const handleSearch = async (query, setter = setSearchResults) => {
    if (USE_MOCK_DATA) {
      console.log(`Mock Search for: ${query}`);
      setter(MOCK_VIDEOS);
      return;
    }
    try {
      const res = await fetch(`/api/lessons/youtube-search?query=${query}`);
      const data = await res.json();
      if (data.items) {
        setter(data.items);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="browse-container">
      {/* SIDEBAR */}
      <aside className="browse-sidebar">
        <h3>Pick Your Poison</h3>

        <button
          className={activeInstrument === "Piano" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Piano");
            setCurrentTab("browse");
            handleSearch("Piano tutorials");
          }}
        >
          🎹 Piano
        </button>

        <button
          className={activeInstrument === "Guitar" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Guitar");
            setCurrentTab("browse");
            handleSearch("Guitar lessons");
          }}
        >
          🎸 Guitar
        </button>

        <button
          className={activeInstrument === "Drums" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Drums");
            setCurrentTab("browse");
            handleSearch("Drum basics");
          }}
        >
          🥁 Drums
        </button>
        <button
          className={activeInstrument === "Vocals" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Vocals");
            setCurrentTab("browse");
            handleSearch("Vocal lessons", setVocals);
          }}
        >
          🎤 Vocals
        </button>
        <button
          className={activeInstrument === "Production" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Production");
            setCurrentTab("browse");
            handleSearch("DAW production tutorials", setProduction);
          }}
        >
          🎚️ Production
        </button>
        <button
          className={activeInstrument === "Other" ? "active-tab" : ""}
          onClick={() => {
            setActiveInstrument("Other");
            setCurrentTab("other");
          }}
        >
          🔍 Other
        </button>

        <nav className="sidebar-nav">
          <button
            className={currentTab === "saved" ? "active-tab" : ""}
            onClick={() => {
              setCurrentTab("saved");
              setActiveInstrument(null);
            }}
          >
            🔖 Saved Items ({savedVideos.length})
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="browse-content">
        {/* CASE 1: SAVED TAB */}
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
        ) : currentTab === "other" ? (
          /* CASE 2: OTHER / SEARCH TAB */
          <section className="video-section">
            <h2>Explore More</h2>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
              Search for any music tutorial or DAW tip above.
            </p>
            <div className="video-grid">
              {searchResults.map((video) => (
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
          /* CASE 3: DEFAULT BROWSE VIEW (Piano, Guitar, Drums, Vocals, Production) */
          <>
            {/* Always show Theory Fundamentals at the top */}
            <section className="video-section">
              <h2>Theory Fundamentals</h2>
              <div className="video-carousel">
                {Array.isArray(theoryBasics) ? (
                  theoryBasics.map((video) => (
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
                  <p>Loading tutorials...</p>
                )}
              </div>
            </section>

            {/* Show Results for the active category (Instrument, Vocals, or Production) */}
            {searchResults.length > 0 && (
              <section className="video-section">
                <h2>{activeInstrument} Tutorials</h2>
                <div className="video-grid">
                  {searchResults.map((video) => (
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
            )}
          </>
        )}

        {/* MODAL (Remains outside the conditional logic so it can appear over any view) */}
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
                className="close-button"
                onClick={() => setSelectedVideoId(null)}
              >
                ×
              </button>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
