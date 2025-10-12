"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface CartContextType {
  cartChanged: number;
  signalCartChange: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartChanged, setCartChanged] = useState(0);

  const signalCartChange = useCallback(() => {
    setCartChanged((prev) => prev + 1);
  }, []);

  return (
    <CartContext.Provider value={{ cartChanged, signalCartChange }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
};
