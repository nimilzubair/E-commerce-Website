import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
//car/[id]/route.ts
// Update cart item quantity
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { quantity } = await req.json();
    const cartItemId = params.id;

    if (quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }

    // Verify the cart item belongs to user's cart and get previous quantity and product_variant_id
    const cartItemRes = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_variant_id,
        carts!inner(customer_id)
      `)
      .eq("id", cartItemId)
      .eq("carts.customer_id", userId)
      .single();
    const cartItem = cartItemRes.data;
    const verifyError = cartItemRes.error;

    if (verifyError || !cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Update product variant stock based on quantity change
    const oldQuantity = cartItem.quantity;
    const diff = quantity - oldQuantity;
    if (diff !== 0) {
      // Fetch current stock
      const variantRes = await supabaseServer
        .from("product_variants")
        .select("stock")
        .eq("id", cartItem.product_variant_id)
        .single();
      const variant = variantRes.data;
      const variantError = variantRes.error;

      if (!variant || variantError) {
        return NextResponse.json({ error: "Product variant not found for stock update" }, { status: 500 });
      }

      // If increasing quantity, decrement stock; if decreasing, increment stock
      const newStock = (variant.stock ?? 0) - diff;
      if (newStock < 0) {
        return NextResponse.json({ error: "Not enough stock available" }, { status: 400 });
      }
      await supabaseServer
        .from("product_variants")
        .update({ stock: newStock })
        .eq("id", cartItem.product_variant_id);
    }

    // Update cart item quantity
    const updateRes = await supabaseServer
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .select()
      .single();
    const updatedItem = updateRes.data;
    const updateError = updateRes.error;

    if (updateError) {
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
    }

    return NextResponse.json({ message: "Cart item updated", cartItem: updatedItem });
  } catch (err) {
    console.error("Update cart item error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}