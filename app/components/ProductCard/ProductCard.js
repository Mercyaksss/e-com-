'use client';

import Link from 'next/link';

export default function ProductCard({ shoe }) {
  // New schema: images array + variants for colors
  // Falls back to old schema just in case
  const image = shoe.images?.[0] || shoe.image || '';
  const colors = shoe.variants ? shoe.variants.map(v => v.color) : (shoe.colors || []);
  const id = shoe._id || shoe.id;

  // Calculate total stock across all variants and sizes
  const totalStock = shoe.variants
    ? shoe.variants.reduce((sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.stock, 0), 0)
    : 0;

  const isOutOfStock = totalStock === 0;

  // Stock badge logic — takes priority over shoe.badge
  const getStockBadge = () => {
    if (totalStock === 0) return { label: 'Out of Stock', color: 'bg-[#333] text-[#888]' };
    if (totalStock === 1) return { label: 'Only 1 left 🔥', color: 'bg-red-500/90 text-white' };
    if (totalStock === 2) return { label: 'Only 2 left', color: 'bg-red-500/90 text-white' };
    if (totalStock <= 5) return { label: 'Low Stock', color: 'bg-yellow-600/90 text-white' };
    return null;
  };

  const stockBadge = getStockBadge();

  return (
    <Link href={`/product/${id}`}>
      <div className={`group bg-[#1a1a1a] overflow-hidden relative cursor-pointer h-full flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}>

        {/* Badge — stock badge takes priority over shoe.badge */}
        {stockBadge ? (
          <span className={`absolute top-4 left-4 z-10 text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1 ${stockBadge.color}`}>
            {stockBadge.label}
          </span>
        ) : shoe.badge ? (
          <span className="absolute top-4 left-4 z-10 bg-[#e8530a] text-[#f5f0eb] text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1">
            {shoe.badge}
          </span>
        ) : null}

        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-[#111]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <img
            src={image}
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
            {colors.slice(0, 3).map((color, i) => (
              <span key={i} className="text-[0.65rem] tracking-[0.1em] uppercase border border-[#2e2e2e] text-[#888] px-2.5 py-1">
                {color}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl tracking-wide text-[#f5f0eb]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              ₦{shoe.price}
            </span>
            <div className="bg-[#e8530a] text-white px-3 py-2 text-xs tracking-[0.15em] uppercase font-medium
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