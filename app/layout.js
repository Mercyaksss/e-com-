import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';

export const metadata = {
  title: 'Sole. — Premium Footwear',
  description: 'Premium footwear for every style. Shop the latest sneakers, trainers and lifestyle shoes with fast delivery across Nigeria.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <style>{`
          :root, [data-theme="light"] {
            --bg-primary:    #f5f0eb;
            --bg-secondary:  #ede8e3;
            --bg-card:       #ffffff;
            --bg-input:      #f0ebe6;
            --border-color:  #d8d0c8;
            --border-subtle: #e5ddd6;
            --text-primary:  #111111;
            --text-secondary:#444444;
            --text-muted:    #888888;
            --accent:        #e8530a;
            --accent-hover:  #ff6b2b;
            --overlay:       rgba(245,240,235,0.95);
          }
          [data-theme="dark"] {
            --bg-primary:    #0a0a0a;
            --bg-secondary:  #111111;
            --bg-card:       #1a1a1a;
            --bg-input:      #111111;
            --border-color:  #2e2e2e;
            --border-subtle: #1a1a1a;
            --text-primary:  #f5f0eb;
            --text-secondary:#cccccc;
            --text-muted:    #888888;
            --accent:        #e8530a;
            --accent-hover:  #ff6b2b;
            --overlay:       rgba(10,10,10,0.95);
          }
          body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
