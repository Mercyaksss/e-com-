'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import CartModal from '../CartModal/CartModal';

export default function Navbar() {
  const { getCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease forwards; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]'
            : 'bg-transparent border-b border-transparent'
          }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-[#f5f0eb] hover:text-[#e8530a] transition-colors no-underline"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em' }}
          >
            SOLE<span className="text-[#e8530a]">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Shop', href: '/productspage' },
              { label: 'Brands', href: '#' },
              { label: 'About', href: '#' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[#888] hover:text-[#f5f0eb] transition-colors text-xs tracking-[0.2em] uppercase no-underline"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden md:block text-xs tracking-[0.15em] uppercase">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e8530a] text-white text-[0.6rem] w-4 h-4 flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer text-[#888] hover:text-[#f5f0eb] transition-colors"
            >
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden animate-slide-down bg-[#0a0a0a] border-t border-[#1a1a1a] px-6 py-6 flex flex-col gap-5">
            {[
              { label: 'Shop', href: '/productspage' },
              { label: 'Brands', href: '#' },
              { label: 'About', href: '#' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-[#888] hover:text-[#f5f0eb] transition-colors text-xs tracking-[0.2em] uppercase no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}