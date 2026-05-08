import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState(null);

  // Track selected instruments for the "What do you play?" section
  const [selectedInterests, setSelectedInterests] = useState([]);
  const interests = [
    "Piano",
    "Guitar",
    "Drum",
    "Vocals",
    "Production",
    "Other",
  ];

  const toggleInterest = (item) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const tryRegister = async (formData) => {
    setError(null);
    const fullName = formData.get("fullname");
    const email = formData.get("email");
    const password = formData.get("password");

    // Split name back for your backend if needed
    const [firstname, ...lastNames] = fullName.split(" ");
    const lastname = lastNames.join(" ");

    try {
      await register({
        firstname,
        lastname,
        email,
        password,
        interests: selectedInterests,
      });
      nav("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-split-container">
      {/* LEFT COLUMN: FORM */}
      <div className="auth-column left">
        <div className="reg-content">
          <div className="logo-area">
            <span className="logo-icon">♫</span>
            <span className="logo-text">SimpleTheory</span>
          </div>

          <h1>Start your journey</h1>
          <p className="subtitle">
            Join 50,000+ musicians mastering their craft.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              tryRegister(new FormData(e.currentTarget));
            }}
          >
            <div className="auth-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                placeholder="John Coltrane"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Work Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                required
              />
            </div>

            <div className="interest-section">
              <div className="interest-header">
                <label>What do you play?</label>
                <span>Select all that apply</span>
              </div>
              <div className="interest-pills">
                {interests.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`pill ${selectedInterests.includes(item) ? "active" : ""}`}
                    onClick={() => toggleInterest(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="submit-btn">
              Create Account →
            </button>
          </form>

          <p className="terms">
            By signing up, you agree to our <a href="#">Terms of Service</a>.
          </p>

          <p className="footer-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: FEATURES */}
      <div className="auth-column right">
        <div className="feature-content">
          <span className="pro-badge">SimpleTheory Pro</span>
          <h2>Elevate your musical intelligence today.</h2>

          <div className="feature-list">
            <div className="feature-item">
              <div className="icon">🏆</div>
              <div>
                <h3>Personalized Learning Paths</h3>
                <p>
                  From Novice to Professional, we adapt the curriculum to your
                  skill level.
                </p>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon">✨</div>
              <div>
                <h3>Interactive Play-Along</h3>
                <p>
                  Practice with real-time feedback using our advanced notation
                  viewer.
                </p>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon">🎹</div>
              <div>
                <h3>DAW & Plugin Directory</h3>
                <p>
                  Access curated tutorials for Ableton, Logic, and FL Studio.
                </p>
              </div>
            </div>
          </div>

          <div className="social-proof">
            <div className="avatars"> {/* Placeholder for user icons */} </div>
            <p>⭐⭐⭐⭐⭐ 4.9/5 rating from our creator community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
