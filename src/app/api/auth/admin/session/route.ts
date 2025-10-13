import { supabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies(); 
    const adminCookie = cookieStore.get("admin_id");
    const adminId = adminCookie?.value;

    if (!adminId) return NextResponse.json({ admin: null });

    const { data, error } = await supabaseServer
      .from("admins")
      .select("id, full_name, email, role, is_active")
      .eq("id", adminId)
      .eq("is_active", true)
      .single();

    if (error || !data) return NextResponse.json({ admin: null });

    return NextResponse.json({ 
      admin: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        role: data.role
      }
    });
  } catch (err) {
    console.error("Admin session error:", err);
    return NextResponse.json({ admin: null }, { status: 500 });
  }
}