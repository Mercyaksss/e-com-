'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Drawer */}
      <div
        className="animate-slide-in fixed right-0 top-0 h-full w-full sm:w-[420px] md:w-[480px] bg-[#0f0f0f] z-50 flex flex-col border-l border-[#1a1a1a]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* Header */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-[#1a1a1a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-[#e8530a]" />
            <h2
              className="text-[#f5f0eb] tracking-[0.15em]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem' }}
            >
              Your Cart
            </h2>
            {cart.length > 0 && (
              <span className="bg-[#e8530a] text-white text-[0.6rem] w-5 h-5 flex items-center justify-center font-medium">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer text-lg"
          >
            x
          </button>
        </div>

        {/* EMPTY STATE */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-8">
            <span className="text-7xl opacity-20 select-none mb-6">👟</span>
            <h3
              className="text-[#f5f0eb] mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem' }}
            >
              Cart is Empty
            </h3>
            <p className="text-[#888] text-sm font-light mb-8 leading-relaxed">
              Looks like you haven't added anything yet. Go find your next pair.
            </p>
            <button
              onClick={onClose}
              className="text-xs tracking-[0.2em] uppercase bg-[#e8530a] text-white px-8 py-3 hover:bg-[#ff6b2b] transition-colors cursor-pointer"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 space-y-0.5">
              {cart.map(item => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-[#1a1a1a] p-4 sm:p-5 flex gap-3 sm:gap-4"
                >
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#111] shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details + quantity/price */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#e8530a]">{item.brand}</p>
                    <h3 className="text-[#f5f0eb] text-xs sm:text-sm font-medium truncate">{item.name}</h3>
                    <div className="flex flex-wrap gap-x-2 text-[0.65rem] tracking-[0.1em] uppercase text-[#888]">
                      <span>Size {item.selectedSize}</span>
                      <span className="text-[#2e2e2e]">·</span>
                      <span className="capitalize">{item.selectedColor}</span>
                    </div>

                    {/* Quantity + price on own row */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2e2e2e]">
                      <div className="flex items-center border border-[#2e2e2e]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 text-[#888] hover:text-[#f5f0eb] hover:bg-[#2e2e2e] transition-all text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 sm:w-8 text-center text-[#f5f0eb] text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 text-[#888] hover:text-[#f5f0eb] hover:bg-[#2e2e2e] transition-all text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span
                        className="text-[#f5f0eb]"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', letterSpacing: '0.05em' }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#444] hover:text-red-400 transition-colors self-start cursor-pointer shrink-0 text-sm mt-0.5"
                    title="Remove item"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#1a1a1a] px-5 sm:px-8 py-6 sm:py-8">

              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888]">Subtotal</span>
                <span
                  className="text-[#f5f0eb]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2rem)', letterSpacing: '0.05em' }}
                >
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-[#444] text-xs mb-6 sm:mb-8 font-light">Shipping and taxes calculated at checkout</p>

              <Link
                href="/checkout"
                className="block w-full text-center bg-[#e8530a] text-white py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer mb-2 no-underline"
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={onClose}
                className="w-full bg-transparent text-[#888] py-3 text-xs tracking-[0.2em] uppercase border border-[#2e2e2e] hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}