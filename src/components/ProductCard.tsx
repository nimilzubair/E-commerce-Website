"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (variantId: string, productName: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);

  const variants = product?.product_variants ?? [];
  const discount = product?.discount ?? 0;
  const price = product?.price ?? 0;

  const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
  const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));

  const selectedVariant = useMemo(() => {
    if (!variants.length) return undefined;
    return (
      variants.find(
        v =>
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
      ) ?? variants[0]
    );
  }, [variants, selectedSize, selectedColor]);

  const primaryImage =
    product?.product_images?.find(img => img.is_primary)?.image_url ||
    product?.product_images?.[0]?.image_url ||
    "/placeholder.svg";

  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a valid variant");
      return;
    }
    if ((selectedVariant.stock ?? 0) < 1) {
      alert("This variant is out of stock");
      return;
    }
    onAddToCart(selectedVariant.id, product.name);
  };

  return (
    <div className="group bg-black border-2 border-gold-500 rounded-xl overflow-hidden shadow-2xl shadow-gold-900/20 hover:shadow-gold-500/30 transition-all duration-500 hover:scale-105 hover:border-gold-300 flex flex-col w-full max-w-xs mx-auto">
      {/* Image Container - Fixed size */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 to-black overflow-hidden flex-shrink-0">
        <Image
          src={primaryImage}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110"
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Golden Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-3 py-1 rounded-full shadow-lg text-sm">
              -{discount}% OFF
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            (selectedVariant?.stock ?? product.quantity ?? 0) > 0 
              ? 'bg-green-900/80 text-green-300 border border-green-500' 
              : 'bg-red-900/80 text-red-300 border border-red-500'
          }`}>
            {(selectedVariant?.stock ?? product.quantity ?? 0) > 0 ? 'IN STOCK' : 'OUT'}
          </div>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 z-20">
          <button className="bg-gold-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-400 transition-all">
            Quick View
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 bg-gradient-to-b from-gray-900 to-black flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="text-lg font-bold text-gold-400 mb-1 tracking-wide group-hover:text-gold-300 transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Product Description */}
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
          {product.description || "Premium quality product"}
        </p>

        {/* Variant Selection */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="space-y-2 mb-3 p-3 bg-gray-900/50 rounded-lg border border-gold-500/20">
            {sizes.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <label className="text-gold-300 font-medium text-xs">Size:</label>
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="bg-black border border-gold-600 rounded px-2 py-1 text-gold-100 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">Choose</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {colors.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <label className="text-gold-300 font-medium text-xs">Color:</label>
                <select
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="bg-black border border-gold-600 rounded px-2 py-1 text-gold-100 text-xs focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">Choose</option>
                  {colors.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xl font-bold text-gold-400">
            PKR {finalPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">
                PKR {price.toFixed(2)}
              </span>
              <span className="text-xs bg-gold-900/30 text-gold-300 px-2 py-1 rounded border border-gold-500/30">
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || (selectedVariant.stock ?? 0) < 1}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-yellow-900/30 text-sm"
        >
          {(selectedVariant?.stock ?? 0) < 1 ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* Additional Info */}
        <div className="mt-3 flex justify-between text-xs text-gray-500 gap-1">
          <span>⭐ Premium</span>
          <span>🚚 Free Ship</span>
          <span>🔒 Secure</span>
        </div>
      </div>
    </div>
  );
}