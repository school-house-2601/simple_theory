import { useState, useRef, useEffect } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, token, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light",
  );
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [passwordSection, setPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      });
      const savedPhoto = localStorage.getItem(`profile_photo_${user.id}`);
      if (user.profile_photo) setProfilePhoto(user.profile_photo);
      else if (savedPhoto) setProfilePhoto(savedPhoto);
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const getInitial = () => {
    if (user?.firstname) return user.firstname[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "?";
  };

  const getDisplayName = () => {
    if (user?.firstname && user?.lastname)
      return `${user.firstname} ${user.lastname}`;
    if (user?.firstname) return user.firstname;
    if (user?.username) return user.username;
    return "Musician";
  };

  const isGoogleUser = token?.startsWith("google-oauth");

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const currentLevel = user?.selected_path || user?.current_level || "Novice";
  const totalXp = user?.total_xp || 0;
  const xpGoal =
    currentLevel === "Novice"
      ? 3000
      : currentLevel === "Intermediate"
        ? 8000
        : 99999;
  const nextLevel =
    currentLevel === "Novice"
      ? "Intermediate"
      : currentLevel === "Intermediate"
        ? "Professional"
        : "Max Level";
  const xpPercent = Math.min(Math.round((totalXp / xpGoal) * 100), 100);

  const levelColors = {
    Novice: "#6262bc",
    Intermediate: "#2fd02f",
    Professional: "#c84d1c",
  };
  const levelColor = levelColors[currentLevel] || "#6366f1";

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
      localStorage.setItem(`profile_photo_${user.id}`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) {
        const updatedUser = await res.json();
        setFormData({
          firstname: updatedUser.firstname || "",
          lastname: updatedUser.lastname || "",
          email: updatedUser.email || "",
        });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        await fetchUser();
        setSaveStatus("saved");
        setIsEditing(false);
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordStatus("Passwords don't match");
      return;
    }
    if (passwordData.newPass.length < 8) {
      setPasswordStatus("Password must be at least 8 characters");
      return;
    }
    setPasswordStatus("saving");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus("saved");
        setPasswordData({ current: "", newPass: "", confirm: "" });
        setPasswordSection(false);
        setTimeout(() => setPasswordStatus(null), 3000);
      } else {
        setPasswordStatus(data.message || "error");
      }
    } catch {
      setPasswordStatus("error");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      {/* BANNER */}
      <div className="profile-banner">
        <div className="banner-left">
          <div className="banner-avatar" style={{ borderColor: levelColor }}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="avatar"
                className="banner-avatar-img"
              />
            ) : (
              <span style={{ color: levelColor }}>{getInitial()}</span>
            )}
          </div>
          <div>
            <h1 className="banner-name">{getDisplayName()}</h1>
            <p className="banner-email">{user?.email}</p>
            <div className="banner-pills">
              <span
                className="tag tag-level"
                style={{
                  color: levelColor,
                  borderColor: `${levelColor}40`,
                  background: `${levelColor}18`,
                }}
              >
                {currentLevel}
              </span>
              {isGoogleUser && (
                <span className="tag tag-google">Google Account</span>
              )}
              <span className="tag tag-streak">
                🔥 {user?.current_streak || 0} Day Streak
              </span>
            </div>
          </div>
        </div>
        <div className="banner-stats">
          <div className="stat">
            <div className="stat-val" style={{ color: levelColor }}>
              {totalXp}
            </div>
            <div className="stat-label">Total XP</div>
          </div>
          <div className="stat">
            <div className="stat-val" style={{ color: levelColor }}>
              {user?.current_streak || 0}
            </div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat">
            <div
              className="stat-val"
              style={{ color: levelColor, fontSize: "16px" }}
            >
              {memberSince}
            </div>
            <div className="stat-label">Member Since</div>
          </div>
        </div>
      </div>

      {/* TOP ROW */}
      <div className="profile-top-grid">
        {/* ACCOUNT INFO CARD */}
        <div className="pcard">
          <div className="pcard-top">
            <span className="pcard-title">Account Information</span>
            {!isEditing ? (
              <button
                className="btn-outline"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSaveStatus(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-purple-sm"
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {saveStatus === "saved" && (
            <div className="status-banner success">✓ Profile updated</div>
          )}
          {saveStatus === "error" && (
            <div className="status-banner error">✗ Failed to save</div>
          )}

          <div className="field-row">
            <div className="field">
              <label>First Name</label>
              {isEditing ? (
                <input
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                  placeholder="First name"
                />
              ) : (
                <div className="field-val">
                  {formData.firstname || <span className="empty">Not set</span>}
                </div>
              )}
            </div>
            <div className="field">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                  placeholder="Last name"
                />
              ) : (
                <div className="field-val">
                  {formData.lastname || <span className="empty">Not set</span>}
                </div>
              )}
            </div>
          </div>

          <div className="field" style={{ marginTop: "14px" }}>
            <label>Email Address</label>
            {isEditing && !isGoogleUser ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              <div className="field-val">
                {formData.email}
                {isGoogleUser && (
                  <span className="tag tag-google" style={{ fontSize: "10px" }}>
                    Google
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="field-row" style={{ marginTop: "14px" }}>
            <div className="field">
              <label>Current Level</label>
              <div
                className="field-val"
                style={{ color: levelColor, fontWeight: 500 }}
              >
                {currentLevel}
              </div>
            </div>
            <div className="field">
              <label>Login Streak</label>
              <div className="field-val">
                🔥 {user?.current_streak || 0} days
              </div>
            </div>
          </div>

          <div className="xp-section">
            <div className="xp-labels">
              <span>XP to {nextLevel}</span>
              <span>
                {totalXp} / {xpGoal}
              </span>
            </div>
            <div className="xp-track">
              <div
                className="xp-fill"
                style={{ width: `${xpPercent}%`, background: levelColor }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT STACK */}
        <div className="profile-right-stack">
          {/* PHOTO CARD */}
          <div className="pcard">
            <span className="pcard-title">Profile Photo</span>
            <div className="photo-area">
              <div
                className="photo-circle"
                style={{
                  borderColor: levelColor,
                  background: `${levelColor}18`,
                }}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="profile" className="photo-img" />
                ) : (
                  <span style={{ color: levelColor, fontSize: "1.8rem" }}>
                    {getInitial()}
                  </span>
                )}
              </div>
              <p className="photo-hint">
                {isGoogleUser
                  ? "Using your Google profile photo"
                  : "Upload a photo to personalize your profile"}
              </p>
            </div>
            <button
              className="btn-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePhoto ? "Change Photo" : "Upload from device"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <p className="upload-hint">JPG, PNG or GIF · Max 5MB</p>
          </div>

          {/* SECURITY CARD */}
          <div className="pcard">
            <div className="pcard-top">
              <span className="pcard-title">Password & Security</span>
              {!isGoogleUser && (
                <button
                  className="btn-outline"
                  onClick={() => {
                    setPasswordSection(!passwordSection);
                    setPasswordStatus(null);
                    setPasswordData({ current: "", newPass: "", confirm: "" });
                  }}
                >
                  {passwordSection ? "Cancel" : "Change"}
                </button>
              )}
            </div>
            {isGoogleUser ? (
              <p className="google-note">
                🔒 Signed in with Google — password management is handled by
                your Google account.
              </p>
            ) : passwordSection ? (
              <div className="password-fields">
                {passwordStatus === "saved" && (
                  <div className="status-banner success">
                    ✓ Password updated successfully
                  </div>
                )}
                {passwordStatus &&
                  passwordStatus !== "saving" &&
                  passwordStatus !== "saved" && (
                    <div className="status-banner error">
                      ✗ {passwordStatus}
                    </div>
                  )}
                <div className="field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={passwordData.newPass}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPass: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  className="btn-purple-sm"
                  style={{ marginTop: "4px" }}
                  onClick={handlePasswordUpdate}
                  disabled={passwordStatus === "saving"}
                >
                  {passwordStatus === "saving"
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            ) : (
              <div className="field">
                <label>Password</label>
                <div className="field-val">••••••••••••</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="profile-bottom-grid">
        {/* APPEARANCE */}
        <div className="pcard">
          <span className="pcard-title">Appearance</span>
          <div className="appear-row">
            <div className="appear-left">
              <div
                className="appear-icon"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  borderColor: "rgba(99,102,241,0.2)",
                }}
              >
                🌙
              </div>
              <div>
                <p className="appear-name">Dark Mode</p>
                <p className="appear-sub">
                  {darkMode ? "Currently active" : "Click to enable"}
                </p>
              </div>
            </div>
            <button
              className={`toggle-btn ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode(true)}
              aria-label="Enable dark mode"
            >
              <span className="toggle-knob" />
            </button>
          </div>
          <div
            className="appear-row"
            style={{ borderTop: "1px solid #1e2040" }}
          >
            <div className="appear-left">
              <div
                className="appear-icon"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  borderColor: "rgba(245,158,11,0.2)",
                }}
              >
                ☀️
              </div>
              <div>
                <p className="appear-name">Light Mode</p>
                <p className="appear-sub">
                  {!darkMode ? "Currently active" : "Click to enable"}
                </p>
              </div>
            </div>
            <button
              className={`toggle-btn ${!darkMode ? "on" : ""}`}
              onClick={() => setDarkMode(false)}
              aria-label="Enable light mode"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>

        {/* LEARNING PATH */}
        <div className="pcard">
          <span className="pcard-title">Learning Path</span>
          <div className="field">
            <label>Selected Path</label>
            <div
              className="field-val"
              style={{ color: levelColor, fontWeight: 500 }}
            >
              {currentLevel}
            </div>
          </div>
          <div className="field" style={{ marginTop: "12px" }}>
            <label>Next Milestone</label>
            <div className="field-val">
              {nextLevel} — {xpGoal.toLocaleString()} XP
            </div>
          </div>
          <div className="xp-section" style={{ marginTop: "14px" }}>
            <div className="xp-labels">
              <span>Progress</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="xp-track">
              <div
                className="xp-fill"
                style={{ width: `${xpPercent}%`, background: levelColor }}
              />
            </div>
          </div>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="pcard">
          <span className="pcard-title">Account</span>
          <div className="field">
            <label>Account Type</label>
            <div className="field-val">Free Plan</div>
          </div>
          <div className="field" style={{ marginTop: "12px" }}>
            <label>Member Since</label>
            <div className="field-val">{memberSince}</div>
          </div>
          <button
            className="btn-purple-full"
            style={{ marginTop: "16px" }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
