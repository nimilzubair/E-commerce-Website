export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" }, 
        { status: 400 }
      );
    }

    // Check if user exists and is an admin
    const { data: admin, error } = await supabaseServer
      .from("admins") // You'll need to create this table
      .select("id, email, password, full_name, role, is_active")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        { error: "Admin account is deactivated" }, 
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    // Create admin session (store in HTTP-only cookie)
    const cookieSerialized = serialize("admin_id", admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Also store admin role for frontend checks (non-httpOnly)
    const roleCookieSerialized = serialize("admin_role", admin.role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(
      { 
        message: "Admin logged in successfully",
        admin: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role
        }
      }, 
      {
        status: 200,
        headers: { 
          "Set-Cookie": [cookieSerialized, roleCookieSerialized] 
        },
      }
    );

  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Something went wrong" }, 
      { status: 500 }
    );
  }
}