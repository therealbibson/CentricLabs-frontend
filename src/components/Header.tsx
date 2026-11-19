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
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-flame text-lg font-black text-white">
            C
          </span>
          <span className="text-xl font-black tracking-tight">
            Centric<span className="text-flame">Labs</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                pathname === item.href
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-flame"
        >
          Cart
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-black text-ink">
              {count}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex items-center gap-1 border-t border-line px-4 py-2 sm:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              pathname === item.href ? "bg-ink text-white" : "text-ink-soft"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
