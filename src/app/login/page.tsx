"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { login, API_URL } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      refreshAuth();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google/login`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { detail?: string }).detail || "Google sign-in is not available");
      }
      const data = (await res.json()) as { auth_url: string };
      window.location.href = data.auth_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--eco-bg)" }}
        aria-hidden
      />
      <div className="relative z-10 flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-lg bg-[var(--eco-mindful-white)]">
        {/* Left: branding */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center px-10 lg:px-12">
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--eco-earth-green)] mb-4">
            Wallace Dealer Portal
          </h1>
          <p className="text-[var(--eco-zen-green)] max-w-sm">
            Secure, eco-inspired workspace for managing price files and dealer downloads.
          </p>
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-sm eco-card p-6 md:p-8">
            <div className="eco-card-border" aria-hidden />
            <h2 className="text-xl font-semibold text-[var(--eco-earth-green)] mb-1 md:hidden">
              Wallace Dealer Portal
            </h2>
            <h2 className="text-2xl font-bold text-[var(--eco-earth-green)] mb-6">
              Log in
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 disabled:opacity-50 rounded-lg"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full border border-[var(--eco-organic-border)] rounded-lg py-2.5 text-sm font-medium text-[var(--eco-earth-green)] bg-white hover:bg-[var(--marine-light)] transition-colors disabled:opacity-50"
            >
              {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
            </button>
          </div>
          <div className="mt-6 space-y-2 text-center text-sm text-[var(--text-secondary)]">
            <p>
              Need an account?{" "}
              <Link href="/register" className="text-[var(--eco-forest-green)] hover:underline">
                Register as a dealer
              </Link>
            </p>
            <p>
              <Link href="/" className="text-[var(--eco-forest-green)] hover:underline">
                Back to home
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
