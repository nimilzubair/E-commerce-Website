// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "+923001234567";
    const whatsappMessage = "Hello! I'm interested in your clothing collection.";
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-primary border-t border-border-color py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="VIP"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-text-secondary">
              Premium clothing for the discerning individual
            </p>
          </div>
          
          <div>
            <h4 className="text-accent font-semibold mb-4 text-lg">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shopall" className="text-text-secondary hover:text-accent transition-colors">All Products</Link></li>
              <li><Link href="/winter" className="text-text-secondary hover:text-accent transition-colors">Winter</Link></li>
              <li><Link href="/summer" className="text-text-secondary hover:text-accent transition-colors">Summer</Link></li>
              <li><Link href="/dupatta" className="text-text-secondary hover:text-accent transition-colors">Dupattas</Link></li>
              <li><Link href="/shawl" className="text-text-secondary hover:text-accent transition-colors">Shawls</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-2">
              <li><a href="#contact" className="text-text-secondary hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Returns</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-accent font-semibold mb-4 text-lg">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Facebook</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Twitter</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-color pt-8 text-center">
          <p className="text-text-secondary">
            &copy; 2025 VIP. All rights reserved. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
