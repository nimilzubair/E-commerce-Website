"use client";

import Image from "next/image";
import { Product, ProductVariant } from "@/types/product";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productVariantId: string, productName: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasVariants =
    Array.isArray(product.product_variants) && product.product_variants.length > 0;

  // Fallback variant if no variants exist
  const defaultVariant: ProductVariant = product.product_variants?.[0] ?? {
    id: product.id,
    product_id: product.id,
    size: "Default",
    color: "Standard",
    stock: product.quantity ?? 0,
    sku: undefined,
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || !onAddToCart) return;

    setAddingToCart(true);
    try {
      await onAddToCart(selectedVariant.id, product.name);
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscountedPrice = () =>
    product.price * (1 - (product.discount || 0) / 100);

  // Safely pick primary image (fallback: first image or image_url)
  const primaryImage =
    product.product_images?.find((img) => img.is_primary) ||
    product.product_images?.[0] ||
    (product.image_url ? { image_url: product.image_url } : null);

  return (
    <div className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col text-center">
      {/* Product Image */}
      <div className="w-full flex justify-center mb-3">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={product.name}
            width={160}
            height={160}
            className="rounded-xl object-cover hover:scale-105 transition-transform duration-300"
            unoptimized={primaryImage.image_url.includes("supabase.co")}
          />
        ) : (
          <div className="flex items-center justify-center w-[160px] h-[160px] bg-gray-100 text-gray-400 text-sm rounded-xl">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">
        {product.category?.name || "Uncategorized"}
      </p>

      {/* Price & Discount */}
      <div className="mb-3">
        {product.discount && product.discount > 0 ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold">
              Rs. {calculateDiscountedPrice().toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.price.toFixed(0)}
            </span>
            <span className="text-sm text-red-500">-{product.discount}%</span>
          </div>
        ) : (
          <span className="text-lg font-bold">Rs. {product.price.toFixed(0)}</span>
        )}
      </div>

      {/* Variants */}
      {hasVariants && (
        <div className="mb-3">
          <select
            value={selectedVariant.id}
            onChange={(e) => {
              const variant = product.product_variants?.find(
                (v) => v.id === e.target.value
              );
              if (variant) setSelectedVariant(variant);
            }}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {product.product_variants?.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.size || "-"} - {variant.color || "-"} (
                {variant.stock ?? 0} left)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add to Cart Button */}
      {onAddToCart && (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || (selectedVariant.stock ?? 0) === 0}
          className={`w-full py-2 px-4 rounded ${
            (selectedVariant.stock ?? 0) > 0
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {addingToCart
            ? "Adding..."
            : (selectedVariant.stock ?? 0) > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      )}

      {/* Stock Info */}
      {selectedVariant && (
        <p className="text-xs text-gray-500 mt-2">
          Stock: {selectedVariant.stock ?? 0}
        </p>
      )}
    </div>
  );
}
