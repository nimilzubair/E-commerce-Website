// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";

// Variants display component
const ProductVariantsDisplay = ({ variants }: { variants: any[] }) => {
  if (!variants || variants.length === 0) return <span>No variants</span>;
  
  return (
    <div className="text-xs">
      {variants.map((variant, idx) => (
        <div key={variant.id} className="flex gap-1">
          <span>{variant.size}</span>
          {variant.color && <span>({variant.color})</span>}
          <span>- {variant.stock} in stock</span>
        </div>
      ))}
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !currentStatus }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Product availability updated successfully");
        fetchProducts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product availability");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button 
          onClick={() => window.location.href = "/admin/products/add"}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Total Stock</th>
              <th className="p-2 text-left">Variants</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.has_variants && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-1 rounded">Has Variants</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">
                  <span className={product.total_stock === 0 ? "text-red-500 font-bold" : ""}>
                    {product.total_stock}
                  </span>
                  {product.low_stock && product.total_stock > 0 && (
                    <span className="text-xs text-orange-500 ml-1">(Low)</span>
                  )}
                </td>
                <td className="p-2">
                  <ProductVariantsDisplay variants={product.product_variants} />
                </td>
                <td className="p-2">{product.category?.name}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.is_available 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = `/admin/products/${product.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      title="Edit Product"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleAvailability(product.id, product.is_available)}
                      className={`px-2 py-1 rounded text-sm ${
                        product.is_available 
                          ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      title={product.is_available ? "Disable Product" : "Enable Product"}
                    >
                      {product.is_available ? "Disable" : "Enable"}
                    </button>
                    <button 
                      onClick={() => window.location.href = `/admin/products/${product.id}/restock`}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                      title="Restock Product"
                    >
                      Restock
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      title="Delete Product"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-4 text-center">No products found</p>}
      </div>
    </div>
  );
}