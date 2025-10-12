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
          is_available,
          image_url
        )
      `)
      .eq("id", productVariantId)
      .maybeSingle();

    if (variantError || !variant) {
      console.error("Variant error:", variantError);
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
    }

    // 4️⃣ Get price from parent product
    const productPrice = variant.product?.price;
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
