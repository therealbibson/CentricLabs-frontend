"use client";

import { API_URL, type Product } from "./api";

export const ADMIN_TOKEN_KEY = "centriclabs-admin-token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export interface AdminOrder {
  id: string;
  customer: { name: string; phone: string; email?: string; address: string };
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AdminQuote {
  id: string;
  serviceId: string;
  name: string;
  phone: string;
  email?: string;
  details: string;
  status: "new" | "contacted" | "done";
  createdAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  pendingQuotes: number;
  totalQuotes: number;
  lowStock: Product[];
  recentOrders: AdminOrder[];
}

export interface Customer {
  name: string;
  email?: string;
  phone: string;
  orders: number;
  totalSpent: number;
  quotes: number;
  lastSeen: string;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    throw new Error("Admin login required — please log in again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Wrong password — try again.");
  const data = (await res.json()) as { token: string };
  setAdminToken(data.token);
  return data.token;
}

export const fetchAdminStats = () => adminFetch<AdminStats>("/api/admin/stats");
export const fetchAdminOrders = () => adminFetch<AdminOrder[]>("/api/orders");
export const fetchAdminCustomers = () =>
  adminFetch<Customer[]>("/api/admin/customers");
export const fetchAdminQuotes = () => adminFetch<AdminQuote[]>("/api/admin/quotes");
export const fetchAdminProducts = () => adminFetch<Product[]>("/api/products");

export const updateOrderStatus = (id: string, status: AdminOrder["status"]) =>
  adminFetch<{ id: string; status: string }>(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const updateQuoteStatus = (id: string, status: AdminQuote["status"]) =>
  adminFetch<{ id: string; status: string }>(`/api/quotes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const createProduct = (body: Partial<Product>) =>
  adminFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateProduct = (id: string, body: Partial<Product>) =>
  adminFetch<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteProduct = (id: string) =>
  adminFetch<{ deleted: string }>(`/api/products/${id}`, { method: "DELETE" });
