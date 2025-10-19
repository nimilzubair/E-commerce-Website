export default function AboutPage() {
  const services = [
    {
      title: "Sublimation Printing",
      icon: "🎨",
      features: [
        "High-definition, fade-resistant printing",
        "Custom branding, patterns, and designs",
        "Ideal for clothing and home textiles",
        "Eco-friendly inks & professional finishing"
      ]
    },
    {
      title: "Fabric Manufacturing",
      icon: "🧵",
      features: [
        "Premium-quality fabric production",
        "Custom GSM, blends, and textures",
        "Bulk and bespoke orders accepted",
        "Strict quality checks at every stage"
      ]
    }
  ];

  const whyChooseUs = [
    {
      title: "In-House Production",
      description: "Fabric manufacturing & printing under one roof",
      icon: "🏭"
    },
    {
      title: "Custom Solutions",
      description: "From concept to final product",
      icon: "💡"
    },
    {
      title: "Small & Bulk Orders",
      description: "Flexible production capability",
      icon: "📦"
    },
    {
      title: "Fast Delivery",
      description: "Reliable turnaround times",
      icon: "⚡"
    },
    {
      title: "Premium Quality",
      description: "Durable materials & long-lasting prints",
      icon: "⭐"
    }
  ];

  const clients = [
    "Clothing & Fashion Brands",
    "Sportswear & Activewear Companies",
    "Uniform & Corporate Wear Suppliers",
    "Home Textile Businesses",
    "Merchandisers & Startups"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              About VIP Textiles
            </span>
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Welcome to <span className="text-yellow-400 font-semibold">VIP Textiles</span>, your trusted partner in sublimation printing and fabric manufacturing. We specialize in producing high-quality fabrics and delivering vibrant, long-lasting custom prints for fashion brands, home textiles, and more.
            </p>
            <p>
              With advanced sublimation technology and in-house fabric production, VIP Textiles ensures precision, durability, and consistent quality in every order. Whether you need bulk manufacturing or custom designs, we turn your ideas into premium products.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              What We Do
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600/30 hover:border-yellow-600 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl">{service.icon}</span>
                  <h3 className="text-3xl font-bold text-yellow-400">
                    {service.title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Why Choose VIP Textiles?
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600/30 hover:border-yellow-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border-2 border-yellow-600/50 backdrop-blur-sm mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Our Mission
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              At VIP Textiles, our mission is to provide businesses and brands with top-quality fabrics and exceptional sublimation printing services—combining innovation, craftsmanship, and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Who We Serve
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clients.map((client, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-gray-900 to-black border-2 border-yellow-600/30 hover:border-yellow-600 transition-all duration-300 hover:transform hover:translate-x-2"
              >
                <div className="w-3 h-3 bg-yellow-400 rounded-full flex-shrink-0"></div>
                <span className="text-lg text-gray-300">{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Let's bring your vision to life with our premium sublimation printing and fabric manufacturing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shopall"
              className="px-10 py-4 bg-black text-yellow-400 font-bold text-lg rounded-full hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
            >
              View Our Products
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border-2 border-black text-black font-bold text-lg rounded-full hover:bg-black hover:text-yellow-400 transform hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}