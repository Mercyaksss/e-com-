'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar/Navbar';
import Link from 'next/link';

const inputClass = `
  w-full bg-[#111] text-[#f5f0eb] px-4 py-3 text-sm
  border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none
  transition-colors placeholder:text-[#444]
`;

const labelClass = `block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-2`;

function SuccessModal({ order, onClose }) {
  return (
    <>
      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes check-draw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        .animate-check { animation: check-draw 0.5s ease 0.3s forwards; stroke-dashoffset: 60; stroke-dasharray: 60; }
      `}</style>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center px-6">
        <div
          className="animate-scale-in bg-[#111] border border-[#1a1a1a] w-full max-w-md"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* Top accent */}
          <div className="h-1 bg-[#e8530a] w-full" />

          <div className="px-10 py-12 text-center">
            {/* Check icon */}
            <div className="w-16 h-16 border-2 border-[#e8530a] flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <path
                  className="animate-check"
                  stroke="#e8530a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <span
              className="text-[#f5f0eb] block mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.1em' }}
            >
              Order Confirmed
            </span>
            <p className="text-[#888] text-sm font-light mb-1">
              Thank you, <span className="text-[#f5f0eb]">{order.firstName}</span>!
            </p>
            <p className="text-[#888] text-sm font-light mb-8">
              Your order <span className="text-[#e8530a] font-medium">{order.id}</span> has been placed successfully.
            </p>

            {/* Order summary mini */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] text-left mb-8">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-[#f5f0eb] text-xs font-medium">{item.name}</p>
                    <p className="text-[#888] text-[0.65rem] tracking-[0.1em] uppercase">
                      Size {item.selectedSize} · {item.selectedColor}
                    </p>
                  </div>
                  <span
                    className="text-[#f5f0eb]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-4 border-t border-[#2e2e2e]">
                <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#888]">Total Paid</span>
                <span
                  className="text-[#f5f0eb]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}
                >
                  ${order.total}
                </span>
              </div>
            </div>

            <p className="text-[#888] text-xs font-light mb-8">
              A confirmation will be sent to <span className="text-[#f5f0eb]">{order.email}</span>
            </p>

            <Link
              href="/"
              onClick={onClose}
              className="block w-full bg-[#e8530a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors no-underline text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Format card number with spaces
  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit number';
    if (!form.cardExpiry || form.cardExpiry.length < 5) e.cardExpiry = 'Enter MM/YY';
    if (!form.cardCvc || form.cardCvc.length < 3) e.cardCvc = 'Enter CVC';
    if (!form.cardName.trim()) e.cardName = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      const order = {
        id: '#SOLE-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        firstName: form.firstName,
        email: form.email,
        items: cart,
        total: getCartTotal().toFixed(2),
      };
      setSuccessOrder(order);
      clearCart?.();
      setLoading(false);
    }, 1800);
  };

  const Field = ({ name, label, placeholder, half, type = 'text', format, maxLength }) => (
    <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        maxLength={maxLength}
        onChange={e => {
          const val = format ? format(e.target.value) : e.target.value;
          update(name, val);
        }}
        className={`${inputClass} ${errors[name] ? 'border-red-400/70' : ''}`}
      />
      {errors[name] && <p className="text-red-400 text-[0.65rem] mt-1 tracking-wide">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease forwards; }
      `}</style>

      {successOrder && (
        <SuccessModal order={successOrder} onClose={() => setSuccessOrder(null)} />
      )}

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page header */}
        <div className="border-b border-[#1a1a1a] relative overflow-hidden">
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.03] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(6rem, 18vw, 16rem)' }}
          >
            CHECKOUT
          </span>
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-36 pb-14 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4">
              <span className="w-8 h-px bg-[#e8530a]" />
              Final Step
            </span>
            <h1
              className="text-[#f5f0eb] leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
            >
              Checkout
            </h1>
          </div>
        </div>

        {/* Empty cart guard */}
        {cart.length === 0 && !successOrder && (
          <div className="flex flex-col items-center justify-center py-40 text-center px-6">
            <span className="text-7xl opacity-20 select-none mb-6">👟</span>
            <h3 className="text-[#f5f0eb] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem' }}>
              Your Cart is Empty
            </h3>
            <p className="text-[#888] text-sm font-light mb-8">Add some shoes before checking out.</p>
            <Link
              href="/productspage"
              className="bg-[#e8530a] text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#ff6b2b] transition-colors no-underline"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            >
              Shop Now
            </Link>
          </div>
        )}

        {cart.length > 0 && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="max-w-7xl mx-auto px-6 md:px-14 py-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">

              {/* LEFT — Forms */}
              <div className="space-y-2">

                {/* Contact Info */}
                <div className="bg-[#111] border border-[#1a1a1a]">
                  <div className="px-8 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">1</span>
                    <span
                      className="text-[#f5f0eb] tracking-[0.15em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}
                    >
                      Contact Information
                    </span>
                  </div>
                  <div className="px-8 py-8 space-y-5">
                    <div className="flex gap-4">
                      <Field name="firstName" label="First Name" placeholder="Jane" half />
                      <Field name="lastName"  label="Last Name"  placeholder="Smith" half />
                    </div>
                    <Field name="email" label="Email Address" placeholder="jane@example.com" type="email" />
                    <Field name="phone" label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-[#111] border border-[#1a1a1a]">
                  <div className="px-8 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">2</span>
                    <span
                      className="text-[#f5f0eb] tracking-[0.15em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}
                    >
                      Payment Details
                    </span>
                    {/* Card icons */}
                    <div className="ml-auto flex gap-2">
                      {['VISA', 'MC', 'AMEX'].map(c => (
                        <span key={c} className="text-[0.55rem] tracking-widest border border-[#2e2e2e] text-[#888] px-1.5 py-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-8 py-8 space-y-5">
                    <Field
                      name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456"
                      format={formatCard} maxLength={19}
                    />
                    <Field name="cardName" label="Name on Card" placeholder="Jane Smith" />
                    <div className="flex gap-4">
                      <Field
                        name="cardExpiry" label="Expiry Date" placeholder="MM/YY"
                        format={formatExpiry} maxLength={5} half
                      />
                      <Field
                        name="cardCvc" label="CVC" placeholder="123"
                        type="password" maxLength={4} half
                      />
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="px-8 pb-8">
                    <div className="flex items-center gap-2 text-[#888] text-xs font-light">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your payment info is encrypted and secure
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Order Summary */}
              <div className="space-y-2">
                <div className="bg-[#111] border border-[#1a1a1a] sticky top-28">
                  <div className="px-7 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                    <span className="w-5 h-px bg-[#e8530a]" />
                    <span
                      className="text-[#f5f0eb] tracking-[0.15em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}
                    >
                      Order Summary
                    </span>
                    <span className="ml-auto text-[#888] text-xs">{cart.reduce((a, i) => a + i.quantity, 0)} items</span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#1a1a1a]">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-4 px-7 py-4">
                        <div className="w-16 h-16 bg-[#0a0a0a] shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#f5f0eb] text-xs font-medium truncate">{item.name}</p>
                          <p className="text-[#888] text-[0.6rem] tracking-[0.1em] uppercase mt-0.5">
                            {item.brand} · Size {item.selectedSize}
                          </p>
                          <p className="text-[#888] text-[0.6rem] tracking-[0.1em] capitalize">{item.selectedColor} · Qty {item.quantity}</p>
                        </div>
                        <span
                          className="text-[#f5f0eb] shrink-0"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-7 py-5 border-t border-[#1a1a1a] space-y-3">
                    <div className="flex justify-between text-xs text-[#888]">
                      <span>Subtotal</span>
                      <span className="text-[#f5f0eb]">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#888]">
                      <span>Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2e2e2e] pt-4 mt-1">
                      <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#888]">Total</span>
                      <span
                        className="text-[#f5f0eb]"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem' }}
                      >
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="px-7 pb-7">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all cursor-pointer
                        ${loading
                          ? 'bg-[#2e2e2e] text-[#888] cursor-not-allowed'
                          : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]'
                        }`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 border border-[#888] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Pay $${getCartTotal().toFixed(2)}`
                      )}
                    </button>

                    <Link
                      href="/productspage"
                      className="block text-center text-[#888] hover:text-[#f5f0eb] text-xs tracking-[0.15em] uppercase mt-4 transition-colors no-underline"
                    >
                      ← Back to Shop
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}
      </main>
    </>
  );
}