"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function SummerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartChanged, signalCartChange } = useCartContext();

  useEffect(() => {
    fetchProducts();
  }, [cartChanged]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?category=summer");

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched summer products:", data);
        setProducts(Array.isArray(data) ? data : []);
        setError("");
      } else {
        setError("Failed to load summer collection");
      }
    } catch (err) {
      console.error("Error loading summer collection:", err);
      setError("Network error - failed to load products");
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
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Added ${productName} to cart!`);
        signalCartChange();
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Network error - failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <h1 className="text-3xl font-bold text-gold-400 mb-8">☀️ Summer Collection</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <h1 className="text-3xl font-bold text-gold-400 mb-8">☀️ Summer Collection</h1>
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 border border-gold-500 text-gold-300 px-6 py-2 rounded-lg hover:bg-gold-500 hover:text-black transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gold-400 mb-8">☀️ Summer Collection</h1>

        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No products found in summer collection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}