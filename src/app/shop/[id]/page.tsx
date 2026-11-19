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
    return <p className="mx-auto max-w-6xl p-10 text-ink-soft">Loading product…</p>;
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-black">Product not found</h1>
        <p className="mt-2 text-ink-soft">
          That product may have been removed or renamed.
        </p>
        <Link href="/shop" className="mt-6 inline-block font-bold text-flame hover:underline">
          ← Back to shop
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
      <Link href="/shop" className="font-bold text-flame hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line bg-cream">
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
            <span className="inline-block rounded-full bg-amber px-3 py-1 text-xs font-black text-ink">
              {product.badge}
            </span>
          )}
          <p className="mt-3 text-sm font-bold uppercase tracking-wider text-flame">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black">{formatNGN(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-ink-soft line-through">
                {formatNGN(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 leading-7 text-ink-soft">{product.description}</p>
          <p className="mt-3 text-sm font-semibold">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock — ask us about restock dates"}
          </p>

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
                className="w-20 rounded-full border border-line bg-cream px-3 py-2 text-center outline-none focus:border-flame"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark disabled:opacity-40"
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </button>
            <Link
              href="/cart"
              className="rounded-full border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-white"
            >
              View cart
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-cream p-5 text-sm leading-6 text-ink-soft">
            <p className="font-bold text-ink">Delivery &amp; payment</p>
            <p className="mt-1">
              Pay on delivery in Lagos. Nationwide delivery in 2–5 working
              days. Questions? Email{" "}
              <a className="font-bold text-flame" href="mailto:uabeeb3@gmail.com">
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
