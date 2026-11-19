"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatNGN, type Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/shop/${product.id}`} className="relative block bg-mist">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-slate">{product.category}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug hover:text-slate">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate">
          {product.description}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-xl font-extrabold">
            {formatNGN(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-slate line-through">
              {formatNGN(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate">
          <span
            aria-hidden="true"
            className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
              product.stock > 0 ? "bg-copper" : "bg-slate"
            }`}
          />
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        {/* Assurance strip — the signature element: trust, stated quietly. */}
        <p className="mt-3 border-t border-line pt-3 text-xs text-slate">
          <span aria-hidden="true" className="font-bold text-copper">✓</span>{" "}
          Tested · 1-year warranty
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-4 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
