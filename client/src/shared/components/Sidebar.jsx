import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Trophy,
  Music,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../features/Auth/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  { label: "My Learning", icon: <BookOpen size={18} />, path: "/lessons" },
  // { label: "Rewards", icon: <Trophy size={18} />, path: "/rewards" },
  { label: "Practice Room", icon: <Music size={18} />, path: "/practice" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isSavedActive =
    location.pathname === "/browse" &&
    new URLSearchParams(location.search).get("tab") === "saved";

  const handleTabInteraction = () => setExpanded(true);
  const handleSidebarClose = () => {
    if (isMobile) setExpanded(false);
  };

  return (
    <>
      <div
        className={`sidebar-tab ${expanded ? "hidden" : ""}`}
        onMouseEnter={!isMobile ? handleTabInteraction : undefined}
        onClick={isMobile ? handleTabInteraction : undefined}
      >
        <span className="sidebar-tab-arrow">›</span>
      </div>
      {isMobile && expanded && (
        <div className="sidebar-overlay" onClick={() => setExpanded(false)} />
      )}
      <aside
        className={`sidebar ${expanded ? "expanded" : ""}`}
        onMouseLeave={!isMobile ? () => setExpanded(false) : undefined}
      >
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            tabIndex="-1"
            className={`sidebar-link ${isSavedActive ? "active" : ""}`}
            onClick={() => {
              navigate(`/browse?tab=saved&t=${Date.now()}`);
            }}
          >
            <Bookmark size={18} />
            <span className="sidebar-label">Saved Items</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/settings" className="sidebar-link">
            <Settings size={18} />
            <span className="sidebar-label">Settings</span>
          </NavLink>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span className="sidebar-label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
