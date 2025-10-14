// app/cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCartContext } from "@/context/CartContext";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchCurrentUser();
  }, [cartChanged]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/currentcookie");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        const totalItems = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartItemCount(totalItems);
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* <Header currentUser={currentUser} cartItemCount={cartItemCount} /> */}

      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Your Shopping Cart
          </span>
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-6">Your cart is empty</p>
            <a 
              href="/shopall" 
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold px-8 py-4 rounded-full hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 inline-block"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-yellow-600/30 shadow-2xl shadow-yellow-900/20 overflow-hidden">
            {cart.items.map((item) => {
              const product = item.product_variant.product;
              const imageUrl = product.product_images?.find(img => img.is_primary)?.image_url 
                || product.product_images?.[0]?.image_url 
                || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%236b7280' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3ENo Image%3C/text%3E%3C/svg%3E";
              const itemPrice = calculateItemPrice(item);
              const originalPrice = product.price;
              const hasDiscount = (product.discount ?? 0) > 0;

              return (
                <div key={item.id} className="border-b border-yellow-600/30 last:border-b-0">
                  <div className="p-6 flex flex-col lg:flex-row items-center gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-yellow-600/50 bg-gradient-to-br from-gray-900 to-black">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover object-center"
                        priority={false}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow text-center lg:text-left">
                      <h3 className="text-xl font-bold text-yellow-300 mb-2">{product.name}</h3>
                      
                      {/* Variant Info */}
                      <div className="flex gap-6 mt-2 text-sm text-gray-300 justify-center lg:justify-start flex-wrap">
                        {item.product_variant.size && (
                          <span className="bg-yellow-900/30 text-yellow-300 px-3 py-1 rounded-lg border border-yellow-600/30">
                            Size: {item.product_variant.size}
                          </span>
                        )}
                        {item.product_variant.color && (
                          <span className="bg-yellow-900/30 text-yellow-300 px-3 py-1 rounded-lg border border-yellow-600/30">
                            Color: {item.product_variant.color}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mt-4 justify-center lg:justify-start flex-wrap">
                        <span className="text-2xl font-bold text-yellow-400">
                          PKR {itemPrice.toFixed(0)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              PKR {originalPrice.toFixed(0)}
                            </span>
                            <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded-lg text-sm border border-red-600/30">
                              Save {product.discount}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-yellow-600 rounded-xl bg-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="px-4 py-2 text-yellow-300 hover:bg-yellow-600 hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-yellow-300 transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-16 text-center text-yellow-300 font-bold text-lg">
                          {updating === item.id ? "..." : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="px-4 py-2 text-yellow-300 hover:bg-yellow-600 hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-yellow-300 transition-all duration-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="bg-red-900/50 text-red-300 px-4 py-2 rounded-lg border border-red-600/30 hover:bg-red-800 hover:text-white disabled:opacity-50 transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">
                        PKR {(itemPrice * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.quantity} × PKR {itemPrice.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cart Total */}
            <div className="p-8 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-t border-yellow-600/30">
              <div className="flex justify-between items-center text-3xl font-bold mb-6">
                <span className="text-yellow-300">Total:</span>
                <span className="text-yellow-400">PKR {total.toFixed(0)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/shopall"
                  className="flex-1 text-center border-2 border-yellow-600 text-yellow-300 px-8 py-4 rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300 font-bold text-lg"
                >
                  Continue Shopping
                </a>
                <a
                  href="/checkout"
                  className="flex-1 text-center bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold px-8 py-4 rounded-full hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-lg"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}