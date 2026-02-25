'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ shoe }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault(); // prevent the outer Link from firing
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link href={`/product/${shoe.id}`}>
      <div className="group bg-[#1a1a1a] overflow-hidden relative cursor-pointer h-full flex flex-col">

        {/* Badge */}
        {shoe.badge && (
          <span className="absolute top-4 left-4 z-10 bg-[#e8530a] text-[#f5f0eb] text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1">
            {shoe.badge}
          </span>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-xl text-white
            opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200
            ${added ? 'bg-green-500' : 'bg-[#e8530a]'}`}
        >
          {added ? '✓' : '+'}
        </button>

        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-[#111]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <img
            src={shoe.image}
            alt={shoe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="px-6 py-5 border-t border-[#2e2e2e] flex flex-col flex-1">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#e8530a] mb-1">{shoe.brand}</p>
          <h3 className="text-[#f5f0eb] text-base font-medium mb-2 group-hover:text-[#e8530a] transition-colors">
            {shoe.name}
          </h3>
          <p className="text-[#888] text-sm mb-4 line-clamp-2 font-light leading-relaxed">{shoe.description}</p>

          {/* Color tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {shoe.colors.slice(0, 3).map((color, i) => (
              <span key={i} className="text-[0.65rem] tracking-[0.1em] uppercase border border-[#2e2e2e] text-[#888] px-2.5 py-1">
                {color}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bebas text-3xl tracking-wide text-[#f5f0eb]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              ${shoe.price}
            </span>
            <div className="bg-[#e8530a] text-white px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium
              group-hover:bg-[#ff6b2b] transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}