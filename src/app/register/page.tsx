"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";

interface RegisterBody {
  name: string;
  email: string;
  customer_number: string;
  password: string;
  notes?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterBody>({
    name: "",
    email: "",
    customer_number: "",
    password: "",
    notes: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest<{ message: string }>("/api/auth/register-dealer", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess("Thanks, your registration has been received. An admin will review and activate your account.");
      setForm({
        name: "",
        email: "",
        customer_number: "",
        password: "",
        notes: "",
      });
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-12 lg:px-16 bg-[var(--surface)]">
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--sidebar-text)] mb-4">
          Wallace Dealer Portal
        </h1>
        <p className="text-[var(--sidebar-text-muted)] max-w-sm">
          Request access to receive price files securely through the dealer portal.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[var(--surface-card)]">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1 md:hidden">
            Wallace Dealer Portal
          </h2>
          <h2 className="text-2xl font-bold text-[var(--marine-dark)] mb-4">
            Dealer registration
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Fill out this form to request access. Your account will be activated after an admin reviews your details.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {success}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Dealer name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="customer_number" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Customer number
              </label>
              <input
                id="customer_number"
                type="text"
                value={form.customer_number}
                onChange={(e) => setForm((f) => ({ ...f, customer_number: e.target.value }))}
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
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--marine-secondary)] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 disabled:opacity-50 rounded-lg"
            >
              {loading ? "Submitting…" : "Submit registration"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--marine-secondary)] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

