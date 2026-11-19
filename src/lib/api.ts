import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_SERVICES } from "./fallback";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  stock: number;
  badge?: string;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startingFrom: number;
  features: string[];
}

export interface OrderResponse {
  id: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as T;
  } catch {
    // Backend not running (or unreachable) — render from the embedded
    // sample catalogue instead of showing an empty shop.
    return fallback;
  }
}

export function fetchProducts(): Promise<Product[]> {
  return getJson<Product[]>("/api/products", FALLBACK_PRODUCTS);
}

export function fetchProduct(id: string): Promise<Product | undefined> {
  return getJson<Product | undefined>(
    `/api/products/${id}`,
    FALLBACK_PRODUCTS.find((p) => p.id === id),
  );
}

export function fetchCategories(): Promise<string[]> {
  return getJson<string[]>("/api/categories", FALLBACK_CATEGORIES);
}

export function fetchServices(): Promise<Service[]> {
  return getJson<Service[]>("/api/services", FALLBACK_SERVICES);
}

export async function createOrder(body: {
  customer: { name: string; phone: string; email?: string; address: string };
  items: { id: string; name: string; price: number; qty: number }[];
  paymentMethod: string;
}): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not place order");
  }
  return (await res.json()) as OrderResponse;
}

export async function createQuote(body: {
  serviceId: string;
  name: string;
  phone: string;
  email?: string;
  details: string;
}): Promise<{ id: string; message: string }> {
  const res = await fetch(`${API_URL}/api/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not send quote request");
  }
  return (await res.json()) as { id: string; message: string };
}

export function formatNGN(n: number): string {
  return `₦${n.toLocaleString("en-NG")}`;
}
