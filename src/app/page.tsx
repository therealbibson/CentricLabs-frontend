"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import ProductCard from "@/components/ProductCard";
import {
  fetchCategories,
  fetchProducts,
  fetchServices,
  formatNGN,
  type Product,
  type Service,
} from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchProducts().then(setProducts);
    void fetchCategories().then(setCategories);
    void fetchServices().then(setServices);
  }, []);

  const featured = products.filter((p) => p.badge).slice(0, 4);
  const heroProduct = products.find((p) => p.badge) ?? products[0];

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <div>
      {/* Hero — a calm white panel: copy and search left, one product right. */}
      <section className="px-4 pt-6 sm:px-6">
        <div className="mx-auto grid max-w-6xl animate-fade-up gap-10 rounded-3xl border border-line bg-surface px-6 py-12 shadow-sm sm:px-10 lg:grid-cols-12 lg:px-14 lg:py-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-copper">
              Phones, laptops and spares — Lagos, Nigeria
            </p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Tech you can trust, priced in Naira.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-slate">
              CentricLabs supplies tested phones, laptops, spares, accessories
              and gadgets — and builds the software, websites and mobile apps
              that run your business.
            </p>

            <form onSubmit={submitSearch} className="mt-7 flex max-w-xl gap-2" role="search">
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <input
                id="hero-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a phone, laptop, charger…"
                className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3.5 text-sm outline-none placeholder:text-slate focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink/90"
              >
                Shop all products
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-line bg-surface px-6 py-3 font-semibold hover:border-ink"
              >
                Get a service quote
              </Link>
            </div>
          </div>

          {heroProduct && (
            <div className="lg:col-span-5">
              <Link
                href={`/shop/${heroProduct.id}`}
                className="block rounded-2xl bg-mist p-4"
              >
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  priority
                />
                <span className="flex items-center justify-between gap-3 px-1 pt-4">
                  <span>
                    <span className="block text-xs text-slate">
                      {heroProduct.category}
                    </span>
                    <span className="mt-0.5 block font-display text-lg font-bold leading-snug">
                      {heroProduct.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-xl font-extrabold">
                    {formatNGN(heroProduct.price)}
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust — one quiet line, no boxes. */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-label="Why buy from CentricLabs">
        <ul className="grid gap-x-6 gap-y-2 text-sm text-slate sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Pay on delivery in Lagos",
            "Every device tested before sale",
            "1-year warranty on new devices",
            "Delivery nationwide, 2–5 working days",
          ].map((item) => (
            <li key={item}>
              <span aria-hidden="true" className="mr-2 font-bold text-copper">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Categories — clean pills, not cards. */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Shop by category
          </h2>
          <Link href="/shop" className="font-semibold text-ink hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-ink"
            >
              {cat}{" "}
              <span className="font-normal text-slate">
                ({products.filter((p) => p.category === cat).length})
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-14 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Featured this week
        </h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-slate">Loading products…</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 60} />
            ))}
          </div>
        )}
      </section>

      {/* Services — a price list, not a grid of identical cards. */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              Services, built by developers
            </h2>
            <p className="mt-2 max-w-2xl text-slate">
              Software development, IT consulting, web and mobile apps — priced
              up front, quoted within one business day.
            </p>
          </div>
          <Link
            href="/services"
            className="rounded-full bg-ink px-5 py-2.5 font-semibold text-white transition hover:bg-ink/90"
          >
            Request a quote
          </Link>
        </div>
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          {services.map((s) => (
            <Link key={s.id} href="/services" className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-mist">
              <span>
                <span className="block text-xs text-slate">{s.tagline}</span>
                <span className="mt-0.5 block font-display text-lg font-bold leading-snug">
                  {s.name}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-xs text-slate">From</span>
                <span className="font-display text-lg font-extrabold">
                  {formatNGN(s.startingFrom)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why shop with us — short columns under a small copper rule. */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Why shop with CentricLabs
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
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
            <div key={item.title}>
              <span aria-hidden="true" className="block h-0.5 w-8 bg-copper" />
              <p className="mt-4 font-display text-lg font-bold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
