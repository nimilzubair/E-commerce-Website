import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

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

    // Verify the cart item belongs to user's cart
    const { data: cartItem, error: verifyError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        carts!inner(customer_id)
      `)
      .eq("id", cartItemId)
      .eq("carts.customer_id", userId)
      .single();

    if (verifyError || !cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabaseServer
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
    }

    return NextResponse.json({ message: "Cart item updated", cartItem: updatedItem });
  } catch (err) {
    console.error("Update cart item error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(
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

    const cartItemId = params.id;

    // Verify the cart item belongs to user's cart
    const { data: cartItem, error: verifyError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        carts!inner(customer_id)
      `)
      .eq("id", cartItemId)
      .eq("carts.customer_id", userId)
      .single();

    if (verifyError || !cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Delete cart item
    const { error: deleteError } = await supabaseServer
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}