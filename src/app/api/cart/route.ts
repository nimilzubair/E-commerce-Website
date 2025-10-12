// file: app/api/cart/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
import { updateCartItemQuantity } from "@/lib/cart/cart";

// =========================
// GET: Get current user's cart and items
// =========================
export async function GET() {
  try {
    const userId = (await cookies()).get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Get user's cart
    const { data: cart } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("customer_id", userId)
      .maybeSingle();

    if (!cart) return NextResponse.json({ cartId: null, items: [] });

    // Get cart items with product variant and product info
    const { data: items, error: itemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        quantity,
        unit_price,
        product_variant:product_variants!inner(
          id,
          size,
          color,
          product:products!inner(
            id,
            name,
            price,
            discount
          )
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) throw itemsError;

    // calculate discounted price for safety
    const cartItems = (items || []).map((item: any) => {
      const product = Array.isArray(item.product_variant.product)
        ? item.product_variant.product[0]
        : item.product_variant.product;
      const discount = product?.discount ?? 0;
      return {
        ...item,
        unit_price: +(product.price * (1 - discount / 100)).toFixed(2),
      };
    });

    return NextResponse.json({ cartId: cart.id, items: cartItems });
  } catch (err: any) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

// =========================
// POST: Add item to cart
// =========================
export async function POST(req: Request) {
  try {
    const userId = (await cookies()).get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { productVariantId, quantity } = await req.json();
    if (!productVariantId || !quantity) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Fetch variant and product info
    const { data: variant, error: variantError } = await supabaseServer
      .from("product_variants")
      .select(`
        id,
        size,
        color,
        stock,
        product:products!inner(
          id,
          name,
          price,
          discount,
          is_available
        )
      `)
      .eq("id", productVariantId)
      .maybeSingle();

    if (variantError || !variant) return NextResponse.json({ error: "Product variant not found" }, { status: 404 });

    const productObj = Array.isArray(variant.product) ? variant.product[0] : variant.product;
    const productPrice = productObj?.price ?? 0;
    const discount = productObj?.discount ?? 0;

    // calculate discounted price
    const discountedPrice = +(productPrice * (1 - discount / 100)).toFixed(2);

    if ((variant.stock ?? 0) < quantity) {
      return NextResponse.json({ error: `Insufficient stock. Only ${variant.stock ?? 0} items available` }, { status: 400 });
    }

    // Get or create user's cart
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

      if (createError || !newCart) throw createError;
      cart = newCart;
    }

    // Check if variant exists in cart
    const { data: existingItem } = await supabaseServer
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_variant_id", productVariantId)
      .maybeSingle();

    let result;
    if (existingItem) {
      // Update quantity using helper
      const updatedItem = await updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity, userId);
      updatedItem.product_variant = variant;
      updatedItem.unit_price = discountedPrice; // always ensure discounted price
      result = { message: "Item quantity updated in cart", cartItem: updatedItem, action: "updated" };
    } else {
      // Insert new cart item with discounted price
      const { data: cartItem, error: insertError } = await supabaseServer
        .from("cart_items")
        .insert([{
          cart_id: cart.id,
          product_variant_id: productVariantId,
          quantity,
          unit_price: discountedPrice // store discounted price
        }])
        .select()
        .single();

      if (insertError || !cartItem) throw insertError;

      // Decrement stock
      await supabaseServer
        .from("product_variants")
        .update({ stock: (variant.stock ?? 0) - quantity })
        .eq("id", productVariantId);

      cartItem.product_variant = variant;
      result = { message: "Item added to cart", cartItem, action: "added" };
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
