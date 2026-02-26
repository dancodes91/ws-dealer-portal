"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeading } from "@/components/PageHeading";
import { StatCard } from "@/components/StatCard";
import {
  IconDashboard,
  IconUsers,
  IconStore,
  IconFiles,
  IconLink,
  IconChart,
} from "@/components/icons";
import {
  getDealers,
  getVendors,
  getFiles,
  getLinks,
  apiRequest,
  type PriceFileListItem,
  type DownloadLinkItem,
} from "@/lib/api-client";

interface DownloadStats {
  total_downloads: number;
  by_dealer: { dealer_id: number; count: number }[];
}

interface AuditLogItem {
  id: number;
  user_id: number | null;
  user_type: string | null;
  action: string;
  details: string | null;
  ip_address: string | null;
  timestamp: string;
}

export default function DashboardPage() {
  const { userType, email } = useAuth();
  const isAdmin = userType === "admin";

  const [statsLoading, setStatsLoading] = useState(isAdmin);
  const [statsError, setStatsError] = useState("");
  const [dealersCount, setDealersCount] = useState<number | null>(null);
  const [vendorsCount, setVendorsCount] = useState<number | null>(null);
  const [filesCount, setFilesCount] = useState<number | null>(null);
  const [linksCount, setLinksCount] = useState<number | null>(null);
  const [totalDownloads, setTotalDownloads] = useState<number | null>(null);

  const [recentFiles, setRecentFiles] = useState<PriceFileListItem[]>([]);
  const [recentLinks, setRecentLinks] = useState<DownloadLinkItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      setStatsError("");
      try {
        const [dealers, vendors, files, links, downloadStats, activity] = await Promise.all([
          getDealers(),
          getVendors(),
          getFiles(undefined, undefined, 0, 500),
          getLinks(undefined, 0, 500),
          apiRequest<DownloadStats>("/api/reports/downloads"),
          apiRequest<AuditLogItem[]>("/api/reports/activity?limit=5"),
        ]);
        if (cancelled) return;
        setDealersCount(dealers.length);
        setVendorsCount(vendors.length);
        setFilesCount(files.length);
        setLinksCount(links.length);
        setTotalDownloads(downloadStats.total_downloads);
        setRecentFiles(files.slice(0, 5));
        setRecentLinks(links.slice(0, 5));
        setRecentActivity(activity);
      } catch (e) {
        if (!cancelled) {
          setStatsError(e instanceof Error ? e.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  return (
    <div>
      <PageHeading icon={<IconDashboard />}>Dashboard</PageHeading>
      <p className="text-[var(--text-secondary)] mb-6">
        Welcome{email ? `, ${email}` : ""}.
      </p>

      {isAdmin ? (
        <>
          {statsError && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
              {statsError}
            </div>
          )}

          {statsLoading ? (
            <p className="text-[var(--text-secondary)]">Loading stats…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                  label="Dealers"
                  value={dealersCount ?? 0}
                  icon={<IconUsers />}
                />
                <StatCard
                  label="Vendors"
                  value={vendorsCount ?? 0}
                  icon={<IconStore />}
                />
                <StatCard
                  label="Price files"
                  value={filesCount ?? 0}
                  icon={<IconFiles />}
                />
                <StatCard
                  label="Download links"
                  value={linksCount ?? 0}
                  icon={<IconLink />}
                />
                <StatCard
                  label="Total downloads"
                  value={totalDownloads ?? 0}
                  icon={<IconChart />}
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-[var(--marine-dark)]">Recent files</h2>
                    <Link
                      href="/dashboard/files"
                      className="text-sm text-[var(--marine-primary)] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  {recentFiles.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No files yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentFiles.map((f) => (
                        <li key={f.id} className="text-sm flex justify-between gap-2">
                          <span className="truncate" title={f.filename}>
                            {f.filename}
                          </span>
                          <span className="text-[var(--text-secondary)] shrink-0">
                            {formatDate(f.uploaded_at)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-[var(--marine-dark)]">Recent links</h2>
                    <Link
                      href="/dashboard/links"
                      className="text-sm text-[var(--marine-primary)] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  {recentLinks.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No links yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentLinks.map((l) => (
                        <li key={l.id} className="text-sm flex justify-between gap-2 items-center">
                          <span className="text-[var(--text-secondary)]">
                            Dealer {l.dealer_id} · File {l.file_id}
                          </span>
                          <span className="shrink-0 flex items-center gap-1">
                            {l.downloaded_at ? (
                              <span className="text-[var(--text-secondary)]">Used</span>
                            ) : null}
                            <span className="text-[var(--text-secondary)]">
                              {formatDate(l.created_at)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-[var(--marine-dark)]">Recent activity</h2>
                    <Link
                      href="/dashboard/reports"
                      className="text-sm text-[var(--marine-primary)] hover:underline"
                    >
                      Reports
                    </Link>
                  </div>
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No recent activity.</p>
                  ) : (
                    <ul className="space-y-2">
                      {recentActivity.map((a) => (
                        <li key={a.id} className="text-sm">
                          <span className="font-medium">{a.action}</span>
                          {a.details && (
                            <span className="text-[var(--text-secondary)]"> — {a.details}</span>
                          )}
                          <span className="block text-[var(--text-secondary)] text-xs mt-0.5">
                            {formatDate(a.timestamp)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card p-6 mb-6">
            <p>
              As a dealer, you can view available price files and download links from this portal.
              Contact support if you need assistance.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-[var(--marine-dark)] mb-2">Quick links</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-3">
              Need help? Contact your administrator or support for access to price files and
              download links.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return iso;
  }
}
