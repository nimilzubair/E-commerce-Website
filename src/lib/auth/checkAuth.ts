import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;

  // Fetch user from Supabase
  const { data, error } = await supabaseServer
    .from("customers")
    .select("id, full_name, email")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data;
}
