import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const tryLogin = async (formData) => {
    setError(null);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login({ email, password });
      nav("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-form">
        <h1>Welcome Back</h1>
        <p>Continue your journey to musical mastery</p>

        <div className="social-buttons">
          <button type="button" className="social-btn">
            Google
          </button>
          <button type="button" className="social-btn">
            Apple
          </button>
        </div>

        <div className="divider">OR CONTINUE WITH</div>

        <form action={tryLogin}>
          <div className="auth-form-group">
            <label>Email or Username</label>
            <input
              type="email"
              name="email"
              placeholder="mister.musician@theory.com"
              required
            />
          </div>

          <div className="auth-form-group">
            <div className="label-row">
              <label>Password</label>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Show the error message if login fails */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn">
            Sign In to SimpleTheory →
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
