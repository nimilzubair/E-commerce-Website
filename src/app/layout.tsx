import './globals.css'
import { ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'E-commerce Website',
  description: 'Shop the best collections online',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
