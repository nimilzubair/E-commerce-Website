// app/admin/products/add/page.tsx
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

  // Variants state: array of { size, color, stock }
  const [variants, setVariants] = useState([
    { size: "", color: "", stock: "" }
  ]);

  // Predefined color options
  const colorOptions = [
    "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink",
    "Orange", "Brown", "Gray", "Navy", "Teal", "Maroon", "Beige", "Charcoal"
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      console.log("Categories fetched:", data.categories);
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

    // Validate variants
    const validVariants = variants.filter(v => 
      v.size && v.color && v.stock && !isNaN(Number(v.stock))
    );
    
    if (validVariants.length === 0) {
      alert("Please add at least one valid variant with size, color, and quantity");
      return;
    }

    console.log("Submitting form data:", formData);
    console.log("Variants:", validVariants);

    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("discount", formData.discount);
    submitData.append("variants", JSON.stringify(
      validVariants.map(v => ({ 
        size: v.size, 
        color: v.color, 
        stock: Number(v.stock) 
      }))
    ));
    submitData.append("category_id", formData.category);
    submitData.append("file", selectedFile);

    // Log FormData contents for debugging
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();
      console.log("API Response:", data);
      
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
      <form onSubmit={handleSubmit} className="max-w-4xl">
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
              <label className="block font-bold mb-1">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Variants section */}
          <div className="border p-4 rounded bg-gray-50">
            <label className="block font-bold mb-2">Product Variants</label>
            <p className="text-sm text-gray-600 mb-3">Add different size and color combinations with their stock quantities</p>
            
            {variants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 mb-3 items-end">
                <div className="col-span-4">
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g., XS, S, M, L, XL"
                    value={variant.size}
                    onChange={e => {
                      const newVariants = [...variants];
                      newVariants[idx].size = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                
                <div className="col-span-4">
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <select
                    value={variant.color}
                    onChange={e => {
                      const newVariants = [...variants];
                      newVariants[idx].color = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Color</option>
                    {colorOptions.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    min="0"
                    onChange={e => {
                      const newVariants = [...variants];
                      newVariants[idx].stock = e.target.value;
                      setVariants(newVariants);
                    }}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                    className="bg-red-500 text-white px-3 py-2 rounded w-full"
                    disabled={variants.length === 1}
                    title="Remove variant"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => setVariants([...variants, { size: "", color: "", stock: "" }])}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              + Add Another Variant
            </button>
          </div>

          <div>
            <label className="block font-bold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
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