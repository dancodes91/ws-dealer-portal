import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--eco-bg)" }}
    >
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--header-border)] shadow-sm bg-[var(--header-bg)]/90 backdrop-blur-md"
        style={{
          height: "var(--header-height)",
          color: "var(--header-text)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--eco-forest-green)]/10 border border-[var(--eco-organic-border)] flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-[var(--eco-forest-green)]" />
          </div>
          <span className="text-lg font-semibold text-[var(--eco-earth-green)]">
            Wallace Dealer Portal
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--eco-forest-green)] hover:text-[var(--eco-earth-green)]"
        >
          Log in
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-4xl w-full grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-center">
          <div className="eco-card p-8">
            <div className="eco-card-border" aria-hidden />
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--eco-earth-green)] mb-4 text-balance">
              Secure price file distribution for Wallace dealers
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Centralize manufacturer price files, send secure download links, and give dealers
              a simple, modern way to stay up to date.
            </p>
            <div className="flex flex-wrap gap-3 mb-6 text-sm text-[var(--text-secondary)]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[var(--eco-organic-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--eco-forest-green)]" />
                Dealer-friendly portal
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[var(--eco-organic-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--eco-leaf-green)]" />
                Secure download links
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[var(--eco-organic-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--eco-zen-green)]" />
                Wallace PC integration
              </div>
            </div>
            <Link
              href="/login"
              className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-lg"
            >
              Log in to portal
            </Link>
          </div>
          <div className="hidden md:flex flex-col gap-4 text-sm text-[var(--text-secondary)]">
            <div className="eco-card p-5">
              <div className="eco-card-border" aria-hidden />
              <h3 className="text-[var(--eco-earth-green)] font-semibold mb-2">
                For admins
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Upload and manage vendor price files</li>
                <li>Create secure, time-limited download links</li>
                <li>See download activity across dealers</li>
              </ul>
            </div>
            <div className="eco-card p-5">
              <div className="eco-card-border" aria-hidden />
              <h3 className="text-[var(--eco-earth-green)] font-semibold mb-2">
                For dealers
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Sign in to access current price files</li>
                <li>Download via the Windows utility or browser</li>
                <li>Stay in sync with Wallace updates</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
