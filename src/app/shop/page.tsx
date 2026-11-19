"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { fetchCategories, fetchProducts, type Product } from "@/lib/api";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const initialQuery = searchParams.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([fetchProducts(), fetchCategories()]).then(
      ([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      },
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)),
    );
  }, [products, category, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Shop
      </h1>
      <p className="mt-2 max-w-2xl text-slate">
        Phones, laptops, spares, accessories, gadgets and more — prices in
        Naira, delivery across Nigeria.
      </p>

      <div className="mt-6 flex max-w-2xl gap-2" role="search">
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <input
          id="shop-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products… e.g. iPhone, charger, laptop"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3 text-sm outline-none placeholder:text-slate focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
        <span className="rounded-full bg-surface px-4 py-3 text-sm font-semibold text-slate shadow-sm ring-1 ring-line">
          {filtered.length} found
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === cat
                ? "bg-ink text-white"
                : "border border-line bg-surface text-ink hover:border-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Loading products"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <div className="aspect-[4/3] rounded-xl bg-mist" />
              <div className="mt-4 h-4 w-2/3 rounded bg-mist" />
              <div className="mt-2 h-4 w-1/2 rounded bg-mist" />
              <div className="mt-4 h-10 rounded-lg bg-mist" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-surface p-8 text-center text-slate shadow-sm">
          No products match that search. Try a different word or category.
        </p>
      ) : (
        <>
          <p className="mt-8 text-sm text-slate">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
            {category !== "All" ? ` · ${category}` : ""}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={Math.min(i, 7) * 40} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="p-10 text-slate">Loading shop…</p>}>
      <ShopContent />
    </Suspense>
  );
}
