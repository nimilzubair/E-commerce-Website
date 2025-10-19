// admin/admins/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Admin added successfully!");
        router.push("/admin/admins");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white border border-yellow-400 rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b border-yellow-300 pb-2">
        Add New Admin
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="bg-[#f9f9f9] border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 p-2 rounded w-full outline-none transition"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-[#f9f9f9] border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 p-2 rounded w-full outline-none transition"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="bg-[#f9f9f9] border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 p-2 rounded w-full outline-none transition"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-[#f9f9f9] border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 p-2 rounded w-full outline-none transition"
          >
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className="flex gap-4 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded transition disabled:opacity-70"
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/admins")}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-6 py-2 rounded transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
