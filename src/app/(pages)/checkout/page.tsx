"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Optional: ensure user has items in cart before showing form (best-effort)
  const [cartHasItems, setCartHasItems] = useState<boolean | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string>("");
  const [address, setAddress] = useState({
    shipping_name: "",
    shipping_phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          setCartHasItems(false);
          return;
        }
        const data = await res.json();
        setCartHasItems((data.items || []).length > 0);
      } catch {
        setCartHasItems(null);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let res = await fetch("/api/payment-options");
        let data = await res.json();
        type PaymentOption = { id: string; name: string; code: string };
        const raw: unknown = data.paymentOptions || [];
        const isPaymentOption = (o: unknown): o is PaymentOption => {
          if (typeof o !== "object" || o === null) return false;
          const r = o as Record<string, unknown>;
          return (
            typeof r.id === "string" &&
            typeof r.name === "string" &&
            typeof r.code === "string"
          );
        };
        let opts: PaymentOption[] = Array.isArray(raw)
          ? raw.filter(isPaymentOption).map((o) => ({ id: o.id, name: o.name, code: o.code }))
          : [];

        // If no options or table missing, try to seed then refetch
        if ((data && data.missingTable) || opts.length === 0) {
          const seedRes = await fetch("/api/payment-options", { method: "POST" });
          // Ignore seed error here; we will refetch and show result
          res = await fetch("/api/payment-options");
          data = await res.json();
          const raw2: unknown = data.paymentOptions || [];
          opts = Array.isArray(raw2)
            ? (raw2 as unknown[]).filter(isPaymentOption).map((o) => ({ id: (o as PaymentOption).id, name: (o as PaymentOption).name, code: (o as PaymentOption).code }))
            : [];
        }
        setPaymentOptions(opts);
        if (opts.length > 0) {
          setSelectedPaymentCode(opts[0].code);
        }
      } catch {
        setPaymentOptions([]);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          address: {
            shipping_name: address.shipping_name,
            shipping_phone: address.shipping_phone || undefined,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || undefined,
            city: address.city,
            state: address.state || undefined,
            postal_code: address.postal_code || undefined,
            country: address.country,
          },
          payment_option_code: selectedPaymentCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
      } else {
        setSuccess("Order created successfully");
        // Optionally redirect to order confirmation with order id
        setTimeout(() => {
          router.push("/");
        }, 1200);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Confirm Checkout</h1>
        <p className="text-sm text-gray-600 mb-6">
          For your security, please re-enter your password to place the order.
        </p>

        {cartHasItems === false && (
          <div className="mb-4 text-sm text-red-600">Your cart is empty.</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                value={address.shipping_name}
                onChange={(e) => setAddress((a) => ({ ...a, shipping_name: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                value={address.shipping_phone}
                onChange={(e) => setAddress((a) => ({ ...a, shipping_phone: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address line 1</label>
              <input
                value={address.address_line1}
                onChange={(e) => setAddress((a) => ({ ...a, address_line1: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address line 2</label>
              <input
                value={address.address_line2}
                onChange={(e) => setAddress((a) => ({ ...a, address_line2: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                value={address.city}
                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/Region</label>
              <input
                value={address.state}
                onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal code</label>
              <input
                value={address.postal_code}
                onChange={(e) => setAddress((a) => ({ ...a, postal_code: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                value={address.country}
                onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment method</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedPaymentCode}
              onChange={(e) => setSelectedPaymentCode(e.target.value)}
              required
            >
              {paymentOptions.length === 0 && (
                <option value="">No payment options available</option>
              )}
              {paymentOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>{opt.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-700">{success}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}


