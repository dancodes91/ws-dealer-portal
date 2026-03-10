"use client";

import { useEffect, useState } from "react";
import {
  getLinks,
  getDealers,
  getFiles,
  generateLinks,
  type Dealer,
  type DownloadLinkItem,
  type PriceFileListItem,
} from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconLink } from "@/components/icons";

export default function LinksPage() {
  const [links, setLinks] = useState<DownloadLinkItem[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [files, setFiles] = useState<PriceFileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ dealerId: 0, fileIds: [] as number[] });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [lList, dList, fList] = await Promise.all([getLinks(), getDealers(), getFiles()]);
      setLinks(lList);
      setDealers(dList);
      setFiles(fList);
      if (dList.length && !form.dealerId) setForm((f) => ({ ...f, dealerId: dList[0].id }));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.dealerId || form.fileIds.length === 0) {
      setError("Select a dealer and at least one file.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await generateLinks(form.dealerId, form.fileIds);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate links");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleFile(id: number) {
    setForm((f) => ({
      ...f,
      fileIds: f.fileIds.includes(id) ? f.fileIds.filter((x) => x !== id) : [...f.fileIds, id],
    }));
  }

  const dealerById = new Map(dealers.map((d) => [d.id, d]));

  return (
    <div>
      <PageHeading icon={<IconLink />}>Download links</PageHeading>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-[var(--marine-dark)] mb-4">Generate links</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dealer</label>
            <select
              value={form.dealerId}
              onChange={(e) => setForm((f) => ({ ...f, dealerId: parseInt(e.target.value, 10) }))}
              className="w-full max-w-xs px-3 py-2 border border-[var(--border)] rounded"
            >
              {dealers.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.customer_number})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Files (select one or more)</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-[var(--border)] rounded p-2">
              {files.map((f) => (
                <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.fileIds.includes(f.id)}
                    onChange={() => toggleFile(f.id)}
                  />
                  <span className="text-sm">{f.filename}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={submitting || form.fileIds.length === 0} className="btn-primary">
            {submitting ? "Generating…" : "Generate links"}
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <h2 className="font-semibold p-4 border-b border-[var(--border)]">Recent links</h2>
        {loading ? (
          <p className="p-4 text-[var(--text-secondary)]">Loading…</p>
        ) : links.length === 0 ? (
          <p className="p-4 text-[var(--text-secondary)]">No links yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--marine-light)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left p-3 font-medium">Dealer</th>
                <th className="text-left p-3 font-medium">Vendor</th>
                <th className="text-left p-3 font-medium">File</th>
                <th className="text-left p-3 font-medium">Expires</th>
                <th className="text-left p-3 font-medium">Downloaded</th>
                <th className="text-left p-3 font-medium">Link</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3">
                    {(() => {
                      const d = dealerById.get(l.dealer_id);
                      return d ? `${d.name} (${d.customer_number})` : l.dealer_id;
                    })()}
                  </td>
                  <td className="p-3">
                    {l.vendor_name || l.vendor_code || "–"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {l.filename || "MAST001.ZIP"}
                    {l.version ? (
                      <span className="text-[var(--text-secondary)] text-xs ml-1">
                        ({l.version})
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3">{new Date(l.expires_at).toLocaleString()}</td>
                  <td className="p-3">{l.downloaded_at ? new Date(l.downloaded_at).toLocaleString() : "–"}</td>
                  <td className="p-3">
                    <a href={l.download_url} target="_blank" rel="noopener noreferrer" className="text-[var(--marine-secondary)] hover:underline break-all">
                      {l.download_url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
