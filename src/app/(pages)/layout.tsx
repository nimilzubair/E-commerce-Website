// Keep your existing layout but ensure Navigation is included
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <Navigation />
        <main className="pt-24"> {/* Add padding for fixed nav */}
          {children}
        </main>
      </CartProvider>
    </ThemeProvider>
  );
}