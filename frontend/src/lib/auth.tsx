"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMyProfile } from "@/lib/api";
import {
  confirmForgotPassword as cognitoConfirmForgotPassword,
  confirmSignUp as cognitoConfirmSignUp,
  forgotPassword as cognitoForgotPassword,
  getCurrentIdToken,
  resendConfirmationCode as cognitoResendConfirmationCode,
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  signUp as cognitoSignUp,
} from "@/lib/cognito";
import type { User } from "@/lib/types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentIdToken()
      .then((idToken) => {
        if (!idToken) return;
        setToken(idToken);
        return getMyProfile(idToken).then(setUser);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const idToken = await cognitoSignIn(email, password);
    setToken(idToken);
    setUser(await getMyProfile(idToken));
  }

  function logout() {
    cognitoSignOut();
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (!token) return;
    setUser(await getMyProfile(token));
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signUp: cognitoSignUp,
        confirmSignUp: cognitoConfirmSignUp,
        resendConfirmationCode: cognitoResendConfirmationCode,
        login,
        logout,
        forgotPassword: cognitoForgotPassword,
        confirmForgotPassword: cognitoConfirmForgotPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
