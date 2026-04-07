'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartModal from '../CartModal/CartModal';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => setMounted(true), []);
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
        className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (scrolled ? 'backdrop-blur-md border-b' : 'border-b border-transparent')}
        style={{ 
          fontFamily: "'DM Sans', sans-serif",
          backgroundColor: scrolled ? 'var(--overlay)' : 'transparent',
          borderColor: scrolled ? 'var(--border-subtle)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="hover:text-[#e8530a] transition-colors no-underline shrink-0"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
            SOLE<span className="text-[#e8530a]">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/productspage' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                className="hover:text-[#e8530a] transition-colors text-xs tracking-[0.2em] uppercase no-underline"
                style={{ color: 'var(--text-muted)' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-5">

            {/* Search — desktop inline, mobile icon */}
            <div className="hidden md:flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className={"flex items-center border transition-all duration-300 overflow-hidden " + (searchOpen ? 'border-[#e8530a]' : 'border-transparent')}
                  style={{ backgroundColor: searchOpen ? 'var(--bg-input)' : 'transparent' }}>
                  {searchOpen && (
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search shoes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                      className="bg-transparent text-xs placeholder:text-[#888] px-3 py-1.5 w-44 focus:outline-none animate-search-expand"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  )}
                  <button
                    type={searchOpen ? 'submit' : 'button'}
                    onClick={() => !searchOpen && setSearchOpen(true)}
                    className="text-[#888] hover:text-[#e8530a] transition-colors cursor-pointer px-2 py-1.5"
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

            {/* Theme toggle */}
            {mounted && (
              <button onClick={toggleTheme}
                className="text-[#888] hover:text-[#e8530a] transition-colors cursor-pointer"
                aria-label="Toggle theme"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  </svg>
                )}
              </button>
            )}

            {/* Cart button */}
            <button onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-[#888] hover:text-[#e8530a] transition-colors cursor-pointer group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden md:block text-xs tracking-[0.15em] uppercase">Cart</span>
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e8530a] text-white text-[0.6rem] w-4 h-4 flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer text-[#888] hover:text-[#e8530a] transition-colors">
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? 'rotate-45 translate-y-2' : '')} />
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? 'opacity-0' : '')} />
              <span className={"block w-5 h-px bg-current transition-all duration-300 " + (mobileOpen ? '-rotate-45 -translate-y-2' : '')} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden animate-slide-down border-t px-6 py-6 flex flex-col gap-5"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center border focus-within:border-[#e8530a] transition-colors"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm placeholder:text-[#888] px-4 py-3 focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
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
                className="hover:text-[#e8530a] transition-colors text-xs tracking-[0.2em] uppercase no-underline"
                style={{ color: 'var(--text-muted)' }}>
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