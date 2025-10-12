export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  is_available?: boolean;
  quantity?: number; // total stock for default variant if no variants
  image_url?: string; // fallback image

  category_id?: string; // foreign key to categories
  category?: Category;

  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
