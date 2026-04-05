'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar/Navbar';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (!params.id) return;
    fetch('/api/products/' + params.id)
      .then(res => res.json())
      .then(data => {
        setShoe(data);
        // Set defaults from first variant — skip out of stock sizes
        if (data.variants?.length > 0) {
          setSelectedColor(data.variants[0].color);
          const firstAvailable = data.variants[0].sizes?.find(s => s.stock > 0);
          if (firstAvailable) setSelectedSize(firstAvailable.size);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  // Get sizes for currently selected color
  const currentVariant = shoe?.variants?.find(v => v.color === selectedColor);
  const availableSizes = currentVariant?.sizes || [];

  // Total stock across ALL variants and sizes
  const totalStock = shoe?.variants
    ? shoe.variants.reduce((sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.stock, 0), 0)
    : 0;

  const isOutOfStock = totalStock === 0;

  // Stock label for detail page
  const getStockLabel = () => {
    if (totalStock === 0) return null;
    if (totalStock === 1) return { label: 'Only 1 left 🔥', color: 'text-red-400' };
    if (totalStock === 2) return { label: 'Only 2 left', color: 'text-red-400' };
    if (totalStock <= 5) return { label: 'Low Stock', color: 'text-yellow-500' };
    return null;
  };

  const stockLabel = shoe ? getStockLabel() : null;

  // Selected size stock
  const selectedSizeStock = availableSizes.find(s => s.size === selectedSize)?.stock ?? 0;

  // When color changes, reset size to first available (in stock) in that color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSizeError(false);
    const variant = shoe.variants.find(v => v.color === color);
    const firstAvailable = variant?.sizes?.find(s => s.stock > 0);
    setSelectedSize(firstAvailable ? firstAvailable.size : '');
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    if (selectedSizeStock === 0) return;
    addToCart({
      ...shoe,
      id: shoe._id,
      image: shoe.images?.[0] || '',
      selectedSize,
      selectedColor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = shoe?.images || [];
  const hasMultiple = images.length > 1;

  const prevImage = () => setActiveIndex(i => (i - 1 + images.length) % images.length);
  const nextImage = () => setActiveIndex(i => (i + 1) % images.length);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextImage() : prevImage();
    touchStartX.current = null;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] pt-36">
          <div className="max-w-7xl mx-auto px-6 md:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="bg-[#111] h-[560px] animate-pulse" />
              <div className="bg-[#111] h-[560px] animate-pulse" />
            </div>
          </div>
        </main>
      </>
    );
  }

  // Not found state
  if (!shoe || shoe.error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center px-6">
          <div className="text-center">
            <span className="text-8xl opacity-20 select-none block mb-6">👟</span>
            <h2 className="text-[#f5f0eb] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}>
              Product Not Found
            </h2>
            <p className="text-[#888] text-sm font-light mb-8">This product does not exist or has been removed.</p>
            <button
              onClick={() => router.push('/productspage')}
              className="text-xs tracking-[0.2em] uppercase text-[#e8530a] border border-[#e8530a] px-8 py-3 hover:bg-[#e8530a] hover:text-white transition-all cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up   { animation: fade-up 0.6s ease forwards; }
        .animate-fade-up-2 { animation: fade-up 0.6s ease 0.15s forwards; opacity: 0; }
        @keyframes img-fade { from { opacity: 0; } to { opacity: 1; } }
        .img-fade { animation: img-fade 0.3s ease forwards; }
        .carousel-arrow { opacity: 0; transition: opacity 0.2s, background 0.2s; }
        .carousel-wrap:hover .carousel-arrow { opacity: 1; }
        @media (hover: none) { .carousel-arrow { opacity: 1 !important; } }
      `}</style>

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-14 pt-24 md:pt-36 pb-16 md:pb-24">

          {/* Back button */}
          <button
            onClick={() => router.push('/productspage')}
            className="flex items-center gap-2 text-[#888] hover:text-[#f5f0eb] transition-colors mb-8 md:mb-12 text-sm tracking-[0.1em] uppercase group cursor-pointer"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

            {/* IMAGE CAROUSEL */}
            <div
              className="carousel-wrap animate-fade-up bg-[#111] border border-[#1a1a1a] relative overflow-hidden group"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              {images.length > 0 && (
                <img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={shoe.name}
                  className="img-fade w-full h-[300px] sm:h-[400px] md:h-[560px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <span
                className="absolute bottom-6 left-6 text-white/[0.06] select-none pointer-events-none leading-none z-20"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                {shoe.brand}
              </span>

              {hasMultiple && (
                <>
                  <button onClick={prevImage} aria-label="Previous image"
                    className="carousel-arrow absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-[#e8530a] text-white text-2xl flex items-center justify-center cursor-pointer">
                    &lsaquo;
                  </button>
                  <button onClick={nextImage} aria-label="Next image"
                    className="carousel-arrow absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/60 hover:bg-[#e8530a] text-white text-2xl flex items-center justify-center cursor-pointer">
                    &rsaquo;
                  </button>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveIndex(i)} aria-label={"Image " + (i + 1)}
                        className={"rounded-full transition-all cursor-pointer " + (i === activeIndex ? 'w-5 h-1.5 bg-[#e8530a]' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60')} />
                    ))}
                  </div>
                  <span className="absolute top-4 right-4 z-30 bg-black/60 text-white text-xs tracking-[0.15em] px-2.5 py-1 select-none">
                    {activeIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="animate-fade-up-2 bg-[#111] border border-[#1a1a1a] px-6 md:px-10 py-8 md:py-12 flex flex-col">

              <div className="mb-6 md:mb-8">
                <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4">
                  <span className="w-6 h-px bg-[#e8530a]" />
                  {shoe.brand}
                </span>
                <h1 className="text-[#f5f0eb] leading-none mb-4 md:mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
                  {shoe.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                    ₦{shoe.price}
                  </span>
                  {stockLabel && (
                    <span className={`text-xs tracking-[0.15em] uppercase font-medium ${stockLabel.color}`}>
                      {stockLabel.label}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[#888] text-sm md:text-base leading-relaxed font-light mb-8 md:mb-10 border-t border-[#1a1a1a] pt-6 md:pt-8">
                {shoe.description}
              </p>

              {/* Full out of stock state */}
              {isOutOfStock ? (
                <div className="flex flex-col flex-1 justify-between">
                  <div className="border border-[#2e2e2e] px-6 py-8 text-center mb-6">
                    <p className="text-[#888] text-xs tracking-[0.25em] uppercase mb-2">Availability</p>
                    <p className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.1em' }}>Out of Stock</p>
                    <p className="text-[#888] text-xs font-light mt-2">This product is currently unavailable.</p>
                  </div>
                  <button
                    disabled
                    className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium bg-[#2e2e2e] text-[#555] cursor-not-allowed mt-auto"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                  >
                    Out of Stock
                  </button>
                </div>
              ) : (
                <>
                  {/* Colour */}
                  <div className="mb-6 md:mb-8">
                    <label className="block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-3 md:mb-4">
                      Colour &mdash; <span className="text-[#f5f0eb] capitalize">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {shoe.variants.map(variant => (
                        <button
                          key={variant.color}
                          onClick={() => handleColorChange(variant.color)}
                          className={"px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all capitalize cursor-pointer " + (selectedColor === variant.color ? 'bg-[#e8530a] text-white border border-[#e8530a]' : 'border border-[#2e2e2e] text-[#888] hover:border-[#e8530a] hover:text-[#e8530a]')}
                        >
                          {variant.color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-8 md:mb-10">
                    <label className={"block text-[0.65rem] tracking-[0.25em] uppercase mb-3 md:mb-4 transition-colors " + (sizeError ? 'text-red-400' : 'text-[#888]')}>
                      {sizeError ? 'Please select a size' : 'Size (US)'}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {availableSizes.map(({ size, stock }) => (
                        <button
                          key={size}
                          disabled={stock === 0}
                          onClick={() => { setSelectedSize(size); setSizeError(false); }}
                          className={"py-2.5 md:py-3 text-sm font-medium transition-all " + (stock === 0 ? 'border border-[#1a1a1a] text-[#333] cursor-not-allowed line-through' : 'cursor-pointer ' + (selectedSize === size ? 'bg-[#e8530a] text-white border border-[#e8530a]' : 'border text-[#888] hover:border-[#e8530a] hover:text-[#e8530a] ' + (sizeError ? 'border-red-400/50' : 'border-[#2e2e2e]')))}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedSizeStock === 0}
                    className={"w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all mt-auto " + (selectedSizeStock === 0 ? 'bg-[#2e2e2e] text-[#555] cursor-not-allowed' : added ? 'bg-green-500 text-white cursor-pointer' : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b] cursor-pointer')}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                  >
                    {added ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </>
              )}

              {/* Product details grid — hidden when out of stock */}
              {!isOutOfStock && (
              <div className="mt-6 md:mt-8 border-t border-[#1a1a1a] pt-6 md:pt-8">
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-4 md:mb-5">Product Details</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Category', value: shoe.category || '—' },
                    { label: 'Colors',   value: shoe.variants.length },
                    { label: 'Sizes',    value: availableSizes.length + ' available' },
                    { label: 'In Stock', value: availableSizes.filter(s => s.stock > 0).length + ' sizes' },
                  ].map(detail => (
                    <div key={detail.label} className="bg-[#0a0a0a] px-3 md:px-4 py-3">
                      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">{detail.label}</p>
                      <p className="text-[#f5f0eb] text-sm capitalize font-medium">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}