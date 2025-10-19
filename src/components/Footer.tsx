import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const whatsappNumber = "+923001234567";
    const whatsappMessage = "Hello! I'm interested in VIP Textiles services.";
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-black border-t-2 border-yellow-600/30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="VIP Textiles" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Textiles
                  </div>
                  <div className="text-xs text-gray-400">Premium Quality</div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in sublimation printing and fabric manufacturing. Premium quality, exceptional service.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/viptextiles" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-400 hover:bg-yellow-600 hover:text-black transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/viptextiles" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-400 hover:bg-yellow-600 hover:text-black transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-400 hover:bg-yellow-600 hover:text-black transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-lg">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shopall" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/winter" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Winter Collection
                </Link>
              </li>
              <li>
                <Link href="/summer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Summer Collection
                </Link>
              </li>
              <li>
                <Link href="/dupatta" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Dupattas
                </Link>
              </li>
              <li>
                <Link href="/shawl" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Shawls
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-lg">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services & Contact */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-lg">Our Services</h4>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-400">
                <span className="text-yellow-400">•</span> Sublimation Printing
              </li>
              <li className="text-gray-400">
                <span className="text-yellow-400">•</span> Fabric Manufacturing
              </li>
              <li className="text-gray-400">
                <span className="text-yellow-400">•</span> Custom Designs
              </li>
              <li className="text-gray-400">
                <span className="text-yellow-400">•</span> Bulk Orders
              </li>
            </ul>
            
            <div className="space-y-2">
              <h5 className="text-yellow-400 font-semibold text-sm mb-3">Contact Info</h5>
              <a 
                href="tel:+923001234567" 
                className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+92 300 1234567</span>
              </a>
              <a 
                href="mailto:info@viptextiles.com" 
                className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@viptextiles.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-yellow-600/30 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Subscribe to get special offers and updates</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-black border-2 border-yellow-600/30 rounded-l-full text-white focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-r-full hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-yellow-600/30 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} <span className="text-yellow-400 font-semibold">VIP Textiles</span>. All rights reserved. Crafted with excellence.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}