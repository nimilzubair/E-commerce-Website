import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET single product for editing
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabaseServer
      .from("products")
      .select(`
        *,
        categories(*),
        product_variants(*),
        product_images(*)
      `)
      .eq("id", id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: "Product not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error("Get product error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" }, 
      { status: 500 }
    );
  }
}

// UPDATE product - FIX THIS FUNCTION
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    console.log("Update product request:", { id, body }); // Debug log

    const { 
      name, 
      description, 
      price, 
      discount, 
      quantity, 
      category_id, 
      is_available,
      is_active 
    } = body;

    // Build update data dynamically
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only include fields that are provided
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount || 0;
    if (quantity !== undefined) updateData.quantity = quantity || 0;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (is_available !== undefined) updateData.is_available = is_available;
    if (is_active !== undefined) updateData.is_active = is_active;

    // If only updating availability, don't require other fields
    if (Object.keys(updateData).length === 1) { // only updated_at
      return NextResponse.json(
        { error: "No valid fields to update" }, 
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseServer
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update product error:", error);
      return NextResponse.json(
        { error: `Failed to update product: ${error.message}` }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      product,
      message: "Product updated successfully" 
    });

  } catch (err: any) {
    console.error("Update product error:", err);
    return NextResponse.json(
      { error: "Failed to update product" }, 
      { status: 500 }
    );
  }
}

// DELETE product - Keep existing
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, get product images to delete from storage
    const { data: images } = await supabaseServer
      .from("product_images")
      .select("image_url")
      .eq("product_id", id);

    // Delete from database (cascade should handle variants and images)
    const { error } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete product error:", error);
      return NextResponse.json(
        { error: "Failed to delete product" }, 
        { status: 500 }
      );
    }

    // Delete images from storage
    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const url = new URL(img.image_url);
        return url.pathname.replace('/storage/v1/object/public/product-images/', '');
      });

      await supabaseServer.storage
        .from("product-images")
        .remove(filePaths);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });

  } catch (err: any) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" }, 
      { status: 500 }
    );
  }
}