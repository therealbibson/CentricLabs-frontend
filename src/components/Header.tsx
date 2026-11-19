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
      {/* Spec strip: the facts a buyer checks first, in mono. */}
      <div className="bg-ink px-4 py-1.5 text-white sm:px-6">
        <p className="mx-auto max-w-6xl font-mono text-[11px] leading-5 tracking-wide">
          Lagos, Nigeria · Pay on delivery in Lagos · Every device tested
          before sale
        </p>
      </div>

      <div className="border-b-2 border-ink bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center bg-signal font-display text-lg font-black text-white"
            >
              C
            </span>
            <span className="font-display text-xl font-black tracking-tight">
              CentricLabs
            </span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b-2 py-1 text-sm font-semibold ${
                  pathname === item.href
                    ? "border-signal text-ink"
                    : "border-transparent text-steel hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className="bg-ink px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-signal"
          >
            Cart{" "}
            <span className="font-mono">
              ({count})
            </span>
          </Link>
        </div>

        <nav
          className="flex items-center gap-5 border-t border-line px-4 py-2 sm:hidden"
          aria-label="Main mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`border-b-2 py-0.5 text-sm font-semibold ${
                pathname === item.href
                  ? "border-signal text-ink"
                  : "border-transparent text-steel"
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
