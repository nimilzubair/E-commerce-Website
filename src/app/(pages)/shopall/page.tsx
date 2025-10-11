"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function ShopAllPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setError("");
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      setError("Network error - failed to load products");
      console.error("Error loading products:", err);
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
        <h1 className="text-2xl font-semibold mb-4">🛍️ Shop All Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">🛍️ Shop All Products</h1>
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
      <h1 className="text-2xl font-semibold mb-4">🛍️ Shop All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center mt-8">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}