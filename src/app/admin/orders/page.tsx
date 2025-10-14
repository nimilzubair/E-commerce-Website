"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_name?: string | null;
  city?: string | null;
  country?: string | null;
  payment_option_code?: string | null;
  payment_option_name?: string | null;
  payment_status?: string | null;
  customers?: { id: string; full_name: string; email: string } | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load orders");
        } else {
          setOrders(data.orders || []);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load orders";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }
      setOrders((prev) => prev.map((o) => (
        o.id === orderId
          ? { ...o, status: data.order.status, payment_status: data.order.payment_status }
          : o
      )));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Update failed";
      alert(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{o.id.slice(0, 8)}...</div>
                  <div className="text-gray-600">{new Date(o.created_at).toLocaleString()}</div>
                  <div className="text-gray-600">{o.shipping_name} {o.city ? `• ${o.city}` : ""} {o.country ? `• ${o.country}` : ""}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{o.customers?.full_name || "-"}</div>
                  <div className="text-gray-600">{o.customers?.email || "-"}</div>
                </td>
                <td className="p-3">${o.total_amount?.toFixed(2)}</td>
                <td className="p-3">
                  <div>{o.payment_option_name || o.payment_option_code || "-"}</div>
                  <div className="text-gray-600">{o.payment_status || "-"}</div>
                </td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">
                  {o.payment_option_code === "cod" ? (
                    <div className="flex gap-2">
                      {o.status !== "delivered" && (
                        <>
                          <button
                            className="px-3 py-1 rounded border"
                            onClick={() => updateStatus(o.id, "pending")}
                            disabled={updatingId === o.id}
                          >
                            Pending
                          </button>
                          <button
                            className="px-3 py-1 rounded border"
                            onClick={() => updateStatus(o.id, "shipped")}
                            disabled={updatingId === o.id}
                          >
                            Shipped
                          </button>
                          <button
                            className="px-3 py-1 rounded border"
                            onClick={() => updateStatus(o.id, "delivered")}
                            disabled={updatingId === o.id}
                          >
                            Delivered
                          </button>
                        </>
                      )}
                      <button
                        className="px-3 py-1 rounded border"
                        onClick={() => updateStatus(o.id, "cancelled")}
                        disabled={updatingId === o.id}
                      >
                        Cancelled
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">Status managed by payment gateway</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


