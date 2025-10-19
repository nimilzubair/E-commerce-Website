// src/app/(pages)/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userCount, setUserCount] = useState<number | null>(null);

  const whatsappNumber = "+923001234567";
  const whatsappMessage = "Hello! I'm interested in VIP Textiles services.";

  const heroSlides = [
    {
      title: "VIP Textiles",
      subtitle: "Premium Quality Sublimation & Fabrics",
      description: "Your trusted partner in sublimation printing and fabric manufacturing",
      image: "/heroslide1.jpg",
      isMainSlide: true
    },
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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>

            {/* Content */}
            {slide.isMainSlide ? (
              // First Slide - Logo and About Us
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                  {/* Logo */}
                  <div className="mb-12 animate-fade-in">
                    <div className="relative w-full max-w-md h-40 mx-auto mb-8">
                      <Image
                        src="/logo.png"
                        alt="VIP Textiles"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>

                  {/* Tagline */}
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      {slide.subtitle}
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up-delay">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up-delay-2">
                    <a
                      href="/about"
                      className="px-12 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-lg rounded-full hover:from-yellow-500 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-900/50"
                    >
                      About Us
                    </a>
                    <a
                      href="/shopall"
                      className="px-12 py-4 border-2 border-yellow-600 text-yellow-400 font-bold text-lg rounded-full hover:bg-yellow-600 hover:text-black transform hover:scale-105 transition-all duration-300"
                    >
                      Shop Collection
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Other Slides - Collection Display
              <div className="absolute inset-0 flex items-center z-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-2xl md:text-3xl mb-8 text-yellow-400 font-light animate-fade-in-delay">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.link}
                      className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-900/50 transform hover:scale-105"
                    >
                      {slide.cta} →
                    </a>
                  </div>
                </div>
              </div>
            )}
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
                  ? "bg-yellow-400 w-12"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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
                className="group relative overflow-hidden rounded-2xl border-2 border-yellow-600/30 hover:border-yellow-600 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-900/20 min-h-[200px]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.background})` }}
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-yellow-400 transition-colors text-sm">
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
                className="group relative overflow-hidden rounded-2xl border-2 border-yellow-600/30 hover:border-yellow-600 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/10 transform hover:-translate-y-2 min-h-[250px]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${feature.background})` }}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-white transition-colors">
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
              <p className="text-xl text-gray-400">Happy Customers</p>
            </div>
            <div className="group">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <p className="text-xl text-gray-400">Premium Quality</p>
            </div>
            <div className="group">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-xl text-gray-400">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-yellow-600 to-yellow-500 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            Begin Your Journey in Elegance
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-black/80">
            Join thousands of satisfied customers who trust VIP Textiles
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/shopall"
              className="inline-block bg-black text-yellow-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-2xl transform hover:scale-105"
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
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600/30">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Email Us</h3>
              <a href="mailto:info@viptextiles.com" className="text-gray-400 hover:text-yellow-400 transition-colors">
                info@viptextiles.com
              </a>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600/30">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Call Us</h3>
              <a href="tel:+923001234567" className="text-gray-400 hover:text-yellow-400 transition-colors">
                +92 300 1234567
              </a>
            </div>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat on WhatsApp
          </button>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-green-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        title="Chat on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-2 border-yellow-600/30">
          Chat with us!
        </span>
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}