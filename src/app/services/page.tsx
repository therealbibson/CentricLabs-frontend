"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createQuote, fetchServices, formatNGN, type Service } from "@/lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchServices().then((list) => {
      setServices(list);
      if (list.length > 0) setServiceId(list[0].id);
    });
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await createQuote({ serviceId, name, phone, email, details });
      setRef(res.id);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the request.");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-flame";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Services</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Software development, IT consulting, web and mobile applications —
        built by Usman Abeeb and CentricLabs, from Lagos for clients
        everywhere. Tell us what you need and we will send a quote within 1
        business day.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <article
            key={s.id}
            className="rounded-2xl border border-line bg-cream p-6 shadow-sm"
          >
            <h2 className="text-xl font-black">{s.name}</h2>
            <p className="mt-1 font-bold text-flame">{s.tagline}</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{s.description}</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {s.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <p className="mt-4 font-black">
              From {formatNGN(s.startingFrom)}
              <span className="ml-2 text-sm font-normal text-ink-soft">
                — final price depends on scope
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setServiceId(s.id);
                document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-flame"
            >
              Request a quote for this service
            </button>
          </article>
        ))}
      </div>

      <section
        id="quote-form"
        className="mt-12 rounded-2xl border border-line bg-cream p-6 sm:p-8"
      >
        <h2 className="text-2xl font-black">Request a quote</h2>
        <p className="mt-1 text-sm text-ink-soft">
          No payment needed — this just sends your project details to
          CentricLabs.
        </p>

        {status === "done" ? (
          <div className="mt-6 rounded-2xl bg-amber-soft p-6">
            <p className="text-lg font-black">Request received ✓</p>
            <p className="mt-2 text-sm leading-6">
              Thanks, {name}. Your quote reference is{" "}
              <span className="font-bold">{ref}</span>. CentricLabs will
              contact you on {phone} within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Service
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={`${inputCls} mt-1`}
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — from {formatNGN(s.startingFrom)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputCls} mt-1`}
                required
                placeholder="e.g. Adaeze Okafor"
              />
            </label>
            <label className="text-sm font-bold">
              Phone / WhatsApp
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputCls} mt-1`}
                required
                placeholder="e.g. 0803 000 0000"
              />
            </label>
            <label className="text-sm font-bold">
              Email (optional)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} mt-1`}
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Tell us about your project
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className={`${inputCls} mt-1 min-h-28`}
                required
                placeholder="e.g. I need a website and online store for my fashion business, with Paystack payments…"
              />
            </label>
            {status === "error" && (
              <p className="text-sm font-bold text-flame sm:col-span-2">
                {error} Is the backend running? (http://localhost:4000)
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-flame px-6 py-3 font-bold text-white hover:bg-flame-dark disabled:opacity-50 sm:col-span-2"
            >
              {status === "sending" ? "Sending…" : "Send quote request"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
