'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar/Navbar';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    fetch(`https://shoe-store-api-dei7.onrender.com/api/shoes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setShoe(data);
        setSelectedColor(data.colors[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shoe:', error);
        setLoading(false);
      });
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...shoe, selectedSize, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // LOADING
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-6xl animate-pulse select-none">👟</span>
            <p className="text-[#888] text-sm tracking-[0.2em] uppercase font-light">Loading product...</p>
          </div>
        </main>
      </>
    );
  }

  // NOT FOUND
  if (!shoe) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
          <div className="text-center">
            <span className="text-8xl opacity-20 select-none block mb-6">👟</span>
            <h2 className="text-[#f5f0eb] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}>
              Product Not Found
            </h2>
            <p className="text-[#888] text-sm font-light mb-8">This shoe doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/productspage')}
              className="text-xs tracking-[0.2em] uppercase text-[#e8530a] border border-[#e8530a] px-8 py-3 hover:bg-[#e8530a] hover:text-white transition-all"
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
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease forwards; }
        .animate-fade-up-2 { animation: fade-up 0.6s ease 0.15s forwards; opacity: 0; }
      `}</style>

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-14 pt-36 pb-24">

          {/* Back button */}
          <button
            onClick={() => router.push('/productspage')}
            className="flex items-center gap-2 text-[#888] hover:text-[#f5f0eb] transition-colors mb-12 text-sm tracking-[0.1em] uppercase group cursor-pointer"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

            {/* IMAGE */}
            <div className="animate-fade-up bg-[#111] border border-[#1a1a1a] relative overflow-hidden group">
              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img
                src={shoe.image}
                alt={shoe.name}
                className="w-full h-[560px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Brand watermark */}
              <span
                className="absolute bottom-6 left-6 text-white/[0.06] select-none pointer-events-none leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem' }}
              >
                {shoe.brand}
              </span>
            </div>

            {/* INFO */}
            <div className="animate-fade-up-2 bg-[#111] border border-[#1a1a1a] px-10 py-12 flex flex-col">

              {/* Brand + name */}
              <div className="mb-8">
                <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4">
                  <span className="w-6 h-px bg-[#e8530a]" />
                  {shoe.brand}
                </span>
                <h1
                  className="text-[#f5f0eb] leading-none mb-6"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                >
                  {shoe.name}
                </h1>
                <span
                  className="text-[#f5f0eb]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}
                >
                  ${shoe.price}
                </span>
              </div>

              <p className="text-[#888] leading-relaxed font-light mb-10 border-t border-[#1a1a1a] pt-8">
                {shoe.description}
              </p>

              {/* Color Selection */}
              <div className="mb-8">
                <label className="block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-4">
                  Colour — <span className="text-[#f5f0eb] capitalize">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {shoe.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2 text-xs tracking-[0.1em] uppercase transition-all capitalize cursor-pointer
                        ${selectedColor === color
                          ? 'bg-[#e8530a] text-white border border-[#e8530a]'
                          : 'border border-[#2e2e2e] text-[#888] hover:border-[#e8530a] hover:text-[#e8530a]'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-10">
                <label className={`block text-[0.65rem] tracking-[0.25em] uppercase mb-4 transition-colors ${sizeError ? 'text-red-400' : 'text-[#888]'}`}>
                  {sizeError ? '⚠ Please select a size' : 'Size (US)'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {shoe.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`py-3 text-sm font-medium transition-all cursor-pointer
                        ${selectedSize === size
                          ? 'bg-[#e8530a] text-white border border-[#e8530a]'
                          : `border text-[#888] hover:border-[#e8530a] hover:text-[#e8530a]
                             ${sizeError ? 'border-red-400/50' : 'border-[#2e2e2e]'}`
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all cursor-pointer mt-auto
                  ${added
                    ? 'bg-green-500 text-white'
                    : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]'
                  }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Product Details */}
              <div className="mt-8 border-t border-[#1a1a1a] pt-8">
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-5">Product Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: shoe.category },
                    { label: 'Gender', value: shoe.gender },
                    { label: 'Colors', value: shoe.colors.length },
                    { label: 'Sizes', value: shoe.sizes.length + ' available' },
                  ].map(detail => (
                    <div key={detail.label} className="bg-[#0a0a0a] px-4 py-3">
                      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">{detail.label}</p>
                      <p className="text-[#f5f0eb] text-sm capitalize font-medium">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}