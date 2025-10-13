// app/api/admin/products/bulk/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Bulk update products
export async function PUT(req: Request) {
  try {
    const { productIds, updateData } = await req.json();

    // Validation
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" }, 
        { status: 400 }
      );
    }

    if (!updateData || typeof updateData !== "object") {
      return NextResponse.json(
        { error: "Update data is required" }, 
        { status: 400 }
      );
    }

    // Validate update fields
    const allowedFields = [
      "is_available", 
      "category_id", 
      "discount", 
      "is_featured",
      "is_active"
    ];
    
    const updateFields = Object.keys(updateData);
    const invalidFields = updateFields.filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid update fields: ${invalidFields.join(", ")}` }, 
        { status: 400 }
      );
    }

    // Prepare update data
    const bulkUpdateData = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    // Perform bulk update
    const { data: updatedProducts, error } = await supabaseServer
      .from("products")
      .update(bulkUpdateData)
      .in("id", productIds)
      .select(`
        id,
        name,
        is_available,
        category_id,
        discount,
        is_featured,
        is_active,
        updated_at
      `);

    if (error) {
      console.error("Bulk update products error:", error);
      return NextResponse.json(
        { error: "Failed to update products" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedProducts?.length || 0} products updated successfully`,
      updated_count: updatedProducts?.length || 0,
      products: updatedProducts
    });

  } catch (err: any) {
    console.error("Bulk update products error:", err);
    return NextResponse.json(
      { error: "Failed to update products" }, 
      { status: 500 }
    );
  }
}

// Bulk delete products
export async function DELETE(req: Request) {
  try {
    const { productIds } = await req.json();

    // Validation
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" }, 
        { status: 400 }
      );
    }

    // First, get product images to delete from storage
    const { data: images } = await supabaseServer
      .from("product_images")
      .select("product_id, image_url")
      .in("product_id", productIds);

    // Delete from database (cascade should handle variants and images)
    const { data: deletedProducts, error } = await supabaseServer
      .from("products")
      .delete()
      .in("id", productIds)
      .select("id, name");

    if (error) {
      console.error("Bulk delete products error:", error);
      return NextResponse.json(
        { error: "Failed to delete products" }, 
        { status: 500 }
      );
    }

    // Delete images from storage
    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const url = new URL(img.image_url);
        return url.pathname.replace('/storage/v1/object/public/product-images/', '');
      }).filter(Boolean);

      if (filePaths.length > 0) {
        await supabaseServer.storage
          .from("product-images")
          .remove(filePaths);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${deletedProducts?.length || 0} products deleted successfully`,
      deleted_count: deletedProducts?.length || 0,
      products: deletedProducts
    });

  } catch (err: any) {
    console.error("Bulk delete products error:", err);
    return NextResponse.json(
      { error: "Failed to delete products" }, 
      { status: 500 }
    );
  }
}

// Bulk restock products
// app/api/admin/products/bulk/route.ts - Update the POST function
export async function POST(req: Request) {
  try {
    const { productIds, quantity } = await req.json();

    // Validation
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" }, 
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid quantity is required" }, 
        { status: 400 }
      );
    }

    // Update products table only (remove inventory table usage)
    const { data: updatedProducts, error } = await supabaseServer
      .from("products")
      .update({ 
        quantity,
        is_available: quantity > 0,
        updated_at: new Date().toISOString()
      })
      .in("id", productIds)
      .select(`
        id,
        name,
        quantity,
        is_available,
        updated_at
      `);

    if (error) {
      console.error("Bulk restock products error:", error);
      return NextResponse.json(
        { error: "Failed to restock products" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedProducts?.length || 0} products restocked successfully`,
      restocked_count: updatedProducts?.length || 0,
      products: updatedProducts
    });

  } catch (err: any) {
    console.error("Bulk restock products error:", err);
    return NextResponse.json(
      { error: "Failed to restock products" }, 
      { status: 500 }
    );
  }
}