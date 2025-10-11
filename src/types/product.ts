export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  is_available: boolean;
  categories: {
    name: string;
    slug: string;
  };
  product_variants: Array<{
    id: string;
    size: string;
    color: string;
    stock: number;
  }>;
  product_images: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }>;
}