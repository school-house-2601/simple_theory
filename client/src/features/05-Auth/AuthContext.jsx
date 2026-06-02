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

  const fetchUser = useCallback(async () => {
    if (!token) return;
    if (token.startsWith("google-oauth")) {
      console.log("Skipping local fetch user check for stable Google Session.");
      return;
    }
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result);
      } else {
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

  const loginWithGoogle = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    setUser(userData);
  };

  // FIXED LOGOUT: Now clears the backend Express session cookie too
  const logout = async () => {
    try {
      // Points directly to your new backend route with standard cross-origin permissions
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to clear backend auth session cookie:", err);
    } finally {
      // Wipes state variables and removes the token from localStorage no matter what
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    token,
    register,
    login,
    logout,
    user,
    fetchUser,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
