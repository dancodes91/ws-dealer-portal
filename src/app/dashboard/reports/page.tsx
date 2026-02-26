"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconChart } from "@/components/icons";

interface DownloadStats {
  total_downloads: number;
  by_dealer: { dealer_id: number; count: number }[];
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiRequest<DownloadStats>("/api/reports/downloads");
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <PageHeading icon={<IconChart />}>Reports</PageHeading>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-[var(--text-secondary)]">Loading…</p>
      ) : stats ? (
        <div className="card p-6">
          <h2 className="font-semibold text-[var(--marine-dark)] mb-4">Download statistics</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Total downloads: <strong>{stats.total_downloads}</strong>
          </p>
          {stats.by_dealer.length > 0 && (
            <table className="w-full max-w-md">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <th className="text-left py-2 font-medium">Dealer ID</th>
                  <th className="text-left py-2 font-medium">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_dealer.map(({ dealer_id, count }) => (
                  <tr key={dealer_id} className="border-b border-[var(--border)]">
                    <td className="py-2">{dealer_id}</td>
                    <td className="py-2">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}
