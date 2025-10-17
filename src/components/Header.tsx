// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  currentUser?: any;
  cartItemCount?: number;
}

export default function Header({ currentUser, cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  return (
    <header className="bg-primary border-b border-border-color sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
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
            <Link href="/shopall" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Shop All
            </Link>
            <Link href="/winter" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Winter
            </Link>
            <Link href="/summer" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Summer
            </Link>
            <Link href="/dupatta" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Dupattas
            </Link>
            <Link href="/shawl" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Shawls
            </Link>
            <a href="#contact" className="text-text-secondary hover:text-accent transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-secondary text-text-primary hover:bg-border-color transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <div className="relative w-8 h-8">
                <Image
                  src="/cart-icon.png"
                  alt="Cart"
                  width={32}
                  height={32}
                  className="text-text-secondary group-hover:text-accent transition-colors"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-text-secondary text-sm">
                  Hello, <span className="text-accent font-semibold">{currentUser.full_name}</span>
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm hover:opacity-80 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-text-secondary hover:text-accent transition-colors font-medium"
                >
                Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm hover:opacity-80 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-text-secondary hover:text-accent text-2xl"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border-color pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/shopall" className="text-text-secondary hover:text-accent transition-colors">
                Shop All
              </Link>
              <Link href="/winter" className="text-text-secondary hover:text-accent transition-colors">
                Winter Collection
              </Link>
              <Link href="/summer" className="text-text-secondary hover:text-accent transition-colors">
                Summer Collection
              </Link>
              <Link href="/dupatta" className="text-text-secondary hover:text-accent transition-colors">
                Dupattas
              </Link>
              <Link href="/shawl" className="text-text-secondary hover:text-accent transition-colors">
                Shawls
              </Link>
              <a href="#contact" className="text-text-secondary hover:text-accent transition-colors">
                Contact
              </a>
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm hover:opacity-80 transition-all text-center"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm hover:opacity-80 transition-all text-center"
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
