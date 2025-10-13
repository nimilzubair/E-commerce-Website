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

// UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { 
      name, 
      description, 
      price, 
      discount, 
      quantity, 
      category_id, 
      is_available 
    } = body;

    // Validation
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: "Name, price, and category are required" }, 
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseServer
      .from("products")
      .update({
        name,
        description,
        price,
        discount: discount || 0,
        quantity: quantity || 0,
        category_id,
        is_available: is_available !== undefined ? is_available : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update product error:", error);
      return NextResponse.json(
        { error: "Failed to update product" }, 
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

// DELETE product
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

    // Delete images from storage (optional - can be handled separately)
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