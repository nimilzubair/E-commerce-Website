// app/api/admin/admins/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data: admins, error } = await supabaseServer
      .from("admins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admins:", error);
      return NextResponse.json(
        { error: "Failed to fetch admins" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      admins: admins || [],
      count: admins?.length || 0 
    });

  } catch (err: any) {
    console.error("Admins API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}