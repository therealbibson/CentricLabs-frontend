"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { fetchProduct, formatNGN, type Product } from "@/lib/api";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    void fetchProduct(id).then((p) => setProduct(p ?? null));
  }, [id]);

  if (product === undefined) {
    return <p className="mx-auto max-w-6xl p-10 text-slate">Loading product…</p>;
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Product not found</h1>
        <p className="mt-2 text-slate">
          That product may have been removed or renamed.
        </p>
        <Link href="/shop" className="mt-6 inline-block font-semibold text-ink hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/shop" className="font-semibold text-ink hover:underline">
        Back to shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover"
            priority
          />
        </div>
        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">
              {product.badge}
            </span>
          )}
          <p className="mt-3 text-sm text-slate">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold">{formatNGN(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-slate line-through">
                {formatNGN(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 leading-7 text-slate">{product.description}</p>
          <p className="mt-3 text-sm text-slate">
            <span
              aria-hidden="true"
              className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                product.stock > 0 ? "bg-copper" : "bg-slate"
              }`}
            />
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock — ask us about restock dates"}
          </p>
          <p className="mt-3 border-t border-line pt-3 text-xs text-slate">
            <span aria-hidden="true" className="font-bold text-copper">✓</span>{" "}
            Tested · 1-year warranty
          </p>

          {/* Specs — clean hairline rows. */}
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {[
              ["Condition", "Tested"],
              ["Warranty", "1 year"],
              ["Delivery", "Lagos + nationwide"],
            ].map(([term, value]) => (
              <div key={term} className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate">{term}</dt>
                <dd className="text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              Qty
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
                }
                className="w-20 rounded-lg border border-line bg-surface px-3 py-2 text-center outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="rounded-lg bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink/90 disabled:opacity-40"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <Link
              href="/cart"
              className="rounded-lg border border-line bg-surface px-6 py-3 font-semibold hover:border-ink"
            >
              View cart
            </Link>
          </div>

          <div className="mt-8 rounded-2xl bg-mist p-5 text-sm leading-6 text-slate">
            <p className="font-display font-bold text-ink">Delivery and payment</p>
            <p className="mt-1">
              Pay on delivery in Lagos. Nationwide delivery in 2–5 working
              days. Questions? Email{" "}
              <a className="font-semibold text-ink hover:underline" href="mailto:uabeeb3@gmail.com">
                uabeeb3@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
