// context/CartContext.tsx (Updated)
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartChanged: boolean;
  signalCartChange: () => void;
  cartItemCount: number;
  updateCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartChanged, setCartChanged] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const signalCartChange = () => {
    setCartChanged(prev => !prev);
  };

  const updateCartCount = (count: number) => {
    setCartItemCount(count);
  };

  // Fetch cart count on changes
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          const totalItems = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          updateCartCount(totalItems);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCartCount();
  }, [cartChanged]);

  return (
    <CartContext.Provider value={{ 
      cartChanged, 
      signalCartChange, 
      cartItemCount, 
      updateCartCount 
    }}>
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