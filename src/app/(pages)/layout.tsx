import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navigation />
      {children}
    </CartProvider>
  );
}
