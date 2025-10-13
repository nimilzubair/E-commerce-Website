"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Category deleted successfully");
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      if (res.ok) {
        alert("Category updated successfully");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <button 
          onClick={() => window.location.href = "/admin/categories/add"}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Category
        </button>
      </div>

      <div className="border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Slug</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: any) => (
              <tr key={category.id} className="border-t">
                <td className="p-2">{category.name}</td>
                <td className="p-2">{category.slug}</td>
                <td className="p-2">{category.product_count}</td>
                <td className="p-2">
                  <span className={category.is_active ? "text-green-500" : "text-red-500"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = `/admin/categories/${category.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleStatus(category.id, category.is_active)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      {category.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => deleteCategory(category.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-4 text-center">No categories found</p>}
      </div>
    </div>
  );
}