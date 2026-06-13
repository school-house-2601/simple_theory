import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useAuth } from "../Auth/AuthContext";
import "./LessonPage.css";

export default function LessonsPage() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeScoreId, setActiveScoreId] = useState(null);
  const [flatUserData, setFlatUserData] = useState(null);

  useEffect(() => {
    if (token) {
      // Only fetch if the user is logged into your platform
      fetch(`${import.meta.env.VITE_API_URL}/lessons/flat-me`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not verify Flat.io account");
          return res.json();
        })
        .then((data) => {
          setFlatUserData(data);
          console.log("Flat.io User connected:", data);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const awardLessonXP = async (lessonId, xpAmount) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/progress/video-complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            videoId: lessonId,
            xpEarned: xpAmount,
            skillCategory: currentPath,
          }),
        },
      );
      const data = await res.json();
      console.log("Lesson XP awarded", data);
    } catch (err) {
      console.error("Failed to award lesson XP", err);
    }
  };

  // Initialize progress from localStorage or your mockData
  const [progressData, setProgressData] = useState(() => {
    const saved = localStorage.getItem("lessonProgress");
    return saved ? JSON.parse(saved) : {};
  });

  const onVideoStateChange = (event, lessonId) => {
    const player = event.target;

    // 1 is the official YouTube code for "PLAYING"
    if (event.data === 1) {
      console.log(`Video started for: ${lessonId}`);

      const interval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        if (duration > 0) {
          const percent = Math.round((currentTime / duration) * 100);
          console.log(`Current Progress: ${percent}%`);

          setProgressData((prev) => {
            const currentVal = prev[lessonId] || 0;
            if (percent > currentVal) {
              const updated = { ...prev, [lessonId]: percent };
              localStorage.setItem("lessonProgress", JSON.stringify(updated));

              if (percent >= 25 && currentVal < 25) awardLessonXP(lessonId, 10);
              if (percent >= 50 && currentVal < 50) awardLessonXP(lessonId, 15);
              if (percent >= 75 && currentVal < 75) awardLessonXP(lessonId, 20);
              if (percent >= 100 && currentVal < 100)
                awardLessonXP(lessonId, 35);

              return updated;
            }
            return prev;
          });
        }
      }, 2000);

      player.progressInterval = interval;
    } else {
      if (player.progressInterval) {
        clearInterval(player.progressInterval);
        console.log("Video paused/stopped, tracking halted.");
      }
    }
  };

  const handleStartLesson = (lesson) => {
    setActiveVideo(lesson);
  };
  const currentPath = location.state?.selectedPath || "Novice";

  const curriculumData = {
    Novice: [
      {
        id: "novice-1",
        title: "Anatomy of the Guitar",
        time: "12m",
        youtubeId: "zpRoq0jcWfQ",
        progress: 0,
      },
      {
        id: "novice-2",
        title: "How to Read Music Notes (Piano)",
        time: "18m",
        youtubeId: "w3QwUaJai8c",
        progress: 0,
      },
      {
        id: "novice-3",
        title: "Your First 3 Chords (G, C, D)",
        time: "22m",
        youtubeId: "zi6CRi0SXLM",
        progress: 0,
      },
      {
        id: "novice-4",
        title: "Learn Drums in 10 Minutes",
        time: "10m",
        youtubeId: "XeVLe4dX9V8",
        progress: 0,
      },
      {
        id: "novice-5",
        title: "Your First Singing Lesson",
        time: "20m",
        youtubeId: "jog-nfLldRI",
        progress: 0,
      },
      {
        id: "novice-6",
        title: "Essential Strumming Patterns",
        time: "18m",
        youtubeId: "hzC0orOGARw",
        progress: 0,
      },
      {
        id: "novice-7",
        title: "Beginner Piano: Proper Seating & Technique",
        time: "15m",
        youtubeId: "jAZtYGUVwPA",
        progress: 0,
      },
      {
        id: "novice-8",
        title: "Music Theory in 15 Minutes",
        time: "15m",
        youtubeId: "ZIcHA2furG0",
        progress: 0,
      },
      {
        id: "novice-9",
        title: "How to Tune Your Guitar",
        time: "10m",
        youtubeId: "LFXMhKbFeoI",
        progress: 0,
      },
      {
        id: "novice-10",
        title: "Vocal Lessons Day 1: Singing for Beginners",
        time: "25m",
        youtubeId: "0Sxs_-MXKFo",
        progress: 0,
      },
    ],
    Intermediate: [
      {
        id: "int-1",
        title: "Logic Pro: Setting Up Your First Session",
        time: "20m",
        youtubeId: "6WPtHxWkY2k",
        progress: 0,
      },
      {
        id: "int-2",
        title: "Ableton Live: Session vs Arrangement View",
        time: "25m",
        youtubeId: "JaSK3Q8vyGA",
        progress: 0,
      },
      {
        id: "int-3",
        title: "FL Studio: Mastering the Piano Roll",
        time: "18m",
        youtubeId: "Wodpb6lABZo",
        progress: 0,
      },
      {
        id: "int-4",
        title: "EQ Explained: The Shortest Tutorial",
        time: "12m",
        youtubeId: "aFN16mfylxw",
        progress: 0,
      },
      {
        id: "int-5",
        title: "Understanding Compression",
        time: "10m",
        youtubeId: "LGqDVhww-hs",
        progress: 0,
      },
      {
        id: "int-6",
        title: "How to Chop Samples in Ableton",
        time: "22m",
        youtubeId: "W-kjTYRQqXQ",
        progress: 0,
      },
      {
        id: "int-7",
        title: "Reverb & Delay: Pro Techniques",
        time: "20m",
        youtubeId: "akwedLwsqR4",
        progress: 0,
      },
      {
        id: "int-8",
        title: "How to EQ Everything",
        time: "45m",
        youtubeId: "jPMO19UIqi4",
        progress: 0,
      },
      {
        id: "int-9",
        title: "Top 3 Creative Reverb & Delay Techniques",
        time: "15m",
        youtubeId: "cAVHiQ5WLco",
        progress: 0,
      },
      {
        id: "int-10",
        title: "Mixing a Hip Hop Beat: EQ & Compression",
        time: "18m",
        youtubeId: "P1HjUJ3Fyrs",
        progress: 0,
      },
    ],
    Professional: [
      {
        id: "pro-1",
        title: "Mastering for Streaming Platforms",
        time: "45m",
        youtubeId: "11F98qR_Ghs",
        progress: 0,
      },
      {
        id: "pro-2",
        title: "Music Licensing & Publishing Law",
        time: "1h 20m",
        youtubeId: "RT2y3IALShA",
        progress: 0,
      },
      {
        id: "pro-3",
        title: "Building a Modern Artist Brand",
        time: "35m",
        youtubeId: "u-NyF6jX4X8",
        progress: 0,
      },
      {
        id: "pro-4",
        title: "How Musicians Get Paid: Publishing & Master Royalties",
        time: "28m",
        youtubeId: "Y_ehUQ9calM",
        progress: 0,
      },
      {
        id: "pro-5",
        title: "The Complete Guide to Music Royalties",
        time: "32m",
        youtubeId: "imbcGjUXhdQ",
        progress: 0,
      },
      {
        id: "pro-6",
        title: "How the Music Business Really Works",
        time: "40m",
        youtubeId: "-FPePnm4Q3c",
        progress: 0,
      },
      {
        id: "pro-7",
        title: "Music Sync Licensing: Get Placed in TV & Film",
        time: "35m",
        youtubeId: "RT2y3IALShA",
        progress: 0,
      },
      {
        id: "pro-8",
        title: "How to Build Your Fanbase Online",
        time: "30m",
        youtubeId: "u-NyF6jX4X8",
        progress: 0,
      },
      {
        id: "pro-9",
        title: "Music Distribution: Spotify & Apple Music",
        time: "22m",
        youtubeId: "EuWYRI_Yc_k",
        progress: 0,
      },
      {
        id: "pro-10",
        title: "Recording Studio Business 101",
        time: "50m",
        youtubeId: "11F98qR_Ghs",
        progress: 0,
      },
    ],
  };

  const resourceData = {
    Novice: [
      {
        title: "Ode to Joy (Tab)",
        type: "Guitar Tab",
        icon: "📄",
        scoreId: "5f37361cf3456860172bec2c",
        link: "https://imra-review-2026.flat.io/embed/5f37361cf3456860172bec2c",
      },
      {
        title: "C Major Scale",
        type: "Guitar Tab",
        icon: "📄",
        scoreId: "67299a11d738101bbf973938",
        link: "https://imra-review-2026.flat.io/embed/67299a11d738101bbf973938",
      },
      {
        title: "Essential Chord Cheat Sheet",
        type: "Notation",
        icon: "📄",
        scoreId: "5a7215d637c62b676aae6be2",
        link: "https://imra-review-2026.flat.io/embed/5a7215d637c62b676aae6be2",
      },
      {
        title: "Twinkle Twinkle Little Star (Piano)",
        type: "Piano",
        icon: "📄",
        scoreId: "66fdeff77c94ef96986a0d51",
        link: "https://flat.io/embed/66fdeff77c94ef96986a0d51",
      },
      {
        title: "Für Elise (Easy Piano)",
        type: "Piano",
        icon: "📄",
        scoreId: "605cb9ca007f81683b4b84f7",
        link: "https://flat.io/embed/605cb9ca007f81683b4b84f7",
      },
      {
        title: "Mary Had a Little Lamb",
        type: "Piano",
        icon: "📄",
        scoreId: "601c50a4289968447fc04148",
        link: "https://flat.io/embed/601c50a4289968447fc04148",
      },
      {
        title: "Hot Cross Buns (Theme & Variations)",
        type: "Piano",
        icon: "📄",
        scoreId: "5a203a4723fb504284eaf2dc",
        link: "https://flat.io/embed/5a203a4723fb504284eaf2dc",
      },
      {
        title: "Jingle Bells (Piano)",
        type: "Piano",
        icon: "📄",
        scoreId: "5fad41dcb7f6ba0918316c61",
        link: "https://flat.io/embed/5fad41dcb7f6ba0918316c61",
      },
      {
        title: "Bink's Sake (Beginner Piano)",
        type: "Piano",
        icon: "📄",
        scoreId: "65c402025453be0d637fb6a8",
        link: "https://flat.io/embed/65c402025453be0d637fb6a8",
      },
      {
        title: "Mary Had a Little Lamb (Flute & Piano)",
        type: "Duet",
        icon: "📄",
        scoreId: "5a1e5674fedb2b54a19269cc",
        link: "https://flat.io/embed/5a1e5674fedb2b54a19269cc",
      },
    ],
    Intermediate: [
      {
        title: "Lofi Hip Hop Template",
        type: "Logic Project",
        icon: "💾",
        thumbnail:
          "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&q=80",
        link: "https://lofiweekly.com/product/lofi-mixing-templates-for-5-daws/",
      },
      {
        title: "Serum Preset Pack v1",
        type: "Samples",
        icon: "📦",
        thumbnail:
          "https://static.wixstatic.com/media/81ef3c_d334e6633046487bb7be21ae0c1f915a~mv2.jpg/v1/fit/w_2500,h_1330,al_c/81ef3c_d334e6633046487bb7be21ae0c1f915a~mv2.jpg",
        link: "https://www.echosoundworks.com/freeserumsounds",
      },
      {
        title: "Vocal Chain Preset",
        type: "Ableton Rack",
        icon: "🎚️",
        thumbnail:
          "https://public-files.gumroad.com/h5ahe1ra5o765al0llf8yr8h9x68",
        link: "https://pushpatterns.gumroad.com/l/vocalchain",
      },
      {
        title: "Free Drum Kit (Cymatics)",
        type: "Samples",
        icon: "🥁",
        thumbnail:
          "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80",
        link: "https://cymatics.fm/pages/free-download-vault",
      },
      {
        title: "Splice Free Samples",
        type: "Sample Library",
        icon: "🎛️",
        thumbnail:
          "https://res.cloudinary.com/splice/image/upload/f_auto,q_auto/v1/app-assets/general/og-image",
        link: "https://splice.com/sounds/royalty-free",
      },
      {
        title: "Ableton Live Manual",
        type: "Reference",
        icon: "📖",
        thumbnail:
          "https://cdn-resources.ableton.com/80bA26cPQ1hEJDFjpUKntxfqdmG3ZykO/static/images/og-images/default.83939b540f40.jpg",
        link: "https://www.ableton.com/en/manual/welcome-to-live/",
      },
      {
        title: "FL Studio Beginner Guide",
        type: "Guide",
        icon: "📝",
        thumbnail:
          "https://www.image-line.com/static/assets/fl-studio-og-image.ace8e42.jpg",
        link: "https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/",
      },
      {
        title: "Free VST Plugins (Bedroom Producers)",
        type: "Plugins",
        icon: "🔌",
        thumbnail:
          "https://bedroomproducersblog.com/wp-content/uploads/2019/06/free-vst-plugins.jpg",
        link: "https://bedroomproducersblog.com/free-vst-plugins/",
      },
      {
        title: "Landr Mastering (Free Trial)",
        type: "Mastering",
        icon: "🎚️",
        thumbnail:
          "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=80",
        link: "https://www.landr.com",
      },
      {
        title: "Royalty Free Samples (Looperman)",
        type: "Loops",
        icon: "🔁",
        thumbnail:
          "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=400&q=80",
        link: "https://www.looperman.com",
      },
    ],
    Professional: [
      {
        title: "1-on-1 Mentor Session",
        type: "Booking",
        icon: "🗓️",
        thumbnail:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
        link: "https://calendly.com",
      },
      {
        title: "Standard Sync License Template",
        type: "Legal",
        icon: "⚖️",
        thumbnail:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
        link: "https://www.sxsw.com/wp-content/uploads/2019/03/Master-Use-Synch-License-Template.pdf",
      },
      {
        title: "EPK Branding Template",
        type: "Assets",
        icon: "🎨",
        thumbnail:
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
        link: "https://www.canva.com/media-kits/templates/",
      },
      {
        title: "DistroKid Distribution",
        type: "Distribution",
        icon: "🚀",
        thumbnail:
          "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80",
        link: "https://distrokid.com",
      },
      {
        title: "Register with ASCAP",
        type: "PRO",
        icon: "💰",
        thumbnail:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
        link: "https://www.ascap.com/music-creators/join",
      },
      {
        title: "Sync Licensing with Musicbed",
        type: "Licensing",
        icon: "🎬",
        thumbnail:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
        link: "https://www.musicbed.com/sell-music",
      },
      {
        title: "SoundExchange Royalties",
        type: "Royalties",
        icon: "📡",
        thumbnail:
          "https://www.soundexchange.com/wp-content/uploads/2022/12/generic-SX.jpg",
        link: "https://www.soundexchange.com/artist-copyright-owner/register/",
      },
      {
        title: "Spotify for Artists",
        type: "Analytics",
        icon: "📊",
        thumbnail:
          "https://images.ctfassets.net/lnhrh9gqejzl/40tTpHX1YWeibfLkyFQhcM/cdb8f778851f65801852ef930d7c5443/S4A_Home_sharecard.jpg",
        link: "https://artists.spotify.com",
      },
      {
        title: "Music Lawyer Directory (NOLO)",
        type: "Legal",
        icon: "⚖️",
        thumbnail:
          "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
        link: "https://www.nolo.com/legal-encyclopedia/music-law",
      },
      {
        title: "Bandcamp for Artists",
        type: "Direct Sales",
        icon: "🛒",
        thumbnail:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
        link: "https://bandcamp.com/signup",
      },
    ],
  };

  const lessons = curriculumData[currentPath] || [];
  const resources = resourceData[currentPath] || [];

  return (
    <div className="lessons-container">
      {/* LEFT: CURRICULUM */}
      <section className="curriculum-column">
        <div className="section-header">
          <h2>{currentPath} Curriculum</h2>
          <p>{currentPath === "Intermediate"}</p>
        </div>

        <div className="lesson-list">
          {lessons.map((lesson) => {
            // --- Logic for Progress ---
            // This says: Use the live data if it exists; otherwise, use the mock data.
            const liveProgress =
              lesson.id in progressData
                ? progressData[lesson.id]
                : lesson.progress;

            return (
              <div key={lesson.id} className="lesson-card">
                {/* 1. PREVIEW TILE */}
                <div className="lesson-preview">
                  <img
                    src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`}
                    alt={lesson.title}
                    onError={(e) => {
                      console.log(`Failed to load ID: ${lesson.youtubeId}`);
                      // This replaces a broken image with a clean grey placeholder
                      e.target.src = "https://placeholder.com";
                    }}
                  />

                  <div className="duration-tag">{lesson.time}</div>
                </div>

                <div className="lesson-content">
                  <div className="lesson-text">
                    <h3>{lesson.title}</h3>

                    {/* CONDITIONAL PROGRESS BAR */}
                    {token ? (
                      <div className="progress-container">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${liveProgress}%` }}
                          ></div>
                        </div>
                        <span className="progress-percent">
                          {liveProgress}%
                        </span>
                      </div>
                    ) : (
                      <p className="login-nudge">
                        Sign in to track your progress
                      </p>
                    )}
                  </div>

                  {/* CONDITIONAL BUTTON */}
                  <button
                    className="practice-btn"
                    onClick={() => handleStartLesson(lesson)}
                  >
                    {token
                      ? liveProgress > 0
                        ? "Resume Lesson"
                        : "Start Lesson"
                      : "Click to Play (Guest Mode)"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT: DYNAMIC RESOURCE PANEL */}
      <section className="resources-column">
        <div className="section-header">
          <h2>{currentPath === "Intermediate" ? "Resourses" : "Resources"}</h2>
        </div>

        <div className="resources-grid">
          {resources.map((item, index) => (
            <div key={index} className="resource-card">
              <div className="resource-icon-box">
                {item.scoreId ? (
                  <img
                    src={`https://flat.io/api/v2/scores/${item.scoreId}/revisions/last/thumbnail.png`}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "6px",
                      backgroundColor: "white",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = item.icon;
                    }}
                  />
                ) : item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = item.icon;
                    }}
                  />
                ) : (
                  item.icon
                )}
              </div>
              <div className="resource-info">
                <div className="resource-text">
                  <span className="resource-tag">{item.type}</span>
                  <h4>{item.title}</h4>
                  {!token && (
                    <p className="login-nudge">Account required for access</p>
                  )}
                </div>

                {/* UPDATED BUTTON LOGIC WITH SECURITY CHECK */}
                <button
                  className="practice-btn resource-action-btn"
                  onClick={() => {
                    // FIX: If there is no active token session, completely block the modal and return early
                    if (!token) {
                      console.log(
                        "Access denied: Please log in to view sheet music tabs.",
                      );
                      return;
                    }

                    if (currentPath === "Novice") {
                      // Instead of opening a new tab, open our new Practice Modal
                      setActiveScoreId(item.link);
                    } else {
                      // Intermediate and Pro still open links/downloads in a new tab
                      window.open(item.link, "_blank");
                    }
                  }}
                  /* Change the opacity if locked */
                  style={{
                    opacity: token ? 1 : 0.5,
                    cursor: token ? "pointer" : "not-allowed",
                  }}
                >
                  {token
                    ? currentPath === "Novice"
                      ? "Practice Tab ▷"
                      : "Go to Resource"
                    : "🔒 Login for Access"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setActiveVideo(null)}
            >
              ×
            </button>

            {/* USE THE YOUTUBE COMPONENT INSTEAD OF IFRAME */}
            <YouTube
              videoId={activeVideo.youtubeId}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: { autoplay: 1 },
              }}
              onStateChange={(e) => onVideoStateChange(e, activeVideo.id)}
            />
          </div>
        </div>
      )}

      {/* PRACTICE MODE MODAL (FLAT.IO PLACEHOLDER) */}
      {activeScoreId && (
        <div
          className="video-modal-overlay"
          onClick={() => setActiveScoreId(null)}
        >
          <div
            className="practice-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="practice-modal-header">
              <h3>Practice Mode</h3>
              <button
                className="close-button"
                onClick={() => setActiveScoreId(null)}
              >
                ×
              </button>
            </div>

            <div className="flat-embed-container">
              {/* This iframe is exactly how Flat.io embeds work */}
              <iframe
                src={`${activeScoreId}?jsapi=true&controlsFloating=true`}
                width="100%"
                height="100%"
                title="Flat.io Notation"
                allow="midi"
              ></iframe>
            </div>

            <div className="practice-footer">
              <p>💡 Tip: Use the spacebar to start/stop the playback.</p>
              <button
                className="complete-practice-btn"
                onClick={() => setActiveScoreId(null)}
              >
                I'm Finished Practicing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
