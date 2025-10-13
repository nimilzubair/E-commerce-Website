// app/api/auth/admin/[id]/password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const { error } = await supabaseServer
      .from("admins")
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Change password error:", error);
      return NextResponse.json(
        { error: "Failed to change password" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (err: any) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Failed to change password" }, 
      { status: 500 }
    );
  }
}