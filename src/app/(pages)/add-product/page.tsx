"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("Please select an image first");

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("file", file);

    const res = await fetch("/api/add-product", { method: "POST", body: data });
    const result = await res.json();

    setLoading(false);
    if (result.success) setMsg("✅ Product added successfully!");
    else setMsg("❌ Error: " + result.error);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category slug (e.g. summer)"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
      {msg && <p className="mt-3 text-center">{msg}</p>}
    </div>
  );
}
