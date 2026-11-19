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
    return <p className="mx-auto max-w-6xl p-10 text-ink-soft">Checking admin login…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <div className="flex gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-bold hover:border-flame"
          >
            View store →
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminToken();
              router.replace("/admin/login");
            }}
            className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-flame"
          >
            Log out
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              pathname === item.href
                ? "bg-flame text-white"
                : "border border-line bg-cream text-ink-soft hover:border-flame hover:text-ink"
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
