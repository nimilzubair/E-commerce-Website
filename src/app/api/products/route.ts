import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

<<<<<<< Updated upstream
  try {
    let query = supabaseServer
      .from('products')
      .select(`
        *,
        categories!inner(name, slug),
        product_variants(*),
        product_images(*)
      `)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('categories.slug', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
=======
  // Select products + related category slug + primary image
  let query = supabaseServer
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      discount,
      is_available,
      category_id,
      categories!inner(slug),
      product_images(image_url, is_primary)
    `);

  if (category) {
    query = query.eq("categories.slug", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Optionally pick only the primary image for each product
  const formatted = data.map((p: any) => ({
    ...p,
    image_url:
      p.product_images?.find((img: any) => img.is_primary)?.image_url ||
      p.product_images?.[0]?.image_url ||
      null,
  }));

  return NextResponse.json(formatted);
}
>>>>>>> Stashed changes
