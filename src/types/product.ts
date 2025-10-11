<<<<<<< Updated upstream
=======
//types/product.ts
>>>>>>> Stashed changes
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
<<<<<<< Updated upstream
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
=======
  discount?: number;
  quantity: number;      // ✅ add this
  image_url: string;     // ✅ add this
  category?: string;
>>>>>>> Stashed changes
}