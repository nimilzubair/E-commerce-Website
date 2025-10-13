// app/api/cart/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

// =========================
// PUT: Update cart item quantity (NO STOCK MODIFICATION)
// =========================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cartItemId = id;

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { quantity } = await req.json();
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }

    // Get current cart item with variant info (READ ONLY)
    const { data: currentItem, error: fetchError } = await supabaseServer
      .from("cart_items")
      .select(`
        *,
        product_variant:product_variants(*)
      `)
      .eq("id", cartItemId)
      .single();

    if (fetchError) throw fetchError;

    const variantId = currentItem.product_variant_id;
    const currentStock = currentItem.product_variant.stock;

    // Check if new quantity is available in stock
    if (quantity > currentStock) {
      return NextResponse.json(
        { error: `Only ${currentStock} items available in stock` }, 
        { status: 400 }
      );
    }

    // Update cart item only
    const { data: updatedItem, error: updateError } = await supabaseServer
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .select()
      .single();

    if (updateError) throw updateError;

    // ❌ NO STOCK MODIFICATION - Stock remains unchanged
    return NextResponse.json({ 
      message: "Cart item updated", 
      cartItem: updatedItem 
    });
  } catch (err: any) {
    console.error("Update cart item error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

// =========================
// DELETE: Remove cart item (NO STOCK MODIFICATION)
// =========================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cartItemId = id;

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Remove cart item only
    await supabaseServer
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    // ❌ NO STOCK MODIFICATION - Stock remains unchanged
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err: any) {
    console.error("Remove cart item error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}