import { useAuth } from "../../features/Auth/AuthContext";
import { NavLink, Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const { token } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link to="/" className="footer-logo">
          <span className="logo-icon">♫</span> SimpleTheory
        </Link>
        <p>
          Master your instrument with data-driven theory and interactive
          practice.
        </p>
      </div>

      <div className="footer-column">
        <h3>Learning</h3>
        <NavLink to="/selection">Courses</NavLink>
        <NavLink to="/browse">Browse Videos</NavLink>
        <NavLink to="/practice">Practice</NavLink>
      </div>

      <div className="footer-column">
        <h3>Account</h3>
        {token ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
        <NavLink to="/howitworks">How it works</NavLink>
      </div>
    </footer>
  );
}
