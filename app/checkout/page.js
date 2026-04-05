'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '../context/CartContext';

const PaystackButton = dynamic(() => import('./PaystackButton'), { ssr: false });
import Navbar from '../components/Navbar/Navbar';
import Link from 'next/link';

// export const dynamic = 'force-dynamic';

const inputClass = `
  w-full bg-[#111] text-[#f5f0eb] px-4 py-3 text-sm
  border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none
  transition-colors placeholder:text-[#444]
`;
const labelClass = `block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-2`;

const DELIVERY_OPTIONS = [
  { id: 'pickup',          label: 'Store Pickup',           sublabel: 'Pick up at our store',        fee: 0 },
  { id: 'within_kaduna',   label: 'Delivery within Kaduna', sublabel: 'Delivered to your address',   fee: 2000 },
  { id: 'outside_kaduna',  label: 'Delivery outside Kaduna', sublabel: 'Delivered to your address',  fee: 4000 },
];

function SuccessModal({ order, onClose }) {
  return (
    <>
      <style>{`
        @keyframes scale-in { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes check-draw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
        .animate-check { animation: check-draw 0.5s ease 0.3s forwards; stroke-dashoffset:60; stroke-dasharray:60; }
      `}</style>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center px-6">
        <div className="animate-scale-in bg-[#111] border border-[#1a1a1a] w-full max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="h-1 bg-[#e8530a] w-full" />
          <div className="px-10 py-12 text-center">
            <div className="w-16 h-16 border-2 border-[#e8530a] flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <path className="animate-check" stroke="#e8530a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[#f5f0eb] block mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.1em' }}>
              Order Confirmed
            </span>
            <p className="text-[#888] text-sm font-light mb-1">
              Thank you, <span className="text-[#f5f0eb]">{order.firstName}</span>!
            </p>
            <p className="text-[#888] text-sm font-light mb-8">
              Your order <span className="text-[#e8530a] font-medium">{order.orderId}</span> has been placed successfully.
            </p>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] text-left mb-8">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-[#f5f0eb] text-xs font-medium">{item.name}</p>
                    <p className="text-[#888] text-[0.65rem] tracking-[0.1em] uppercase">Size {item.selectedSize} · {item.selectedColor}</p>
                  </div>
                  <span className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-4 border-t border-[#2e2e2e]">
                <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#888]">Total Paid</span>
                <span className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}>
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-[#888] text-xs font-light mb-8">
              A confirmation will be sent to <span className="text-[#f5f0eb]">{order.email}</span>
            </p>
            <Link href="/" onClick={onClose}
              className="block w-full bg-[#e8530a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors no-underline text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
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

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', delivery: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [formReady, setFormReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const selectedDelivery = DELIVERY_OPTIONS.find(o => o.id === form.delivery);
  const deliveryFee = selectedDelivery?.fee ?? 0;
  const needsAddress = form.delivery && form.delivery !== 'pickup';

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setErrors(prev => ({ ...prev, [field]: '' }));

    const { firstName, lastName, email, phone, delivery, address } = updated;
    const addressValid = delivery === 'pickup' || (delivery && address.trim());
    setFormReady(
      firstName.trim() && lastName.trim() &&
      /\S+@\S+\.\S+/.test(email) && phone.trim() &&
      delivery && addressValid
    );
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim())     e.phone     = 'Required';
    if (!form.delivery)         e.delivery  = 'Please select a delivery option';
    if (needsAddress && !form.address.trim()) e.address = 'Delivery address is required';
    return e;
  };

  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const paystackConfig = {
    reference: 'SOLE-' + Date.now(),
    email: form.email,
    amount: Math.round(total * 100),
    currency: 'NGN',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: form.firstName + ' ' + form.lastName },
        { display_name: 'Phone', variable_name: 'phone', value: form.phone },
        { display_name: 'Delivery Option', variable_name: 'delivery_option', value: selectedDelivery?.label || '' },
        { display_name: 'Address', variable_name: 'address', value: form.address || 'Store Pickup' },
      ],
    },
  };

  const handlePaystackSuccess = async (response) => {
    setLoading(true);
    try {
      const orderPayload = {
        customer: {
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          address:   form.address || 'Store Pickup',
        },
        items: cart.map(item => ({
          productId:     item._id || item.id || 'unknown',
          name:          item.name || '',
          brand:         item.brand || '',
          price:         item.price,
          quantity:      item.quantity,
          selectedSize:  String(item.selectedSize),
          selectedColor: item.selectedColor || '',
          image:         item.image || item.images?.[0] || '',
        })),
        subtotal,
        deliveryOption: selectedDelivery?.label || '',
        deliveryFee,
        total,
        paymentMethod:    'Paystack',
        paymentReference: response.reference,
        paystackReference: response.reference,
        paymentStatus:    'Paid',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save order');

      setSuccessOrder({
        orderId:   data.orderId,
        firstName: form.firstName,
        email:     form.email,
        items:     cart,
        total:     total.toFixed(2),
      });
      clearCart?.();
    } catch (err) {
      setErrors({ submit: 'Payment was successful but order failed to save. Please contact support. Ref: ' + response.reference });
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    // User closed Paystack popup without paying — do nothing
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-up { animation: fade-up 0.5s ease forwards; }
      `}</style>

      {successOrder && <SuccessModal order={successOrder} onClose={() => setSuccessOrder(null)} />}

      <Navbar />

      <main className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <div className="border-b border-[#1a1a1a] relative overflow-hidden">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.03] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(6rem, 18vw, 16rem)' }}>
            CHECKOUT
          </span>
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-24 md:pt-36 pb-10 md:pb-14 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4">
              <span className="w-8 h-px bg-[#e8530a]" />
              Final Step
            </span>
            <h1 className="text-[#f5f0eb] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
              Checkout
            </h1>
          </div>
        </div>

        {mounted && cart.length === 0 && !successOrder && (
          <div className="flex flex-col items-center justify-center py-40 text-center px-6">
            <span className="text-7xl opacity-20 select-none mb-6">👟</span>
            <h3 className="text-[#f5f0eb] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem' }}>Your Cart is Empty</h3>
            <p className="text-[#888] text-sm font-light mb-8">Add some shoes before checking out.</p>
            <Link href="/productspage"
              className="bg-[#e8530a] text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#ff6b2b] transition-colors no-underline"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
              Shop Now
            </Link>
          </div>
        )}

        {mounted && cart.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 md:px-14 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 md:gap-8">

            {/* LEFT — Steps */}
            <div className="space-y-2">

              {/* Step 1 — Contact Info */}
              <div className="bg-[#111] border border-[#1a1a1a]">
                <div className="px-5 sm:px-8 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">1</span>
                  <span className="text-[#f5f0eb] tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>Contact Information</span>
                </div>
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <label className={labelClass}>First Name</label>
                      <input type="text" placeholder="Jane" value={form.firstName}
                        onChange={e => handleChange('firstName', e.target.value)}
                        className={`${inputClass} ${errors.firstName ? 'border-red-400/70' : ''}`} />
                      {errors.firstName && <p className="text-red-400 text-[0.65rem] mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={labelClass}>Last Name</label>
                      <input type="text" placeholder="Smith" value={form.lastName}
                        onChange={e => handleChange('lastName', e.target.value)}
                        className={`${inputClass} ${errors.lastName ? 'border-red-400/70' : ''}`} />
                      {errors.lastName && <p className="text-red-400 text-[0.65rem] mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" placeholder="jane@example.com" value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className={`${inputClass} ${errors.email ? 'border-red-400/70' : ''}`} />
                    {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" placeholder="+234 800 000 0000" value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className={`${inputClass} ${errors.phone ? 'border-red-400/70' : ''}`} />
                    {errors.phone && <p className="text-red-400 text-[0.65rem] mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2 — Delivery */}
              <div className="bg-[#111] border border-[#1a1a1a]">
                <div className="px-5 sm:px-8 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">2</span>
                  <span className="text-[#f5f0eb] tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>Delivery</span>
                </div>
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-4">
                  {errors.delivery && <p className="text-red-400 text-[0.65rem]">{errors.delivery}</p>}
                  {DELIVERY_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChange('delivery', option.id)}
                      className={`w-full flex items-center justify-between px-5 py-4 border transition-all text-left ${form.delivery === option.id ? 'border-[#e8530a] bg-[#e8530a]/5' : 'border-[#2e2e2e] hover:border-[#444]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.delivery === option.id ? 'border-[#e8530a]' : 'border-[#444]'}`}>
                          {form.delivery === option.id && <div className="w-2 h-2 rounded-full bg-[#e8530a]" />}
                        </div>
                        <div>
                          <p className="text-[#f5f0eb] text-sm font-medium">{option.label}</p>
                          <p className="text-[#888] text-xs font-light">{option.sublabel}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium shrink-0 ml-4 ${option.fee === 0 ? 'text-green-400' : 'text-[#f5f0eb]'}`}
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>
                        {option.fee === 0 ? 'Free' : `+₦${option.fee.toLocaleString()}`}
                      </span>
                    </button>
                  ))}

                  {/* Address field — only shown when delivery is selected */}
                  {needsAddress && (
                    <div className="pt-2">
                      <label className={labelClass}>Delivery Address</label>
                      <input
                        type="text"
                        placeholder="Enter your full delivery address"
                        value={form.address}
                        onChange={e => handleChange('address', e.target.value)}
                        className={`${inputClass} ${errors.address ? 'border-red-400/70' : ''}`}
                      />
                      {errors.address && <p className="text-red-400 text-[0.65rem] mt-1">{errors.address}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — Payment */}
              <div className="bg-[#111] border border-[#1a1a1a] px-5 sm:px-8 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">3</span>
                  <span className="text-[#f5f0eb] tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>Payment</span>
                </div>
                <p className="text-[#888] text-sm font-light mt-3 ml-9">
                  You'll be redirected to Paystack's secure payment page to complete your purchase. We accept cards, bank transfers, and USSD.
                </p>
                <div className="flex items-center gap-2 text-[#888] text-xs font-light mt-4 ml-9">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured by Paystack
                </div>
              </div>

              {errors.submit && <p className="text-red-400 text-xs px-1">{errors.submit}</p>}
            </div>

            {/* RIGHT — Order Summary */}
            <div className="space-y-2">
              <div className="bg-[#111] border border-[#1a1a1a] sticky top-28">
                <div className="px-7 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                  <span className="w-5 h-px bg-[#e8530a]" />
                  <span className="text-[#f5f0eb] tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>Order Summary</span>
                  <span className="ml-auto text-[#888] text-xs">{cart.reduce((a, i) => a + i.quantity, 0)} items</span>
                </div>
                <div className="divide-y divide-[#1a1a1a]">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-4 px-7 py-4">
                      <div className="w-16 h-16 bg-[#0a0a0a] shrink-0 overflow-hidden">
                        <img src={item.image || item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#f5f0eb] text-xs font-medium truncate">{item.name}</p>
                        <p className="text-[#888] text-[0.6rem] tracking-[0.1em] uppercase mt-0.5">{item.brand} · Size {item.selectedSize}</p>
                        <p className="text-[#888] text-[0.6rem] tracking-[0.1em] capitalize">{item.selectedColor} · Qty {item.quantity}</p>
                      </div>
                      <span className="text-[#f5f0eb] shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-7 py-5 border-t border-[#1a1a1a] space-y-3">
                  <div className="flex justify-between text-xs text-[#888]">
                    <span>Subtotal</span>
                    <span className="text-[#f5f0eb]">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#888]">
                    <span>Delivery</span>
                    {!form.delivery ? (
                      <span className="text-[#555]">Select option</span>
                    ) : deliveryFee === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      <span className="text-[#f5f0eb]">+₦{deliveryFee.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2e2e2e] pt-4 mt-1">
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#888]">Total</span>
                    <span className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem' }}>
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="px-7 pb-7 space-y-3">
                  {loading ? (
                    <div className="w-full py-4 bg-[#2e2e2e] flex items-center justify-center gap-2 text-[#888] text-sm tracking-[0.2em] uppercase">
                      <span className="w-3 h-3 border border-[#888] border-t-transparent rounded-full animate-spin" />
                      Saving order...
                    </div>
                  ) : (
                    <PaystackButton
                      config={paystackConfig}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      disabled={!formReady}
                      total={total}
                    />
                  )}
                  {!formReady && (
                    <p className="text-[#888] text-[0.65rem] text-center tracking-wide">Fill in your details to proceed</p>
                  )}
                  <Link href="/productspage"
                    className="block text-center text-[#888] hover:text-[#f5f0eb] text-xs tracking-[0.15em] uppercase mt-2 transition-colors no-underline">
                    ← Back to Shop
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </>
  );
}