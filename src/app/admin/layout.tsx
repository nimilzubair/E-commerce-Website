// src/app/admin/layout.tsx
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar admin={admin} />
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}

function AdminNavbar({ admin }: { admin: any }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await fetch("/api/auth/admin/signout", { method: "POST" });
      router.push("/auth/login");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", color: "blue" },
    { label: "Products", path: "/admin/products", color: "green" },
    { label: "Orders", path: "/admin/orders", color: "teal" },
    { label: "Categories", path: "/admin/categories", color: "yellow" },
    { label: "Admins", path: "/admin/admins", color: "purple" },
  ];

  return (
    <nav className="bg-white border-b-2 border-yellow-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">VIP Textiles</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{admin.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-gray-800">{admin.full_name}</p>
              <p className="text-xs text-gray-600 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-yellow-100 transition-all"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}