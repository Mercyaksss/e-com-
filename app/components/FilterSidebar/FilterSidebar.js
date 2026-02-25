'use client';

import { useState, useEffect } from 'react';

export default function FilterSidebar({ onFilterChange }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetch('https://shoe-store-api-dei7.onrender.com/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data));

    fetch('https://shoe-store-api-dei7.onrender.com/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      brand: selectedBrand,
      category: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const handleReset = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    onFilterChange({});
  };

  const hasActiveFilters = selectedBrand || selectedCategory || priceRange.min || priceRange.max;

  const selectClass = `
    w-full bg-[#111] text-[#f5f0eb] px-4 py-3 text-sm
    border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none
    transition-colors appearance-none cursor-pointer
  `;

  const inputClass = `
    w-full bg-[#111] text-[#f5f0eb] px-4 py-3 text-sm
    border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none
    transition-colors placeholder:text-[#444]
  `;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .select-arrow { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div
        className="bg-[#111] border border-[#1a1a1a] sticky top-24 overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-[#e8530a]" />
            <span
              className="text-[#f5f0eb] tracking-[0.2em] text-sm uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}
            >
              Filters
            </span>
          </div>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#e8530a]" title="Active filters" />
          )}
        </div>

        <div className="px-6 py-6 flex flex-col gap-7">

          {/* Brand */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-3">
              Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`${selectClass} select-arrow`}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-3">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`${selectClass} select-arrow`}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-3">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className={inputClass}
              />
              <span className="text-[#444] text-sm shrink-0">—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="hover:text-white transition-colors cursor-pointer">✕</button>
                </span>
              )}
              {selectedCategory && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-white transition-colors cursor-pointer">✕</button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.1em] uppercase border border-[#e8530a] text-[#e8530a] px-2.5 py-1">
                  ${priceRange.min || '0'} — ${priceRange.max || '∞'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-white transition-colors cursor-pointer">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Buttons */}
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
                className="w-full bg-transparent text-[#888] py-3 text-xs tracking-[0.2em] uppercase border border-[#2e2e2e] hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer"
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