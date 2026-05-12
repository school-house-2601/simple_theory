import { useLocation } from "react-router-dom";
import { useState } from "react";
import YouTube from "react-youtube";
import { useAuth } from "../05-Auth/AuthContext";
import "./LessonPage.css";

export default function LessonsPage() {
  const { token } = useAuth();
  const location = useLocation();
  const [activeVideo, setActiveVideo] = useState(null);
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
        title: "Proper Seating & Hand Position",
        time: "15m",
        youtubeId: "jAZtYGUVwPA",
        progress: 0,
      },
    ],
    Intermediate: [
      {
        id: "int-1",
        title: "Logic Pro: Setting up your first Session",
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
        youtubeId: "stRlgM4Lah4",
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
    ],
  };

  const resourceData = {
    Novice: [
      { title: "Ode to Joy (Tab)", type: "Notation", icon: "📄" },
      { title: "C Major Scale", type: "Tab", icon: "📄" },
    ],
    Intermediate: [
      { title: "Lofi Hip Hop Template", type: "Logic Project", icon: "💾" },
      { title: "Serum Preset Pack v1", type: "Samples", icon: "📦" },
      { title: "Vocal Chain Preset", type: "Ableton Rack", icon: "🎚️" },
    ],
    Professional: [
      { title: "1-on-1 Mentor Session", type: "Booking", icon: "🗓️" },
      { title: "Standard Sync License Template", type: "Legal", icon: "⚖️" },
      { title: "EPK Branding Template", type: "Assets", icon: "🎨" },
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
          <p>
            {currentPath === "Intermediate"
              ? "Master your DAW"
              : "Step-by-Step Learning"}
          </p>
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
          <h2>
            {currentPath === "Intermediate"
              ? "Project Files & Downloads"
              : "Library & Tabs"}
          </h2>
          <p>Resources for this track</p>
        </div>

        <div className="resources-grid">
          {resources.map((item, index) => (
            <div key={index} className="resource-card">
              <div className="resource-icon-box">{item.icon}</div>
              <div className="resource-info">
                <span className="resource-tag">{item.type}</span>
                <h4>{item.title}</h4>
                <button className="download-btn">
                  {currentPath === "Intermediate"
                    ? "Download File"
                    : "Open Tab"}
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
    </div>
  );
}
