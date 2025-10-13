// app/api/auth/admin/admins/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: admins, error, count } = await supabaseServer
      .from("admins")
      .select("id, email, full_name, role, is_active, created_at, updated_at", { 
        count: 'exact' 
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Fetch admins error:", error);
      return NextResponse.json(
        { error: "Failed to fetch admins" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      admins: admins || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (err: any) {
    console.error("Fetch admins error:", err);
    return NextResponse.json(
      { error: "Failed to fetch admins" }, 
      { status: 500 }
    );
  }
}