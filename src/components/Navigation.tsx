"use client";

import Link from "next/link";
import { useCartContext } from "@/context/CartContext";

export default function Navigation() {
  const { cartItemCount } = useCartContext();

  return (
    <nav className="bg-white shadow-sm border-b p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          MyStore
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link href="/shopall" className="hover:text-blue-600 font-medium transition-colors">
            Shop All
          </Link>
          <Link href="/winter" className="hover:text-blue-600 font-medium transition-colors">
            Winter
          </Link>
          <Link href="/summer" className="hover:text-blue-600 font-medium transition-colors">
            Summer
          </Link>
          <Link href="/dupatta" className="hover:text-blue-600 font-medium transition-colors">
            Dupattas
          </Link>
          <Link href="/shawl" className="hover:text-blue-600 font-medium transition-colors">
            Shawls
          </Link>
          
          <Link href="/cart" className="relative hover:text-blue-600 font-medium transition-colors">
            <span className="flex items-center gap-1">
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </span>
          </Link>
          
          <Link href="/auth/login" className="hover:text-blue-600 font-medium transition-colors">
            Login
          </Link>
          <Link href="/auth/signout" className="text-red-600 hover:text-red-700 font-medium transition-colors">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}