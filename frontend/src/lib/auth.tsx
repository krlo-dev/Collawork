"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMyProfile, loginUser, registerUser } from "@/lib/api";
import type { User } from "@/lib/types";

const TOKEN_STORAGE_KEY = "collawork_token";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => readStoredToken() !== null);

  useEffect(() => {
    if (!token) return;
    getMyProfile(token)
      .then(setUser)
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function login(email: string, password: string) {
    const { access_token } = await loginUser(email, password);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    setUser(await getMyProfile(access_token));
  }

  async function register(name: string, email: string, password: string) {
    const { access_token } = await registerUser(name, email, password);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    setUser(await getMyProfile(access_token));
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (!token) return;
    setUser(await getMyProfile(token));
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
