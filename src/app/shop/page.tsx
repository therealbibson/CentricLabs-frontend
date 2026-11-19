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
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        Shop
      </h1>
      <p className="mt-2 max-w-2xl text-steel">
        Phones, laptops, spares, accessories, gadgets and more — prices in
        Naira, delivery across Nigeria.
      </p>

      <div className="mt-6 flex max-w-2xl" role="search">
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <input
          id="shop-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products… e.g. iPhone, charger, laptop"
          className="min-w-0 flex-1 border-2 border-ink bg-surface px-4 py-3 text-sm outline-none placeholder:text-steel focus:border-signal"
        />
        <span className="border-2 border-l-0 border-ink bg-ink px-4 py-3 font-mono text-sm font-bold text-white">
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
            className={`border-2 px-4 py-2 text-sm font-bold ${
              category === cat
                ? "border-ink bg-ink text-white"
                : "border-ink bg-surface text-ink hover:border-signal hover:text-signal"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-steel">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 border-2 border-ink bg-surface p-6 text-center text-steel">
          No products match that search. Try a different word or category.
        </p>
      ) : (
        <>
          <p className="mt-6 font-mono text-sm text-steel">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
            {category !== "All" ? ` · ${category}` : ""}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="p-10 text-steel">Loading shop…</p>}>
      <ShopContent />
    </Suspense>
  );
}
