'use client';

import { useState, useEffect } from 'react';

export default function FilterSidebar({ onFilterChange }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);              // ← NEW

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');   // ← NEW (single value)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch filter options
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(products => {
        if (!Array.isArray(products)) return;

        // Brands
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
        setBrands(uniqueBrands);

        // Categories
        const uniqueCategories = [...new Set(
          products.flatMap(p => Array.isArray(p.category) ? p.category : [p.category])
        )].filter(Boolean).sort();
        setCategories(uniqueCategories);

        // Sizes - only those with stock > 0
        const availableSizes = products.flatMap(p =>
          p.variants?.flatMap(v =>
            v.sizes
              ?.filter(s => s.stock > 0)
              .map(s => s.size) || []
          ) || []
        );

        const uniqueSizes = [...new Set(availableSizes)].sort((a, b) => a - b);
        setSizes(uniqueSizes);
      })
      .catch(err => console.error('Failed to fetch filter options:', err));
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      brand: selectedBrand,
      category: selectedCategory,
      size: selectedSize,                    // ← NEW (single size)
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const handleReset = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedSize('');                     // ← NEW
    setPriceRange({ min: '', max: '' });
    onFilterChange({});
  };

  const hasActiveFilters = selectedBrand || selectedCategory || selectedSize || priceRange.min || priceRange.max;

  const selectClass = "w-full px-4 py-3 text-sm border focus:border-[#e8530a] focus:outline-none transition-colors appearance-none cursor-pointer";
  const inputClass = "w-full px-4 py-3 text-sm border focus:border-[#e8530a] focus:outline-none transition-colors placeholder:text-[#888]";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .select-arrow { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="sticky top-24 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>

        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-[#e8530a]" />
            <span className="tracking-[0.2em] text-sm uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Filters
            </span>
          </div>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#e8530a]" title="Active filters" />}
        </div>

        <div className="px-6 py-6 flex flex-col gap-7">

          {/* Brand */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Brand</label>
            <div className="relative">
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className={selectClass + " select-arrow"} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                <option value="">All Brands</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </div>

          {/* Size - Dropdown (Single Select) */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Size (EU)</label>
            <div className="relative">
              <select 
                value={selectedSize} 
                onChange={e => setSelectedSize(e.target.value)} 
                className={selectClass + " select-arrow"} 
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>EU {size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Category</label>
            <div className="relative">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={selectClass + " select-arrow"} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Price Range (₦)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={priceRange.min}
                onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                className={inputClass}
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} 
              />
              <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>to</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={priceRange.max}
                onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                className={inputClass}
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} 
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="hover:text-white transition-colors cursor-pointer">x</button>
                </span>
              )}
              {selectedSize && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  EU {selectedSize}
                  <button onClick={() => setSelectedSize('')} className="hover:text-white transition-colors cursor-pointer">x</button>
                </span>
              )}
              {selectedCategory && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-white transition-colors cursor-pointer">x</button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  ₦{priceRange.min || '0'} to ₦{priceRange.max || 'max'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-white transition-colors cursor-pointer">x</button>
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <button 
              onClick={handleFilterChange}
              className="w-full bg-[#e8530a] text-white py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button 
                onClick={handleReset}
                className="w-full bg-transparent py-3 text-xs tracking-[0.2em] uppercase border hover:border-[#e8530a] hover:text-[#e8530a] transition-all cursor-pointer"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
              >
                Clear All
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}