// =========================
// DELETE: Remove item from cart
// =========================
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get cartItemId from query string for RESTful compliance
    const url = new URL(req.url);
    const cartItemId = url.searchParams.get("cartItemId");
    if (!cartItemId) {
      return NextResponse.json({ error: "Missing cart item ID" }, { status: 400 });
    }

    // Get cart item and variant info
    const { data: cartItem, error: cartItemError } = await supabaseServer
      .from("cart_items")
      .select("id, quantity, product_variant_id, cart_id")
      .eq("id", cartItemId)
      .maybeSingle();

    if (cartItemError || !cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Increment product variant stock by quantity being removed
    const { data: variant, error: variantError } = await supabaseServer
      .from("product_variants")
      .select("stock")
      .eq("id", cartItem.product_variant_id)
      .maybeSingle();

    if (variantError || !variant) {
      return NextResponse.json({ error: "Product variant not found for stock update" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
// =========================
// GET: Get current user's cart and items
// =========================
export async function GET() {
  try {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_id");
  const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's cart
    const { data: cart } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .maybeSingle();

    if (!cart) {
      return NextResponse.json({ cartId: null, items: [] });
    }

    // Get cart items with product variant and product info
    const { data: items, error: itemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        quantity,
        unit_price,
        product_variant:product_variants!inner (
          id,
          size,
          color,
          product:products!inner (
            id,
            name,
            price,
            discount
          )
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ cartId: cart.id, items: items || [] });
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

// =========================
// POST: Add item to cart
// =========================
export async function POST(req: Request) {
  try {
    // 1️⃣ Get user ID from cookies
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2️⃣ Get product variant ID and quantity from request
    const { productVariantId, quantity } = await req.json();
    if (!productVariantId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3️⃣ Fetch the variant along with its parent product and product images
    const { data: variant, error: variantError } = await supabaseServer
      .from("product_variants")
      .select(`
        id,
        size,
        color,
        stock,
        product:products!inner (
          id,
          name,
          price,
          discount,
          is_available
        )
      `)
      .eq("id", productVariantId)
      .maybeSingle();

    if (variantError || !variant) {
      console.error("Variant error:", variantError);
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
    }

    // 4️⃣ Get price from parent product
    const productObj = Array.isArray(variant.product) ? variant.product[0] : variant.product;
    const productPrice = productObj?.price;
    if (productPrice == null) {
      console.error("Product price not found for variant", variant);
      return NextResponse.json({ error: "Product price not found" }, { status: 500 });
    }

    // 5️⃣ Check stock
    if ((variant.stock ?? 0) < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${variant.stock ?? 0} items available` },
        { status: 400 }
      );
    }

    // 6️⃣ Get or create user's cart
    let { data: cart } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createError } = await supabaseServer
        .from("carts")
        .insert([{ customer_id: userId }])
        .select("id")
        .single();

      if (createError || !newCart) {
        console.error("Create cart error:", createError);
        return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
      }
      cart = newCart;
    }

    // 7️⃣ Check if the variant already exists in the cart
    const { data: existingItem } = await supabaseServer
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_variant_id", productVariantId)
      .maybeSingle();

    let result;

    if (existingItem) {
      // 8️⃣ Update quantity if exists
      const newQuantity = existingItem.quantity + quantity;
      if ((variant.stock ?? 0) < newQuantity) {
        return NextResponse.json(
          { error: `Cannot add more. Only ${variant.stock - existingItem.quantity} additional items available` },
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabaseServer
        .from("cart_items")
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error("Update cart item error:", updateError);
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
      }

      // Decrement stock by quantity added
      await supabaseServer
        .from("product_variants")
        .update({ stock: (variant.stock ?? 0) - quantity })
        .eq("id", productVariantId);

      // Attach product info
      updatedItem.product_variant = variant;
      result = { message: "Item quantity updated in cart", cartItem: updatedItem, action: "updated" };
    } else {
      // 9️⃣ Insert new cart item
      const { data: cartItem, error: insertError } = await supabaseServer
        .from("cart_items")
        .insert([{
          cart_id: cart.id,
          product_variant_id: productVariantId,
          quantity,
          unit_price: productPrice,
        }])
        .select()
        .single();

      if (insertError) {
        console.error("Insert cart item error:", insertError);
        console.error("Insert data:", {
          cart_id: cart.id,
          product_variant_id: productVariantId,
          quantity,
          unit_price: productPrice
        });
        return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
      }

      // Decrement stock by quantity added
      await supabaseServer
        .from("product_variants")
        .update({ stock: (variant.stock ?? 0) - quantity })
        .eq("id", productVariantId);

      // Attach product info
      cartItem.product_variant = variant;
      result = { message: "Item added to cart", cartItem, action: "added" };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
