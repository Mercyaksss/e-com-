'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import { getShoes } from '../data/mockData';

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [shoes, setShoes] = useState(() => getShoes());
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (filters) => {
    setShoes(getShoes(filters));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(shoes.length / PRODUCTS_PER_PAGE);
  const paginatedShoes = shoes.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 0.6s ease forwards; }

        .page-layout { display: flex; flex-direction: column; gap: 2.5rem; }
        @media (min-width: 1180px) { .page-layout { flex-direction: row; } }

        .sidebar-col { width: 100%; flex-shrink: 0; }
        @media (min-width: 1180px) { .sidebar-col { width: 256px; } }

        /* Sticky sidebar only on desktop */
        .sidebar-inner { position: static; }
        @media (min-width: 1180px) { .sidebar-inner { position: sticky; top: 96px; } }

        .products-grid { display: grid; gap: 2px; grid-template-columns: 1fr; }
        @media (min-width: 480px)  { .products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1180px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* PAGE HEADER */}
        <div className="relative border-b border-[#1a1a1a] overflow-hidden">
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.03] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 20vw, 18rem)' }}
          >
            SHOP
          </span>
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-28 md:pt-36 pb-10 md:pb-16 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4 md:mb-5">
              <span className="w-8 h-px bg-[#e8530a]" />
              All Products
            </span>
            <h1 className="leading-none text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
              The Full<br /><span className="text-[#e8530a]">Collection</span>
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-10 md:py-16">
          <div className="page-layout">

            {/* SIDEBAR */}
            <aside className="sidebar-col">
              <div className="sidebar-inner">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </aside>

            {/* PRODUCTS AREA */}
            <div className="flex-1 min-w-0">

              {/* Results bar */}
              <div className="flex items-center justify-between mb-6 md:mb-8 pb-5 border-b border-[#1a1a1a]">
                <p className="text-[#888] text-sm font-light">
                  Showing{' '}
                  <span className="text-[#f5f0eb] font-medium">
                    {shoes.length > 0
                      ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 + ' to ' + Math.min(currentPage * PRODUCTS_PER_PAGE, shoes.length)
                      : '0'}
                  </span>
                  {' '}of <span className="text-[#f5f0eb] font-medium">{shoes.length}</span> results
                </p>
                {totalPages > 1 && (
                  <p className="text-[#888] text-xs tracking-[0.1em]">
                    Page <span className="text-[#f5f0eb]">{currentPage}</span> / {totalPages}
                  </p>
                )}
              </div>

              {/* PRODUCTS GRID */}
              {shoes.length > 0 && (
                <>
                  <div className="products-grid">
                    {paginatedShoes.map((shoe, i) => (
                      <div key={shoe.id} className="animate-fade-up h-full" style={{ animationDelay: i * 50 + 'ms', opacity: 0 }}>
                        <ProductCard shoe={shoe} />
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="mt-10 md:mt-12 flex flex-col items-center gap-5">
                      <p className="text-[#888] text-xs tracking-[0.15em] uppercase">
                        Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} to {Math.min(currentPage * PRODUCTS_PER_PAGE, shoes.length)} of {shoes.length} products
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={"flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all " + (currentPage === 1 ? 'border-[#1a1a1a] text-[#444] cursor-not-allowed' : 'border-[#2e2e2e] text-[#888] hover:border-[#e8530a] hover:text-[#e8530a] cursor-pointer')}
                        >
                          Prev
                        </button>
                        {getPageNumbers().map((page, i) =>
                          page === '...' ? (
                            <span key={'e' + i} className="w-8 md:w-9 h-8 md:h-9 flex items-center justify-center text-[#444] text-sm">...</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={"w-8 md:w-9 h-8 md:h-9 flex items-center justify-center text-xs font-medium border transition-all cursor-pointer " + (currentPage === page ? 'bg-[#e8530a] border-[#e8530a] text-white' : 'border-[#2e2e2e] text-[#888] hover:border-[#e8530a] hover:text-[#e8530a]')}
                            >
                              {page}
                            </button>
                          )
                        )}
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={"flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all " + (currentPage === totalPages ? 'border-[#1a1a1a] text-[#444] cursor-not-allowed' : 'border-[#2e2e2e] text-[#888] hover:border-[#e8530a] hover:text-[#e8530a] cursor-pointer')}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* EMPTY STATE */}
              {shoes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
                  <span className="text-8xl mb-6 opacity-30 select-none">👟</span>
                  <h3 className="text-[#f5f0eb] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem' }}>
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