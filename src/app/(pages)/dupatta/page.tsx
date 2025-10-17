// app/dupatta/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DupattaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const { cartChanged, signalCartChange } = useCartContext();

  useEffect(() => {
    fetchProducts();
    fetchCurrentUser();
    fetchCartCount();
  }, [cartChanged]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/currentcookie");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const totalItems = data.items?.reduce(
  (sum: number, item: { quantity: number }) => sum + item.quantity,
  0
) || 0;

        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?category=dupatta");
      
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setError("");
      } else {
        setError("Failed to load dupatta collection");
      }
    } catch (err) {
      setError("Network error - failed to load products");
      console.error("Error loading dupattas:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productVariantId: string, productName: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productVariantId, 
          quantity: 1 
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Added ${productName} to cart!`);
        signalCartChange();
        fetchCartCount();
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (err) {
      alert("Network error - failed to add to cart");
      console.error("Add to cart error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dupatta collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* <Header currentUser={currentUser} cartItemCount={cartItemCount} /> */}

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-20 px-6 border-b border-yellow-600/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Dupatta</span> Collection
          </h1>
          <p className="text-xl text-gray-400">Elegant drapes for timeless beauty</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-6 py-4 rounded-2xl mb-8 text-center">
            {error}
            <button 
              onClick={fetchProducts}
              className="ml-4 text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl mb-4">No dupattas found in this collection</p>
            <a 
              href="/shopall" 
              className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all"
            >
              Browse All Collections
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}