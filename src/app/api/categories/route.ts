import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data: categories, error } = await supabaseServer
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Categories fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" }, 
        { status: 500 }
      );
    }

    const formattedCategories = (categories || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      product_count: category.products?.[0]?.count || 0,
    }));

    return NextResponse.json({ categories: formattedCategories });

  } catch (err: any) {
    console.error("Categories API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}