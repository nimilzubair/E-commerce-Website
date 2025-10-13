// app/api/auth/admin/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { full_name, role, is_active } = await req.json();

    // Validation
    if (role && !["super_admin", "admin", "moderator"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" }, 
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name.trim();
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: admin, error } = await supabaseServer
      .from("admins")
      .update(updateData)
      .eq("id", id)
      .select("id, email, full_name, role, is_active, created_at, updated_at")
      .single();

    if (error) {
      console.error("Update admin error:", error);
      return NextResponse.json(
        { error: "Failed to update admin" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      admin
    });

  } catch (err: any) {
    console.error("Update admin error:", err);
    return NextResponse.json(
      { error: "Failed to update admin" }, 
      { status: 500 }
    );
  }
}