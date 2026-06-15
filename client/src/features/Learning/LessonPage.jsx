import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useAuth } from "../Auth/AuthContext";
import { curriculumData, resourceData } from "../../data/lessonData";
import "./LessonPage.css";

export default function LessonsPage() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeScoreId, setActiveScoreId] = useState(null);
  const [flatUserData, setFlatUserData] = useState(null);

  useEffect(() => {
    if (token) {
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
        }
      );
      const data = await res.json();
      console.log("Lesson XP awarded", data);
    } catch (err) {
      console.error("Failed to award lesson XP", err);
    }
  };

  const [progressData, setProgressData] = useState(() => {
    const saved = localStorage.getItem("lessonProgress");
    return saved ? JSON.parse(saved) : {};
  });

  const onVideoStateChange = (event, lessonId) => {
    const player = event.target;

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
            const liveProgress =
              lesson.id in progressData
                ? progressData[lesson.id]
                : lesson.progress;

            return (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-preview">
                  <img
                    src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`}
                    alt={lesson.title}
                    onError={(e) => {
                      console.log(`Failed to load ID: ${lesson.youtubeId}`);
                      e.target.src = "https://placeholder.com";
                    }}
                  />
                  <div className="duration-tag">{lesson.time}</div>
                </div>

                <div className="lesson-content">
                  <div className="lesson-text">
                    <h3>{lesson.title}</h3>

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

                <button
                  className="practice-btn resource-action-btn"
                  onClick={() => {
                    if (!token) {
                      console.log(
                        "Access denied: Please log in to view sheet music tabs."
                      );
                      return;
                    }

                    if (currentPath === "Novice") {
                      setActiveScoreId(item.link);
                    } else {
                      window.open(item.link, "_blank");
                    }
                  }}
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

      {/* PRACTICE MODE MODAL */}
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
