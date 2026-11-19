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
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">
          Browse phones, laptops, accessories and gadgets.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark"
        >
          Go to shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Your cart</h1>
      <div className="mt-6 space-y-4">
        {items.map(({ product, qty }) => (
          <article
            key={product.id}
            className="flex gap-4 rounded-2xl border border-line bg-cream p-4"
          >
            <Link href={`/shop/${product.id}`} className="shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={120}
                className="h-20 w-24 rounded-xl object-cover sm:h-24 sm:w-32"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${product.id}`} className="font-bold hover:text-flame">
                {product.name}
              </Link>
              <p className="text-sm text-ink-soft">{formatNGN(product.price)} each</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-bold">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={qty}
                    onChange={(e) => setQty(product.id, Number(e.target.value) || 1)}
                    className="w-16 rounded-full border border-line bg-paper px-2 py-1 text-center outline-none focus:border-flame"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-sm font-bold text-flame hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-black">{formatNGN(product.price * qty)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-cream p-5">
        <div>
          <p className="text-sm text-ink-soft">Total</p>
          <p className="text-2xl font-black">{formatNGN(total)}</p>
          <button
            type="button"
            onClick={clear}
            className="mt-1 text-sm font-bold text-ink-soft hover:text-flame"
          >
            Clear cart
          </button>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-flame px-8 py-3 font-bold text-white hover:bg-flame-dark"
        >
          Checkout →
        </Link>
      </div>
    </div>
  );
}
