// app/api/products/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    console.log("Fetching products, category:", category);

    // ✅ Build query with proper error handling
    let query = supabaseServer
      .from("products")
      .select(`
        *,
        categories!inner(
          id,
          name, 
          slug
        ),
        product_variants(
          id,
          size,
          color,
          stock,
          created_at
        ),
        product_images(
          id,
          image_url,
          is_primary,
          created_at
        )
      `)
      .eq("is_available", true) // Only fetch available products
      .order("created_at", { ascending: false });

    // ✅ Add category filter if provided and valid
    if (category && category.trim() !== "" && category !== "null" && category !== "undefined") {
      query = query.eq("categories.slug", category.trim());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" }, 
        { status: 500 }
      );
    }

    console.log(`Found ${data?.length || 0} products`);

    // ✅ Format data safely with proper error handling
    const formattedProducts = (data || []).map((product: any) => {
      try {
        // Find primary image or fallback to first image
        const productImages = product.product_images || [];
        const primaryImage = productImages.find((img: any) => img.is_primary);
        const firstImage = productImages[0];
        
        // Calculate final price with discount
        const originalPrice = product.price || 0;
        const discount = product.discount || 0;
        const finalPrice = discount > 0 
          ? originalPrice * (1 - discount / 100)
          : originalPrice;

        // Get available stock from variants or product quantity
        const variants = product.product_variants || [];
        const totalStock = variants.length > 0 
          ? variants.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0)
          : product.quantity || 0;

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: originalPrice,
          discount: discount,
          final_price: +finalPrice.toFixed(2),
          quantity: product.quantity,
          is_available: product.is_available,
          category: product.categories ? {
            id: product.categories.id,
            name: product.categories.name,
            slug: product.categories.slug
          } : null,
          product_variants: variants.map((variant: any) => ({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            product_id: variant.product_id
          })),
          product_images: productImages.map((img: any) => ({
            id: img.id,
            image_url: img.image_url,
            is_primary: img.is_primary
          })),
          image_url: primaryImage?.image_url || firstImage?.image_url || null,
          total_stock: totalStock,
          has_variants: variants.length > 0,
          created_at: product.created_at,
          updated_at: product.updated_at
        };
      } catch (formatError) {
        console.error("Error formatting product:", product.id, formatError);
        // Return basic product info even if formatting fails
        return {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          discount: product.discount || 0,
          final_price: product.price || 0,
          is_available: product.is_available || false,
          image_url: null,
          product_variants: [],
          product_images: [],
          total_stock: 0,
          has_variants: false
        };
      }
    });

    // Filter out products with formatting errors if needed
    const validProducts = formattedProducts.filter(product => 
      product.id && product.name && product.price > 0
    );

    return NextResponse.json(validProducts);
    
  } catch (err: any) {
    console.error("Server error in products API:", err);
    return NextResponse.json(
      { error: "Internal server error while fetching products" },
      { status: 500 }
    );
  }
}