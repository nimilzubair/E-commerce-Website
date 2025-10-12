import { supabaseServer } from "@/lib/supabase/server";

// ✅ Update cart item quantity and manage stock
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
  userId: string
) {
  // Get the cart item
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

  if (cartItemRes.error || !cartItemRes.data) {
    throw new Error("Cart item not found");
  }

  const cartItem = cartItemRes.data;

  // Update product variant stock if quantity changed
  const diff = quantity - cartItem.quantity;

  if (diff !== 0) {
    const variantRes = await supabaseServer
      .from("product_variants")
      .select("stock")
      .eq("id", cartItem.product_variant_id)
      .single();

    if (variantRes.error || !variantRes.data) {
      throw new Error("Product variant not found for stock update");
    }

    const newStock = (variantRes.data.stock ?? 0) - diff;
    if (newStock < 0) {
      throw new Error("Not enough stock available");
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

  if (updateRes.error || !updateRes.data) {
    throw new Error("Failed to update cart item");
  }

  return updateRes.data;
}

// ✅ Remove cart item and adjust stock
export async function removeCartItem(cartItemId: string) {
  // Get cart item and variant info
  const { data: cartItem, error: cartItemError } = await supabaseServer
    .from("cart_items")
    .select("id, quantity, product_variant_id")
    .eq("id", cartItemId)
    .maybeSingle();

  if (cartItemError || !cartItem) {
    throw new Error("Cart item not found");
  }

  // Update stock
  const { data: variant, error: variantError } = await supabaseServer
    .from("product_variants")
    .select("stock")
    .eq("id", cartItem.product_variant_id)
    .maybeSingle();

  if (variantError || !variant) {
    throw new Error("Product variant not found for stock update");
  }

  await supabaseServer
    .from("product_variants")
    .update({ stock: (variant.stock ?? 0) + cartItem.quantity })
    .eq("id", cartItem.product_variant_id);

  // Delete cart item
  const { error: deleteError } = await supabaseServer
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (deleteError) {
    throw new Error("Failed to remove cart item");
  }

  return true;
}
