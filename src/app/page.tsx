"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Customer = {
  id: string;
  full_name: string;
  email: string;
};

export default function HomePage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const { count } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      if (count) setUserCount(count);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/currentcookie");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setCurrentUser(null);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Timeless <span className="text-gold-400">Elegance</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium clothing and accessories
          </p>
          <Link
            href="/shopall"
            className="inline-block bg-gold-500 text-black px-8 py-3 rounded font-semibold hover:bg-gold-400 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-gold-500 mb-2">
              {userCount ?? "..."}
            </div>
            <p className="text-gray-700">Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-gold-500 mb-2">100%</div>
            <p className="text-gray-700">Premium Quality</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-gold-500 mb-2">24/7</div>
            <p className="text-gray-700">Support</p>
          </div>
        </div>
      </section>

      {/* User Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {currentUser ? (
            <div className="bg-gold-50 border-l-4 border-gold-500 p-8 rounded">
              <p className="text-gray-800 mb-2">
                Welcome, <span className="font-semibold">{currentUser.full_name}</span>
              </p>
              <p className="text-gray-600 text-sm mb-4">{currentUser.email}</p>
              <button
                onClick={handleSignOut}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-8 rounded text-center">
              <p className="text-gray-700 mb-4">Start shopping today</p>
              <Link
                href="/auth/login"
                className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shopall" className="hover:text-gold-400">All Products</Link></li>
              <li><Link href="/winter" className="hover:text-gold-400">Winter</Link></li>
              <li><Link href="/summer" className="hover:text-gold-400">Summer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Collections</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/dupatta" className="hover:text-gold-400">Dupattas</Link></li>
              <li><Link href="/shawl" className="hover:text-gold-400">Shawls</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-gold-400">About</a></li>
              <li><a href="#" className="hover:text-gold-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-gold-400">FAQ</a></li>
              <li><a href="#" className="hover:text-gold-400">Shipping</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 LUXE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}