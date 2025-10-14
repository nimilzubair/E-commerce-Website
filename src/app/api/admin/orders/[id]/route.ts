export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

// PATCH /api/admin/orders/[id]
// Body: { status: string }
// Only allow status update when payment_option_code = 'cod'
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const adminId = cookieStore.get("admin_id")?.value;
    if (!adminId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { status } = await req.json();
    // Match DB check constraint (exclude "processing" to avoid constraint violation)
    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"] as const;
    if (!status || typeof status !== "string" || !allowedStatuses.includes(status as any)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Fetch order to validate payment method and current status
    const { data: order, error: fetchErr } = await supabaseServer
      .from("orders")
      .select("id, status, payment_option_code")
      .eq("id", id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_option_code !== "cod") {
      return NextResponse.json({ error: "Only COD orders can be updated manually" }, { status: 403 });
    }

    // If already delivered, only allow change to cancelled
    if (order.status === "delivered" && status !== "cancelled") {
      return NextResponse.json({ error: "Delivered orders can only be changed to cancelled" }, { status: 400 });
    }

    // For COD orders: if delivered -> mark payment_status as paid, else unpaid
    const payment_status = status === "delivered" ? "paid" : "unpaid";

    const { data: updated, error: updErr } = await supabaseServer
      .from("orders")
      .update({ status, payment_status })
      .eq("id", id)
      .select("id, status, payment_status")
      .single();

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ order: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


