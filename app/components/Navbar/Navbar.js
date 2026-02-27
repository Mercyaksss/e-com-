'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import CartModal from '../CartModal/CartModal';

export default function Navbar() {
  const { getCartCount } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push('/productspage?search=' + encodeURIComponent(searchQuery.trim()));
    setSearchQuery('');
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease forwards; }
        @keyframes search-expand {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-search-expand { animation: search-expand 0.2s ease forwards; }
      `}</style>

      <nav
        className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]' : 'bg-transparent border-b border-transparent')}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="text-[#f5f0eb] hover:text-[#e8530a] transition-colors no-underline shrink-0"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em' }}>
            SOLE<span className="text-[#e8530a]">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Shop', href: '/productspage' },
              { label: 'Brands', href: '#' },
              { label: 'About', href: '#' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                className="text-[#888] hover:text-[#f5f0eb] transition-colors text-xs tracking-[0.2em] uppercase no-underline">
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-5">

            {/* Search — desktop inline, mobile icon */}
            <div className="hidden md:flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className={"flex items-center border transition-all duration-300 overflow-hidden " + (searchOpen ? 'border-[#e8530a] bg-[#111]' : 'border-transparent')}>
                  {searchOpen && (
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search shoes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                      className="bg-transparent text-[#f5f0eb] text-xs placeholder:text-[#444] px-3 py-1.5 w-44 focus:outline-none animate-search-expand"
                    />
                  )}
                  <button
                    type={searchOpen ? 'submit' : 'button'}
                    onClick={() => !searchOpen && setSearchOpen(true)}
                    className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer px-2 py-1.5"
                    aria-label="Search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </button>
                </div>
              </form>
              {/* Click outside to close */}
              {searchOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setSearchOpen(false)} />}
            </div>

            {/* Cart button */}
            <button onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer group">
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

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer text-[#888] hover:text-[#f5f0eb] transition-colors">
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? 'rotate-45 translate-y-2' : '')} />
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? 'opacity-0' : '')} />
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? '-rotate-45 -translate-y-2' : '')} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden animate-slide-down bg-[#0a0a0a] border-t border-[#1a1a1a] px-6 py-6 flex flex-col gap-5">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center border border-[#2e2e2e] focus-within:border-[#e8530a] transition-colors bg-[#111]">
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[#f5f0eb] text-sm placeholder:text-[#444] px-4 py-3 focus:outline-none"
              />
              <button type="submit" className="px-4 text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>

            {[
              { label: 'Shop', href: '/productspage' },
              { label: 'Brands', href: '#' },
              { label: 'About', href: '#' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                className="text-[#888] hover:text-[#f5f0eb] transition-colors text-xs tracking-[0.2em] uppercase no-underline">
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