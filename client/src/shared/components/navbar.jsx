import { useAuth } from "../../features/05-Auth/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const { token, logout } = useAuth();
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const handleNavSearch = (e) => {
    if (e.key === "Enter") {
      // Navigates to browse page with the query in the URL
      navigate(`/browse?search=${encodeURIComponent(navSearch)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">♫</span> SimpleTheory
        </Link>
        <div className="nav-menu">
          <NavLink to="/selection">Courses</NavLink>
          <NavLink to="/browse">Browse Videos</NavLink>
          <NavLink to="/challenges">Challenges</NavLink>
        </div>
      </div>

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

      <div className="nav-right">
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
    </nav>
  );
}
