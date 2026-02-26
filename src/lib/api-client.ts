const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type UserType = "dealer" | "admin";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Dealer {
  id: number;
  name: string;
  email: string;
  customer_number: string;
  active: boolean;
  created_at: string;
}

export interface Vendor {
  id: number;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface PriceFileListItem {
  id: number;
  filename: string;
  vendor_id: number;
  dealer_id: number | null;
  uploaded_at: string;
  uploaded_by: string | null;
}

export interface DownloadLinkItem {
  id: number;
  file_id: number;
  dealer_id: number;
  token: string;
  expires_at: string;
  created_at: string;
  downloaded_at: string | null;
  download_url: string;
}

async function getStoredToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getStoredToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Login failed");
  }
  const data: TokenResponse = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  return data;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export async function getDealers(skip = 0, limit = 100, active?: boolean): Promise<Dealer[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (active !== undefined) params.set("active", String(active));
  return apiRequest<Dealer[]>(`/api/dealers?${params}`);
}

export async function getDealer(id: number): Promise<Dealer> {
  return apiRequest<Dealer>(`/api/dealers/${id}`);
}

export async function createDealer(data: {
  name: string;
  email: string;
  password: string;
  customer_number: string;
  active?: boolean;
}): Promise<Dealer> {
  return apiRequest<Dealer>("/api/dealers", {
    method: "POST",
    body: JSON.stringify({ ...data, active: data.active ?? true }),
  });
}

export async function updateDealer(
  id: number,
  data: Partial<{ name: string; email: string; password: string; customer_number: string; active: boolean }>
): Promise<Dealer> {
  return apiRequest<Dealer>(`/api/dealers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDealer(id: number): Promise<void> {
  return apiRequest<void>(`/api/dealers/${id}`, { method: "DELETE" });
}

export async function getVendors(): Promise<Vendor[]> {
  return apiRequest<Vendor[]>("/api/vendors");
}

export async function createVendor(data: { code: string; name: string; description?: string }): Promise<Vendor> {
  return apiRequest<Vendor>("/api/vendors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVendor(
  id: number,
  data: Partial<{ code: string; name: string; description: string }>
): Promise<Vendor> {
  return apiRequest<Vendor>(`/api/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteVendor(id: number): Promise<void> {
  return apiRequest<void>(`/api/vendors/${id}`, { method: "DELETE" });
}

export async function getFiles(
  vendorId?: number,
  dealerId?: number,
  skip?: number,
  limit?: number
): Promise<PriceFileListItem[]> {
  const params = new URLSearchParams();
  if (vendorId != null) params.set("vendor_id", String(vendorId));
  if (dealerId != null) params.set("dealer_id", String(dealerId));
  if (skip != null) params.set("skip", String(skip));
  if (limit != null) params.set("limit", String(limit));
  return apiRequest<PriceFileListItem[]>(`/api/files?${params}`);
}

export async function uploadFile(
  file: File,
  vendorId: number,
  dealerId?: number,
  version?: string
): Promise<{ id: number; filename: string }> {
  const token = await getStoredToken();
  const form = new FormData();
  form.append("file", file);
  form.append("vendor_id", String(vendorId));
  if (dealerId != null) form.append("dealer_id", String(dealerId));
  if (version) form.append("version", version);
  const res = await fetch(`${API_URL}/api/files/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Upload failed");
  }
  return res.json();
}

export async function generateLinks(dealerId: number, fileIds: number[]): Promise<DownloadLinkItem[]> {
  return apiRequest<DownloadLinkItem[]>("/api/links/generate", {
    method: "POST",
    body: JSON.stringify({ dealer_id: dealerId, file_ids: fileIds }),
  });
}

export async function getLinks(dealerId?: number, skip?: number, limit?: number): Promise<DownloadLinkItem[]> {
  const params = new URLSearchParams();
  if (dealerId != null) params.set("dealer_id", String(dealerId));
  if (skip != null) params.set("skip", String(skip));
  if (limit != null) params.set("limit", String(limit));
  return apiRequest<DownloadLinkItem[]>(`/api/links?${params}`);
}
