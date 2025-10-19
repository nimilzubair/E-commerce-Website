// src/app/admin/page.tsx
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

      if (!productsRes.ok) throw new Error(`Products API failed: ${productsRes.status}`);
      if (!categoriesRes.ok) throw new Error(`Categories API failed: ${categoriesRes.status}`);
      if (!adminsRes.ok) throw new Error(`Admins API failed: ${adminsRes.status}`);

      const productsText = await productsRes.text();
      const categoriesText = await categoriesRes.text();
      const adminsText = await adminsRes.text();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-yellow-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-gray-800 font-bold text-lg mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-yellow-500 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your store statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-yellow-500 transition-all p-6">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Products</h2>
          <p className="text-4xl font-bold text-yellow-600">{stats.products}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-yellow-500 transition-all p-6">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Categories</h2>
          <p className="text-4xl font-bold text-yellow-600">{stats.categories}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-yellow-500 transition-all p-6">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Admins</h2>
          <p className="text-4xl font-bold text-yellow-600">{stats.admins}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/products/add"
            className="text-center p-4 rounded-lg border-2 border-yellow-500 hover:bg-yellow-50 transition-all"
          >
            <div className="text-2xl mb-2">📦</div>
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </a>
          
          <a
            href="/admin/categories/add"
            className="text-center p-4 rounded-lg border-2 border-yellow-500 hover:bg-yellow-50 transition-all"
          >
            <div className="text-2xl mb-2">📁</div>
            <span className="text-sm font-medium text-gray-700">Add Category</span>
          </a>
          
          <a
            href="/admin/admins/add"
            className="text-center p-4 rounded-lg border-2 border-yellow-500 hover:bg-yellow-50 transition-all"
          >
            <div className="text-2xl mb-2">👤</div>
            <span className="text-sm font-medium text-gray-700">Add Admin</span>
          </a>
          
          <a
            href="/admin/orders"
            className="text-center p-4 rounded-lg border-2 border-yellow-500 hover:bg-yellow-50 transition-all"
          >
            <div className="text-2xl mb-2">📋</div>
            <span className="text-sm font-medium text-gray-700">View Orders</span>
          </a>
        </div>
      </div>
    </div>
  );
}