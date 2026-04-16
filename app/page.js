'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import hero from '../public/heroimage.png';
import shoe1 from '../public/shoe1.png';
import shoe2 from '../public/shoe2.png';
import shoe3 from '../public/shoe3.png';
import shoe4 from '../public/shoe4.png';
import shoe5 from '../public/shoe5.png';
import shoe6 from '../public/shoe6.png';
import { useRouter } from 'next/navigation'; 
import { useTheme } from './context/ThemeContext';

const products = [
  { id: 1, brand: 'Nike', name: 'Air Max 270', price: 18000, badge: 'New', emoji: shoe1, span: false, details: "https://e-com-vert-xi.vercel.app/" },
  { id: 2, brand: 'Adidas', name: 'Ultra Boost 22', price: 19000, badge: null, emoji: shoe2, span: false, details: "https://e-com-vert-xi.vercel.app/" },
  { id: 3, brand: 'Jordan', name: 'Air Jordan 1 Retro', price: 22000, badge: 'Hot', emoji: shoe3, span: false, details: "https://e-com-vert-xi.vercel.app/"},
  { id: 4, brand: 'New Balance', name: '990v5 Made in USA', price: 18500, badge: null, emoji: shoe4, span: false, details: "https://e-com-vert-xi.vercel.app/"},
  { id: 5, brand: 'Puma', name: 'RS-X Reinvention', price: 11000, badge: 'Sale', emoji: shoe5, span: false, details: "https://e-com-vert-xi.vercel.app/" },
  { id: 6, brand: 'Puma', name: 'RS-X Reinvention', price: 11000, badge: 'Sale', emoji: shoe6, span: false, details: "https://e-com-vert-xi.vercel.app/" },

];

const testimonials = [
  { initials: 'JT', name: 'James T.', text: 'Ordered a pair of Air Max and they arrived the very next day. Packaging was immaculate and the shoes were exactly as described. Will definitely be back.' },
  { initials: 'SK', name: 'Sofia K.', text: 'Finally found a store that stocks hard-to-find New Balance colourways at a fair price. The filter system makes it super easy to hunt down exactly what you want.' },
  { initials: 'MR', name: 'Marcus R.', text: 'The Jordan 1s I got are absolutely fire. Legit check passed instantly. Customer service was super helpful when I needed to swap sizes.' },
];

const features = [
  { num: '01', title: 'Authenticity Guaranteed', desc: 'Every pair is 100% authentic, sourced directly from authorized retailers and brand partners. Zero fakes, ever.' },
  { num: '02', title: 'Lightning-Fast Delivery', desc: 'Order before 3PM and get same-day dispatch. Free express shipping on all orders over $100.' },
  { num: '03', title: '30-Day Easy Returns', desc: 'Not in love? Return any unworn pair within 30 days for a full refund, no questions asked.' },
  { num: '04', title: 'Expert Styling Advice', desc: 'Our team of sneaker obsessives is on hand to help you find the perfect pair for any occasion.' },
];

const brands = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Asics'];
// const filters = ['All', 'Running', 'Lifestyle', 'Basketball'];
const marqueeItems = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Asics', 'Converse', 'Vans', 'Reebok', 'Saucony'];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

export default function SoleLanding() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();                    // ← Added here
  const [activeFilter, setActiveFilter] = useState('All');
  const [added, setAdded] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');   // ← Added here
  const [heroRef, heroVisible] = useReveal();
  const [productsRef, productsVisible] = useReveal();
  const [featuresRef, featuresVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/productspage?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleAdd = (id) => {
    setAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 1200);
  };

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .text-outline { -webkit-text-stroke: 2px #f5f0eb; color: transparent; }
        .clip-btn { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
        @keyframes float { 0%,100% { transform: translateY(0) rotate(-15deg); } 50% { transform: translateY(-20px) rotate(-12deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-rev { animation: spin-slow-rev 20s linear infinite; }
        @keyframes scroll-line { 0%,100% { transform: scaleY(1); opacity:1; } 50% { transform: scaleY(0.4); opacity:0.2; } }
        .animate-scroll-line { animation: scroll-line 1.5s ease-in-out infinite; }
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes menu-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-menu-down { animation: menu-down 0.2s ease forwards; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ mixBlendMode: theme === 'dark' ? 'difference' : 'normal' }}>
        <div className="flex items-center justify-between px-6 md:px-14 py-5 md:py-7">
          <a href="#" className="font-bebas text-3xl tracking-widest" style={{ color: 'var(--text-primary)' }}>SOLE.</a>

          {/* Desktop links - hidden below 960px */}
          <ul className="hidden lg:flex gap-10 list-none">
            {['Shop', 'Brands', 'About', 'Contact'].map(item => (
              <li key={item}>
                <a href={"#" + item.toLowerCase()} className="text-xs tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: 'var(--text-primary)' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">

            {/* Desktop Search Bar - hidden below 960px */}
            <div className="hidden lg:flex items-center">
              <form 
                onSubmit={handleSearch}
                className="flex items-center border border-transparent focus-within:border-[#e8530a] transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: 'var(--bg-input)', padding: '4px 10px' }}
              >
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm placeholder:text-[#888] px-3 py-1.5 w-56 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  className="text-[#888] hover:text-[#e8530a] transition-colors p-1"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="text-[#888] hover:text-[#e8530a] transition-colors cursor-pointer"
              aria-label="Toggle theme"
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

            {/* Hamburger - visible below 960px */}
            <button
              className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={"block w-6 h-px transition-all duration-300 " + (menuOpen ? 'rotate-45 translate-y-2' : '')} style={{ backgroundColor: 'var(--text-primary)' }} />
              <span className={"block w-6 h-px transition-all duration-300 " + (menuOpen ? 'opacity-0' : '')} style={{ backgroundColor: 'var(--text-primary)' }} />
              <span className={"block w-6 h-px transition-all duration-300 " + (menuOpen ? '-rotate-45 -translate-y-2' : '')} style={{ backgroundColor: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu (including search) - shown below 960px */}
        {menuOpen && (
          <div className="lg:hidden animate-menu-down backdrop-blur border-t px-6 py-6 flex flex-col gap-6" 
              style={{ backgroundColor: 'var(--overlay)', borderColor: 'var(--border-subtle)' }}>
            
            {/* Mobile Search */}
            <form 
              onSubmit={handleSearch}
              className="flex items-center border border-transparent focus-within:border-[#e8530a] transition-all duration-300 rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-input)', padding: '12px 16px' }}
            >
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base placeholder:text-[#888] focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
                onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
              />
              <button
                type="submit"
                className="text-[#888] hover:text-[#e8530a] transition-colors ml-3"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </form>

            {/* Mobile Menu Links */}
            {['Shop', 'Brands', 'About', 'Contact'].map(item => (
              <a
                key={item}
                href={"#" + item.toLowerCase()}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity no-underline py-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>
      {/* HERO */}
      <section className="min-h-screen grid md:grid-cols-2 relative overflow-hidden">
        {/* Left */}
        <div
          ref={heroRef}
          className={"reveal " + (heroVisible ? 'visible' : '') + " flex flex-col justify-center px-6 md:px-14 pt-32 md:pt-40 pb-16 md:pb-20 relative z-10"}
        >
          <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-6 md:mb-8">
            <span className="w-8 h-px bg-[#e8530a]" />
            New Collection 2025
          </span>
          <h1 className="font-bebas leading-[0.9] tracking-wide mb-6 md:mb-8" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}>
            Step Into<br />
            <span className="text-[#e8530a]">Style</span>
          </h1>
          <p className="max-w-xs leading-relaxed mb-8 md:mb-12 font-light text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            Premium footwear from the world's leading brands. Engineered for performance, designed to turn heads.
          </p>

          {/* Mobile hero shoe */}
          <div className="flex md:hidden justify-center my-6">
            <span className="text-[8rem] animate-float drop-shadow-[0_20px_40px_rgba(232,83,10,0.3)] select-none"><Image src={hero} width={400} height={400} alt='hero-image' priority /></span>
          </div>

          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <Link
              href="/productspage"
              className="clip-btn bg-[#e8530a] text-[#f5f0eb] px-8 md:px-11 py-4 md:py-[18px] text-sm font-medium tracking-[0.15em] uppercase hover:bg-[#ff6b2b] transition-all hover:-translate-y-0.5 no-underline"
            >
              Shop Now
            </Link>
            <a href="#about" className="text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 no-underline" style={{ color: 'var(--text-primary)' }}>
              Our Story <span className="text-base">→</span>
            </a>
          </div>
        </div>

        {/* Right — desktop only */}
        <div className="hidden md:flex relative overflow-hidden items-center justify-center">
          <span className="absolute font-bebas text-[28vw] tracking-tight select-none pointer-events-none" style={{ fontSize: '28vw', color: 'var(--text-primary)', opacity: theme === 'dark' ? '0.03' : '0.06' }}>SOLE</span>
          <div className="animate-float text-[22rem] drop-shadow-[0_40px_80px_rgba(232,83,10,0.3)] select-none"><Image src={hero} width={450} height={450} alt='hero-image' priority /></div>
          <span className="absolute bottom-14 right-14 font-bebas text-[8rem] leading-none select-none" style={{ color: 'var(--text-primary)', opacity: theme === 'dark' ? '0.04' : '0.08' }}>01</span>
        </div>

        {/* Scroll indicator — hidden on mobile */}
        <div className="hidden md:flex absolute bottom-10 left-14 items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#888]">
          <span className="w-px h-12 bg-gradient-to-b from-[#e8530a] to-transparent animate-scroll-line origin-top" />
          Scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#e8530a] py-3 md:py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-bebas text-lg md:text-2xl tracking-widest text-[#0a0a0a] px-6 md:px-10 after:content-['✦'] after:ml-6 md:after:ml-10 after:text-xs md:after:text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div id="brands" className="py-12 md:py-16 px-6 md:px-14" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p className="text-center text-xs tracking-[0.35em] uppercase mb-8 md:mb-12" style={{ color: 'var(--text-muted)' }}>Trusted by sneakerheads worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {brands.map(b => (
            <span key={b} className="font-bebas text-xl md:text-2xl tracking-widest hover:text-[#e8530a] transition-colors cursor-default" style={{ color: 'var(--text-muted)' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section
        id="shop"
        ref={productsRef}
        className={"reveal " + (productsVisible ? 'visible' : '') + " px-6 md:px-14 py-16 md:py-28"}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#e8530a] mb-3">Our Collection</p>
            <h2 className="font-bebas leading-none" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Featured<br /><span style={{ opacity: 0.3 }}>Drops</span>
            </h2>
          </div>
          {/* Filter pills */}
          <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 md:flex-wrap scrollbar-hide">
            <Link 
              href="/productspage"
              className={"flex-shrink-0 px-5 py-2.5 border text-xs tracking-[0.1em] uppercase transition-all cursor-pointer "}
              style={{borderColor: 'var(--accent-hover)', color: 'var(--accent-hover)'}}
            >
              View all products <span className="text-base"> → </span>
            </Link>
            {/* {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={"flex-shrink-0 px-5 py-2.5 border text-xs tracking-[0.1em] uppercase transition-all cursor-pointer " + (activeFilter === f ? 'border-[#e8530a] text-[#e8530a]' : 'hover:border-[#e8530a] hover:text-[#e8530a]')}
                style={ activeFilter !== f ? { borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
              >
                {f}
              </button>
            ))} */}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
          {products.map((p) => (
            <Link
              key={p.id}
              className={"relative overflow-hidden group " + (p.span ? 'sm:col-span-2' : '')}
              style={{ backgroundColor: 'var(--bg-card)' }}
              href={p.details}
            >
              {p.badge && (
                <span className="absolute top-4 left-4 z-10 bg-[#e8530a] text-[#f5f0eb] text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1">
                  {p.badge}
                </span>
              )}
              {/* <button
                onClick={() => handleAdd(p.id)}
                className={"absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-xl text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 cursor-pointer " + (added[p.id] ? 'bg-green-500' : 'bg-[#e8530a]')}
              >
                {added[p.id] ? '✓' : '+'}
              </button> */}
              <div className={"flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 relative " + (p.span ? 'text-[8rem] sm:text-[12rem] aspect-square sm:aspect-[2/1]' : 'text-[7rem] aspect-square')}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image src={p.emoji} fill alt={p.name} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="px-5 md:px-7 py-5 flex justify-between items-end" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#e8530a] mb-1">{p.brand}</p>
                  <p className="text-base font-medium">{p.name}</p>
                </div>
                <span className="font-bebas text-3xl tracking-wide">₦{p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="about"
        ref={featuresRef}
        className={"reveal " + (featuresVisible ? 'visible' : '') + " px-6 md:px-14 py-16 md:py-28 grid md:grid-cols-2 gap-10 md:gap-20 items-center"}
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {/* Visual — desktop only */}
        <div className="hidden md:flex items-center justify-center h-[500px]">
          <div className="relative w-[380px] h-[380px] animate-spin-slow">
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'var(--border-color)' }} />
            <div className="absolute inset-5 rounded-full border border-dashed border-[#e8530a]/30" />
            {[
              'top-[-5px] left-[calc(50%-5px)]',
              'bottom-[-5px] left-[calc(50%-5px)]',
              'left-[-5px] top-[calc(50%-5px)]',
              'right-[-5px] top-[calc(50%-5px)]',
            ].map((pos, i) => (
              <span key={i} className={"absolute w-2.5 h-2.5 rounded-full bg-[#e8530a] " + pos} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9rem] animate-spin-slow-rev drop-shadow-[0_20px_40px_rgba(232,83,10,0.4)] select-none"><Image src={hero} width={280} height={280} alt='hero-image'/></span>
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-[#e8530a] mb-4">Why Choose Sole</p>
          <h2 className="font-bebas leading-none mb-10 md:mb-14" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Built<br />Different
          </h2>
          <div className="flex flex-col gap-8 md:gap-10">
            {features.map(f => (
              <div key={f.num} className="flex gap-6 items-start group">
                <span className="font-bebas text-4xl md:text-5xl leading-none min-w-[48px] md:min-w-[56px] group-hover:text-[#e8530a] transition-colors" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  {f.num}
                </span>
                <div>
                  <p className="font-medium mb-2 text-sm md:text-base">{f.title}</p>
                  <p className="text-sm text-[#888] leading-relaxed font-light">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        ref={testimonialsRef}
        className={"reveal " + (testimonialsVisible ? 'visible' : '') + " px-6 md:px-14 py-16 md:py-28"}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <p className="text-xs tracking-[0.35em] uppercase text-[#e8530a] mb-4">Customer Love</p>
        <h2 className="font-bebas leading-none mb-10 md:mb-14" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
          What They're<br /><span className="opacity-30">Saying</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {testimonials.map((t) => (
            <div key={t.name} className="p-7 md:p-10 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
              <span className="absolute -top-5 right-5 font-bebas text-[12rem] text-[#e8530a]/[0.06] leading-none select-none pointer-events-none">"</span>
              <div className="text-[#e8530a] tracking-[3px] text-sm mb-5">★★★★★</div>
              <p className="text-sm leading-loose font-light italic mb-7" style={{ color: 'var(--text-secondary)' }}>{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8530a] flex items-center justify-center text-sm font-medium shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#888]">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        ref={ctaRef}
        className={"reveal " + (ctaVisible ? 'visible' : '') + " bg-[#e8530a] px-6 md:px-14 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center relative overflow-hidden"}
      >
        <span className="hidden md:block absolute right-[-40px] top-1/2 -translate-y-1/2 font-bebas text-[22rem] text-black/[0.08] leading-none select-none pointer-events-none">SOLE</span>
        <h2 className="font-bebas leading-none text-[#0a0a0a] relative z-10" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
          Ready to<br />Find Your<br />Sole Mate?
        </h2>
        <div className="relative z-10">
          <p className="text-black/60 leading-relaxed font-light mb-7 md:mb-9 text-sm md:text-base">
            Browse over 500 styles from the world's biggest brands. New drops every Friday. Free shipping on orders over $100.
          </p>
          <a
            href="/productspage"
            className="clip-btn bg-[#0a0a0a] text-[#f5f0eb] px-8 md:px-11 py-4 md:py-[18px] text-sm font-medium tracking-[0.15em] uppercase hover:bg-[#222] transition-all hover:-translate-y-0.5 inline-block no-underline"
          >
            Browse Collection
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-14 pt-14 md:pt-20 pb-10" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mb-10 md:mb-14">
          {/* Brand col — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-bebas text-5xl tracking-wider mb-4">SOLE.</div>
            <p className="text-sm leading-relaxed font-light max-w-[260px] mb-8" style={{ color: 'var(--text-muted)' }}>
              Premium footwear for those who know that great shoes aren't an expense — they're an investment.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'ig', 'yt'].map(s => (
                <a key={s} href="#" className="w-10 h-10 flex items-center justify-center text-sm hover:border-[#e8530a] hover:text-[#e8530a] transition-all no-underline" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Link cols — 2 col grid on mobile */}
          {[
            { title: 'Shop', links: ['New Arrivals', "Men's", "Women's", 'Sale'] },
            { title: 'Brands', links: ['Nike', 'Adidas', 'Jordan', 'New Balance'] },
            { title: 'Help', links: ['Size Guide', 'Returns', 'Track Order', 'Contact Us'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs tracking-[0.3em] uppercase mb-4 md:mb-6" style={{ color: 'var(--text-primary)' }}>{col.title}</h4>
              <ul className="flex flex-col gap-3 list-none">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-[#e8530a] transition-colors no-underline" style={{ color: 'var(--text-muted)' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2025 SOLE. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Designed & developed by <a className="text-[#e8530a] font-medium" href='https://mercy-yakubu-frontend-developer.vercel.app/' target="_blank">Mercy Yakubu</a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
              <a key={l} href="#" className="text-xs hover:text-[#e8530a] transition-colors no-underline" style={{ color: 'var(--text-muted)' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}