// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data: products, error } = await supabaseServer
      .from("products")
      .select(`
        *,
        categories(*),
        product_variants(*),
        product_images(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      products: products || [],
      count: products?.length || 0 
    });

  } catch (err: any) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Required fields
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount")) || 0;
    const categoryId = formData.get("category_id") as string;
    const file = formData.get("file") as File;

    // Variants with size AND color
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

    // Validation
    if (!name || !price || !categoryId) {
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

    // Get category with validation
    const { data: category, error: catErr } = await supabaseServer
      .from("categories")
      .select("id, name, slug, is_active")
      .eq("id", categoryId)
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

    // Insert variants with size and color
    const variantRows = variants.map((v) => ({
      product_id: product.id,
      size: v.size || null,
      color: v.color || null,
      stock: v.stock,
    }));

    const { data: insertedVariants, error: variantErr } = await supabaseServer
      .from("product_variants")
      .insert(variantRows)
      .select("id, size, color, stock");

    if (variantErr) {
      await supabaseServer.from("products").delete().eq("id", product.id);
      throw variantErr;
    }

    // Add inventory records for each variant
    if (insertedVariants && insertedVariants.length > 0) {
      const variantInventoryRecords = insertedVariants.map((variant) => ({
        variant_id: variant.id,
        quantity: variant.stock,
        updated_at: new Date().toISOString()
      }));

      const { error: variantInventoryError } = await supabaseServer
        .from("inventory")
        .insert(variantInventoryRecords);

      if (variantInventoryError) {
        console.error("Variant inventory records error:", variantInventoryError);
      }
    }

    // Upload image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${category.slug}/${fileName}`;

    const { error: uploadErr } = await supabaseServer.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      await supabaseServer.from("products").delete().eq("id", product.id);
      await supabaseServer.from("product_variants").delete().eq("product_id", product.id);
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
      await supabaseServer.from("product_variants").delete().eq("product_id", product.id);
      await supabaseServer.storage.from("product-images").remove([filePath]);
      throw imgErr;
    }

    return NextResponse.json({ 
      success: true, 
      product: {
        ...product,
        variants: insertedVariants || []
      },
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