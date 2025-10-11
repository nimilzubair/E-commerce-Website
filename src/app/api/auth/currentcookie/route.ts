import { supabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies(); // server-only API
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) return NextResponse.json({ user: null });

    const { data, error } = await supabaseServer
      .from("customers")
      .select("id, full_name, email")
      .eq("id", userId)
      .single();

    if (error || !data) return NextResponse.json({ user: null });

    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
