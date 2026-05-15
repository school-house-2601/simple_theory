import { useAuth } from "../../features/05-Auth/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const { token, logout } = useAuth();
  const [navSearch, setNavSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavSearch = (e) => {
    if (e.key === "Enter") {
      // Navigates to browse page with the query in the URL
      navigate(`/browse?search=${encodeURIComponent(navSearch)}`);
    }
  };

  return (
    <nav className="navbar">
      {/* 1. LEFT SIDE: Logo + Desktop Links */}
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">♫</span>
          <span className="logo-text">SimpleTheory</span>
        </Link>
        {/* These links only show on Desktop via CSS */}
        <div className="desktop-only-links">
          <NavLink to="/selection">Courses</NavLink>
          <NavLink to="/browse">Browse Videos</NavLink>
          <NavLink to="/challenges">Challenges</NavLink>
        </div>
      </div>

      {/* 2. CENTER: Search Bar */}
      <div className="nav-center">
        <div className="search-container">
          <span className="search-icon">Q</span>
          <input
            type="text"
            placeholder="Search theory, tabs, tutorials..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            onKeyDown={handleNavSearch}
          />
        </div>
      </div>

      {/* 3. RIGHT SIDE: Auth/Dashboard (Desktop Only) */}
      <div className="nav-right desktop-only-auth">
        {token ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button onClick={logout} className="logout-link">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* 4. HAMBURGER ICON: Mobile Only */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* 5. MOBILE MENU: Hidden on desktop */}
      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <NavLink to="/selection" onClick={() => setIsOpen(false)}>
          Courses
        </NavLink>
        <NavLink to="/browse" onClick={() => setIsOpen(false)}>
          Browse Videos
        </NavLink>
        <NavLink to="/challenges" onClick={() => setIsOpen(false)}>
          Challenges
        </NavLink>
        {token ? (
          <>
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="logout-link"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
