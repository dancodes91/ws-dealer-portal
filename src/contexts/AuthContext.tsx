"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { decode_token_payload } from "@/lib/auth-utils";

type UserType = "dealer" | "admin";

interface AuthState {
  token: string | null;
  userType: UserType | null;
  userId: number | null;
  email: string | null;
  ready: boolean;
}

const AuthContext = createContext<AuthState & { logout: () => void; refreshAuth: () => void }>({
  token: null,
  userType: null,
  userId: null,
  email: null,
  ready: false,
  logout: () => {},
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    userType: null,
    userId: null,
    email: null,
    ready: false,
  });

  const refreshAuth = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      setState((s) => ({ ...s, ready: true }));
      return;
    }
    const payload = decode_token_payload(token);
    if (payload) {
      setState({
        token,
        userType: payload.type as UserType,
        userId: payload.id ?? null,
        email: payload.sub ?? null,
        ready: true,
      });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setState((s) => ({ ...s, ready: true }));
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    setState({
      token: null,
      userType: null,
      userId: null,
      email: null,
      ready: true,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth(allowedTypes?: UserType[]) {
  const auth = useAuth();
  if (!auth.ready) return { auth, allowed: false };
  if (!auth.token) return { auth, allowed: false };
  if (allowedTypes && auth.userType && !allowedTypes.includes(auth.userType))
    return { auth, allowed: false };
  return { auth, allowed: true };
}
