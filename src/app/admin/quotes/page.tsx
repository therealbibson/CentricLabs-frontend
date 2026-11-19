"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { fetchAdminQuotes, updateQuoteStatus, type AdminQuote } from "@/lib/admin";

const STATUS_STYLE: Record<AdminQuote["status"], string> = {
 new: "bg-mist text-slate",
 contacted: "bg-copper text-white",
 done: "bg-ink text-white",
};

export default function AdminQuotesPage() {
 const [quotes, setQuotes] = useState<AdminQuote[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const load = () => {
 setLoading(true);
 void fetchAdminQuotes()
 .then(setQuotes)
 .catch((err: Error) => setError(err.message))
 .finally(() => setLoading(false));
 };

 useEffect(load, []);

 async function changeStatus(quote: AdminQuote, status: AdminQuote["status"]) {
 try {
 await updateQuoteStatus(quote.id, status);
 setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, status } : q)));
 } catch (err) {
 setError(err instanceof Error ? err.message : "Could not update quote.");
 }
 }

 return (
 <AdminShell title="Quote requests">
 {error && (
 <p className="mb-4 rounded-xl bg-red-50 p-4 font-semibold text-red-700">
 {error}
 </p>
 )}
 {loading ? (
 <p className="text-slate">Loading quote requests…</p>
 ) : quotes.length === 0 ? (
 <p className="rounded-2xl border border-line bg-surface p-6 text-slate shadow-sm">
 No quote requests yet — requests from the Services page will appear
 here.
 </p>
 ) : (
 <div className="space-y-4">
 {quotes.map((q) => (
 <article key={q.id} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <p className="font-extrabold">{q.id}</p>
 <p className="text-sm text-slate">
 {q.name} · {q.phone}
 {q.email ? ` · ${q.email}` : ""} ·{" "}
 {new Date(q.createdAt).toLocaleString("en-NG")}
 </p>
 </div>
 <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[q.status]}`}>
 {q.status}
 </span>
 </div>
 <p className="mt-3 text-sm leading-6">
 <strong>Service:</strong> {q.serviceId}
 </p>
 <p className="mt-1 text-sm leading-6 text-slate">{q.details}</p>
 <div className="mt-4 flex flex-wrap gap-2">
 <button
 type="button"
 onClick={() => void changeStatus(q, "contacted")}
 disabled={q.status !== "new"}
 className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-40"
 >
 Mark as contacted
 </button>
 <button
 type="button"
 onClick={() => void changeStatus(q, "done")}
 disabled={q.status === "done"}
 className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-ink disabled:opacity-40"
 >
 Mark as done
 </button>
 </div>
 </article>
 ))}
 </div>
 )}
 </AdminShell>
 );
}
