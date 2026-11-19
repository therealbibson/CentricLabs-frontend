"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminShell from "@/components/AdminShell";
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProduct,
} from "@/lib/admin";
import { fetchCategories, formatNGN, type Product } from "@/lib/api";

interface FormState {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  description: string;
  stock: string;
  badge: string;
  image: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  category: "Phones",
  price: "",
  oldPrice: "",
  description: "",
  stock: "",
  badge: "",
  image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    void fetchAdminProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    void fetchCategories().then(setCategories);
  }, []);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      description: p.description,
      stock: String(p.stock),
      badge: p.badge ?? "",
      image: p.image,
    });
    setNotice("");
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setNotice("");
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      description: form.description,
      stock: Number(form.stock),
      badge: form.badge || undefined,
      image: form.image,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, body);
        setNotice("Product updated.");
      } else {
        await createProduct(body);
        setNotice("Product added.");
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setNotice("Product deleted.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product.");
    }
  }

  async function quickSave(p: Product, patch: Partial<Product>) {
    try {
      await updateProduct(p.id, patch);
      setNotice(`Updated ${p.name}.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update product.");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-flame";

  return (
    <AdminShell title="Products">
      {error && (
        <p className="mb-4 rounded-2xl border border-line bg-cream p-4 font-bold text-flame">
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-4 rounded-2xl bg-amber-soft p-4 font-bold">{notice}</p>
      )}

      <button
        type="button"
        onClick={startAdd}
        className="rounded-full bg-flame px-5 py-2.5 text-sm font-bold text-white hover:bg-flame-dark"
      >
        + Add product
      </button>

      {/* Add / edit form */}
      <form
        id="product-form"
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-2xl border border-line bg-cream p-6 sm:grid-cols-2"
      >
        <h2 className="text-lg font-black sm:col-span-2">
          {editingId ? "Edit product" : "Add a new product"}
        </h2>
        <label className="text-sm font-bold">
          Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputCls} mt-1`} required placeholder="e.g. iPhone 14 · 128GB" />
        </label>
        <label className="text-sm font-bold">
          Category
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputCls} mt-1`} required list="admin-categories" placeholder="e.g. Phones" />
          <datalist id="admin-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="text-sm font-bold">
          Price (₦)
          <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={`${inputCls} mt-1`} required />
        </label>
        <label className="text-sm font-bold">
          Old price (₦, optional — for sales)
          <input type="number" min={0} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={`${inputCls} mt-1`} />
        </label>
        <label className="text-sm font-bold">
          Stock
          <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={`${inputCls} mt-1`} required />
        </label>
        <label className="text-sm font-bold">
          Badge (optional)
          <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={`${inputCls} mt-1`} placeholder="e.g. Best Seller, New" />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Image URL
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${inputCls} mt-1`} required placeholder="https://images.unsplash.com/… or /products/phone.jpg" />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} mt-1 min-h-20`} required />
        </label>
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-full bg-flame px-6 py-2.5 font-bold text-white hover:bg-flame-dark disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="rounded-full border border-line bg-paper px-6 py-2.5 font-bold">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="mt-6 text-ink-soft">Loading products…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-cream">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-bold">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.price}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== p.price) void quickSave(p, { price: v });
                      }}
                      className="w-28 rounded-lg border border-line bg-paper px-2 py-1 outline-none focus:border-flame"
                      aria-label={`Price for ${p.name}`}
                    />
                    <span className="ml-1 text-xs text-ink-soft">
                      {p.oldPrice ? `was ${formatNGN(p.oldPrice)}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== p.stock) void quickSave(p, { stock: v });
                      }}
                      className={`w-20 rounded-lg border px-2 py-1 outline-none focus:border-flame ${
                        p.stock <= 5 ? "border-flame bg-amber-soft font-black" : "border-line bg-paper"
                      }`}
                      aria-label={`Stock for ${p.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button type="button" onClick={() => startEdit(p)} className="font-bold text-flame hover:underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => void remove(p.id, p.name)} className="font-bold text-ink-soft hover:text-flame hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        Tip: change a price or stock number in the table and click away — it
        saves automatically.
      </p>
    </AdminShell>
  );
}
