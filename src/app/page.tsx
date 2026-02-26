import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--header-border)]"
        style={{
          height: "var(--header-height)",
          backgroundColor: "var(--header-bg)",
          color: "var(--header-text)",
        }}
      >
        <h1 className="text-lg font-semibold text-[var(--marine-primary)]">Wallace Dealer Portal</h1>
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--marine-primary)] hover:text-[var(--marine-secondary)]"
        >
          Log in
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <h2 className="text-3xl font-bold text-[var(--marine-dark)] mb-4">
            Secure Price File Distribution
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Access your price files, manage downloads, and stay up to date with manufacturer updates.
          </p>
          <Link
            href="/login"
            className="btn-primary inline-block px-6 py-3 rounded-lg"
          >
            Log in to Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
