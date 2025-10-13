import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Test a simple query
    const { data, error } = await supabaseServer
      .from("products")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Supabase connection failed", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful" 
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Connection test failed", details: err.message },
      { status: 500 }
    );
  }
}