import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./VideoPlayer.css";
import { MOCK_VIDEOS } from "../../mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function BrowsePage() {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [flatResults, setFlatResults] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeInstrument, setActiveInstrument] = useState(null);
  const [activeScoreId, setActiveScoreId] = useState(null);
  const [currentTab, setCurrentTab] = useState("browse");
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("search");
  const USE_MOCK_DATA = true;
  const navigate = useNavigate();
  // 1. Initialize cache from localStorage so it survives refreshes
  const [searchCache, setSearchCache] = useState(() => {
    try {
      const savedCache = localStorage.getItem("youtube_cache");
      return savedCache ? JSON.parse(savedCache) : {};
    } catch {
      return {};
    }
  });
  const [flatCache, setFlatCache] = useState(() => {
    const savedFlatCache = localStorage.getItem("flat_io_cache");
    return savedFlatCache ? JSON.parse(savedFlatCache) : {};
  });
  const [savedVideos, setSavedVideos] = useState(() => {
    try {
      const key = user?.id ? `savedLessons_${user.id}` : "savedLessons_guest";
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const key = user?.id ? `savedLessons_${user.id}` : "savedLessons_guest";
    const saved = localStorage.getItem(key);
    setSavedVideos(saved ? JSON.parse(saved) : []);
  }, [user?.id]);

  const [watchTimer, setWatchTimer] = useState(null);
  const [xpAwarded, setXpAwarded] = useState(new Set());

  const toggleSaveVideo = (video) => {
    const key = user?.id ? `savedLessons_${user.id}` : "savedLessons_guest";
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
    localStorage.setItem(key, JSON.stringify(updatedSaved));
  };

  const awardVideoXP = async (videoId) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/progress/video-complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            videoId: videoId,
            xpEarned: 5,
            skillCategory: activeInstrument || "Theory",
          }),
        },
      );
      const data = await res.json();
      console.log("XP response:", data);
    } catch (err) {
      console.error("Failed to award XP", err);
    }
  };

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
    if (xpAwarded.has(videoId)) return;
    const timer = setTimeout(async () => {
      await awardVideoXP(videoId);
      setXpAwarded((prev) => new Set(prev).add(videoId));
    }, 60000);
    setWatchTimer(timer);
  };

  const handleCloseVideo = () => {
    if (watchTimer) {
      clearTimeout(watchTimer);
      setWatchTimer(null);
    }
    setSelectedVideoId(null);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "saved") {
      setCurrentTab("saved");
      setActiveInstrument(null);
    }
  }, [searchParams.get("tab"), searchParams.get("t")]);

  useEffect(() => {
    if (queryFromUrl) {
      setCurrentTab("other");
      setActiveInstrument(null);
      handleSearch(queryFromUrl);
    }
  }, [queryFromUrl]);

  useEffect(() => {
    if (!queryFromUrl && !activeInstrument) {
      setActiveInstrument("Theory");
      handleSearch("Music Theory for Beginners");
    }
  }, [queryFromUrl, activeInstrument]);

  const handleSearch = async (query) => {
    if (searchCache[query]) {
      setSearchResults(searchCache[query]);
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/lessons/youtube-search?query=${query}`,
        );
        if (!res.ok) throw new Error(`YouTube API Error: ${res.status}`);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const newCache = { ...searchCache, [query]: data.items };
          setSearchCache(newCache);
          localStorage.setItem("youtube_cache", JSON.stringify(newCache));
          setSearchResults(data.items);
        } else {
          setSearchResults(MOCK_VIDEOS);
        }
      } catch (err) {
        console.error("YouTube Error. Using mock data.", err);
        setSearchResults(MOCK_VIDEOS);
      }
    }

    if (flatCache[query]) {
      console.log(flatCache);
      setFlatResults(flatCache[query]);
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/lessons/flat-search?query=${query}`,
        );
        if (!res.ok) throw new Error(`Flat.io API Error: ${res.status}`);
        const data = await res.json();
        const sheets = Array.isArray(data) ? data : data.results || [];
        const newFlatCache = { ...flatCache, [query]: sheets };
        setFlatCache(newFlatCache);
        localStorage.setItem("flat_io_cache", JSON.stringify(newFlatCache));
        setFlatResults(sheets);
      } catch (err) {
        console.error("Flat.io layout fetch failed.", err);
        setFlatResults([]);
      }
    }
  };

  return (
    <div className="browse-container">
      <main className="browse-content">
        <header className="browse-header">
          <h1>Browse Video Knowledge</h1>
          <p>Aggregated tutorials and theory from across the web.</p>
        </header>
        <div className="filter-bar">
          <nav className="category-pills">
            <button
              className={activeInstrument === "Theory" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Theory");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("Music Theory for Beginners");
              }}
            >
              {" "}
              🎼 Theory{" "}
            </button>
            <button
              className={activeInstrument === "Piano" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Piano");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("Piano tutorials");
              }}
            >
              {" "}
              🎹 Piano{" "}
            </button>
            <button
              className={activeInstrument === "Guitar" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Guitar");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("Guitar lessons");
              }}
            >
              {" "}
              🎸 Guitar{" "}
            </button>
            <button
              className={activeInstrument === "Drums" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Drums");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("Drum basics");
              }}
            >
              {" "}
              🥁 Drums{" "}
            </button>
            <button
              className={activeInstrument === "Vocals" ? "pill active" : "pill"}
              onClick={() => {
                setActiveInstrument("Vocals");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("Vocal lessons");
              }}
            >
              {" "}
              🎤 Vocals{" "}
            </button>
            <button
              className={
                activeInstrument === "Production" ? "pill active" : "pill"
              }
              onClick={() => {
                setActiveInstrument("Production");
                setCurrentTab("browse");
                navigate("/browse", { replace: true });
                handleSearch("DAW production tutorials");
              }}
            >
              {" "}
              🎚️ Production{" "}
            </button>
            <button
              className={currentTab === "saved" ? "pill active" : "pill"}
              onClick={() => {
                setCurrentTab("saved");
                setActiveInstrument(null);
              }}
            >
              {" "}
              🔖 Saved ({savedVideos.length}){" "}
            </button>
          </nav>
        </div>

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
                      onSelect={handleVideoSelect}
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
            <>
              <section className="video-section">
                <h2>{activeInstrument || "Explore"} Video Tutorials</h2>
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

              {flatResults.length > 0 && (
                <section
                  className="video-section"
                  style={{ marginBottom: "40px" }}
                >
                  <h2>Interactive Sheet Music</h2>
                  <div className="video-grid">
                    {flatResults.slice(0, 4).map((sheet) => (
                      <SheetMusicCard
                        key={sheet.id}
                        sheet={sheet}
                        onSelectScore={setActiveScoreId}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* YOUTUBE MODAL */}
        {selectedVideoId && (
          <div
            className="video-modal-overlay"
            onClick={() => handleCloseVideo()}
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => handleCloseVideo()}
              >
                {" "}
                &times;{" "}
              </button>
              <div className="video-responsive">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* FLAT.IO SHEET MUSIC MODAL */}
        {activeScoreId && (
          <ModalWrapper
            activeScoreId={activeScoreId}
            setActiveScoreId={setActiveScoreId}
          />
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
        {" "}
        {isSaved ? "★" : "☆"}{" "}
      </button>
    </div>
  );
}

function SheetMusicCard({ sheet, onSelectScore }) {
  return (
    <div
      className="video-card sheet-card"
      onClick={() => onSelectScore(sheet.id)}
      style={{ cursor: "pointer", borderLeft: "4px solid #0052cc" }}
    >
      <div className="video-info" style={{ padding: "20px 15px" }}>
        <span
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            color: "#6b778c",
            fontWeight: "bold",
          }}
        >
          🎼 Flat.io Score
        </span>
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>{sheet.title}</h4>
        <p>By {sheet.author || "Community Contributor"}</p>
        <p style={{ fontSize: "12px", color: "#0052cc", marginTop: "10px" }}>
          Click to open music notation here →
        </p>
      </div>
    </div>
  );
}
function ModalWrapper({ activeScoreId, setActiveScoreId }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activeScoreId]);

  return (
    <div className="video-modal-overlay" onClick={() => setActiveScoreId(null)}>
      <div
        className="video-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <button className="close-modal" onClick={() => setActiveScoreId(null)}>
          &times;
        </button>
        <div className="video-responsive" style={{ paddingTop: "65%" }}>
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://flat.io/embed/${activeScoreId}?layout=responsive`}
            title="Flat.io sheet music player"
            frameBorder="0"
            allow="autoplay; midi"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
