"use client";

import { useEffect, useState } from "react";
import { getDealers, createDealer, updateDealer, deleteDealer, type Dealer } from "@/lib/api-client";
import { PageHeading } from "@/components/PageHeading";
import { IconUsers } from "@/components/icons";

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"none" | "create" | "edit">("none");
  const [editing, setEditing] = useState<Dealer | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    customer_number: "",
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await getDealers();
      setDealers(list);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dealers");
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
      await createDealer(form);
      setModal("none");
      setForm({ name: "", email: "", password: "", customer_number: "", active: true });
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
      await updateDealer(editing.id, {
        name: form.name,
        email: form.email,
        customer_number: form.customer_number,
        active: form.active,
        ...(form.password ? { password: form.password } : {}),
      });
      setModal("none");
      setEditing(null);
      setForm({ name: "", email: "", password: "", customer_number: "", active: true });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this dealer?")) return;
    try {
      await deleteDealer(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  function openEdit(d: Dealer) {
    setEditing(d);
    setForm({
      name: d.name,
      email: d.email,
      password: "",
      customer_number: d.customer_number,
      active: d.active,
    });
    setModal("edit");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeading icon={<IconUsers />}>Dealers</PageHeading>
        <button
          onClick={() => {
            setModal("create");
            setForm({ name: "", email: "", password: "", customer_number: "", active: true });
          }}
          className="btn-primary"
        >
          Add dealer
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
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Name</th>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Email</th>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Customer #</th>
                <th className="text-left p-3 font-medium text-[var(--marine-dark)]">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {dealers.map((d) => (
                <tr key={d.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.email}</td>
                  <td className="p-3">{d.customer_number}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.active ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {d.active ? "Active" : "Pending / Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => openEdit(d)} className="text-[var(--marine-secondary)] hover:underline mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline">
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
            <h2 className="text-lg font-semibold mb-4">Add dealer</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Customer number"
                value={form.customer_number}
                onChange={(e) => setForm((f) => ({ ...f, customer_number: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
                Active
              </label>
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
            <h2 className="text-lg font-semibold mb-4">Edit dealer</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                type="password"
                placeholder="New password (leave blank to keep)"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <input
                placeholder="Customer number"
                value={form.customer_number}
                onChange={(e) => setForm((f) => ({ ...f, customer_number: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
                Active
              </label>
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
