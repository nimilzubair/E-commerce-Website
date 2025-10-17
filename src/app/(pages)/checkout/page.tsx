// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

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
    fetchCurrentUser();
    fetchCartCount();
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

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/currentcookie");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const totalItems = data.items?.reduce(
  (sum: number, item: { quantity: number }) => sum + item.quantity,
  0
) || 0;

        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* <Header currentUser={currentUser} cartItemCount={cartItemCount} /> */}

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-yellow-600/30 p-8">
          <h1 className="text-4xl font-bold text-center mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Checkout
            </span>
          </h1>
          <p className="text-gray-400 text-center mb-8">
            For your security, please re-enter your password to place the order.
          </p>

          {cartHasItems === false && (
            <div className="mb-6 text-center bg-red-900/20 border border-red-700 text-red-300 px-6 py-4 rounded-2xl">
              Your cart is empty.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Full name</label>
                <input
                  value={address.shipping_name}
                  onChange={(e) => setAddress((a) => ({ ...a, shipping_name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                <input
                  value={address.shipping_phone}
                  onChange={(e) => setAddress((a) => ({ ...a, shipping_phone: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">Address line 1</label>
                <input
                  value={address.address_line1}
                  onChange={(e) => setAddress((a) => ({ ...a, address_line1: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">Address line 2</label>
                <input
                  value={address.address_line2}
                  onChange={(e) => setAddress((a) => ({ ...a, address_line2: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">City</label>
                <input
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">State/Region</label>
                <input
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Postal code</label>
                <input
                  value={address.postal_code}
                  onChange={(e) => setAddress((a) => ({ ...a, postal_code: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Country</label>
                <input
                  value={address.country}
                  onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Payment method</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
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
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
            {success && <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg">{success}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 rounded-full hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-60 transition-all duration-300 text-lg"
            >
              {isSubmitting ? "Placing order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}