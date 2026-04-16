'use client';

import cloudinaryLoader from '../../../lib/cloudinaryLoader';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ shoe, priority = false }) {
  const image = shoe.images?.[0] || shoe.image || '';
  const colors = shoe.variants ? shoe.variants.map(v => v.color) : (shoe.colors || []);
  const id = shoe._id || shoe.id;

  const totalStock = shoe.variants
    ? shoe.variants.reduce((sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.stock, 0), 0)
    : 0;

  const isOutOfStock = totalStock === 0;

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
      <div className={`group overflow-hidden relative cursor-pointer h-full flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`} 
           style={{ backgroundColor: 'var(--bg-card)' }}>

        {/* Badge */}
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
        <div className="relative h-64 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(232,83,10,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          <Image
            src={`${image}?w=800&q=75&f=auto&c=limit`}
            alt={shoe.name}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 1180px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col flex-1" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#e8530a] mb-1">{shoe.brand}</p>
          <h3 className="text-base font-medium mb-2 group-hover:text-[#e8530a] transition-colors" style={{ color: 'var(--text-primary)' }}>
            {shoe.name}
          </h3>
          <p className="text-sm mb-4 line-clamp-2 font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>{shoe.description}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {colors.slice(0, 3).map((color, i) => (
              <span key={i} className="text-[0.65rem] tracking-[0.1em] uppercase px-2.5 py-1" 
                    style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                {color}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text-primary)' }}>
              ₦{shoe.price}
            </span>
            <div className="bg-[#e8530a] text-white px-3 py-2 text-xs tracking-[0.15em] uppercase font-medium group-hover:bg-[#ff6b2b] transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}