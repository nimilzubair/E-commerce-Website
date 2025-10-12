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

  // ✅ Fetch summer category products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?category=summer");

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched products:", data);
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

  // ✅ Add product to cart
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

  // ✅ Loading state
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">☀️ Summer Collection</h1>
        <p>Loading summer collection...</p>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">☀️ Summer Collection</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 border px-4 py-2 rounded hover:bg-gray-100"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Final UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">☀️ Summer Collection</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in summer collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
