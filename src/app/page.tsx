// app/page.tsx (Updated with proper navigation spacing)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function LuxuryHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userCount, setUserCount] = useState<number | null>(null);

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
    setUserCount(1247);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const categories = [
    { name: "Shop All", background: "/categories/shop-all.jpg", link: "/shopall" },
    { name: "Winter Collection", background: "/categories/winter.jpg", link: "/winter" },
    { name: "Summer Collection", background: "/categories/summer.jpg", link: "/summer" },
    { name: "Dupattas", background: "/categories/dupattas.jpg", link: "/dupatta" },
    { name: "Shawls", background: "/categories/shawls.jpg", link: "/shawl" }
  ];

  const features = [
    { background: "/features/premium-quality.png", title: "Premium Quality", desc: "Handpicked fabrics and materials" },
    { background: "/features/fast-delivery.png", title: "Fast Delivery", desc: "Express shipping nationwide" },
    { background: "/features/secure-payment.png", title: "Secure Payment", desc: "100% safe & encrypted" },
    { background: "/features/exclusive-designs.png", title: "Exclusive Designs", desc: "Limited edition collections" }
  ];

  return (
    <div className="min-h-screen bg-primary text-text-primary">
      {/* Add padding to account for fixed navigation */}
      <div className="pt-24">
        {/* Hero Carousel */}
        <section className="relative h-screen overflow-hidden -mt-24">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center z-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 text-text-primary drop-shadow-2xl animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-2xl md:text-3xl mb-8 text-accent font-light animate-fade-in-delay">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.link}
                      className="inline-block bg-accent text-primary px-10 py-4 rounded-full font-bold text-lg hover:opacity-80 transition-all duration-300 shadow-2xl hover:shadow-accent/50 transform hover:scale-105"
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
                    ? "bg-accent w-12"
                    : "bg-text-primary/50 hover:bg-text-primary/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 px-6 bg-gradient-to-b from-primary to-secondary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-4">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent">Collections</span>
            </h2>
            <p className="text-center text-text-secondary mb-16 text-lg">Curated designs for every occasion</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((cat, index) => (
                <a
                  key={index}
                  href={cat.link}
                  className="group relative overflow-hidden rounded-2xl border border-border-color hover:border-accent transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 min-h-[200px]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.background})` }}
                  />
                  <div className="absolute inset-0 bg-primary/50 group-hover:bg-primary/40 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-text-secondary group-hover:text-accent transition-colors text-sm">
                      Discover →
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-primary">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-border-color hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 transform hover:-translate-y-2 min-h-[250px]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${feature.background})` }}
                  />
                  <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/50 transition-all duration-300" />
                  
                  <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold mb-2 text-accent group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary group-hover:text-text-primary transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-primary to-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {userCount || "..."}+
                </div>
                <p className="text-xl text-text-secondary">Happy Customers</p>
              </div>
              <div className="group">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <p className="text-xl text-text-secondary">Premium Quality</p>
              </div>
              <div className="group">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <p className="text-xl text-text-secondary">Customer Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/40" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-text-primary drop-shadow-2xl">
              Begin Your Journey in Elegance
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-text-primary/90">
              Join thousands of satisfied customers who trust VIP for their wardrobe
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/shopall"
                className="inline-block bg-primary text-accent px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary transition-all duration-300 shadow-2xl hover:shadow-primary/50 transform hover:scale-105"
              >
                Shop All Collections
              </a>
              <a
                href="/auth/signup"
                className="inline-block bg-text-primary text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-border-color transition-all duration-300 shadow-2xl transform hover:scale-105"
              >
                Create Account
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent">
                Get in Touch
              </span>
            </h2>
            <p className="text-xl text-text-secondary mb-12">
              Have questions? We're here to help you find the perfect piece
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary to-primary border border-border-color">
                <div className="w-12 h-12 mx-auto mb-4 relative">
                  <Image
                    src="/contact/email.png"
                    alt="Email"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-accent mb-2">Email Us</h3>
                <a href="mailto:info@vip.com" className="text-text-secondary hover:text-accent transition-colors">
                  info@vip.com
                </a>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary to-primary border border-border-color">
                <div className="w-12 h-12 mx-auto mb-4 relative">
                  <Image
                    src="/contact/phone.png"
                    alt="Phone"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-accent mb-2">Call Us</h3>
                <a href="tel:+923001234567" className="text-text-secondary hover:text-accent transition-colors">
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
      </div>

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
        <span className="absolute right-full mr-4 bg-primary text-text-primary px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </button>
    </div>
  );
}
