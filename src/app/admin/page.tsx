"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalAdmins: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // You might want to create a dedicated stats API endpoint
      const [productsRes, categoriesRes, adminsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories"),
        fetch("/api/auth/admin/admins"),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const adminsData = await adminsRes.json();

      setStats({
        totalProducts: productsData.pagination?.total || 0,
        totalCategories: categoriesData.categories?.length || 0,
        totalAdmins: adminsData.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-bold">Total Products</h3>
          <p className="text-2xl">{stats.totalProducts}</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold">Total Categories</h3>
          <p className="text-2xl">{stats.totalCategories}</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold">Total Admins</h3>
          <p className="text-2xl">{stats.totalAdmins}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => window.location.href = "/admin/products/add"}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add New Product
            </button>
            <button 
              onClick={() => window.location.href = "/admin/categories/add"}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add New Category
            </button>
            <button 
              onClick={() => window.location.href = "/admin/admins/add"}
              className="bg-purple-500 text-white p-2 rounded"
            >
              Add New Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}