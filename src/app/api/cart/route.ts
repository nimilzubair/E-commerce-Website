// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";

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

    // Get cart items with product variant and product info + images
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
          stock,
          product:products!inner(
            id,
            name,
            price,
            discount,
            product_images(
              image_url,
              is_primary
            )
          )
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) throw itemsError;

    // Format cart items with calculated prices and images
    const cartItems = (items || []).map((item: any) => {
      const product = Array.isArray(item.product_variant.product)
        ? item.product_variant.product[0]
        : item.product_variant.product;

      return {
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_variant: {
          id: item.product_variant.id,
          size: item.product_variant.size,
          color: item.product_variant.color,
          stock: item.product_variant.stock,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            product_images: product.product_images || []
          }
        }
      };
    });

    return NextResponse.json({ cartId: cart.id, items: cartItems });
  } catch (err: any) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

// =========================
// POST: Add item to cart (NO STOCK MODIFICATION)
// =========================
export async function POST(req: Request) {
  try {
    const userId = (await cookies()).get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { productVariantId, quantity } = await req.json();
    if (!productVariantId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check available stock (READ ONLY - no modification)
    const { data: variant, error: variantError } = await supabaseServer
      .from("product_variants")
      .select(`
        id,
        stock,
        size,
        color,
        product:products(
          id,
          name,
          price,
          discount,
          product_images(
            image_url,
            is_primary
          )
        )
      `)
      .eq("id", productVariantId)
      .single();

    if (variantError || !variant) {
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
    }

    // Check if requested quantity is available
    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} items available in stock` }, 
        { status: 400 }
      );
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

    // Check if same variant already in cart
    const { data: existingItem } = await supabaseServer
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_variant_id", productVariantId)
      .maybeSingle();

    // Calculate unit price
    const product = Array.isArray(variant.product) ? variant.product[0] : variant.product;
    const discount = product?.discount ?? 0;
    const unitPrice = +(product.price * (1 - discount / 100)).toFixed(2);

    let result;
    let finalQuantity = quantity;

    if (existingItem) {
      // Update quantity - calculate total requested quantity
      finalQuantity = existingItem.quantity + quantity;
      
      // Check if new total quantity exceeds stock
      if (finalQuantity > variant.stock) {
        return NextResponse.json(
          { error: `Cannot add more. Only ${variant.stock} items available in stock` }, 
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabaseServer
        .from("cart_items")
        .update({ 
          quantity: finalQuantity, 
          unit_price: unitPrice 
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) throw updateError;
      result = { 
        message: "Item quantity updated in cart", 
        cartItem: updatedItem, 
        action: "updated" 
      };
    } else {
      // Add new item to cart
      const { data: cartItem, error: insertError } = await supabaseServer
        .from("cart_items")
        .insert([{
          cart_id: cart.id,
          product_variant_id: productVariantId,
          quantity,
          unit_price: unitPrice
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      result = { 
        message: "Item added to cart", 
        cartItem, 
        action: "added" 
      };
    }

    // NO STOCK MODIFICATION - Stock remains unchanged
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}