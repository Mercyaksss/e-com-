'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '../context/CartContext';

const PaystackButton = dynamic(() => import('./PaystackButton'), { ssr: false });
import Navbar from '../components/Navbar/Navbar';
import Link from 'next/link';

// export const dynamic = 'force-dynamic';

const inputClass = `w-full px-4 py-3 text-sm border focus:border-[#e8530a] focus:outline-none transition-colors`;
const labelClass = `block text-[0.65rem] tracking-[0.25em] uppercase mb-2`;

const DELIVERY_OPTIONS = [
  { id: 'pickup',          label: 'Store Pickup',           sublabel: 'Pick up at our store',        fee: 0 },
  { id: 'within_kaduna',   label: 'Delivery within Kaduna', sublabel: 'Delivered to your address',   fee: 2000 },
  // { id: 'outside_kaduna',  label: 'Delivery outside Kaduna', sublabel: 'Delivered to your address',  fee: 4000 },
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
        <div className="animate-scale-in w-full max-w-md" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="h-1 bg-[#e8530a] w-full" />
          <div className="px-10 py-12 text-center">
            <div className="w-16 h-16 border-2 border-[#e8530a] flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <path className="animate-check" stroke="#e8530a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="block mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              Order Confirmed
            </span>
            <p className="text-sm font-light mb-1" style={{ color: 'var(--text-muted)' }}>
              Thank you, <span style={{ color: 'var(--text-primary)' }}>{order.firstName}</span>!
            </p>
            <p className="text-sm font-light mb-8" style={{ color: 'var(--text-muted)' }}>
              Your order <span className="text-[#e8530a] font-medium">{order.orderId}</span> has been placed successfully.
            </p>
            <div className="text-left mb-8" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3 last:border-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <p className="text-[0.65rem] tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>Size {item.selectedSize} · {item.selectedColor}</p>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span className="text-[0.65rem] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Total Paid</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs font-light mb-8" style={{ color: 'var(--text-muted)' }}>
              A confirmation will be sent to <span style={{ color: 'var(--text-primary)' }}>{order.email}</span>
            </p>
            <Link href="/productspage" onClick={onClose}
              className="block w-full bg-[#e8530a] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors no-underline text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              Back to Shop
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

      <main className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'var(--bg-primary)' }}>

        <div className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'var(--text-primary)', opacity: 0.03 }}>
            CHECKOUT
          </span>
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-24 md:pt-36 pb-10 md:pb-14 relative z-10 animate-fade-up">
            <span className="flex items-center gap-3 text-[#e8530a] text-xs tracking-[0.3em] uppercase mb-4">
              <span className="w-8 h-px bg-[#e8530a]" />
              Final Step
            </span>
            <h1 className="leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: 'var(--text-primary)' }}>
              Checkout
            </h1>
          </div>
        </div>

        {mounted && cart.length === 0 && !successOrder && (
          <div className="flex flex-col items-center justify-center py-40 text-center px-6">
            <span className="text-7xl opacity-20 select-none mb-6">👟</span>
            <h3 className="mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--text-primary)' }}>Your Cart is Empty</h3>
            <p className="text-sm font-light mb-8" style={{ color: 'var(--text-muted)' }}>Add some shoes before checking out.</p>
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
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="px-5 sm:px-8 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">1</span>
                  <span className="tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--text-primary)' }}>Contact Information</span>
                </div>
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <label className={labelClass} style={{ color: 'var(--text-muted)' }}>First Name</label>
                      <input type="text" placeholder="Jane" value={form.firstName}
                        onChange={e => handleChange('firstName', e.target.value)}
                        className={`${inputClass} ${errors.firstName ? 'border-red-400/70' : ''}`}
                        style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: errors.firstName ? '' : 'var(--border-color)' }} />
                      {errors.firstName && <p className="text-red-400 text-[0.65rem] mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={labelClass} style={{ color: 'var(--text-muted)' }}>Last Name</label>
                      <input type="text" placeholder="Smith" value={form.lastName}
                        onChange={e => handleChange('lastName', e.target.value)}
                        className={`${inputClass} ${errors.lastName ? 'border-red-400/70' : ''}`}
                        style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: errors.lastName ? '' : 'var(--border-color)' }} />
                      {errors.lastName && <p className="text-red-400 text-[0.65rem] mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" placeholder="jane@example.com" value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className={`${inputClass} ${errors.email ? 'border-red-400/70' : ''}`}
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: errors.email ? '' : 'var(--border-color)' }} />
                    {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                    <input type="tel" placeholder="+234 800 000 0000" value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className={`${inputClass} ${errors.phone ? 'border-red-400/70' : ''}`}
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: errors.phone ? '' : 'var(--border-color)' }} />
                    {errors.phone && <p className="text-red-400 text-[0.65rem] mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2 — Delivery */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="px-5 sm:px-8 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">2</span>
                  <span className="tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--text-primary)' }}>Delivery</span>
                </div>
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-4">
                  {errors.delivery && <p className="text-red-400 text-[0.65rem]">{errors.delivery}</p>}
                  {DELIVERY_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChange('delivery', option.id)}
                      className={`w-full flex items-center justify-between px-5 py-4 border transition-all text-left ${form.delivery === option.id ? 'border-[#e8530a] bg-[#e8530a]/5' : 'hover:border-[#e8530a]'}`}
                      style={ form.delivery !== option.id ? { borderColor: 'var(--border-color)' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.delivery === option.id ? 'border-[#e8530a]' : ''}`}
                          style={ form.delivery !== option.id ? { borderColor: 'var(--text-muted)' } : {}}>
                          {form.delivery === option.id && <div className="w-2 h-2 rounded-full bg-[#e8530a]" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</p>
                          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{option.sublabel}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium shrink-0 ml-4 ${option.fee === 0 ? 'text-green-400' : ''}`}
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: option.fee !== 0 ? 'var(--text-primary)' : '' }}>
                        {option.fee === 0 ? 'Free' : `+₦${option.fee.toLocaleString()}`}
                      </span>
                    </button>
                  ))}

                  {needsAddress && (
                    <div className="pt-2">
                      <label className={labelClass} style={{ color: 'var(--text-muted)' }}>Delivery Address</label>
                      <input
                        type="text"
                        placeholder="Enter your full delivery address"
                        value={form.address}
                        onChange={e => handleChange('address', e.target.value)}
                        className={`${inputClass} ${errors.address ? 'border-red-400/70' : ''}`}
                        style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: errors.address ? '' : 'var(--border-color)' }}
                      />
                      {errors.address && <p className="text-red-400 text-[0.65rem] mt-1">{errors.address}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — Payment */}
              <div className="px-5 sm:px-8 py-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 bg-[#e8530a] text-white text-xs flex items-center justify-center font-medium shrink-0">3</span>
                  <span className="tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--text-primary)' }}>Payment</span>
                </div>
                <p className="text-sm font-light mt-3 ml-9" style={{ color: 'var(--text-muted)' }}>
                  You'll be redirected to Paystack's secure payment page to complete your purchase. We accept cards, bank transfers, and USSD.
                </p>
                <div className="flex items-center gap-2 text-xs font-light mt-4 ml-9" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured by Paystack
                </div>
              </div>

              {errors.submit && <p className="text-red-400 text-xs px-1">{errors.submit}</p>}
            </div>

            <div className="space-y-2">
              <div className="sticky top-28" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="px-7 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="w-5 h-px bg-[#e8530a]" />
                  <span className="tracking-[0.15em]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--text-primary)' }}>Order Summary</span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{cart.reduce((a, i) => a + i.quantity, 0)} items</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-4 px-7 py-4">
                      <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <img src={item.image || item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="text-[0.6rem] tracking-[0.1em] uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.brand} · Size {item.selectedSize}</p>
                        <p className="text-[0.6rem] tracking-[0.1em] capitalize" style={{ color: 'var(--text-muted)' }}>{item.selectedColor} · Qty {item.quantity}</p>
                      </div>
                      <span className="shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-7 py-5 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span style={{ color: 'var(--text-primary)' }}>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Delivery</span>
                    {!form.delivery ? (
                      <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>Select option</span>
                    ) : deliveryFee === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      <span style={{ color: 'var(--text-primary)' }}>+₦{deliveryFee.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Total</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--text-primary)' }}>
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="px-7 pb-7 space-y-3">
                  {loading ? (
                    <div className="w-full py-4 flex items-center justify-center gap-2 text-sm tracking-[0.2em] uppercase" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      <span className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-muted)' }} />
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
                    <p className="text-[0.65rem] text-center tracking-wide" style={{ color: 'var(--text-muted)' }}>Fill in your details to proceed</p>
                  )}
                  <Link href="/productspage"
                    className="block text-center text-xs tracking-[0.15em] uppercase mt-2 transition-colors no-underline hover:text-[#e8530a]"
                    style={{ color: 'var(--text-muted)' }}>
                    ← Back to Shop
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
      <footer className="py-6 text-center" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Designed & developed by <a className="text-[#e8530a] font-medium" href='https://mercy-yakubu-frontend-developer.vercel.app/' target="_blank">Mercy Yakubu</a>
        </p>
      </footer>
    </>
  );
}