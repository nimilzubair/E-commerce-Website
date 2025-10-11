import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <div className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xl font-bold text-green-700">
          Rs {discountedPrice}
        </span>
        <button className="bg-black text-white text-sm px-3 py-1 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
