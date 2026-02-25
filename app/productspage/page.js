'use client';
import '../globals.css'
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';

export default function ProductsPage() {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShoes = (filters = {}) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const queryString = params.toString();
    const url = `https://shoe-store-api-dei7.onrender.com/api/shoes${queryString ? '?' + queryString : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setShoes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shoes:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShoes();
  }, []);

  const handleFilterChange = (filters) => {
    fetchShoes(filters);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease forwards; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        .animate-pulse-dot { animation: pulse-dot 1.2s ease-in-out infinite; }
      `}</style>

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* PAGE HEADER */}
        <div className="relative border-b border-[#1a1a1a] overflow-hidden">
          {/* Big background text */}
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.03] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(8rem, 20vw, 18rem)' }}
          >
            SHOP
          </span>

          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-36 pb-16 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-5">
              <span className="w-8 h-px bg-[#e8530a]" />
              All Products
            </span>
            <h1
              className="leading-none text-[#f5f0eb]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(4rem, 9vw, 8rem)' }}
            >
              The Full<br />
              <span className="text-[#e8530a]">Collection</span>
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-16">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* SIDEBAR */}
            <aside className="lg:w-64 flex-shrink-0">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            {/* PRODUCTS AREA */}
            <div className="flex-1">

              {/* Results bar */}
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#1a1a1a]">
                <p className="text-[#888] text-sm font-light">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e8530a] animate-pulse-dot" />
                      Fetching products...
                    </span>
                  ) : (
                    <span>
                      Showing <span className="text-[#f5f0eb] font-medium">{shoes.length}</span> results
                    </span>
                  )}
                </p>
              </div>

              {/* LOADING SKELETON */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-[#1a1a1a] overflow-hidden">
                      <div className="h-64 bg-[#222] animate-pulse" />
                      <div className="px-6 py-5 border-t border-[#2e2e2e] space-y-3">
                        <div className="h-2 w-16 bg-[#2e2e2e] rounded animate-pulse" />
                        <div className="h-4 w-36 bg-[#2e2e2e] rounded animate-pulse" />
                        <div className="h-3 w-full bg-[#2e2e2e] rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-[#2e2e2e] rounded animate-pulse" />
                        <div className="flex justify-between items-center pt-2">
                          <div className="h-8 w-16 bg-[#2e2e2e] rounded animate-pulse" />
                          <div className="h-8 w-24 bg-[#2e2e2e] rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PRODUCTS GRID */}
              {!loading && shoes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
                  {shoes.map((shoe, i) => (
                    <div
                      key={shoe.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                    >
                      <ProductCard shoe={shoe} />
                    </div>
                  ))}
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && shoes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <span className="text-8xl mb-6 opacity-30 select-none">👟</span>
                  <h3
                    className="text-[#f5f0eb] mb-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem' }}
                  >
                    No Shoes Found
                  </h3>
                  <p className="text-[#888] text-sm font-light max-w-xs leading-relaxed">
                    Try adjusting your filters or clearing them to see the full collection.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}