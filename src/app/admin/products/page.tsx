"use client";

import { useEffect, useState } from "react";

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

      <div className="border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">{product.total_stock}</td>
                <td className="p-2">{product.category?.name}</td>
                <td className="p-2">
                  <span className={product.is_available ? "text-green-500" : "text-red-500"}>
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = `/admin/products/${product.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleAvailability(product.id, product.is_available)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      {product.is_available ? "Disable" : "Enable"}
                    </button>
                    <button 
                      onClick={() => window.location.href = `/admin/products/${product.id}/restock`}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Restock
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
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