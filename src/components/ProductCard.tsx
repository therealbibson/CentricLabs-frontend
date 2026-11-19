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
    <article className="flex flex-col border-2 border-ink bg-surface">
      <Link href={`/shop/${product.id}`} className="relative block border-b-2 border-ink">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-signal px-2.5 py-1 font-mono text-xs font-bold text-white">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-xs text-steel">{product.category}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug hover:text-signal">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-steel">
          {product.description}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="price-ticket">{formatNGN(product.price)}</span>
          {product.oldPrice && (
            <span className="font-mono text-sm text-steel line-through">
              {formatNGN(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="mt-2 font-mono text-xs text-steel">
          <span
            aria-hidden="true"
            className={`mr-1.5 inline-block h-2 w-2 ${
              product.stock > 0 ? "bg-signal" : "bg-steel"
            }`}
          />
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-4 bg-ink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-signal disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
