"use client";
import { useState } from "react";

interface Variant {
  size: string;
  color: string;
  stock: string; // we'll convert to number later
}

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
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => setVariants([...variants, { size: "", color: "", stock: "" }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("Please select an image first");

    setLoading(true);
    const data = new FormData();

    // Append main product data
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    // Append variants as JSON string
    if (variants.length > 0) {
      const variantsPayload = variants.map(v => ({
        size: v.size,
        color: v.color,
        stock: Number(v.stock),
      }));
      data.append("variants", JSON.stringify(variantsPayload));
    }

    data.append("file", file);

    const res = await fetch("/api/add-product", { method: "POST", body: data });
    const result = await res.json();

    setLoading(false);
    if (result.success) {
      setMsg("✅ Product added successfully!");
      // Reset form
      setFormData({ name: "", description: "", price: "", discount: "", quantity: "", category: "" });
      setVariants([]);
      setFile(null);
    } else setMsg("❌ Error: " + result.error);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="discount" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="category" placeholder="Category slug (e.g. summer)" value={formData.category} onChange={handleChange} required className="border p-2 rounded" />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />

        {/* Variants Section */}
        <div className="mt-3 border p-2 rounded">
          <h3 className="font-semibold mb-2">Product Variants (Optional)</h3>
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Size" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="border p-1 rounded w-1/3" />
              <input type="text" placeholder="Color" value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)} className="border p-1 rounded w-1/3" />
              <input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="border p-1 rounded w-1/3" />
              <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white px-2 rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="bg-green-500 text-white px-3 py-1 rounded">Add Variant</button>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
      {msg && <p className="mt-3 text-center">{msg}</p>}
    </div>
  );
}
