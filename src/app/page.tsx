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
      {/* Hero — asymmetric: copy and search left, one product right. */}
      <section className="border-b-2 border-ink bg-base">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-sm text-steel">
              Lagos, Nigeria — phones, laptops, spares, software
            </p>
            <h1 className="mt-4 font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              Tech you can trust, priced in Naira.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-steel">
              CentricLabs supplies tested phones, laptops, spares, accessories
              and gadgets — and builds the software, websites and mobile apps
              that run your business.
            </p>

            <form onSubmit={submitSearch} className="mt-7 flex max-w-xl" role="search">
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <input
                id="hero-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a phone, laptop, charger…"
                className="min-w-0 flex-1 border-2 border-ink bg-surface px-4 py-3.5 text-sm outline-none placeholder:text-steel focus:border-signal"
              />
              <button
                type="submit"
                className="bg-ink px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-signal"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="bg-signal px-6 py-3 font-bold text-white transition-colors hover:bg-signal-deep"
              >
                Shop all products
              </Link>
              <Link
                href="/services"
                className="border-2 border-ink bg-surface px-6 py-3 font-bold hover:border-signal hover:text-signal"
              >
                Get a service quote
              </Link>
            </div>
          </div>

          {heroProduct && (
            <div className="lg:col-span-5">
              <Link
                href={`/shop/${heroProduct.id}`}
                className="block border-2 border-ink bg-surface"
              >
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover"
                  priority
                />
                <span className="flex items-center justify-between gap-3 border-t-2 border-ink p-4">
                  <span>
                    <span className="block font-mono text-xs text-steel">
                      {heroProduct.category}
                    </span>
                    <span className="mt-0.5 block font-display text-lg font-bold leading-snug">
                      {heroProduct.name}
                    </span>
                  </span>
                  <span className="price-ticket shrink-0 text-base">
                    {formatNGN(heroProduct.price)}
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Spec strip: trust facts, mono, no decoration. */}
      <section className="border-b-2 border-ink bg-surface" aria-label="Why buy from CentricLabs">
        <ul className="mx-auto grid max-w-6xl gap-x-6 gap-y-2 px-4 py-4 font-mono text-xs leading-5 text-steel sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-signal" />
            Pay on delivery in Lagos
          </li>
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-signal" />
            Every device tested before sale
          </li>
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-signal" />
            1-year warranty on new devices
          </li>
          <li>
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-signal" />
            Delivery nationwide, 2–5 working days
          </li>
        </ul>
      </section>

      {/* Categories — a numbered index, not icon cards. */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-black tracking-tight">
            Shop by category
          </h2>
          <Link href="/shop" className="font-bold text-signal hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-px border-2 border-ink bg-line sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="group bg-surface p-5 hover:bg-ink hover:text-white"
            >
              <p className="font-mono text-xs text-signal">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-snug">
                {cat}
              </p>
              <p className="mt-1 font-mono text-xs text-steel group-hover:text-white/70">
                {products.filter((p) => p.category === cat).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="font-display text-3xl font-black tracking-tight">
          Featured this week
        </h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-steel">Loading products…</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Services — one dark block for contrast. */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-black tracking-tight">
              Services, built by developers
            </h2>
            <Link
              href="/services"
              className="bg-signal px-5 py-2.5 font-bold text-white transition-colors hover:bg-signal-deep"
            >
              Request a quote
            </Link>
          </div>
          <div className="mt-8 grid gap-px border-2 border-white/20 bg-white/20 md:grid-cols-2">
            {services.map((s) => (
              <Link key={s.id} href="/services" className="bg-ink p-6 hover:bg-white/5">
                <p className="font-mono text-xs text-white/60">{s.tagline}</p>
                <p className="mt-2 font-display text-xl font-bold">{s.name}</p>
                <p className="mt-3 font-mono text-sm font-bold text-white">
                  From {formatNGN(s.startingFrom)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why shop with us — numbered, plain. */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl font-black tracking-tight">
          Why shop with CentricLabs
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Tested before sale",
              text: "Every phone and laptop is checked — battery health, screen, ports — before it leaves us.",
            },
            {
              n: "02",
              title: "Pay on delivery in Lagos",
              text: "Order now, pay when it arrives. Bank transfer and online payment (Paystack) coming soon.",
            },
            {
              n: "03",
              title: "Real support, from a developer",
              text: "Questions about a device or a project? You talk to the person who built the store — uabeeb3@gmail.com.",
            },
          ].map((item) => (
            <div key={item.n} className="border-2 border-ink bg-surface p-5">
              <p className="font-mono text-sm font-bold text-signal">{item.n}</p>
              <p className="mt-2 font-display text-lg font-bold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-steel">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
