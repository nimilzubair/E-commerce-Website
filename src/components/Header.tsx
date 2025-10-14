// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  currentUser?: any;
  cartItemCount?: number;
}

export default function Header({ currentUser, cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  return (
    <header className="bg-black border-b border-yellow-600/30 sticky top-0 z-50 backdrop-blur-md bg-black/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="VIP"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/shopall" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Shop All
            </Link>
            <Link href="/winter" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Winter
            </Link>
            <Link href="/summer" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Summer
            </Link>
            <Link href="/dupatta" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Dupattas
            </Link>
            <Link href="/shawl" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Shawls
            </Link>
            <a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link href="/cart" className="relative group">
              <div className="relative w-8 h-8">
                <Image
                  src="/cart-icon.png"
                  alt="Cart"
                  width={32}
                  height={32}
                  className="text-gray-300 group-hover:text-yellow-400 transition-colors"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-gray-300 text-sm">
                  Hello, <span className="text-yellow-400 font-semibold">{currentUser.full_name}</span>
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-yellow-400 text-2xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-yellow-600/30 pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/shopall" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Shop All
              </Link>
              <Link href="/winter" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Winter Collection
              </Link>
              <Link href="/summer" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Summer Collection
              </Link>
              <Link href="/dupatta" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Dupattas
              </Link>
              <Link href="/shawl" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Shawls
              </Link>
              <a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Contact
              </a>
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all text-center"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}