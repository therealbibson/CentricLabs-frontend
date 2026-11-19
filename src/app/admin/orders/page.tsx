"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { fetchAdminOrders, updateOrderStatus, type AdminOrder } from "@/lib/admin";
import { formatNGN } from "@/lib/api";

const STATUSES: AdminOrder["status"][] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLE: Record<AdminOrder["status"], string> = {
  pending: "bg-amber-soft text-ink",
  confirmed: "bg-sage text-ink",
  shipped: "bg-amber text-ink",
  delivered: "bg-ink text-white",
  cancelled: "bg-flame text-white",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    void fetchAdminOrders()
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function changeStatus(order: AdminOrder, status: AdminOrder["status"]) {
    try {
      await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update order.");
    }
  }

  return (
    <AdminShell title="Orders">
      {error && (
        <p className="mb-4 rounded-2xl border border-line bg-cream p-4 font-bold text-flame">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-ink-soft">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-line bg-cream p-6 text-ink-soft">
          No orders yet — orders placed at checkout will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <article key={o.id} className="rounded-2xl border border-line bg-cream p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-black">{o.id}</p>
                  <p className="text-sm text-ink-soft">
                    {o.customer.name} · {o.customer.phone} ·{" "}
                    {new Date(o.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black">{formatNGN(o.total)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_STYLE[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenId(openId === o.id ? null : o.id)}
                className="mt-3 text-sm font-bold text-flame hover:underline"
              >
                {openId === o.id ? "Hide details" : "View details"}
              </button>

              {openId === o.id && (
                <div className="mt-3 rounded-xl bg-paper p-4 text-sm leading-6">
                  <p>
                    <strong>Address:</strong> {o.customer.address}
                  </p>
                  {o.customer.email && (
                    <p>
                      <strong>Email:</strong> {o.customer.email}
                    </p>
                  )}
                  <p>
                    <strong>Payment:</strong> {o.paymentMethod}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {o.items.map((item) => (
                      <li key={item.id}>
                        {item.name} × {item.qty} — {formatNGN(item.price * item.qty)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <label className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold">
                Update status
                <select
                  value={o.status}
                  onChange={(e) => void changeStatus(o, e.target.value as AdminOrder["status"])}
                  className="rounded-full border border-line bg-paper px-3 py-2 outline-none focus:border-flame"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="font-normal text-ink-soft">
                  pending → confirmed → shipped → delivered (or cancelled)
                </span>
              </label>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
