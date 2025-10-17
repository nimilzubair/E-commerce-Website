// components/ProductCard.tsx
"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productVariantId: string, productName: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { theme } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState(product.product_variants?.[0]);
  const [isLoading, setIsLoading] = useState(false);

  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
  
  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsLoading(true);
    await onAddToCart(selectedVariant.id, product.name);
    setIsLoading(false);
  };

  const hasVariants = product.product_variants && product.product_variants.length > 1;
  const hasDiscount = (product.discount ?? 0) > 0;
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className={`rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-secondary to-primary border-border-color hover:border-accent' 
        : 'bg-primary border-border-color hover:border-accent'
    }`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={primaryImage?.image_url || "/placeholder-image.jpg"}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-primary px-2 py-1 rounded-lg text-sm font-bold">
            Save {product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={`p-4 transition-colors duration-300 bg-secondary`}>
        <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 text-text-primary`}>
          {product.name}
        </h3>

        {/* Variant Selection */}
        {hasVariants && (
          <div className="mb-3">
            <select
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = product.product_variants?.find(v => v.id === e.target.value);
                setSelectedVariant(variant);
              }}
              className={`w-full p-2 rounded-lg border text-sm transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-primary border-border-color text-text-primary' 
                  : 'bg-primary border-border-color text-text-primary'
              }`}
            >
              {product.product_variants?.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {[variant.size, variant.color].filter(Boolean).join(' • ')}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xl font-bold transition-colors duration-300 text-accent`}>
            PKR {discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className={`text-sm line-through transition-colors duration-300 text-text-secondary`}>
              PKR {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 bg-accent text-primary hover:opacity-80 disabled:opacity-50`}
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
