import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // 🔧 Helper
  // =============================
  const getToken = () => localStorage.getItem("aih_token");

  const authHeader = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  // =============================
  // 1. Check session on load
  // =============================
  useEffect(() => {
    const checkSession = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: authHeader(),
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user || data);
        } else {
          localStorage.removeItem("aih_token");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // =============================
  // 2. OAuth login (Google/Facebook)
  // =============================
  const loginWithToken = async (token) => {
    try {
      localStorage.setItem("aih_token", token);

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user || data);
      } else {
        localStorage.removeItem("aih_token");
      }
    } catch (err) {
      console.error("OAuth login failed:", err);
      localStorage.removeItem("aih_token");
    }
  };

  // =============================
  // 3. Login
  // =============================
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message };
      }

      localStorage.setItem("aih_token", data.token);
      setUser(data.user);

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Server connection failed" };
    }
  };

  // =============================
  // 4. Signup
  // =============================
  const signup = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.message };
      }

      localStorage.setItem("aih_token", data.token);
      setUser(data.user);

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Signup failed. Try again." };
    }
  };

  // =============================
  // 5. Logout
  // =============================
  const logout = () => {
    localStorage.removeItem("aih_token");
    setUser(null);
  };

  // =============================
  // 6. Admin: refresh users
  // =============================
  const refresh = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: authHeader(),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  // =============================
  // 7. Admin: approve rep
  // =============================
  const approveRep = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/approve`, {
        method: "PATCH",
        headers: authHeader(),
      });

      if (res.ok) refresh();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // =============================
  // 8. Admin: reject rep
  // =============================
  const rejectRep = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}/reject`, {
        method: "PATCH",
        headers: authHeader(),
      });

      if (res.ok) refresh();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  // =============================
  // 9. Toggle enrollment
  // =============================
  const toggleEnrollment = async (workshopId) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/workshops/${workshopId}/enroll`, {
        method: "POST",
        headers: authHeader(),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.updatedUser);
      }
    } catch (err) {
      console.error("Enrollment toggle failed:", err);
    }
  };

  // =============================
  // Provider
  // =============================
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        users,
        login,
        signup,
        logout,
        loginWithToken,
        approveRep,
        rejectRep,
        toggleEnrollment,
        refresh,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// =============================
// Hook
// =============================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
