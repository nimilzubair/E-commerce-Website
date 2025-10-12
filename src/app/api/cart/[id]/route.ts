// file: app/api/cart/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateCartItemQuantity, removeCartItem } from "@/lib/cart/cart";

// =========================
// PUT: Update cart item quantity
// =========================
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const cartItemId = context.params.id; // ✅ no await here

    // Get user ID from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get quantity from request body
    const { quantity } = await req.json();
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }

    // Update cart item
    const updatedItem = await updateCartItemQuantity(cartItemId, quantity, userId);

    return NextResponse.json({ message: "Cart item updated", cartItem: updatedItem });
  } catch (err: any) {
    console.error("Update cart item error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

// =========================
// DELETE: Remove cart item
// =========================
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const cartItemId = context.params.id; // ✅ no await here

    // Get user ID from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Remove cart item
    await removeCartItem(cartItemId);

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err: any) {
    console.error("Remove cart item error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
