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
    return <p className="mx-auto max-w-6xl p-10 text-steel">Loading product…</p>;
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-black">Product not found</h1>
        <p className="mt-2 text-steel">
          That product may have been removed or renamed.
        </p>
        <Link href="/shop" className="mt-6 inline-block font-bold text-signal hover:underline">
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
      <Link href="/shop" className="font-bold text-signal hover:underline">
        Back to shop
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="border-2 border-ink bg-surface">
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
            <span className="inline-block bg-signal px-2.5 py-1 font-mono text-xs font-bold text-white">
              {product.badge}
            </span>
          )}
          <p className="mt-3 font-mono text-sm text-steel">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="price-ticket text-xl">{formatNGN(product.price)}</span>
            {product.oldPrice && (
              <span className="font-mono text-lg text-steel line-through">
                {formatNGN(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 leading-7 text-steel">{product.description}</p>
          <p className="mt-3 font-mono text-sm">
            <span
              aria-hidden="true"
              className={`mr-1.5 inline-block h-2 w-2 ${
                product.stock > 0 ? "bg-signal" : "bg-steel"
              }`}
            />
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock — ask us about restock dates"}
          </p>

          {/* Spec strip: the facts a buyer scans before adding to cart. */}
          <dl className="mt-6 grid grid-cols-3 gap-px border-2 border-ink bg-line text-center">
            {[
              ["Condition", "Tested"],
              ["Warranty", "1 year"],
              ["Delivery", "Lagos + nationwide"],
            ].map(([term, value]) => (
              <div key={term} className="bg-surface px-2 py-3">
                <dt className="font-mono text-[11px] text-steel">{term}</dt>
                <dd className="mt-1 text-sm font-bold leading-tight">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-bold">
              Qty
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
                }
                className="w-20 border-2 border-ink bg-surface px-3 py-2 text-center outline-none focus:border-signal"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="bg-signal px-6 py-3 font-bold text-white transition-colors hover:bg-signal-deep disabled:opacity-40"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <Link
              href="/cart"
              className="border-2 border-ink px-6 py-3 font-bold hover:border-signal hover:text-signal"
            >
              View cart
            </Link>
          </div>

          <div className="mt-8 border-2 border-ink bg-surface p-5 text-sm leading-6 text-steel">
            <p className="font-display font-bold text-ink">Delivery and payment</p>
            <p className="mt-1">
              Pay on delivery in Lagos. Nationwide delivery in 2–5 working
              days. Questions? Email{" "}
              <a className="font-bold text-signal" href="mailto:uabeeb3@gmail.com">
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
