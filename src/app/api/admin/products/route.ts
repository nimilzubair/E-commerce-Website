import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const lowStock = searchParams.get("lowStock") === "true";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Build query
    let query = supabaseServer
      .from("products")
      .select(`
        *,
        categories!inner(
          id,
          name, 
          slug,
          is_active
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
      `, { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Admin products fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" }, 
        { status: 500 }
      );
    }

    // Format products with stock calculations
    const formattedProducts = (data || []).map((product: any) => {
      const variants = product.product_variants || [];
      const totalStock = variants.length > 0 
        ? variants.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0)
        : product.quantity || 0;

      const primaryImage = (product.product_images || []).find((img: any) => img.is_primary);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        quantity: product.quantity,
        is_available: product.is_available,
        category: product.categories,
        product_variants: variants,
        product_images: product.product_images,
        image_url: primaryImage?.image_url,
        total_stock: totalStock,
        has_variants: variants.length > 0,
        low_stock: totalStock < 10,
        out_of_stock: totalStock === 0,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
    });

    // Apply low stock filter if requested
    let filteredProducts = formattedProducts;
    if (lowStock) {
      filteredProducts = formattedProducts.filter(product => product.low_stock);
    }

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (err: any) {
    console.error("Admin products API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}