"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/admin/session");
        const data = await res.json();
        
        if (res.ok && data.admin) {
          setAdmin(data.admin);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div>
      <AdminNavbar admin={admin} />
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function AdminNavbar({ admin }: { admin: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/admin/signout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="flex gap-4 items-center">
          <span>Welcome, {admin.full_name} ({admin.role})</span>
          <button 
            onClick={() => router.push("/admin")}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Dashboard
          </button>
          <button 
            onClick={() => router.push("/admin/products")}
            className="bg-green-500 px-3 py-1 rounded"
          >
            Products
          </button>
          <button 
            onClick={() => router.push("/admin/orders")}
            className="bg-teal-500 px-3 py-1 rounded"
          >
            Orders
          </button>
          <button 
            onClick={() => router.push("/admin/categories")}
            className="bg-yellow-500 px-3 py-1 rounded"
          >
            Categories
          </button>
          <button 
            onClick={() => router.push("/admin/admins")}
            className="bg-purple-500 px-3 py-1 rounded"
          >
            Admins
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}