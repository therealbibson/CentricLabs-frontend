"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
];

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40">
      {/* Quiet trust line — the facts a buyer checks first. */}
      <div className="border-b border-line bg-surface px-4 py-2 text-center text-xs text-slate sm:px-6">
        Lagos, Nigeria · Pay on delivery in Lagos · Every device tested
        before sale
      </div>

      <div className="border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-lg font-extrabold text-white"
            >
              C
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              CentricLabs
            </span>
          </Link>

          <nav className="hidden items-center gap-7 sm:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b-2 py-1 text-sm font-semibold ${
                  pathname === item.href
                    ? "border-copper text-ink"
                    : "border-transparent text-slate hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Cart{" "}
            <span
              key={count}
              className="inline-block animate-pop rounded-full bg-white/15 px-1.5 py-0.5 text-xs"
            >
              {count}
            </span>
          </Link>
        </div>

        <nav
          className="flex items-center gap-6 border-t border-line px-4 py-2 sm:hidden"
          aria-label="Main mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`border-b-2 py-0.5 text-sm font-semibold ${
                pathname === item.href
                  ? "border-copper text-ink"
                  : "border-transparent text-slate"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
