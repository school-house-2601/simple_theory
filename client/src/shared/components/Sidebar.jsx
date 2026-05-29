import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Bookmark, Trophy, Music, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../features/05-Auth/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "My Learning", icon: <BookOpen size={18} />, path: "/lessons" },
    /** wip */
    { label: "Rewards", icon: <Trophy size={18} />, path: "/rewards" },
    /** wip */
    { label: "Practice Room", icon: <Music size={18} />, path: "/practice" },
];

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isSavedActive = location.pathname === "/browse" &&
        new URLSearchParams(location.search).get("tab") === "saved";
    const { logout } = useAuth();

    return (
        <>
            <div
                className={`sidebar-tab ${expanded ? "hidden" : ""}`}
                onMouseEnter={() => setExpanded(true)}
            >
                <span className="sidebar-tab-arrow">›</span>
            </div>
            <aside
                className={`sidebar ${expanded ? "expanded" : ""}`}
                onMouseLeave={() => setExpanded(false)}
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