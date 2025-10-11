"use client";

import React, { useState, useEffect } from "react";

interface CartItem {
  id: string;
  quantity: number;
  unit_price: number;
  product_variants: {
    id: string;
    size: string;
    color: string;
    products: {
      id: string;
      name: string;
      price: number;
      discount: number;
    };
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
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
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (res.ok) {
        fetchCart(); // Refresh cart
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update quantity");
      }
    } catch (err) {
      alert("Network error - failed to update quantity");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCart(); // Refresh cart
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to remove item");
      }
    } catch (err) {
      alert("Network error - failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
        <p>Error: {error}</p>
        <button 
          onClick={fetchCart}
          className="mt-4 border px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <p>Cart ID: {cart?.cartId || "No cart created"}</p>
        </div>
      ) : (
        <div>
          <p>Cart ID: {cart.cartId}</p>
          <div className="mt-4 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="border p-4">
                <h3>{item.product_variants.products.name}</h3>
                <p>Size: {item.product_variants.size}</p>
                <p>Color: {item.product_variants.color}</p>
                <p>Unit Price: ${item.unit_price}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span>Quantity:</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <p>Total: ${(item.unit_price * item.quantity).toFixed(2)}</p>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="mt-2 border px-3 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold">
              Cart Total: $
              {cart.items
                .reduce((total, item) => total + (item.unit_price * item.quantity), 0)
                .toFixed(2)}
            </h3>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <button 
          onClick={fetchCart}
          className="border px-4 py-2"
        >
          Refresh Cart
        </button>
      </div>
    </div>
  );
}