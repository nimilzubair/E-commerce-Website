"use client";

import React, { useState, useEffect } from "react";
import { useCartContext } from "@/context/CartContext";

interface CartItem {
  id: string;
  quantity: number;
  unit_price: number; // discounted price
  product_variant: {
    id: string;
    size?: string;
    color?: string;
    product: {
      id: string;
      name: string;
      price: number; // original price
      discount?: number;
      stock?: number;
    };
  };
}

interface CartResponse {
  cartId: string;
  items: CartItem[];
}

export default function CartPage() {
  const { signalCartChange } = useCartContext();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to fetch cart");
      }
    } catch (err) {
      setError("Network error - failed to connect to server");
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        fetchCart();
        signalCartChange();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update quantity");
      }
    } catch {
      alert("Network error - failed to update quantity");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCart();
        signalCartChange();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to remove item");
      }
    } catch {
      alert("Network error - failed to remove item");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
        <p>Error: {error}</p>
        <button onClick={fetchCart} className="mt-4 border px-4 py-2">Retry</button>
      </div>
    );

  // calculate totals
  const totalDiscounted = cart?.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) ?? 0;
  const totalOriginal = cart?.items.reduce((sum, item) => sum + (item.product_variant.product.price * item.quantity), 0) ?? 0;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => {
            const product = item.product_variant.product;
            const discount = product.discount ?? 0;
            return (
              <div key={item.id} className="border p-4 flex flex-col gap-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Size: {item.product_variant.size || "-"}</p>
                <p>Color: {item.product_variant.color || "-"}</p>
                {product.stock !== undefined && <p>Stock: {product.stock}</p>}

                <p>
                  Price:{" "}
                  <span className="text-green-600 font-bold">${item.unit_price.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="text-gray-400 line-through ml-2">${product.price.toFixed(2)}</span>
                  )}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span>Quantity:</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <p>
                  Subtotal:{" "}
                  <span className="text-green-600 font-bold">${(item.unit_price * item.quantity).toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="text-gray-400 line-through ml-2">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                </p>

                <button onClick={() => removeItem(item.id)} className="mt-2 border px-3 py-1">Remove</button>
              </div>
            );
          })}

          <div className="mt-6 border-t pt-4 space-y-2">
            <h3 className="text-xl font-bold">Total (Discounted): ${totalDiscounted.toFixed(2)}</h3>
            {totalOriginal > totalDiscounted && (
              <>
                <h3 className="text-gray-500 line-through">Total (Original): ${totalOriginal.toFixed(2)}</h3>
                <h3 className="text-green-600">You Save: ${(totalOriginal - totalDiscounted).toFixed(2)}</h3>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <button onClick={fetchCart} className="border px-4 py-2">Refresh Cart</button>
      </div>
    </div>
  );
}
