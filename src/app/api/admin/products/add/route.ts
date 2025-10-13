import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Required fields
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount")) || 0;
    const quantity = Number(formData.get("quantity")) || 0;
    const categoryId = formData.get("category_id") as string; // ← Changed from categorySlug to categoryId
    const file = formData.get("file") as File;


    // Optional variants (product cannot be added without variants)
    const variantsStr = formData.get("variants") as string;
    const variants: { size?: string; color?: string; stock: number }[] = variantsStr
      ? JSON.parse(variantsStr)
      : [];
    if (!variants.length) {
      return NextResponse.json(
        { error: "At least one variant is required" },
        { status: 400 }
      );
    }

    // Validation - UPDATE THIS SECTION
    if (!name || !price || !categoryId) { // ← Changed from categorySlug to categoryId
      return NextResponse.json(
        { error: "Name, price, and category are required" }, 
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Product image is required" }, 
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" }, 
        { status: 400 }
      );
    }

    // Get category with validation - UPDATE THIS SECTION
    const { data: category, error: catErr } = await supabaseServer
      .from("categories")
      .select("id, name, slug, is_active")
      .eq("id", categoryId) // ← Changed from slug to id
      .single();

    if (catErr || !category) {
      console.error("Category lookup error:", catErr);
      return NextResponse.json(
        { error: "Category not found" }, 
        { status: 404 }
      );
    }

    // Check if category is active
    if (!category.is_active) {
      return NextResponse.json(
        { error: "Selected category is not active" }, 
        { status: 400 }
      );
    }

    // Check if product name already exists in same category
    const { data: existingProduct } = await supabaseServer
      .from("products")
      .select("id")
      .eq("name", name.trim())
      .eq("category_id", category.id)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name already exists in this category" }, 
        { status: 400 }
      );
    }

    // Calculate total stock from variants
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    // Insert product with quantity as totalStock
    const { data: product, error: prodErr } = await supabaseServer
      .from("products")
      .insert([{
        category_id: category.id,
        name: name.trim(),
        description: description.trim(),
        price,
        discount,
        quantity: totalStock,
        is_available: totalStock > 0,
      }])
      .select()
      .single();

    if (prodErr || !product) {
      console.error("Product insert error:", prodErr);
      throw prodErr;
    }

    // Insert variants if provided
    if (variants.length > 0) {
      const variantRows = variants.map((v) => ({
        product_id: product.id,
        size: v.size || null,
        color: v.color || null,
        stock: v.stock,
      }));

      const { error: variantErr } = await supabaseServer
        .from("product_variants")
        .insert(variantRows);

      if (variantErr) {
        await supabaseServer.from("products").delete().eq("id", product.id);
        throw variantErr;
      }
    }

    // Upload image - UPDATE THIS SECTION
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${category.slug}/${fileName}`; // ← Use category.slug from the fetched category

    const { error: uploadErr } = await supabaseServer.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      await supabaseServer.from("products").delete().eq("id", product.id);
      if (variants.length > 0) {
        await supabaseServer.from("product_variants").delete().eq("product_id", product.id);
      }
      throw uploadErr;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`;

    // Insert image record
    const { error: imgErr } = await supabaseServer
      .from("product_images")
      .insert([{
        product_id: product.id,
        image_url: imageUrl,
        is_primary: true,
      }]);

    if (imgErr) {
      await supabaseServer.from("products").delete().eq("id", product.id);
      if (variants.length > 0) {
        await supabaseServer.from("product_variants").delete().eq("product_id", product.id);
      }
      await supabaseServer.storage.from("product-images").remove([filePath]);
      throw imgErr;
    }

    return NextResponse.json({ 
      success: true, 
      product,
      imageUrl,
      message: "Product added successfully" 
    });

  } catch (err: any) {
    console.error("Add product error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to add product" }, 
      { status: 500 }
    );
  }
}