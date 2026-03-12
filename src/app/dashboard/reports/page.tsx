"use client";

import { useEffect, useState } from "react";
import { apiRequest, getDealers, type Dealer } from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconChart } from "@/components/icons";

interface DownloadStats {
  total_downloads: number;
  by_dealer: { dealer_id: number; count: number }[];
}

interface DealerDownloadRow {
  dealer_id: number;
  count: number;
  name: string;
  customer_number: string | null;
  share: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [data, dealerList] = await Promise.all([
          apiRequest<DownloadStats>("/api/reports/downloads"),
          getDealers(),
        ]);
        if (cancelled) return;
        setStats(data);
        setDealers(dealerList);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows: DealerDownloadRow[] =
    stats && dealers.length
      ? (() => {
          const dealerById = new Map(dealers.map((d) => [d.id, d]));
          const total = stats.total_downloads || 0;
          return stats.by_dealer
            .map(({ dealer_id, count }) => {
              const d = dealerById.get(dealer_id);
              return {
                dealer_id,
                count,
                name: d ? d.name : `Dealer #${dealer_id}`,
                customer_number: d ? d.customer_number : null,
                share: total > 0 ? (count / total) * 100 : 0,
              };
            })
            .sort((a, b) => b.count - a.count);
        })()
      : [];

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
        <div className="space-y-6">
          <div className="eco-card p-6">
            <div className="eco-card-border" aria-hidden />
            <h2 className="font-semibold text-[var(--eco-earth-green)] mb-2">
              Overall downloads
            </h2>
            <p className="text-[var(--text-secondary)] mb-1">Total completed downloads</p>
            <p className="text-3xl font-bold text-[var(--eco-earth-green)]">
              {stats.total_downloads}
            </p>
          </div>

          {rows.length > 0 && (
            <div className="eco-card p-6">
              <div className="eco-card-border" aria-hidden />
              <h2 className="font-semibold text-[var(--eco-earth-green)] mb-4">
                Downloads by dealer
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Top dealers by completed downloads. Percentages are relative to total downloads.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full max-w-2xl">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-card)]/70">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium">Dealer</th>
                      <th className="text-left py-2 px-2 font-medium">Downloads</th>
                      <th className="text-left py-2 px-2 font-medium">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.dealer_id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2 px-2">
                          <div className="text-sm font-medium">
                            {row.name}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {row.customer_number
                              ? `Customer #${row.customer_number}`
                              : `Dealer #${row.dealer_id}`}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-sm">{row.count}</td>
                        <td className="py-2 px-2 text-sm">
                          {row.share.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
