"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function DupattaPage() {
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
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">🧣 Dupatta Collection</h1>
        <p>Loading dupattas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">🧣 Dupatta Collection</h1>
        <p>Error: {error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 border px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🧣 Dupatta Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>
      
      {products.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p>No dupattas found in this collection</p>
        </div>
      )}
    </div>
  );
}