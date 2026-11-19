"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatNGN } from "@/lib/api";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-slate">
          Browse phones, laptops, accessories and gadgets.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink/90"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Your cart</h1>
      <p className="mt-2 text-sm text-slate">
        {items.length} item{items.length === 1 ? "" : "s"} · pay on delivery in Lagos
      </p>
      <div className="mt-6 space-y-4">
        {items.map(({ product, qty }) => (
          <article
            key={product.id}
            className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm"
          >
            <Link href={`/shop/${product.id}`} className="shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={120}
                className="h-20 w-24 rounded-lg border border-line object-cover sm:h-24 sm:w-32"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${product.id}`} className="font-display font-bold hover:text-slate">
                {product.name}
              </Link>
              <p className="text-sm text-slate">{formatNGN(product.price)} each</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={qty}
                    onChange={(e) => setQty(product.id, Number(e.target.value) || 1)}
                    className="w-16 rounded-lg border border-line bg-surface px-2 py-1 text-center outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-sm font-semibold text-slate hover:text-ink hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 self-start font-display text-lg font-extrabold">{formatNGN(product.price * qty)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div>
          <p className="text-sm text-slate">Total</p>
          <p className="mt-1 font-display text-2xl font-extrabold">{formatNGN(total)}</p>
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-sm font-semibold text-slate hover:text-ink"
          >
            Clear cart
          </button>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-ink px-8 py-3 font-semibold text-white transition hover:bg-ink/90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
