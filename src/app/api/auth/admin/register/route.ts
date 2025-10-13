// app/api/auth/admin/register/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role = "admin" } = await req.json();

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" }, 
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["super_admin", "admin", "moderator"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" }, 
        { status: 400 }
      );
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabaseServer
      .from("admins")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" }, 
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const { data: admin, error: createError } = await supabaseServer
      .from("admins")
      .insert([{
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        full_name: full_name.trim(),
        role,
        is_active: true,
      }])
      .select("id, email, full_name, role, is_active, created_at")
      .single();

    if (createError) {
      console.error("Admin creation error:", createError);
      return NextResponse.json(
        { error: "Failed to create admin account" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Admin account created successfully",
        admin: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role,
          is_active: admin.is_active,
          created_at: admin.created_at
        }
      }, 
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Admin registration error:", err);
    return NextResponse.json(
      { error: "Failed to create admin account" }, 
      { status: 500 }
    );
  }
}