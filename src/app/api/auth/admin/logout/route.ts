export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Clear both admin cookies
  const adminIdCookie = serialize("admin_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  const adminRoleCookie = serialize("admin_role", "", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json(
    { message: "Admin signed out successfully" }, 
    {
      headers: { 
        "Set-Cookie": [adminIdCookie, adminRoleCookie] 
      },
    }
  );
}