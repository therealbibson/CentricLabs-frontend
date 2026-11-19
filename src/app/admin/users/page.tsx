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
 <p className="text-sm leading-6 text-steel">
 Customers are derived from the orders and quote requests the store
 already has — there is no separate customer registration yet. Grouped
 by phone number.
 </p>
 {error && (
 <p className="mt-4 border-2 border-ink bg-surface p-4 font-bold text-signal">
 {error}
 </p>
 )}
 {loading ? (
 <p className="mt-4 text-steel">Loading customers…</p>
 ) : customers.length === 0 ? (
 <p className="mt-4 border-2 border-ink bg-surface p-6 text-steel">
 No customers yet — the first order or quote request will create one
 here automatically.
 </p>
 ) : (
 <div className="mt-6 overflow-x-auto border-2 border-ink bg-surface">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead>
 <tr className="border-b border-line font-mono text-xs text-steel">
 <th className="px-4 py-3">Customer</th>
 <th className="px-4 py-3">Phone</th>
 <th className="px-4 py-3">Orders</th>
 <th className="px-4 py-3">Total spent</th>
 <th className="px-4 py-3">Quotes</th>
 <th className="px-4 py-3">Last seen</th>
 </tr>
 </thead>
 <tbody>
 {customers.map((c) => (
 <tr key={c.phone} className="border-b border-line last:border-0">
 <td className="px-4 py-3">
 <p className="font-bold">{c.name}</p>
 {c.email && <p className="text-xs text-steel">{c.email}</p>}
 </td>
 <td className="px-4 py-3">{c.phone}</td>
 <td className="px-4 py-3 font-bold">{c.orders}</td>
 <td className="px-4 py-3 font-black">{formatNGN(c.totalSpent)}</td>
 <td className="px-4 py-3">{c.quotes}</td>
 <td className="px-4 py-3 text-xs text-steel">
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
