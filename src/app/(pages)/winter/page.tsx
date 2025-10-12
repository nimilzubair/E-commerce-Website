"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function WinterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?category=winter");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: Product[] = await res.json();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error("Error loading winter collection:", err);
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
        body: JSON.stringify({ productVariantId, quantity: 1 }),
      });
      const data = await res.json();

      if (res.ok) alert(`Added ${productName} to cart!`);
      else alert(data.error || "Failed to add to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Network error - failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">❄️ Winter Collection</h1>
        <p>Loading winter collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">❄️ Winter Collection</h1>
        <p>{error}</p>
        <button onClick={fetchProducts} className="mt-4 border px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">❄️ Winter Collection</h1>

      {products.length === 0 ? (
        <p className="text-center mt-8">No products found in winter collection</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            // Use first image or placeholder
            const imgUrl = p.product_images?.[0]?.image_url || "/placeholder.png";

            // Use first variant for Add to Cart or default to product
            const variant = p.product_variants?.[0];

            // Price with discount if exists
            const finalPrice = p.discount
              ? p.price - (p.price * p.discount) / 100
              : p.price;

            return (
              <div key={p.id} className="border rounded p-2 flex flex-col items-center">
                <img src={imgUrl} alt={p.name} className="w-32 h-32 object-cover mb-2 rounded" />
                <h2 className="font-semibold text-center">{p.name}</h2>
                <p className="text-sm text-gray-600">
                  {p.category || p.product_variants?.[0]?.product_id ? "" : "Uncategorized"}
                </p>
                <p className="text-sm mt-1">
                  Rs. {finalPrice.toFixed(0)}
                  {p.discount ? <span className="line-through text-gray-400 ml-1">Rs. {p.price}</span> : null}
                </p>
                {variant && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {variant.size || "-"}, Color: {variant.color || "-"}, Stock: {variant.stock ?? p.quantity ?? 0}
                  </p>
                )}
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  onClick={() => addToCart(variant?.id || p.id, p.name)}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
