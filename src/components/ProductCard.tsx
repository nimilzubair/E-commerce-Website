"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productVariantId: string, productName: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.product_variants?.[0]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url 
    || product.product_images?.[0]?.image_url 
    || "/api/placeholder/300/400";

  const discountedPrice = selectedVariant?.price && product.discount 
    ? selectedVariant.price * (1 - product.discount / 100)
    : selectedVariant?.price;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(selectedVariant.id, product.name);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-600/20 hover:border-yellow-500 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/10">
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount && product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Variant Selection */}
        {product.product_variants && product.product_variants.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = product.product_variants?.find(v => v.id === e.target.value);
                setSelectedVariant(variant);
              }}
              className="w-full bg-black border border-yellow-600/30 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none"
            >
              {product.product_variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.size} {variant.color ? `- ${variant.color}` : ''} - PKR {variant.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          {discountedPrice && (
            <span className="text-2xl font-bold text-yellow-400">
              PKR {discountedPrice.toFixed(2)}
            </span>
          )}
          {product.discount && product.discount > 0 && selectedVariant?.price && (
            <span className="text-lg text-gray-400 line-through">
              PKR {selectedVariant.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAddingToCart}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}