"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    category: "",
  });

  // Variants state: array of { size, stock }
  const [variants, setVariants] = useState([
    { size: "", stock: "" }
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      console.log("Categories fetched:", data.categories); // Debug log
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a product image");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    console.log("Submitting form data:", formData); // Debug log
    console.log("Selected file:", selectedFile.name); // Debug log

    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("discount", formData.discount);
    // Remove quantity, add variants as JSON string
    submitData.append("variants", JSON.stringify(
      variants.filter(v => v.size && v.stock && !isNaN(Number(v.stock)))
        .map(v => ({ size: v.size, stock: Number(v.stock) }))
    ));
    submitData.append("category_id", formData.category);
    submitData.append("file", selectedFile);

    // Log FormData contents for debugging
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await fetch("/api/admin/products/add", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();
      console.log("API Response:", data); // Debug log
      
      if (res.ok) {
        alert("Product added successfully!");
        router.push("/admin/products");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Variants section */}
          <div>
            <label className="block font-bold mb-1">Variants (Size & Quantity)</label>
            {variants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size (e.g. XS, S, M, L)"
                  value={variant.size}
                  onChange={e => {
                    const newVariants = [...variants];
                    newVariants[idx].size = e.target.value;
                    setVariants(newVariants);
                  }}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={variant.stock}
                  min="0"
                  onChange={e => {
                    const newVariants = [...variants];
                    newVariants[idx].stock = e.target.value;
                    setVariants(newVariants);
                  }}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                  className="bg-red-500 text-white px-2 rounded"
                  disabled={variants.length === 1}
                  title="Remove variant"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setVariants([...variants, { size: "", stock: "" }])}
              className="bg-green-500 text-white px-3 py-1 rounded mt-1"
            >
              + Add Variant
            </button>
          </div>

          <div>
            <label className="block font-bold mb-1">Category</label>
            {/* // In AddProductPage component, change the select option value */}
            <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            >
            <option value="">Select Category</option>
            {categories.map((category: any) => (
                <option key={category.id} value={category.id}> {/* Change from slug to id */}
                {category.name}
                </option>
            ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Product Image</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
              accept="image/*"
              className="border p-2 rounded w-full"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}