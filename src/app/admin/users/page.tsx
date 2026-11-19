"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { fetchAdminCustomers, type Customer } from "@/lib/admin";
import { formatNGN } from "@/lib/api";

export default function AdminCustomersPage() {
 const [customers, setCustomers] = useState<Customer[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 void fetchAdminCustomers()
 .then(setCustomers)
 .catch((err: Error) => setError(err.message))
 .finally(() => setLoading(false));
 }, []);

 return (
 <AdminShell title="Customers">
 <p className="text-sm leading-6 text-slate">
 Customers are derived from the orders and quote requests the store
 already has — there is no separate customer registration yet. Grouped
 by phone number.
 </p>
 {error && (
 <p className="mt-4 rounded-xl bg-red-50 p-4 font-semibold text-red-700">
 {error}
 </p>
 )}
 {loading ? (
 <p className="mt-4 text-slate">Loading customers…</p>
 ) : customers.length === 0 ? (
 <p className="mt-4 rounded-2xl border border-line bg-surface p-6 text-slate shadow-sm">
 No customers yet — the first order or quote request will create one
 here automatically.
 </p>
 ) : (
 <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead>
 <tr className="border-b border-line bg-mist text-xs text-slate">
 <th className="px-4 py-3 font-semibold">Customer</th>
 <th className="px-4 py-3 font-semibold">Phone</th>
 <th className="px-4 py-3 font-semibold">Orders</th>
 <th className="px-4 py-3 font-semibold">Total spent</th>
 <th className="px-4 py-3 font-semibold">Quotes</th>
 <th className="px-4 py-3 font-semibold">Last seen</th>
 </tr>
 </thead>
 <tbody>
 {customers.map((c) => (
 <tr key={c.phone} className="border-b border-line last:border-0">
 <td className="px-4 py-3">
 <p className="font-semibold">{c.name}</p>
 {c.email && <p className="text-xs text-slate">{c.email}</p>}
 </td>
 <td className="px-4 py-3">{c.phone}</td>
 <td className="px-4 py-3 font-semibold">{c.orders}</td>
 <td className="px-4 py-3 font-extrabold">{formatNGN(c.totalSpent)}</td>
 <td className="px-4 py-3">{c.quotes}</td>
 <td className="px-4 py-3 text-xs text-slate">
 {new Date(c.lastSeen).toLocaleString("en-NG")}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </AdminShell>
 );
}
