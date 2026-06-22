import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem("token");
    return hasToken;
  });

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to clear backend auth session cookie:", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
    }
  };

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (token.startsWith("google-oauth")) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // Store token as side effect
      queueMicrotask(() => localStorage.setItem("token", token));
      // Always fetch fresh user data to update streak and XP
      fetchUser();
    } else {
      queueMicrotask(() => localStorage.removeItem("token"));
      setUser(null);
      setLoading(false);
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
    setUser(result.user);
    localStorage.setItem("user", JSON.stringify(result.user));
  };

  const loginWithGoogle = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const value = {
    token,
    register,
    login,
    logout,
    user,
    fetchUser,
    loginWithGoogle,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
