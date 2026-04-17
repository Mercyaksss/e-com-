'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import { Suspense } from 'react';

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const searchQuery = searchParams.get('search') || '';

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setActiveFilters(filters);
    try {
      const params = new URLSearchParams();
      if (filters.brand)    params.set('brand', filters.brand);
      if (filters.category) params.set('category', filters.category);
      if (filters.size)     params.set('size', filters.size);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

      const res = await fetch('/api/products?' + params.toString());
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Filter by search query on top of existing filters
  const filteredProducts = searchQuery
    ? allProducts.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.category) ? p.category.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) : p.category?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allProducts;

  // Keep products in sync
  useEffect(() => {
    setProducts(filteredProducts);
    setCurrentPage(1);
  }, [allProducts, searchQuery]);

  const handleFilterChange = (filters) => {
    fetchProducts(filters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
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
        @keyframes shimmer { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
        .skeleton { animation: shimmer 1.5s ease-in-out infinite; background: var(--bg-card); }

        .page-layout { display: flex; flex-direction: column; gap: 2.5rem; }
        @media (min-width: 1180px) { .page-layout { flex-direction: row; } }

        .sidebar-col { width: 100%; flex-shrink: 0; }
        @media (min-width: 1180px) { .sidebar-col { width: 256px; } }

        .sidebar-inner { position: static; }
        @media (min-width: 1180px) { .sidebar-inner { position: sticky; top: 96px; } }

        .products-grid { display: grid; gap: 2px; grid-template-columns: 1fr; }
        @media (min-width: 554px)  { .products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1180px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Navbar />
      </Suspense>

      <main className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'var(--bg-primary)' }}>

        {/* PAGE HEADER */}
        <div className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 20vw, 18rem)', color: 'var(--text-primary)', opacity: 0.03 }}
          >
            SHOP
          </span>
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-24 md:pt-28 pb-8 md:pb-10 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4 md:mb-5">
              <span className="w-8 h-px bg-[#e8530a]" />
              All Products
            </span>
            <h1 className="leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 9vw, 6rem)', color: 'var(--text-primary)' }}>
              {searchQuery ? (
                <>Search: <span className="text-[#e8530a]">{searchQuery}</span></>
              ) : (
                <>The Full <span className="text-[#e8530a]">Collection</span></>
              )}
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-10 md:py-16">
          <div className="page-layout">

            {/* MOBILE FILTER TOGGLE */}
            <div className="flex items-center justify-between lg:hidden mb-2">
              <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>
                {!loading && <span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{products.length}</span> products</span>}
              </p>
              <button
                onClick={() => setFilterOpen(f => !f)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-all cursor-pointer hover:border-[#e8530a] hover:text-[#e8530a]"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                {filterOpen ? 'Hide Filters' : 'Filters'}
              </button>
            </div>

            {/* SIDEBAR */}
            <aside className={`sidebar-col ${filterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="sidebar-inner">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </aside>

            {/* PRODUCTS AREA */}
            <div className="flex-1 min-w-0">

              {/* Results bar */}
              {!loading && (
                <div className="flex items-center justify-between mb-6 md:mb-8 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>
                    Showing{' '}
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {products.length > 0
                        ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 + ' to ' + Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)
                        : '0'}
                    </span>
                    {' '}of <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{products.length}</span> results
                  </p>
                  {totalPages > 1 && (
                    <p className="text-xs tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                      Page <span style={{ color: 'var(--text-primary)' }}>{currentPage}</span> / {totalPages}
                    </p>
                  )}
                </div>
              )}

              {/* LOADING SKELETONS */}
              {loading && (
                <div className="products-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: '420px' }} />
                  ))}
                </div>
              )}

              {/* PRODUCTS GRID */}
              {!loading && products.length > 0 && (
                <>
                  <div className="products-grid">
                    {paginatedProducts.map((product, i) => (
                      <div key={product._id} className="animate-fade-up h-full" style={{ animationDelay: i * 50 + 'ms', opacity: 0 }}>
                        <ProductCard shoe={product} priority={i === 0} />
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="mt-10 md:mt-12 flex flex-col items-center gap-5">
                      <p className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
                        Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} to {Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)} of {products.length} products
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={"flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all " + (currentPage === 1 ? 'cursor-not-allowed' : 'hover:border-[#e8530a] hover:text-[#e8530a] cursor-pointer')}
                          style={ currentPage === 1 ? { borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', opacity: 0.4 } : { borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                        >
                          Prev
                        </button>
                        {getPageNumbers().map((page, i) =>
                          page === '...' ? (
                            <span key={'e' + i} className="w-8 md:w-9 h-8 md:h-9 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>...</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={"w-8 md:w-9 h-8 md:h-9 flex items-center justify-center text-xs font-medium border transition-all cursor-pointer " + (currentPage === page ? 'bg-[#e8530a] border-[#e8530a] text-white' : 'hover:border-[#e8530a] hover:text-[#e8530a]')}
                              style={ currentPage !== page ? { borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
                            >
                              {page}
                            </button>
                          )
                        )}
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={"flex items-center gap-2 px-3 md:px-4 py-2.5 text-xs tracking-[0.15em] uppercase border transition-all " + (currentPage === totalPages ? 'cursor-not-allowed' : 'hover:border-[#e8530a] hover:text-[#e8530a] cursor-pointer')}
                          style={ currentPage === totalPages ? { borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', opacity: 0.4 } : { borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* EMPTY STATE */}
              {!loading && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
                  <span className="text-8xl mb-6 opacity-30 select-none">👟</span>
                  <h3 className="mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--text-primary)' }}>
                    No Products Found
                  </h3>
                  <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Try adjusting your filters or clearing them to see the full collection.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Designed & developed by <a className="text-[#e8530a] font-medium" href='https://mercy-yakubu-frontend-developer.vercel.app/' target="_blank">Mercy Yakubu</a>
        </p>
      </footer>
    </>
  );
}