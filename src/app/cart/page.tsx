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
        <h1 className="font-display text-3xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-steel">
          Browse phones, laptops, accessories and gadgets.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-signal px-6 py-3 font-bold text-white transition-colors hover:bg-signal-deep"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-black tracking-tight">Your cart</h1>
      <p className="mt-2 font-mono text-sm text-steel">
        {items.length} item{items.length === 1 ? "" : "s"} · pay on delivery in Lagos
      </p>
      <div className="mt-6 space-y-4">
        {items.map(({ product, qty }) => (
          <article
            key={product.id}
            className="flex gap-4 border-2 border-ink bg-surface p-4"
          >
            <Link href={`/shop/${product.id}`} className="shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={120}
                className="h-20 w-24 border-2 border-ink object-cover sm:h-24 sm:w-32"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${product.id}`} className="font-display font-bold hover:text-signal">
                {product.name}
              </Link>
              <p className="font-mono text-sm text-steel">{formatNGN(product.price)} each</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={qty}
                    onChange={(e) => setQty(product.id, Number(e.target.value) || 1)}
                    className="w-16 border-2 border-ink bg-surface px-2 py-1 text-center outline-none focus:border-signal"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-sm font-bold text-signal hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="price-ticket shrink-0 self-start">{formatNGN(product.price * qty)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-surface p-5">
        <div>
          <p className="font-mono text-sm text-steel">Total</p>
          <p className="mt-1">
            <span className="price-ticket text-xl">{formatNGN(total)}</span>
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-sm font-bold text-steel hover:text-signal"
          >
            Clear cart
          </button>
        </div>
        <Link
          href="/checkout"
          className="bg-signal px-8 py-3 font-bold text-white transition-colors hover:bg-signal-deep"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
