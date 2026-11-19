"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  fetchCategories,
  fetchProducts,
  fetchServices,
  formatNGN,
  type Product,
  type Service,
} from "@/lib/api";

const CATEGORY_EMOJI: Record<string, string> = {
  Phones: "📱",
  "Laptops & Computers": "💻",
  Accessories: "🔌",
  Spares: "🔧",
  Gadgets: "⌚",
  Software: "💿",
  "General Goods": "🎒",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    void fetchProducts().then(setProducts);
    void fetchCategories().then(setCategories);
    void fetchServices().then(setServices);
  }, []);

  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="inline-block rounded-full bg-amber px-4 py-1.5 text-xs font-black uppercase tracking-wider text-ink">
            Lagos · Nigeria — we deliver nationwide
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Tech you need.
            <br />
            <span className="text-flame">Software we build.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-7 text-white/80">
            CentricLabs supplies phones, laptops, spares, accessories and
            gadgets — and builds the software, websites and mobile apps that
            run your business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark"
            >
              Shop products →
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white/40 px-6 py-3 font-bold text-white hover:border-amber hover:text-amber"
            >
              Get a service quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Pay on delivery in Lagos · Genuine products, tested before sale ·
            1-year warranty on new devices
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Shop by category
          </h2>
          <Link href="/shop" className="font-bold text-flame hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="rounded-2xl border border-line bg-cream p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-flame hover:shadow-md"
            >
              <span className="text-3xl">{CATEGORY_EMOJI[cat] ?? "🛍️"}</span>
              <p className="mt-3 font-bold leading-snug">{cat}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {products.filter((p) => p.category === cat).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Featured this week
        </h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-ink-soft">Loading products…</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Services preview */}
      <section className="border-y border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Services — built by developers
            </h2>
            <Link
              href="/services"
              className="font-bold text-flame hover:underline"
            >
              All services →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.id}
                href="/services"
                className="rounded-2xl border border-line bg-paper p-5 transition hover:border-flame hover:shadow-md"
              >
                <p className="font-bold leading-snug">{s.name}</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {s.tagline}
                </p>
                <p className="mt-3 text-sm font-black text-flame">
                  From {formatNGN(s.startingFrom)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why shop with us */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Why shop with CentricLabs?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Tested before sale",
              text: "Every phone and laptop is checked — battery health, screen, ports — before it leaves us.",
            },
            {
              title: "Pay on delivery in Lagos",
              text: "Order now, pay when it arrives. Bank transfer and online payment (Paystack) coming soon.",
            },
            {
              title: "Real support, from a developer",
              text: "Questions about a device or a project? You talk to the person who built the store — uabeeb3@gmail.com.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-cream p-5"
            >
              <p className="font-bold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
