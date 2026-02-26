"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-center px-12 lg:px-16 bg-[var(--surface)]"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--sidebar-text)] mb-4">
          Wallace Dealer Portal
        </h1>
        <p className="text-[var(--sidebar-text-muted)] max-w-sm">
          Secure price file distribution. Sign in to access your files and manage downloads.
        </p>
      </div>

      {/* Right: form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[var(--surface-card)]">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1 md:hidden">
            Wallace Dealer Portal
          </h2>
          <h2 className="text-2xl font-bold text-[var(--marine-dark)] mb-8">
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
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            <Link href="/" className="text-[var(--marine-secondary)] hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
