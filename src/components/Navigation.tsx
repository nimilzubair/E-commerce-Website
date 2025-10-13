"use client";

import Link from "next/link";
import { useCartContext } from "@/context/CartContext";

export default function Navigation() {
  const { cartItemCount } = useCartContext();

  return (
    <nav className="bg-black border-b border-gold-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gold-400 hover:text-gold-300 transition-colors">
          LUXE
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/shopall" className="text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Shop
          </Link>
          <Link href="/winter" className="text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Winter
          </Link>
          <Link href="/summer" className="text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Summer
          </Link>
          <Link href="/dupatta" className="text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Dupattas
          </Link>
          <Link href="/shawl" className="text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Shawls
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex gap-6 items-center">
          {/* Cart */}
          <Link href="/cart" className="relative text-gray-300 hover:text-gold-400 transition-colors">
            <div className="text-xl">🛒</div>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          <Link href="/auth/login" className="text-gray-300 hover:text-gold-400 transition-colors text-sm">
            Login
          </Link>
          <Link href="/auth/signout" className="text-gray-300 hover:text-gold-400 transition-colors text-sm">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}