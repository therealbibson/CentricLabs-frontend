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
        <p className="rounded-2xl border border-line bg-cream p-4 font-bold text-flame">
          {error}
        </p>
      )}
      {!stats && !error && <p className="text-ink-soft">Loading dashboard…</p>}
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
                className="rounded-2xl border border-line bg-cream p-5 shadow-sm transition hover:border-flame"
              >
                <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-black">{card.value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-line bg-cream p-5">
              <h2 className="font-black">Low stock — 5 or fewer left</h2>
              {stats.lowStock.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">Nothing low on stock. 🎉</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {stats.lowStock.map((p) => (
                    <li key={p.id} className="flex justify-between gap-3">
                      <Link href="/admin/products" className="font-semibold hover:text-flame">
                        {p.name}
                      </Link>
                      <span className="font-black text-flame">
                        {p.stock} left · {formatNGN(p.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-line bg-cream p-5">
              <h2 className="font-black">Recent orders</h2>
              {stats.recentOrders.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">
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
              <Link href="/admin/orders" className="mt-4 inline-block text-sm font-bold text-flame hover:underline">
                View all orders →
              </Link>
            </section>
          </div>
        </>
      )}
    </AdminShell>
  );
}
