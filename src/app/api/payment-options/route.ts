export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// GET /api/payment-options
// Returns available payment options. If the table doesn't exist, returns empty with a note.
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("payment_options")
      .select("id, name, code, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      // Gracefully handle any error as "missing or not ready" to avoid 500s
      const message = (error as any)?.message || "Unknown error";
      return NextResponse.json({ paymentOptions: [], missingTable: true, error: message });
    }

    return NextResponse.json({ paymentOptions: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    // Avoid 500 to keep UI flow resilient
    return NextResponse.json({ paymentOptions: [], missingTable: true, error: message });
  }
}

// POST /api/payment-options
// Seeds only Cash on Delivery and Online Payment if the table exists
export async function POST() {
  try {
    const defaults = [
      { name: "Cash on Delivery", code: "cod", is_active: true },
      { name: "Online Payment", code: "online", is_active: true },
    ];

    // Use upsert keyed on `code` so repeated seeds won't duplicate
    const { error } = await supabaseServer
      .from("payment_options")
      .upsert(defaults, { onConflict: "code" });

    if (error) {
      const message = (error as any)?.message || "Insert failed";
      // Table missing or other issue: respond with guidance but not 500
      return NextResponse.json({
        success: false,
        error: message,
        sql: `CREATE TABLE IF NOT EXISTS public.payment_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    // Keep response non-fatal for UI resilience
    return NextResponse.json({ success: false, error: message });
  }
}


