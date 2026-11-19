"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder, formatNGN } from "@/lib/api";

const PAYMENT_METHODS = [
  "Pay on delivery (Lagos)",
  "Bank transfer",
  "Paystack (online) — coming soon",
] as const;

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (paymentMethod === PAYMENT_METHODS[2]) {
      setError(
        "Online Paystack payment is not connected yet — please choose pay on delivery or bank transfer for now.",
      );
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const order = await createOrder({
        customer: { name, phone, email: email || undefined, address },
        items: items.map(({ product, qty }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          qty,
        })),
        paymentMethod,
      });
      setOrderId(order.id);
      setStatus("done");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place the order.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-4 text-3xl font-black">Order placed!</h1>
        <p className="mt-3 leading-7 text-ink-soft">
          Thanks, {name}. Your order reference is{" "}
          <span className="font-black text-ink">{orderId}</span>. CentricLabs
          will call {phone} to confirm delivery.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Payment method: {paymentMethod}. Keep your order reference safe.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-black">Nothing to check out</h1>
        <p className="mt-2 text-ink-soft">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark"
        >
          Go to shop →
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-flame";
  const deliveryFee = 0; // placeholder — delivery pricing to be added later

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        <form onSubmit={submit} className="grid gap-4 lg:col-span-3">
          <label className="text-sm font-bold">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} mt-1`} required placeholder="e.g. Adaeze Okafor" />
          </label>
          <label className="text-sm font-bold">
            Phone / WhatsApp
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputCls} mt-1`} required placeholder="e.g. 0803 000 0000" />
          </label>
          <label className="text-sm font-bold">
            Email (optional)
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1`} placeholder="you@example.com" />
          </label>
          <label className="text-sm font-bold">
            Delivery address
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className={`${inputCls} mt-1 min-h-20`} required placeholder="House no, street, area, city, state" />
          </label>

          <fieldset>
            <legend className="text-sm font-bold">Payment method</legend>
            <div className="mt-2 space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${
                    paymentMethod === method
                      ? "border-flame bg-cream"
                      : "border-line bg-cream"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-ink-soft">
              Mock payment note: online payment via Paystack is not connected
              yet — no money is taken here. Pay on delivery or bank transfer
              for now.
            </p>
          </fieldset>

          {status === "error" && (
            <p className="text-sm font-bold text-flame">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark disabled:opacity-50"
          >
            {status === "sending" ? "Placing order…" : `Place order — ${formatNGN(total + deliveryFee)}`}
          </button>
        </form>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-cream p-5">
            <h2 className="font-black">Order summary</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span>
                    {product.name} × {qty}
                  </span>
                  <span className="font-bold">{formatNGN(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
              <p className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold">To be confirmed</span>
              </p>
              <p className="flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-black">{formatNGN(total)}</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
