"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Category added successfully!");
        router.push("/admin/categories");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Category Name</label>
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

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="font-bold">Active</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/categories")}
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