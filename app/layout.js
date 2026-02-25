import { CartProvider } from './context/CartContext';
import './globals.css';

export const metadata = {
  title: 'SOLE - Premium Shoe Store',
  description: 'Discover premium footwear from the world\'s leading brands',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}