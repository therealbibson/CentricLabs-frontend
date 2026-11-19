"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { fetchAdminStats, type AdminStats } from "@/lib/admin";
import { formatNGN } from "@/lib/api";

export default function AdminDashboardPage() {
 const [stats, setStats] = useState<AdminStats | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 void fetchAdminStats().then(setStats).catch((err: Error) => setError(err.message));
 }, []);

 return (
 <AdminShell title="Admin dashboard">
 {error && (
 <p className="border-2 border-ink bg-surface p-4 font-bold text-signal">
 {error}
 </p>
 )}
 {!stats && !error && <p className="text-steel">Loading dashboard…</p>}
 {stats && (
 <>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {[
 { label: "Products", value: String(stats.totalProducts), href: "/admin/products" },
 { label: "Orders", value: String(stats.totalOrders), href: "/admin/orders" },
 { label: "Revenue (excl. cancelled)", value: formatNGN(stats.revenue), href: "/admin/orders" },
 { label: "Pending quotes", value: String(stats.pendingQuotes), href: "/admin/quotes" },
 ].map((card) => (
 <Link
 key={card.label}
 href={card.href}
 className="border-2 border-ink bg-surface p-5 hover:border-signal"
 >
 <p className="font-mono text-sm text-steel">
 {card.label}
 </p>
 <p className="mt-2 font-display text-3xl font-black">{card.value}</p>
 </Link>
 ))}
 </div>

 <div className="mt-8 grid gap-8 lg:grid-cols-2">
 <section className="border-2 border-ink bg-surface p-5">
 <h2 className="font-black">Low stock — 5 or fewer left</h2>
 {stats.lowStock.length === 0 ? (
 <p className="mt-3 text-sm text-steel">Nothing low on stock.</p>
 ) : (
 <ul className="mt-3 space-y-2 text-sm">
 {stats.lowStock.map((p) => (
 <li key={p.id} className="flex justify-between gap-3">
 <Link href="/admin/products" className="font-semibold hover:text-signal">
 {p.name}
 </Link>
 <span className="font-black text-signal">
 {p.stock} left · {formatNGN(p.price)}
 </span>
 </li>
 ))}
 </ul>
 )}
 </section>

 <section className="border-2 border-ink bg-surface p-5">
 <h2 className="font-black">Recent orders</h2>
 {stats.recentOrders.length === 0 ? (
 <p className="mt-3 text-sm text-steel">
 No orders yet — orders from the checkout will show here.
 </p>
 ) : (
 <ul className="mt-3 space-y-2 text-sm">
 {stats.recentOrders.map((o) => (
 <li key={o.id} className="flex justify-between gap-3">
 <span>
 <span className="font-bold">{o.id}</span> · {o.customer.name}
 </span>
 <span className="font-black">{formatNGN(o.total)}</span>
 </li>
 ))}
 </ul>
 )}
 <Link href="/admin/orders" className="mt-4 inline-block text-sm font-bold text-signal hover:underline">
 View all orders
 </Link>
 </section>
 </div>
 </>
 )}
 </AdminShell>
 );
}
