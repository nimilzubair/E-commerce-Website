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
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a variant");
      return;
    }
    if ((selectedVariant.stock ?? 0) < 1) {
      alert("Out of stock");
      return;
    }
    onAddToCart(selectedVariant.id, product.name);
  };

  const isOutOfStock = (selectedVariant?.stock ?? 0) < 1;

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gold-400 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-700'
              : 'bg-black text-white'
          }`}>
            {isOutOfStock ? 'Out' : 'In Stock'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || "Premium quality"}
        </p>

        {/* Variants */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="space-y-2 mb-4">
            {sizes.length > 0 && (
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
              >
                <option value="">Select Size</option>
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}

            {colors.length > 0 && (
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
              >
                <option value="">Select Color</option>
                {colors.map(color => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-black">
            PKR {finalPrice.toFixed(0)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              PKR {price.toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded font-semibold transition-all duration-300 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gold-500 hover:text-black'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}