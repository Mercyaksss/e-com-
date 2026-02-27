'use client';

import { useState } from 'react';

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
  { id: 1, name: 'Air Max 270',        brand: 'Nike',        category: 'Running',    price: 180, stock: 24, image: '' },
  { id: 2, name: 'Ultra Boost 22',     brand: 'Adidas',      category: 'Running',    price: 190, stock: 12, image: '' },
  { id: 3, name: 'Air Jordan 1 Retro', brand: 'Jordan',      category: 'Basketball', price: 220, stock: 8,  image: '' },
  { id: 4, name: '990v5 Made in USA',  brand: 'New Balance', category: 'Lifestyle',  price: 185, stock: 30, image: '' },
  { id: 5, name: 'RS-X Reinvention',   brand: 'Puma',        category: 'Lifestyle',  price: 110, stock: 5,  image: '' },
];

const DUMMY_ORDERS = [
  {
    id: '#SOLE-A1B2C3', customer: 'James Thompson', email: 'james@email.com',
    phone: '+1 (555) 012-3456', items: 2, total: 370, status: 'Delivered', date: '2025-02-20',
    address: { line1: '24 Maple Street', line2: 'Apt 3B', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
    products: [
      { name: 'Air Max 270', brand: 'Nike', size: 10, color: 'white', qty: 1, price: 180 },
      { name: 'Ultra Boost 22', brand: 'Adidas', size: 10, color: 'black', qty: 1, price: 190 },
    ],
    payment: 'Visa ending 4242', notes: 'Please leave at door.',
  },
  {
    id: '#SOLE-D4E5F6', customer: 'Sofia Kim', email: 'sofia@email.com',
    phone: '+1 (555) 987-6543', items: 1, total: 185, status: 'Processing', date: '2025-02-22',
    address: { line1: '8 Oak Avenue', line2: '', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'United States' },
    products: [
      { name: '990v5 Made in USA', brand: 'New Balance', size: 8, color: 'grey', qty: 1, price: 185 },
    ],
    payment: 'Mastercard ending 1234', notes: '',
  },
  {
    id: '#SOLE-G7H8I9', customer: 'Marcus Reid', email: 'marcus@email.com',
    phone: '+44 7700 900123', items: 3, total: 590, status: 'Shipped', date: '2025-02-23',
    address: { line1: '15 King Street', line2: 'Floor 2', city: 'London', state: '', zip: 'EC2A 4BX', country: 'United Kingdom' },
    products: [
      { name: 'Air Jordan 1 Retro', brand: 'Jordan', size: 11, color: 'black', qty: 1, price: 220 },
      { name: 'Air Max 270', brand: 'Nike', size: 11, color: 'red', qty: 1, price: 180 },
      { name: 'RS-X Reinvention', brand: 'Puma', size: 11, color: 'white', qty: 1, price: 110 },
    ],
    payment: 'PayPal', notes: 'Gift — please no invoice in box.',
  },
  {
    id: '#SOLE-J1K2L3', customer: 'Amara Osei', email: 'amara@email.com',
    phone: '+233 24 000 1234', items: 1, total: 220, status: 'Pending', date: '2025-02-24',
    address: { line1: '3 Independence Ave', line2: '', city: 'Accra', state: 'Greater Accra', zip: 'GA-123', country: 'Ghana' },
    products: [
      { name: 'Air Jordan 1 Retro', brand: 'Jordan', size: 9, color: 'white', qty: 1, price: 220 },
    ],
    payment: 'Visa ending 5678', notes: '',
  },
  {
    id: '#SOLE-M4N5O6', customer: 'Lena Muller', email: 'lena@email.com',
    phone: '+49 151 12345678', items: 2, total: 300, status: 'Cancelled', date: '2025-02-24',
    address: { line1: 'Unter den Linden 5', line2: '', city: 'Berlin', state: '', zip: '10117', country: 'Germany' },
    products: [
      { name: 'Classic Leather', brand: 'Reebok', size: 7, color: 'white', qty: 2, price: 150 },
    ],
    payment: 'Mastercard ending 9999', notes: 'Cancelled by customer.',
  },
];

const ADMIN_CREDENTIALS = { username: 'admin', password: 'sole2025' };

const STATUS_STYLES = {
  Delivered:  'border-green-500/50 text-green-400',
  Shipped:    'border-blue-500/50 text-blue-400',
  Processing: 'border-yellow-500/50 text-yellow-400',
  Pending:    'border-[#e8530a]/50 text-[#e8530a]',
  Cancelled:  'border-red-500/50 text-red-400',
};

const inputClass = "w-full bg-[#0a0a0a] text-[#f5f0eb] px-4 py-3 text-sm border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none transition-colors placeholder:text-[#444]";
const labelClass = "block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-2";
const emptyProduct = { name: '', brand: '', category: '', price: '', stock: '', image: '' };

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (form.username === ADMIN_CREDENTIALS.username && form.password === ADMIN_CREDENTIALS.password) {
        onLogin();
      } else {
        setError('Invalid username or password.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', letterSpacing: '0.1em' }}>
            SOLE<span className="text-[#e8530a]">.</span>
          </span>
          <p className="text-[0.65rem] tracking-[0.35em] uppercase text-[#888] mt-1">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#1a1a1a]">
          <div className="h-0.5 bg-[#e8530a]" />
          <div className="px-8 py-10 space-y-5">
            <div>
              <label className={labelClass}>Username</label>
              <input type="text" placeholder="admin" value={form.username}
                onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setError(''); }}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                className={inputClass} />
            </div>
            {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}
            <button type="submit" disabled={loading}
              className={"w-full py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all cursor-pointer mt-2 " + (loading ? 'bg-[#2e2e2e] text-[#888]' : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]')}
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-[#888] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-center text-[#444] text-xs mt-6 font-light">Default: admin / sole2025</p>
      </div>
    </div>
  );
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || emptyProduct);
  const [errors, setErrors] = useState({});
  const isEdit = !!product?.id;

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Required';
    if (!form.brand.trim())    e.brand    = 'Required';
    if (!form.category.trim()) e.category = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)  e.stock = 'Valid stock required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock), id: product?.id || Date.now() });
  };

  const Field = ({ name, label, placeholder, type = 'text' }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]}
        onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
        className={inputClass + (errors[name] ? ' border-red-400/70' : '')} />
      {errors[name] && <p className="text-red-400 text-[0.65rem] mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-[#e8530a]" />
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </span>
          <button onClick={onClose} className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">x</button>
        </div>
        <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-5">
          <Field name="name"     label="Product Name"          placeholder="Air Max 270" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field name="brand"    label="Brand"    placeholder="Nike" />
            <Field name="category" label="Category" placeholder="Running" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field name="price" label="Price ($)" placeholder="180" type="number" />
            <Field name="stock" label="Stock"     placeholder="24"  type="number" />
          </div>
          <Field name="image" label="Image URL (optional)" placeholder="https://..." />
        </div>
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
          <button onClick={handleSave}
            className="flex-1 bg-[#e8530a] text-white py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button onClick={onClose}
            className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-sm text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-red-500" />
        <div className="px-8 py-10">
          <span className="text-4xl mb-4 block select-none">🗑️</span>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#f5f0eb', letterSpacing: '0.1em' }}>
            Delete Product?
          </h3>
          <p className="text-[#888] text-sm font-light mt-2 mb-8">
            Are you sure you want to delete <span className="text-[#f5f0eb]">{name}</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
            <button onClick={onClose} className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-[#e8530a]" />

        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
              Order Details
            </span>
            <p className="text-[#e8530a] text-xs tracking-[0.15em] mt-0.5">{order.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={"text-[0.65rem] tracking-[0.1em] uppercase border px-2.5 py-1 " + (STATUS_STYLES[order.status] || 'border-[#2e2e2e] text-[#888]')}>
              {order.status}
            </span>
            <button onClick={onClose} className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">x</button>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-6">

          {/* Customer Info */}
          <div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#e8530a] mb-4">Customer Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Full Name',  value: order.customer },
                { label: 'Email',      value: order.email },
                { label: 'Phone',      value: order.phone },
                { label: 'Order Date', value: order.date },
              ].map(d => (
                <div key={d.label} className="bg-[#0a0a0a] px-4 py-3">
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">{d.label}</p>
                  <p className="text-[#f5f0eb] text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#e8530a] mb-4">Delivery Address</p>
            <div className="bg-[#0a0a0a] px-4 py-4">
              <p className="text-[#f5f0eb] text-sm leading-relaxed">
                {order.address.line1}
                {order.address.line2 && <><br />{order.address.line2}</>}
                <br />{order.address.city}{order.address.state ? ', ' + order.address.state : ''} {order.address.zip}
                <br />{order.address.country}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#e8530a] mb-4">Items Ordered</p>
            <div className="space-y-2">
              {order.products.map((p, i) => (
                <div key={i} className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[#f5f0eb] text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[#888] text-xs mt-0.5">
                      {p.brand} &middot; Size {p.size} &middot; {p.color} &middot; Qty {p.qty}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb', whiteSpace: 'nowrap' }}>
                    ${(p.price * p.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#2e2e2e] mt-1">
                <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888]">Order Total</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#f5f0eb' }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment + Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] px-4 py-3">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">Payment Method</p>
              <p className="text-[#f5f0eb] text-sm">{order.payment}</p>
            </div>
            <div className="bg-[#0a0a0a] px-4 py-3">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">Order Notes</p>
              <p className="text-[#f5f0eb] text-sm">{order.notes || 'None'}</p>
            </div>
          </div>

        </div>

        <div className="px-6 sm:px-8 pb-6">
          <button onClick={onClose}
            className="w-full border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [productModal, setProductModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderStatusEdit, setOrderStatusEdit] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveProduct = (data) => {
    if (products.find(p => p.id === data.id)) {
      setProducts(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      setProducts(prev => [data, ...prev]);
    }
    setProductModal(null);
  };

  const handleDeleteProduct = () => {
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleStatusChange = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setOrderStatusEdit(null);
  };

  const stats = [
    { label: 'Total Products', value: products.length, sub: products.filter(p => p.stock <= 5).length + ' low stock' },
    { label: 'Total Orders',   value: orders.length,   sub: orders.filter(o => o.status === 'Pending').length + ' pending' },
    { label: 'Revenue',        value: '$' + orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0).toLocaleString(), sub: 'excl. cancelled' },
    { label: 'Avg Order',      value: '$' + Math.round(orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0) / orders.filter(o => o.status !== 'Cancelled').length), sub: 'per order' },
  ];

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-[#1a1a1a] flex items-center justify-between">
        <div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
            SOLE<span style={{ color: '#e8530a' }}>.</span>
          </span>
          <p className="text-[0.55rem] tracking-[0.3em] uppercase text-[#888] mt-0.5">Admin Portal</p>
        </div>
        {/* Close button — mobile only */}
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer text-lg">x</button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {[
          { id: 'products', label: 'Products', icon: '👟' },
          { id: 'orders',   label: 'Orders',   icon: '📦' },
        ].map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); setSidebarOpen(false); }}
            className={"w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase transition-all cursor-pointer text-left " + (activeTab === tab.id ? 'bg-[#e8530a]/10 text-[#e8530a] border-l-2 border-[#e8530a]' : 'text-[#888] hover:text-[#f5f0eb] hover:bg-white/[0.03] border-l-2 border-transparent')}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-[#1a1a1a]">
        <button onClick={() => setLoggedIn(false)}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer">
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease forwards; }
        @keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .slide-in-left { animation: slide-in-left 0.25s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* SIDEBAR — desktop fixed, mobile overlay */}
        {/* Desktop */}
        <aside className="hidden lg:flex w-56 bg-[#111] border-r border-[#1a1a1a] fixed top-0 left-0 h-full flex-col z-40 shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setSidebarOpen(false)} />
            <aside className="lg:hidden slide-in-left fixed top-0 left-0 h-full w-56 bg-[#111] border-r border-[#1a1a1a] flex flex-col z-50">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* MAIN */}
        <div className="lg:ml-56 flex-1 flex flex-col min-h-screen">

          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1a1a1a] px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1 shrink-0">
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                </button>
                <div>
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
                    {activeTab === 'products' ? 'Products' : 'Orders'}
                  </h1>
                  <p className="text-[#888] text-xs font-light hidden sm:block">
                    {activeTab === 'products' ? products.length + ' products' : orders.length + ' orders'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#111] text-[#f5f0eb] text-sm border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none px-3 py-2 w-32 sm:w-44 lg:w-52 placeholder:text-[#444] transition-colors"
                />
                {activeTab === 'products' && (
                  <button onClick={() => setProductModal('add')}
                    className="bg-[#e8530a] text-white px-3 sm:px-5 py-2 text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer whitespace-nowrap"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                    + Add
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 fade-up">

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {stats.map(s => (
                <div key={s.label} className="bg-[#111] border border-[#1a1a1a] px-4 sm:px-6 py-4 sm:py-5">
                  <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#888] mb-2">{s.label}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#f5f0eb', letterSpacing: '0.05em' }}>
                    {s.value}
                  </p>
                  <p className="text-[#888] text-[0.65rem] mt-1 font-light">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-[#111] border border-[#1a1a1a] overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 sm:px-6 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-16 text-[#888] text-sm font-light">No products found.</td></tr>
                    ) : filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center text-lg shrink-0 overflow-hidden">
                              {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : '👟'}
                            </div>
                            <span className="text-[#f5f0eb] font-medium text-xs sm:text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[#888] text-xs sm:text-sm">{p.brand}</td>
                        <td className="px-4 sm:px-6 py-4 text-[#888] text-xs sm:text-sm">{p.category}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>${p.price}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={"text-sm font-medium " + (p.stock <= 5 ? 'text-red-400' : p.stock <= 15 ? 'text-yellow-400' : 'text-green-400')}>
                            {p.stock} {p.stock <= 5 && <span className="text-[0.6rem] tracking-widest uppercase ml-1">Low</span>}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setProductModal(p)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Edit</button>
                            <span className="text-[#2e2e2e]">|</span>
                            <button onClick={() => setDeleteTarget(p)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-[#111] border border-[#1a1a1a] overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 sm:px-6 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-[#888] text-sm font-light">No orders found.</td></tr>
                    ) : filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setOrderDetail(o)}>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="text-[#e8530a] font-medium text-xs tracking-wide">{o.id}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <p className="text-[#f5f0eb] font-medium text-xs sm:text-sm">{o.customer}</p>
                          <p className="text-[#888] text-xs hidden sm:block">{o.email}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[#888] text-xs sm:text-sm">{o.items}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>${o.total}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[#888] text-xs">{o.date}</td>
                        <td className="px-4 sm:px-6 py-4" onClick={e => e.stopPropagation()}>
                          {orderStatusEdit === o.id ? (
                            <select defaultValue={o.status}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                              onBlur={() => setOrderStatusEdit(null)}
                              autoFocus
                              className="bg-[#0a0a0a] text-[#f5f0eb] text-xs border border-[#e8530a] px-2 py-1 focus:outline-none cursor-pointer">
                              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={"text-[0.65rem] tracking-[0.1em] uppercase border px-2.5 py-1 " + (STATUS_STYLES[o.status] || 'border-[#2e2e2e] text-[#888]')}>
                              {o.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setOrderDetail(o)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">View</button>
                            <span className="text-[#2e2e2e]">|</span>
                            <button onClick={() => setOrderStatusEdit(o.id)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Update</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MODALS */}
      {productModal && (
        <ProductModal
          product={productModal === 'add' ? null : productModal}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDeleteProduct}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {orderDetail && (
        <OrderDetailModal
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
        />
      )}
    </>
  );
}