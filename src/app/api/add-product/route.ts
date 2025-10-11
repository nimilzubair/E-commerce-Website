import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount")) || 0;
    const quantity = Number(formData.get("quantity"));
    const categorySlug = formData.get("category") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    // get category_id using slug (like "summer")
    const { data: category, error: catErr } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (catErr || !category) throw new Error("Category not found");

    const { data: product, error: prodErr } = await supabaseServer
      .from("products")
      .insert([
        {
          category_id: category.id,
          name,
          description,
          price,
          discount,
          quantity,
          is_available: quantity > 0,
        },
      ])
      .select()
      .single();

    if (prodErr) throw prodErr;

    // Upload image to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${categorySlug}/${file.name}`;

    const { error: uploadErr } = await supabaseServer.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadErr) throw uploadErr;

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`;

    // Insert into product_images table
    const { error: imgErr } = await supabaseServer
      .from("product_images")
      .insert([
        {
          product_id: product.id,
          image_url: imageUrl,
          is_primary: true,
        },
      ]);

    if (imgErr) throw imgErr;

    return NextResponse.json({ success: true, product, imageUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
