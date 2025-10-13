import { supabaseServer } from "@/lib/supabase/server";

// ✅ Update cart item quantity (without stock modification)
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

  // ✅ Stock validation (check but don't modify)
  const variantRes = await supabaseServer
    .from("product_variants")
    .select("stock")
    .eq("id", cartItem.product_variant_id)
    .single();

  if (variantRes.error || !variantRes.data) {
    throw new Error("Product variant not found");
  }

  if (variantRes.data.stock < quantity) {
    throw new Error(`Only ${variantRes.data.stock} items available in stock`);
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

// ✅ Remove cart item (without stock modification)
export async function removeCartItem(cartItemId: string) {
  // Get cart item
  const { data: cartItem, error: cartItemError } = await supabaseServer
    .from("cart_items")
    .select("id, quantity, product_variant_id")
    .eq("id", cartItemId)
    .maybeSingle();

  if (cartItemError || !cartItem) {
    throw new Error("Cart item not found");
  }

  // Delete cart item (no stock modification needed)
  const { error: deleteError } = await supabaseServer
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (deleteError) {
    throw new Error("Failed to remove cart item");
  }

  return true;
}