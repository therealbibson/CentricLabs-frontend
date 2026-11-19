"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { fetchCategories, fetchProducts, type Product } from "@/lib/api";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
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
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Shop</h1>
      <p className="mt-2 text-ink-soft">
        Phones, laptops, spares, accessories, gadgets and more — prices in
        Naira, delivery across Nigeria.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products… e.g. iPhone, charger, laptop"
          className="flex-1 rounded-full border border-line bg-cream px-5 py-3 text-sm outline-none focus:border-flame"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              category === cat
                ? "bg-ink text-white"
                : "border border-line bg-cream text-ink-soft hover:border-flame hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-ink-soft">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-cream p-6 text-center text-ink-soft">
          No products match that search. Try a different word or category.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm font-semibold text-ink-soft">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
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
    <Suspense fallback={<p className="p-10 text-ink-soft">Loading shop…</p>}>
      <ShopContent />
    </Suspense>
  );
}
