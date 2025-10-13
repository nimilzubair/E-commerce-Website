"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function ShopAllPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { signalCartChange } = useCartContext();

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
            <button 
              onClick={fetchProducts}
              className="ml-4 underline font-medium hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}