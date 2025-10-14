export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

// GET /api/admin/orders
// Lists orders with customer, totals, and basic shipping/payment info
export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("admin_id")?.value;
    if (!adminId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .select(`
        id,
        customer_id,
        status,
        total_amount,
        created_at,
        shipping_name,
        city,
        country,
        payment_option_code,
        payment_option_name,
        payment_status,
        customers:customers(id, full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


