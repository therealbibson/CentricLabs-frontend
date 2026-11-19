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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-cream shadow-sm transition hover:shadow-md">
      <Link href={`/shop/${product.id}`} className="relative block">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-amber px-3 py-1 text-xs font-black text-ink">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-flame">
          {product.category}
        </p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 font-bold leading-snug hover:text-flame">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
          {product.description}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black">{formatNGN(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-ink-soft line-through">
              {formatNGN(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-4 rounded-full bg-flame px-4 py-2.5 text-sm font-bold text-white transition hover:bg-flame-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
