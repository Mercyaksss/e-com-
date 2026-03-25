'use client';

import { usePaystackPayment } from 'react-paystack';

export default function PaystackButton({ config, onSuccess, onClose, disabled, total }) {
  const initializePayment = usePaystackPayment(config);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => initializePayment({ onSuccess, onClose })}
      className={`w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all cursor-pointer ${disabled ? 'bg-[#2e2e2e] text-[#888] cursor-not-allowed' : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]'}`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}>
      Pay ₦{Number(total).toLocaleString()}
    </button>
  );
}