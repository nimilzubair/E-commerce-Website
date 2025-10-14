"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/currentcookie");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          const totalItems = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemCount(totalItems);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCurrentUser();
    fetchCartCount();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setCurrentUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <nav className="bg-black border-b border-yellow-600/30 sticky top-0 z-50 backdrop-blur-md bg-black/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
  <img 
    src="/logo.png" 
    alt="LUXE" 
    className="h-12 w-auto" // Adjust height as needed
  />
</a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/shopall" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Shop All
            </a>
            <a href="/winter" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Winter
            </a>
            <a href="/summer" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Summer
            </a>
            <a href="/dupatta" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Dupattas
            </a>
            <a href="/shawl" className="text-gray-300 hover:text-yellow-400 transition-colors font-medium">
              Shawls
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <a href="/cart" className="relative group">
              <div className="text-2xl text-gray-300 group-hover:text-yellow-400 transition-colors">
                🛒
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>

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
                <a
                  href="/auth/login"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
                >
                  Login
                </a>
                <a
                  href="/auth/signup"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all"
                >
                  Sign Up
                </a>
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
              <a href="/shopall" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Shop All
              </a>
              <a href="/winter" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Winter Collection
              </a>
              <a href="/summer" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Summer Collection
              </a>
              <a href="/dupatta" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Dupattas
              </a>
              <a href="/shawl" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Shawls
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
                  <a
                    href="/auth/login"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/auth/signup"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm hover:from-yellow-500 hover:to-yellow-400 transition-all text-center"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}