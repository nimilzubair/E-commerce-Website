import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

// =========================
// GET: Fetch user's cart
// =========================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get or create cart for user
    let { data: cart, error: cartError } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .single();

    if (cartError) {
      if (cartError.code === "PGRST116" || cartError.message?.includes("No rows found")) {
        const { data: newCart, error: createError } = await supabaseServer
          .from("carts")
          .insert([{ customer_id: userId }])
          .select("id")
          .single();

        if (createError) {
          console.error("Create cart error:", createError);
          return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
        }
        cart = newCart;
      } else {
        console.error("Fetch cart error:", cartError);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
      }
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Fetch cart items with product + variant details
    const { data: cartItems, error: itemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        quantity,
        unit_price,
        product_variants (
          id,
          size,
          color,
          products:product_id (
            id,
            name,
            price
          )
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) {
      console.error("Cart items error:", itemsError);
      return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
    }

    return NextResponse.json({ cartId: cart.id, items: cartItems || [] });
  } catch (err) {
    console.error("Cart error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// =========================
// POST: Add item to cart
// =========================
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user_id");
    const userId = userCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productVariantId, quantity } = await req.json();

    if (!productVariantId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get product variant details
    const { data: variant, error: variantError } = await supabaseServer
      .from("product_variants")
      .select(`
        id,
        stock,
        products:product_id (
          id,
          price
        )
      `)
      .eq("id", productVariantId)
      .single();

    if (variantError || !variant) {
      console.error("Variant error:", variantError);
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
    }

    // Check stock
    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${variant.stock} items available` },
        { status: 400 }
      );
    }

    // Get or create user cart
    let { data: cart, error: cartError } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .single();

    if (cartError) {
      if (cartError.code === "PGRST116" || cartError.message?.includes("No rows found")) {
        const { data: newCart, error: createError } = await supabaseServer
          .from("carts")
          .insert([{ customer_id: userId }])
          .select("id")
          .single();

        if (createError) {
          console.error("Create cart error:", createError);
          return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
        }
        cart = newCart;
      } else {
        console.error("Fetch cart error:", cartError);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
      }
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if variant already exists in cart
    const { data: existingItem } = await supabaseServer
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_variant_id", productVariantId)
      .maybeSingle();

    let result;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (variant.stock < newQuantity) {
        return NextResponse.json(
          {
            error: `Cannot add more items. Only ${
              variant.stock - existingItem.quantity
            } additional items available`,
          },
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabaseServer
        .from("cart_items")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error("Update cart item error:", updateError);
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
      }

      result = { message: "Item quantity updated in cart", cartItem: updatedItem, action: "updated" };
    } else {
      const { data: cartItem, error: insertError } = await supabaseServer
        .from("cart_items")
        .insert([
          {
            cart_id: cart.id,
            product_variant_id: productVariantId,
            quantity,
            unit_price: variant.products.price,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert cart item error:", insertError);
        return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
      }

      result = { message: "Item added to cart", cartItem, action: "added" };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
