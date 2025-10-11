"use client";
<<<<<<< Updated upstream

import { Product } from "@/types/product";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productVariantId: string, productName: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.product_variants?.[0] || null
  );
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("No variant selected");
      return;
    }

    setAddingToCart(true);
    try {
      await onAddToCart(selectedVariant.id, product.name);
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscountedPrice = () => {
    return product.price * (1 - (product.discount || 0) / 100);
  };

  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];

  return (
    <div className="border rounded-lg p-4">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        {primaryImage ? (
          <img 
            src={primaryImage.image_url} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
=======

import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImage = product.image_url?.trim() !== "";

  return (
    <div className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col text-center">
      {/* ✅ FIX: Fixed-size container instead of fill */}
      <div className="w-full flex justify-center mb-3">
        {hasImage ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={180} // 👈 fixed width
            height={180} // 👈 fixed height
            className="rounded-xl object-cover hover:scale-105 transition-transform duration-300"
            unoptimized={product.image_url.includes("supabase.co")}
          />
        ) : (
          <div className="flex items-center justify-center w-[180px] h-[180px] bg-gray-100 text-gray-400 text-sm rounded-xl">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-2">
        {product.description || "No description available."}
      </p>

      <div className="flex justify-between items-center w-full mt-auto text-sm">
        <span className="text-gray-800 font-bold">Rs. {product.price}</span>
        <span className="text-gray-500">Stock: {product.quantity}</span>
>>>>>>> Stashed changes
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.categories?.name}</p>
      
      {/* Price */}
      <div className="mb-3">
        {product.discount > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${calculateDiscountedPrice().toFixed(2)}</span>
            <span className="text-sm text-gray-500 line-through">${product.price}</span>
            <span className="text-sm text-red-500">-{product.discount}%</span>
          </div>
        ) : (
          <span className="text-lg font-bold">${product.price}</span>
        )}
      </div>

      {/* Variants Selection */}
      {product.product_variants && product.product_variants.length > 0 && (
        <div className="mb-3">
          <select 
            value={selectedVariant?.id || ""}
            onChange={(e) => {
              const variant = product.product_variants.find(v => v.id === e.target.value);
              if (variant) setSelectedVariant(variant);
            }}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {product.product_variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.size} - {variant.color} ({variant.stock} left)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart || !selectedVariant || selectedVariant.stock === 0}
        className={`w-full py-2 px-4 rounded ${
          selectedVariant && selectedVariant.stock > 0
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {addingToCart
          ? "Adding..."
          : selectedVariant && selectedVariant.stock > 0
          ? "Add to Cart"
          : "Out of Stock"}
      </button>

      {/* Stock Info */}
      {selectedVariant && (
        <p className="text-xs text-gray-500 mt-2">
          Stock: {selectedVariant.stock}
        </p>
      )}
    </div>
  );
}