import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET all categories with product counts
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

    // Format categories with product counts
    const formattedCategories = (categories || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active, // Add this back
      product_count: category.products?.[0]?.count || 0,
      created_at: category.created_at,
      updated_at: category.updated_at
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

// POST create new category
export async function POST(req: Request) {
  try {
    const { name, description, is_active = true } = await req.json(); // Add is_active

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" }, 
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const { data: existingCategory } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" }, 
        { status: 400 }
      );
    }

    // Create category
    const { data: category, error } = await supabaseServer
      .from("categories")
      .insert([{
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        is_active: is_active, // Add this back
      }])
      .select()
      .single();

    if (error) {
      console.error("Create category error:", error);
      return NextResponse.json(
        { error: "Failed to create category" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      category,
      message: "Category created successfully" 
    });

  } catch (err: any) {
    console.error("Create category error:", err);
    return NextResponse.json(
      { error: "Failed to create category" }, 
      { status: 500 }
    );
  }
}