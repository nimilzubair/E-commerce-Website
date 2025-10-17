// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartChanged: boolean;
  signalCartChange: () => void;
  cartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartChanged, setCartChanged] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const signalCartChange = () => {
    setCartChanged(prev => !prev);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          setCartItemsCount(data.items?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, [cartChanged]);

  return (
    <CartContext.Provider value={{ cartChanged, signalCartChange, cartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}