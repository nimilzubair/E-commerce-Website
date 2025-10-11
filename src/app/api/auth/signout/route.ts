export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookieSerialized = serialize("user_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "Signed out successfully" }, {
    headers: { "Set-Cookie": cookieSerialized },
  });
}
