import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask the server who we are (the session lives in an httpOnly cookie).
  useEffect(() => {
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api("/auth/login", { method: "POST", body: { email, password } });
    setUser(d.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
