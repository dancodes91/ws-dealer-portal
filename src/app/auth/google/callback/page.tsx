"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const access = params.get("access_token");
    const refresh = params.get("refresh_token");
    if (access && refresh) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      refreshAuth();
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [refreshAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[var(--text-secondary)]">Finishing Google sign-in…</p>
    </div>
  );
}

