import { useLocation } from "react-router-dom";
import "./LessonPage.css";

export default function LessonsPage() {
  const location = useLocation();
  const currentPath = location.state?.selectedPath || "Novice"; // Fallback to Novice

  // 1. DATA LOGIC (Ideally move these to mockData.js later)
  const curriculumData = {
    Novice: [
      { id: 1, title: "Anatomy of the Guitar", time: "12m", progress: 100 },
      {
        id: 2,
        title: "Proper Seating & Hand Position",
        time: "15m",
        progress: 85,
      },
    ],
    Intermediate: [
      {
        id: 1,
        title: "Logic Pro: Setting up your first Session",
        time: "20m",
        progress: 0,
      },
      {
        id: 2,
        title: "Ableton Live: Session vs Arrangement View",
        time: "25m",
        progress: 0,
      },
      {
        id: 3,
        title: "FL Studio: Mastering the Piano Roll",
        time: "18m",
        progress: 0,
      },
    ],
    Professional: [
      {
        id: 1,
        title: "Mastering for Streaming Platforms",
        time: "45m",
        progress: 10,
      },
      {
        id: 2,
        title: "Music Licensing & Publishing Law",
        time: "1h 20m",
        progress: 5,
      },
      {
        id: 3,
        title: "Building a Modern Artist Brand",
        time: "35m",
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
      {/* LEFT: CURRICULUM (Stays consistent) */}
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
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              {/* Same LessonCard structure we built earlier */}
              <h3>{lesson.title}</h3>
              <button className="practice-btn">Start Lesson</button>
            </div>
          ))}
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
    </div>
  );
}
