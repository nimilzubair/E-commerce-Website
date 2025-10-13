import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET single category
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: category, error } = await supabaseServer
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .eq("id", id)
      .single();

    if (error || !category) {
      return NextResponse.json(
        { error: "Category not found" }, 
        { status: 404 }
      );
    }

    const formattedCategory = {
      ...category,
      product_count: category.products?.[0]?.count || 0
    };

    return NextResponse.json({ category: formattedCategory });

  } catch (err: any) {
    console.error("Get category error:", err);
    return NextResponse.json(
      { error: "Failed to fetch category" }, 
      { status: 500 }
    );
  }
}

// UPDATE category
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, is_active } = await req.json(); // Add is_active back

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

    // Check if slug already exists (excluding current category)
    const { data: existingCategory } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" }, 
        { status: 400 }
      );
    }

    // Update category
    const updateData: any = {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    // Only include is_active if provided
    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    const { data: category, error } = await supabaseServer
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update category error:", error);
      return NextResponse.json(
        { error: "Failed to update category" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      category,
      message: "Category updated successfully" 
    });

  } catch (err: any) {
    console.error("Update category error:", err);
    return NextResponse.json(
      { error: "Failed to update category" }, 
      { status: 500 }
    );
  }
}

// DELETE category - Keep existing implementation
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has products
    const { data: products } = await supabaseServer
      .from("products")
      .select("id")
      .eq("category_id", id)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing products" }, 
        { status: 400 }
      );
    }

    // Delete category
    const { error } = await supabaseServer
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete category error:", error);
      return NextResponse.json(
        { error: "Failed to delete category" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Category deleted successfully" 
    });

  } catch (err: any) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      { error: "Failed to delete category" }, 
      { status: 500 }
    );
  }
}