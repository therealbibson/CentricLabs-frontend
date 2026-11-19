"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { adminLogin } from "@/lib/admin";

export default function AdminLoginPage() {
 const router = useRouter();
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);

 async function submit(e: FormEvent) {
 e.preventDefault();
 setBusy(true);
 setError("");
 try {
 await adminLogin(password);
 router.replace("/admin");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Login failed.");
 } finally {
 setBusy(false);
 }
 }

 return (
 <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
 <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm">
 <p className="font-display text-3xl font-extrabold tracking-tight">
 CentricLabs Admin
 </p>
 <p className="mt-2 text-sm leading-6 text-slate">
 Log in to manage products, orders, customers and quote requests.
 </p>
 <form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-semibold">
 Admin password
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="mt-1 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
 required
 autoFocus
 placeholder="Enter admin password"
 />
 </label>
 {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
 <button
 type="submit"
 disabled={busy}
 className="w-full rounded-lg bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50"
 >
 {busy ? "Logging in…" : "Log in"}
 </button>
 </form>
 <p className="mt-6 rounded-xl bg-mist p-4 text-xs leading-5 text-slate">
 Demo password for local development: <strong>admin123</strong>.
 Change it with the <code>ADMIN_PASSWORD</code> environment variable
 before any real deployment — see backend/.env.example.
 </p>
 </div>
 </div>
 );
}
