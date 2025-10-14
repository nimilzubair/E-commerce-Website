// page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LuxuryHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userCount, setUserCount] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // WhatsApp number - replace with your actual number
  const whatsappNumber = "+923001234567";
  const whatsappMessage = "Hello! I'm interested in your clothing collection.";

  const heroSlides = [
  {
    title: "Winter Collection 2025",
    subtitle: "Embrace elegance in every thread",
    image: "/categories/winter.jpg",
    cta: "Explore Winter",
    link: "/winter"
  },
  {
    title: "Summer Essentials",
    subtitle: "Light, breezy, sophisticated",
    image: "/categories/summer.jpg",
    cta: "Shop Summer",
    link: "/summer"
  },
  {
    title: "Timeless Dupattas",
    subtitle: "Handcrafted perfection",
    image: "/categories/dupattas.jpg",
    cta: "View Collection",
    link: "/dupatta"
  }
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/currentcookie");
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    // Fetch cart count
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
    setUserCount(1247);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  // Categories with proper background images
  const categories = [
  { name: "Shop All", background: "/categories/shop-all.jpg", link: "/shopall" },
  { name: "Winter Collection", background: "/categories/winter.jpg", link: "/winter" },
  { name: "Summer Collection", background: "/categories/summer.jpg", link: "/summer" },
  { name: "Dupattas", background: "/categories/dupattas.jpg", link: "/dupatta" },
  { name: "Shawls", background: "/categories/shawls.jpg", link: "/shawl" }
];


  // Features with proper relevant images
  const features = [
  { background: "/features/premium-quality.png", title: "Premium Quality", desc: "Handpicked fabrics and materials" },
  { background: "/features/fast-delivery.png", title: "Fast Delivery", desc: "Express shipping nationwide" },
  { background: "/features/secure-payment.png", title: "Secure Payment", desc: "100% safe & encrypted" },
  { background: "/features/exclusive-designs.png", title: "Exclusive Designs", desc: "Limited edition collections" }
];


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Component */}
      <Header currentUser={currentUser} cartItemCount={cartItemCount} />

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl mb-8 text-yellow-300 font-light">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105"
                  >
                    {slide.cta} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-yellow-500 w-12"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Collections</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Curated designs for every occasion</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, index) => (
              <a
                key={index}
                href={cat.link}
                className="group relative overflow-hidden rounded-2xl border border-yellow-600/20 hover:border-yellow-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 min-h-[200px]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.background})` }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 group-hover:text-yellow-300 transition-colors text-sm">
                    Discover →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-yellow-600/20 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 transform hover:-translate-y-2 min-h-[250px]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${feature.background})` }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {userCount || "..."}+
              </div>
              <p className="text-xl text-gray-300">Happy Customers</p>
            </div>
            <div className="group">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <p className="text-xl text-gray-300">Premium Quality</p>
            </div>
            <div className="group">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-xl text-gray-300">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            Begin Your Journey in Elegance
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Join thousands of satisfied customers who trust VIP for their wardrobe
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/shopall"
              className="inline-block bg-black text-yellow-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-2xl hover:shadow-black/50 transform hover:scale-105"
            >
              Shop All Collections
            </a>
            <a
              href="/auth/signup"
              className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Get in Touch
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Have questions? We're here to help you find the perfect piece
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-yellow-600/20">
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <Image
                  src="/contact/email.png"
                  alt="Email"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Email Us</h3>
              <a href="mailto:info@vip.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                info@vip.com
              </a>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-yellow-600/20">
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <Image
                  src="/contact/phone.png"
                  alt="Phone"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Call Us</h3>
              <a href="tel:+923001234567" className="text-gray-300 hover:text-yellow-400 transition-colors">
                +92 300 1234567
              </a>
            </div>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <div className="w-6 h-6 relative">
              <Image
                src="/contact/whatsapp.png"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            Chat on WhatsApp
          </button>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-green-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        title="Chat on WhatsApp"
      >
        <div className="w-8 h-8 relative">
          <Image
            src="/contact/whatsapp.png"
            alt="WhatsApp"
            fill
            className="object-contain"
          />
        </div>
        <span className="absolute right-full mr-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </button>
    </div>
  );
}