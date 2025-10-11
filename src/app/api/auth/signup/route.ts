export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { full_name, email, phone, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseServer
      .from("customers")
      .insert([{ full_name, email, phone, password: hashedPassword }])
      .select("id, full_name, email");

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
