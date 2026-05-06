import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();
const API = "/api";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // We wrap this in useCallback so it doesn't trigger unnecessary re-renders
  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result);
      } else {
        // If the token is invalid or expired, log them out
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  }, [token]);

  // This handles the "Stay Logged In" logic
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token, fetchUser]);

  const register = async (credentials) => {
    const response = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.message || "Registration failed");
    setToken(result.token);
  };

  const login = async (credentials) => {
    const response = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.message || "Login failed");
    setToken(result.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = { token, register, login, logout, user, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
