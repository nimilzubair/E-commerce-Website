// app/api/admin/products/[id]/restock/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity, variantId } = await req.json();

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid quantity is required" }, 
        { status: 400 }
      );
    }

    if (variantId) {
      // Restock specific variant
      const { data: variant, error: variantError } = await supabaseServer
        .from("product_variants")
        .update({ 
          stock: quantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", variantId)
        .select()
        .single();

      if (variantError) {
        return NextResponse.json(
          { error: "Failed to restock variant" }, 
          { status: 500 }
        );
      }

      // Update product availability based on variants
      const { data: variants } = await supabaseServer
        .from("product_variants")
        .select("stock")
        .eq("product_id", id);

      const totalStock = variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

      await supabaseServer
        .from("products")
        .update({ 
          is_available: totalStock > 0,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      return NextResponse.json({
        success: true,
        variant,
        message: "Variant restocked successfully"
      });

    } else {
      // Restock main product quantity
      const { data: product, error } = await supabaseServer
        .from("products")
        .update({ 
          quantity,
          is_available: quantity > 0,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to restock product" }, 
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        product,
        message: "Product restocked successfully"
      });
    }

  } catch (err: any) {
    console.error("Restock error:", err);
    return NextResponse.json(
      { error: "Failed to restock product" }, 
      { status: 500 }
    );
  }
}