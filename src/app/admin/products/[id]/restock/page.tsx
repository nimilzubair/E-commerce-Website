"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RestockProductPage() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("");
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data.product);
        setQuantity(data.product.quantity?.toString() || "0");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || parseInt(quantity) < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}/restock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product restocked successfully!");
        router.push("/admin/products");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error restocking product:", error);
      alert("Failed to restock product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Restock Product</h1>
      
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="font-bold text-lg">{product.name}</h2>
        <p className="text-gray-600">Current Stock: {product.quantity}</p>
        <p className="text-gray-600">Price: ${product.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">New Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            >
              {loading ? "Restocking..." : "Restock Product"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}