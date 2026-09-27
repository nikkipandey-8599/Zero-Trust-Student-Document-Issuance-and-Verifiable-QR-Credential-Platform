import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("verifyid_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("verifyid_token", data.token);
      localStorage.setItem(
        "verifyid_user",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      setUser({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("verifyid_token");
    localStorage.removeItem("verifyid_user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("verifyid_token");

    if (!token) {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}