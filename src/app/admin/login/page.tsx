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
 <div className="border-2 border-ink bg-surface p-8">
 <p className="font-display text-3xl font-black tracking-tight">
 CentricLabs Admin
 </p>
 <p className="mt-2 text-sm leading-6 text-steel">
 Log in to manage products, orders, customers and quote requests.
 </p>
 <form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-bold">
 Admin password
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="mt-1 w-full border-2 border-ink bg-base px-4 py-3 text-sm outline-none focus:border-signal"
 required
 autoFocus
 placeholder="Enter admin password"
 />
 </label>
 {error && <p className="text-sm font-bold text-signal">{error}</p>}
 <button
 type="submit"
 disabled={busy}
 className="w-full bg-signal px-6 py-3 font-bold text-white hover:bg-signal-deep disabled:opacity-50"
 >
 {busy ? "Logging in…" : "Log in"}
 </button>
 </form>
 <p className="mt-6 bg-base p-4 text-xs leading-5 text-steel">
 Demo password for local development: <strong>admin123</strong>.
 Change it with the <code>ADMIN_PASSWORD</code> environment variable
 before any real deployment — see backend/.env.example.
 </p>
 </div>
 </div>
 );
}
