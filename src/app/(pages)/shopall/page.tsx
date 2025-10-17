// app/shopall/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShopAllPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const { signalCartChange } = useCartContext();

  useEffect(() => {
    fetchProducts();
    fetchCurrentUser();
    fetchCartCount();
  }, []);

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
      setError("");
      
      const res = await fetch("/api/products");
      
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading products:", err);
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productVariantId: string, productName: string) => {
    try {
      const authRes = await fetch("/api/auth/currentcookie");
      const authData = await authRes.json();
      if (!authData.user) {
        alert("Please sign in to add items to cart");
        window.location.href = "/auth/login";
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId, quantity: 1 }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Added to cart`);
        signalCartChange();
        fetchCartCount();
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart");
      console.error("Add to cart error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading products...</p>
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
            All <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Collections</span>
          </h1>
          <p className="text-xl text-gray-400">Discover our complete premium collection</p>
        </div>
      </div>

      {/* Products Grid */}
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

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No products available</p>
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all"
            >
              Return Home
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}