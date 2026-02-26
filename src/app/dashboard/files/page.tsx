"use client";

import { useEffect, useState } from "react";
import { getFiles, getVendors, uploadFile, type PriceFileListItem, type Vendor } from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconFiles } from "@/components/icons";

export default function FilesPage() {
  const [files, setFiles] = useState<PriceFileListItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ vendorId: 0, dealerId: "", version: "" });
  const [fileInput, setFileInput] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [fList, vList] = await Promise.all([getFiles(), getVendors()]);
      setFiles(fList);
      setVendors(vList);
      if (vList.length && !uploadForm.vendorId) setUploadForm((u) => ({ ...u, vendorId: vList[0].id }));
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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!fileInput || !uploadForm.vendorId) return;
    setUploading(true);
    setError("");
    try {
      await uploadFile(
        fileInput,
        uploadForm.vendorId,
        uploadForm.dealerId ? parseInt(uploadForm.dealerId, 10) : undefined,
        uploadForm.version || undefined
      );
      setFileInput(null);
      setUploadForm((u) => ({ ...u, version: "" }));
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <PageHeading icon={<IconFiles />}>Files</PageHeading>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-[var(--marine-dark)] mb-4">Upload price file</h2>
        <form onSubmit={handleUpload} className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <select
              value={uploadForm.vendorId}
              onChange={(e) => setUploadForm((u) => ({ ...u, vendorId: parseInt(e.target.value, 10) }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.code} – {v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dealer ID (optional)</label>
            <input
              type="number"
              placeholder="Leave blank for shared file"
              value={uploadForm.dealerId}
              onChange={(e) => setUploadForm((u) => ({ ...u, dealerId: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Version (optional)</label>
            <input
              value={uploadForm.version}
              onChange={(e) => setUploadForm((u) => ({ ...u, version: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File</label>
            <input
              type="file"
              onChange={(e) => setFileInput(e.target.files?.[0] ?? null)}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={uploading || !fileInput} className="btn-primary">
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <h2 className="font-semibold p-4 border-b border-[var(--border)]">Uploaded files</h2>
        {loading ? (
          <p className="p-4 text-[var(--text-secondary)]">Loading…</p>
        ) : files.length === 0 ? (
          <p className="p-4 text-[var(--text-secondary)]">No files yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--marine-light)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left p-3 font-medium">Filename</th>
                <th className="text-left p-3 font-medium">Vendor ID</th>
                <th className="text-left p-3 font-medium">Dealer ID</th>
                <th className="text-left p-3 font-medium">Uploaded</th>
                <th className="text-left p-3 font-medium">By</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3">{f.filename}</td>
                  <td className="p-3">{f.vendor_id}</td>
                  <td className="p-3">{f.dealer_id ?? "–"}</td>
                  <td className="p-3">{new Date(f.uploaded_at).toLocaleString()}</td>
                  <td className="p-3">{f.uploaded_by ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
