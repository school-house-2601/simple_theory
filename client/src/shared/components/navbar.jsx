import { useAuth } from "../../features/Auth/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./navbar.css";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const [navSearch, setNavSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const profilePhoto = user?.id
    ? localStorage.getItem(`profile_photo_${user.id}`)
    : null;

  const handleNavSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/browse?search=${encodeURIComponent(navSearch)}`);
    }
  };

  const handleCoursesClick = (e) => {
    e.preventDefault();
    if (user?.selected_path) {
      navigate("/lessons", { state: { selectedPath: user.selected_path } });
    } else {
      navigate("/selection");
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate initials or avatar from user data
  const getAvatar = () => {
    if (!user) return "?";
    if (user.firstname) return user.firstname[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "?";
  };

  const getDisplayName = () => {
    if (!user) return "Account";
    if (user.firstname && user.lastname)
      return `${user.firstname} ${user.lastname}`;
    if (user.firstname) return user.firstname;
    if (user.username) return user.username;
    return user.email || "Account";
  };

  return (
    <nav className="navbar">
      {/* 1. LEFT SIDE: Logo + Desktop Links */}
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">♫</span>
          <span className="logo-text">SimpleTheory</span>
        </Link>
        <div className="desktop-only-links">
          <a
            href="#"
            onClick={handleCoursesClick}
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Courses
          </a>
          <NavLink to="/browse">Browse Videos</NavLink>
          <NavLink to="/practice">Practice</NavLink>
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

      {/* 3. RIGHT SIDE: Auth/Avatar (Desktop Only) */}
      <div className="nav-right desktop-only-auth">
        {token ? (
          <div className="avatar-wrapper" ref={dropdownRef}>
            <button
              className="avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Open user menu"
            >
              <div className="avatar-circle">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  getAvatar()
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="avatar-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-name">{getDisplayName()}</span>
                  <span className="dropdown-email">{user?.email}</span>
                </div>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/dashboard");
                    setDropdownOpen(false);
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                >
                  👤 Your Profile
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item dropdown-logout"
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setDropdownOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
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
        <a
          href="#"
          onClick={(e) => {
            handleCoursesClick(e);
            closeMenu();
          }}
          style={{
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Courses
        </a>
        <NavLink to="/browse" onClick={closeMenu}>
          Browse Videos
        </NavLink>
        <NavLink to="/practice" onClick={closeMenu}>
          Practice
        </NavLink>
        {token ? (
          <>
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" onClick={closeMenu}>
              Profile
            </NavLink>
            <button
              onClick={() => {
                logout();
                navigate("/login");
                closeMenu();
              }}
              className="logout-link"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" onClick={closeMenu}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
