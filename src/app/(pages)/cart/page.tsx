"use client";

import React, { useState, useEffect } from "react";
import { useCartContext } from "@/context/CartContext";
import Image from "next/image";

interface CartItem {
  id: string;
  quantity: number;
  product_variant: {
    id: string;
    size?: string;
    color?: string;
    product: {
      id: string;
      name: string;
      price: number;
      discount?: number;
      product_images: Array<{ image_url: string; is_primary: boolean }>;
    };
  };
}

export default function CartPage() {
  const { cartChanged, signalCartChange } = useCartContext();
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, [cartChanged]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }
    
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      if (res.ok) {
        signalCartChange();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update quantity");
        fetchCart();
      }
    } catch {
      alert("Network error - failed to update quantity");
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        signalCartChange();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to remove item");
        fetchCart();
      }
    } catch {
      alert("Network error - failed to remove item");
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const calculateItemPrice = (item: CartItem) => {
    const price = item.product_variant.product.price;
    const discount = item.product_variant.product.discount || 0;
    return price * (1 - discount / 100);
  };

  const total = cart.items.reduce((sum, item) => {
    return sum + (calculateItemPrice(item) * item.quantity);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gold-300 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gold-400 mb-8 text-center">Your Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-400 text-xl mb-6">Your cart is empty</p>
            <a 
              href="/shopall" 
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 inline-block"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gold-500 shadow-2xl shadow-gold-900/20 overflow-hidden">
            {cart.items.map((item) => {
              const product = item.product_variant.product;
              const imageUrl = product.product_images?.find(img => img.is_primary)?.image_url 
                || product.product_images?.[0]?.image_url 
                || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%236b7280' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3ENo Image%3C/text%3E%3C/svg%3E";
              const itemPrice = calculateItemPrice(item);
              const originalPrice = product.price;
              const hasDiscount = (product.discount ?? 0) > 0;

              return (
                <div key={item.id} className="border-b border-gold-500/30 last:border-b-0">
                  <div className="p-6 flex flex-col lg:flex-row items-center gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gold-500/50">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow text-center lg:text-left">
                      <h3 className="text-xl font-bold text-gold-300 mb-2">{product.name}</h3>
                      
                      {/* Variant Info */}
                      <div className="flex gap-6 mt-2 text-sm text-gray-300 justify-center lg:justify-start flex-wrap">
                        {item.product_variant.size && (
                          <span className="bg-gold-900/30 text-gold-300 px-3 py-1 rounded-lg border border-gold-500/30">
                            Size: {item.product_variant.size}
                          </span>
                        )}
                        {item.product_variant.color && (
                          <span className="bg-gold-900/30 text-gold-300 px-3 py-1 rounded-lg border border-gold-500/30">
                            Color: {item.product_variant.color}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mt-4 justify-center lg:justify-start flex-wrap">
                        <span className="text-2xl font-bold text-gold-400">
                          PKR {itemPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              PKR {originalPrice.toFixed(2)}
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded-lg text-sm border border-red-500/30">
                              Save {product.discount}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gold-500 rounded-xl bg-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="px-4 py-2 text-gold-300 hover:bg-gold-500 hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold-300 transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-16 text-center text-gold-300 font-bold text-lg">
                          {updating === item.id ? "..." : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="px-4 py-2 text-gold-300 hover:bg-gold-500 hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold-300 transition-all duration-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="bg-red-900/50 text-red-300 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-800 hover:text-white disabled:opacity-50 transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gold-400">
                        PKR {(itemPrice * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.quantity} × PKR {itemPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cart Total */}
            <div className="p-8 bg-gradient-to-r from-gold-900/20 to-gold-800/10 border-t border-gold-500/30">
              <div className="flex justify-between items-center text-3xl font-bold mb-6">
                <span className="text-gold-300">Total:</span>
                <span className="text-gold-400">PKR {total.toFixed(2)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/shopall"
                  className="flex-1 text-center border-2 border-gold-500 text-gold-300 px-8 py-4 rounded-lg hover:bg-gold-500 hover:text-black transition-all duration-300 font-bold text-lg"
                >
                  Continue Shopping
                </a>
                <button className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 text-lg">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}