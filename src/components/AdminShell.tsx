"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { clearAdminToken, getAdminToken } from "@/lib/admin";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Customers" },
  { href: "/admin/quotes", label: "Quotes" },
];

/**
 * Guard + shell for the protected admin pages. Redirects to /admin/login
 * when there is no admin token in localStorage.
 *
 * Admin is a working tool, not a marketing page: same tokens, restrained
 * art direction — white panels, hairline borders, pill navigation, ink
 * only for the active section and primary actions.
 */
export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <p className="mx-auto max-w-6xl p-10 text-slate">Checking admin login…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate">CentricLabs admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/shop"
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-ink"
          >
            View store
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminToken();
              router.replace("/admin/login");
            }}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Log out
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === item.href
                ? "bg-ink text-white"
                : "border border-line bg-surface text-slate hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
