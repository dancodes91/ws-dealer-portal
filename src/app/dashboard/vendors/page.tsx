"use client";

import { useEffect, useState } from "react";
import { getVendors, createVendor, updateVendor, deleteVendor, type Vendor } from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconStore } from "@/components/icons";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await getVendors();
      setVendors(list);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createVendor({
        code: form.code,
        name: form.name,
        description: form.description || undefined,
      });
      setModal("none");
      setForm({ code: "", name: "", description: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateVendor(editing.id, {
        code: form.code,
        name: form.name,
        description: form.description || undefined,
      });
      setModal("none");
      setEditing(null);
      setForm({ code: "", name: "", description: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this vendor?")) return;
    try {
      await deleteVendor(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  function openEdit(v: Vendor) {
    setEditing(v);
    setForm({
      code: v.code,
      name: v.name,
      description: v.description ?? "",
    });
    setModal("edit");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeading icon={<IconStore />}>Vendors</PageHeading>
        <button
          onClick={() => {
            setModal("create");
            setForm({ code: "", name: "", description: "" });
          }}
          className="btn-primary"
        >
          Add vendor
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-[var(--text-secondary)]">Loading…</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--marine-light)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Code</th>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Name</th>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Description</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3">{v.code}</td>
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.description ?? "–"}</td>
                  <td className="p-3">
                    <button onClick={() => openEdit(v)} className="text-[var(--marine-secondary)] hover:underline mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal === "create" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add vendor</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving…" : "Create"}
                </button>
                <button type="button" onClick={() => setModal("none")} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "edit" && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Edit vendor</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => { setModal("none"); setEditing(null); }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
