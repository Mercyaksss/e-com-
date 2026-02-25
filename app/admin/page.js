'use client';

import { useState } from 'react';

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
  { id: 1, name: 'Air Max 270', brand: 'Nike', category: 'Running', price: 180, stock: 24, image: '' },
  { id: 2, name: 'Ultra Boost 22', brand: 'Adidas', category: 'Running', price: 190, stock: 12, image: '' },
  { id: 3, name: 'Air Jordan 1 Retro', brand: 'Jordan', category: 'Basketball', price: 220, stock: 8, image: '' },
  { id: 4, name: '990v5 Made in USA', brand: 'New Balance', category: 'Lifestyle', price: 185, stock: 30, image: '' },
  { id: 5, name: 'RS-X Reinvention', brand: 'Puma', category: 'Lifestyle', price: 110, stock: 5, image: '' },
];

const DUMMY_ORDERS = [
  { id: '#SOLE-A1B2C3', customer: 'James Thompson', email: 'james@email.com', items: 2, total: 370, status: 'Delivered', date: '2025-02-20' },
  { id: '#SOLE-D4E5F6', customer: 'Sofia Kim', email: 'sofia@email.com', items: 1, total: 185, status: 'Processing', date: '2025-02-22' },
  { id: '#SOLE-G7H8I9', customer: 'Marcus Reid', email: 'marcus@email.com', items: 3, total: 590, status: 'Shipped', date: '2025-02-23' },
  { id: '#SOLE-J1K2L3', customer: 'Amara Osei', email: 'amara@email.com', items: 1, total: 220, status: 'Pending', date: '2025-02-24' },
  { id: '#SOLE-M4N5O6', customer: 'Lena Müller', email: 'lena@email.com', items: 2, total: 300, status: 'Cancelled', date: '2025-02-24' },
];

const ADMIN_CREDENTIALS = { username: 'admin', password: 'sole2025' };

const STATUS_STYLES = {
  Delivered:  'border-green-500/50 text-green-400',
  Shipped:    'border-blue-500/50 text-blue-400',
  Processing: 'border-yellow-500/50 text-yellow-400',
  Pending:    'border-[#e8530a]/50 text-[#e8530a]',
  Cancelled:  'border-red-500/50 text-red-400',
};

const inputClass = `w-full bg-[#0a0a0a] text-[#f5f0eb] px-4 py-3 text-sm border border-[#2e2e2e]
  focus:border-[#e8530a] focus:outline-none transition-colors placeholder:text-[#444]`;
const labelClass = `block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-2`;

// ─── EMPTY PRODUCT FORM ───────────────────────────────────────────────────────
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
        {/* Logo */}
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
              <input
                type="text" placeholder="admin"
                value={form.username}
                onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setError(''); }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                className={inputClass}
              />
            </div>
            {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all cursor-pointer mt-2
                ${loading ? 'bg-[#2e2e2e] text-[#888]' : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]'}`}
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

// ─── PRODUCT FORM MODAL ───────────────────────────────────────────────────────
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
      <input
        type={type} placeholder={placeholder}
        value={form[name]}
        onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
        className={`${inputClass} ${errors[name] ? 'border-red-400/70' : ''}`}
      />
      {errors[name] && <p className="text-red-400 text-[0.65rem] mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-[#e8530a]" />
        <div className="px-8 py-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </span>
          <button onClick={onClose} className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">✕</button>
        </div>
        <div className="px-8 py-8 space-y-5">
          <Field name="name"     label="Product Name" placeholder="Air Max 270" />
          <div className="flex gap-4">
            <Field name="brand"    label="Brand"    placeholder="Nike" />
            <Field name="category" label="Category" placeholder="Running" />
          </div>
          <div className="flex gap-4">
            <Field name="price" label="Price ($)" placeholder="180" type="number" />
            <Field name="stock" label="Stock"     placeholder="24"  type="number" />
          </div>
          <Field name="image" label="Image URL (optional)" placeholder="https://..." />
        </div>
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#e8530a] text-white py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          >
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer"
          >
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
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
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 text-xs tracking-[0.2em] uppercase hover:bg-red-600 transition-colors cursor-pointer">
              Delete
            </button>
            <button onClick={onClose} className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
              Cancel
            </button>
          </div>
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
  const [productModal, setProductModal] = useState(null); // null | 'add' | product obj
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderStatusEdit, setOrderStatusEdit] = useState(null);
  const [search, setSearch] = useState('');

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
    { label: 'Total Products', value: products.length, sub: `${products.filter(p => p.stock <= 5).length} low stock` },
    { label: 'Total Orders',   value: orders.length,   sub: `${orders.filter(o => o.status === 'Pending').length} pending` },
    { label: 'Revenue',        value: `$${orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0).toLocaleString()}`, sub: 'excl. cancelled' },
    { label: 'Avg Order',      value: `$${Math.round(orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0) / orders.filter(o => o.status !== 'Cancelled').length)}`, sub: 'per order' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* SIDEBAR */}
        <aside className="w-56 bg-[#111] border-r border-[#1a1a1a] fixed top-0 left-0 h-full flex flex-col z-40 shrink-0">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-[#1a1a1a]">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
              SOLE<span style={{ color: '#e8530a' }}>.</span>
            </span>
            <p className="text-[0.55rem] tracking-[0.3em] uppercase text-[#888] mt-0.5">Admin Portal</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {[
              { id: 'products', label: 'Products', icon: '👟' },
              { id: 'orders',   label: 'Orders',   icon: '📦' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase transition-all cursor-pointer text-left
                  ${activeTab === tab.id
                    ? 'bg-[#e8530a]/10 text-[#e8530a] border-l-2 border-[#e8530a]'
                    : 'text-[#888] hover:text-[#f5f0eb] hover:bg-white/[0.03] border-l-2 border-transparent'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-[#1a1a1a]">
            <button
              onClick={() => setLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer"
            >
              <span>⎋</span> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="ml-56 flex-1 flex flex-col min-h-screen">

          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1a1a1a] px-10 py-4 flex items-center justify-between">
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
                {activeTab === 'products' ? 'Manage Products' : 'Manage Orders'}
              </h1>
              <p className="text-[#888] text-xs font-light">
                {activeTab === 'products' ? `${products.length} products` : `${orders.length} orders`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder={activeTab === 'products' ? 'Search products...' : 'Search orders...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#111] text-[#f5f0eb] text-sm border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none px-4 py-2 w-52 placeholder:text-[#444] transition-colors"
              />
              {activeTab === 'products' && (
                <button
                  onClick={() => setProductModal('add')}
                  className="bg-[#e8530a] text-white px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  + Add Product
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 px-10 py-8 space-y-6 fade-up">

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {stats.map(s => (
                <div key={s.label} className="bg-[#111] border border-[#1a1a1a] px-6 py-5">
                  <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#888] mb-2">{s.label}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#f5f0eb', letterSpacing: '0.05em' }}>
                    {s.value}
                  </p>
                  <p className="text-[#888] text-[0.65rem] mt-1 font-light">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-[#111] border border-[#1a1a1a] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-16 text-[#888] text-sm font-light">No products found.</td></tr>
                    ) : filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center text-lg shrink-0 overflow-hidden">
                              {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : '👟'}
                            </div>
                            <span className="text-[#f5f0eb] font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#888]">{p.brand}</td>
                        <td className="px-6 py-4 text-[#888]">{p.category}</td>
                        <td className="px-6 py-4">
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>
                            ${p.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-red-400' : p.stock <= 15 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {p.stock} {p.stock <= 5 && <span className="text-[0.6rem] tracking-widest uppercase ml-1">Low</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setProductModal(p)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-[#2e2e2e]">|</span>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
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
              <div className="bg-[#111] border border-[#1a1a1a] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-[#888] text-sm font-light">No orders found.</td></tr>
                    ) : filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-[#e8530a] font-medium text-xs tracking-wide">{o.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#f5f0eb] font-medium">{o.customer}</p>
                          <p className="text-[#888] text-xs">{o.email}</p>
                        </td>
                        <td className="px-6 py-4 text-[#888]">{o.items} item{o.items > 1 ? 's' : ''}</td>
                        <td className="px-6 py-4">
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>
                            ${o.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#888] text-xs">{o.date}</td>
                        <td className="px-6 py-4">
                          {orderStatusEdit === o.id ? (
                            <select
                              defaultValue={o.status}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                              onBlur={() => setOrderStatusEdit(null)}
                              autoFocus
                              className="bg-[#0a0a0a] text-[#f5f0eb] text-xs border border-[#e8530a] px-2 py-1 focus:outline-none cursor-pointer"
                            >
                              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-[0.65rem] tracking-[0.1em] uppercase border px-2.5 py-1 ${STATUS_STYLES[o.status] || 'border-[#2e2e2e] text-[#888]'}`}>
                              {o.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setOrderStatusEdit(o.id)}
                            className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            Update
                          </button>
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
    </>
  );
}