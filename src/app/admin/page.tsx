// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsRes, categoriesRes, adminsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/admins")
      ]);

      // Check if responses are OK and have content
      if (!productsRes.ok) throw new Error(`Products API failed: ${productsRes.status}`);
      if (!categoriesRes.ok) throw new Error(`Categories API failed: ${categoriesRes.status}`);
      if (!adminsRes.ok) throw new Error(`Admins API failed: ${adminsRes.status}`);

      const productsText = await productsRes.text();
      const categoriesText = await categoriesRes.text();
      const adminsText = await adminsRes.text();

      // Parse JSON only if content exists
      const productsData = productsText ? JSON.parse(productsText) : { products: [] };
      const categoriesData = categoriesText ? JSON.parse(categoriesText) : { categories: [] };
      const adminsData = adminsText ? JSON.parse(adminsText) : { admins: [] };

      setStats({
        products: productsData.products?.length || 0,
        categories: categoriesData.categories?.length || 0,
        admins: adminsData.admins?.length || 0
      });

    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold mb-2">Total Categories</h2>
          <p className="text-3xl font-bold text-green-600">{stats.categories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold mb-2">Total Admins</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
        </div>
      </div>
    </div>
  );
}