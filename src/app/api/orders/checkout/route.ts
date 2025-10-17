export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";

// POST /api/orders/checkout
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const password = body?.password as string | undefined;
    const address = body?.address as any;
    const paymentOptionCode = body?.payment_option_code as string | undefined;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (!address || !address.address_line1 || !address.city || !address.country || !address.shipping_name) {
      return NextResponse.json({ error: "Address fields are incomplete" }, { status: 400 });
    }

    if (!paymentOptionCode) {
      return NextResponse.json({ error: "Payment option is required" }, { status: 400 });
    }

    // Fetch customer and verify password
    const { data: customer, error: customerError } = await supabaseServer
      .from("customers")
      .select("id, password, full_name, email")
      .eq("id", userId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Get user's cart
    const { data: cart } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .maybeSingle();

    if (!cart) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch cart items with variants
    const { data: items, error: itemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        quantity,
        unit_price,
        product_variant:product_variants!inner(
          id,
          stock
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock
    for (const item of items) {
      const variant = Array.isArray(item.product_variant)
        ? item.product_variant[0]
        : item.product_variant;

      const currentStock = variant?.stock ?? 0;

      if (item.quantity > currentStock) {
        return NextResponse.json(
          { error: `Insufficient stock for an item. Available: ${currentStock}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.unit_price * item.quantity,
      0
    );
    const totalAmount = +subtotal.toFixed(2);

    // Payment option
    let paymentOptionName: string | null = null;
    const { data: paymentOptData, error: paymentOptError } = await supabaseServer
      .from("payment_options")
      .select("name, code, is_active")
      .eq("code", paymentOptionCode)
      .maybeSingle();

    if (!paymentOptError && paymentOptData) {
      if (paymentOptData.is_active !== true) {
        return NextResponse.json(
          { error: "Selected payment option is not active" },
          { status: 400 }
        );
      }
      paymentOptionName = paymentOptData.name;
    }

    // Create order
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert([
        {
          customer_id: userId,
          status: "pending",
          total_amount: totalAmount,
          shipping_name: address.shipping_name,
          shipping_phone: address.shipping_phone || null,
          address_line1: address.address_line1,
          address_line2: address.address_line2 || null,
          city: address.city,
          state: address.state || null,
          postal_code: address.postal_code || null,
          country: address.country,
          payment_option_code: paymentOptionCode,
          payment_option_name: paymentOptionName,
          payment_status: "unpaid",
        },
      ])
      .select("id, customer_id, status, total_amount, created_at")
      .single();

    if (orderError || !order) {
      const maybeMissingColumns = {
        sql: `ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_name text,
  ADD COLUMN IF NOT EXISTS shipping_phone text,
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_line2 text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS payment_option_code text,
  ADD COLUMN IF NOT EXISTS payment_option_name text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';`,
      };
      return NextResponse.json(
        { error: orderError?.message || "Failed to create order", ...maybeMissingColumns },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItemsPayload = items.map((item: any) => {
      const variant = Array.isArray(item.product_variant)
        ? item.product_variant[0]
        : item.product_variant;
      return {
        order_id: order.id,
        product_variant_id: variant.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      };
    });

    const { error: orderItemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItemsPayload);

    if (orderItemsError) {
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 });
    }

    // Decrement stock
    for (const item of items) {
      const variant = Array.isArray(item.product_variant)
        ? item.product_variant[0]
        : item.product_variant;

      const newStock = (variant.stock as number) - item.quantity;

      const { error: updateError } = await supabaseServer
        .from("product_variants")
        .update({ stock: newStock })
        .eq("id", variant.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    // Clear cart
    const { error: clearError } = await supabaseServer
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    if (clearError) {
      return NextResponse.json({ error: clearError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Order created successfully",
      order,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("Checkout error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
