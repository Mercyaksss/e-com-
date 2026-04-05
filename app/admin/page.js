'use client';

import { useState, useEffect } from 'react';

const ADMIN_CREDENTIALS = { username: 'admin', password: 'sole2025' };

const STATUS_STYLES = {
  Delivered:  'border-green-500/50 text-green-400',
  Shipped:    'border-blue-500/50 text-blue-400',
  Processing: 'border-yellow-500/50 text-yellow-400',
  Pending:    'border-[#e8530a]/50 text-[#e8530a]',
  Cancelled:  'border-red-500/50 text-red-400',
};

const STATUS_DOT = {
  Delivered:  'bg-green-400',
  Shipped:    'bg-blue-400',
  Processing: 'bg-yellow-400',
  Pending:    'bg-[#e8530a]',
  Cancelled:  'bg-red-400',
};

const inputClass = "w-full bg-[#0a0a0a] text-[#f5f0eb] px-4 py-3 text-sm border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none transition-colors placeholder:text-[#444]";
const labelClass = "block text-[0.65rem] tracking-[0.25em] uppercase text-[#888] mb-2";

const emptyProduct = {
  name: '', brand: '', category: '', price: '', description: '',
  badge: '', images: '', variants: [{ color: '', sizes: [{ size: '', stock: '' }] }],
};

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
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
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
  const isEdit = !!product?._id;

  const toForm = (p) => {
    if (!p) return emptyProduct;
    return {
      name: p.name || '',
      brand: p.brand || '',
      category: Array.isArray(p.category) ? p.category.join(', ') : (p.category || ''),
      price: p.price || '',
      description: p.description || '',
      badge: p.badge || '',
      images: Array.isArray(p.images) ? p.images.join('\n') : (p.images || ''),
      variants: p.variants?.length > 0 ? p.variants.map(v => ({
        color: v.color,
        sizes: v.sizes.map(s => ({ size: s.size, stock: s.stock }))
      })) : [{ color: '', sizes: [{ size: '', stock: '' }] }],
    };
  };

  const [form, setForm] = useState(() => toForm(product));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { color: '', sizes: [{ size: '', stock: '' }] }] }));
  const removeVariant = (vi) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== vi) }));
  const updateVariantColor = (vi, color) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === vi ? { ...v, color } : v) }));
  const addSize = (vi) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === vi ? { ...v, sizes: [...v.sizes, { size: '', stock: '' }] } : v) }));
  const removeSize = (vi, si) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === vi ? { ...v, sizes: v.sizes.filter((_, j) => j !== si) } : v) }));
  const updateSize = (vi, si, field, value) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === vi ? { ...v, sizes: v.sizes.map((s, j) => j === si ? { ...s, [field]: value } : s) } : v) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (form.variants.length === 0) e.variants = 'At least one variant required';
    form.variants.forEach((v, i) => {
      if (!v.color.trim()) e['variant_color_' + i] = 'Color required';
      v.sizes.forEach((s, j) => {
        if (!s.size) e['variant_size_' + i + '_' + j] = 'Size required';
        if (s.stock === '' || isNaN(s.stock)) e['variant_stock_' + i + '_' + j] = 'Stock required';
      });
    });
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      category: form.category.split(',').map(c => c.trim()).filter(Boolean),
      description: form.description.trim(),
      badge: form.badge.trim() || null,
      images: form.images.split('\n').map(u => u.trim()).filter(Boolean),
      variants: form.variants.map(v => ({
        color: v.color.trim(),
        sizes: v.sizes.map(s => ({ size: Number(s.size), stock: Number(s.stock) })),
      })),
    };

    try {
      const url = isEdit ? '/api/products/' + product._id : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      onSave(data);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-[#e8530a]" />
        <div className="px-6 sm:px-8 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </span>
          <button onClick={onClose} className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer text-lg leading-none">✕</button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-5">
          {/* Basic fields */}
          <div>
            <label className={labelClass}>Product Name *</label>
            <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
              placeholder="Air Max 270" className={inputClass + (errors.name ? ' border-red-400/70' : '')} />
            {errors.name && <p className="text-red-400 text-[0.65rem] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Brand</label>
              <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Nike" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price ($) *</label>
              <input type="number" value={form.price} onChange={e => { setForm(f => ({ ...f, price: e.target.value })); setErrors(p => ({ ...p, price: '' })); }}
                placeholder="180" className={inputClass + (errors.price ? ' border-red-400/70' : '')} />
              {errors.price && <p className="text-red-400 text-[0.65rem] mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category (comma separated)</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Lifestyle, Running" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Badge (optional)</label>
              <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                placeholder="New, Hot, Sale..." className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Product description..." rows={3}
              className={inputClass + " resize-none"} />
          </div>

          <div>
            <label className={labelClass}>Images</label>
            <div className="space-y-3">
              {/* Image previews */}
              {form.images && form.images.split('\n').filter(Boolean).map((url, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2e2e2e] p-2">
                  <img src={url} alt="Product" className="w-16 h-16 object-cover shrink-0" />
                  <span className="text-[#888] text-xs truncate flex-1">{url}</span>
                  <button onClick={() => {
                    const urls = form.images.split('\n').filter(Boolean);
                    urls.splice(i, 1);
                    setForm(f => ({ ...f, images: urls.join('\n') }));
                  }} className="text-[#888] hover:text-red-400 transition-colors cursor-pointer shrink-0">✕</button>
                </div>
              ))}

              {/* Upload button */}
              <div className="relative">
                <input
                  type="file" accept="image/*" multiple id="image-upload"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    setUploading(true);
                    try {
                      const urls = await Promise.all(files.map(async (file) => {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);
                        return data.url;
                      }));
                      setForm(f => ({
                        ...f,
                        images: [...f.images.split('\n').filter(Boolean), ...urls].join('\n')
                      }));
                    } catch (err) {
                      setErrors(p => ({ ...p, submit: 'Image upload failed: ' + err.message }));
                    } finally {
                      setUploading(false);
                      e.target.value = '';
                    }
                  }}
                />
                <div className={"w-full border border-dashed border-[#2e2e2e] px-4 py-6 text-center transition-colors " + (uploading ? 'border-[#e8530a]/50' : 'hover:border-[#e8530a]/50')}>
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2 text-[#888] text-sm">
                      <span className="w-4 h-4 border border-[#888] border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="text-[#888] text-sm">Click to upload images</span>
                  )}
                </div>
              </div>

              {/* Manual URL input as fallback */}
              <textarea value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                placeholder={"Or paste image URLs here (one per line)..."} rows={2}
                className={inputClass + " resize-none text-xs"} />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass + " mb-0"}>Variants (Color + Sizes) *</label>
              <button onClick={addVariant} className="text-[0.65rem] tracking-[0.15em] uppercase text-[#e8530a] hover:text-[#ff6b2b] cursor-pointer transition-colors">
                + Add Color
              </button>
            </div>
            {errors.variants && <p className="text-red-400 text-[0.65rem] mb-2">{errors.variants}</p>}

            <div className="space-y-4">
              {form.variants.map((variant, vi) => (
                <div key={vi} className="bg-[#0a0a0a] border border-[#2e2e2e] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <input value={variant.color}
                        onChange={e => { updateVariantColor(vi, e.target.value); setErrors(p => ({ ...p, ['variant_color_' + vi]: '' })); }}
                        placeholder="Color name (e.g. Black)"
                        className={inputClass + (errors['variant_color_' + vi] ? ' border-red-400/70' : '')} />
                      {errors['variant_color_' + vi] && <p className="text-red-400 text-[0.65rem] mt-1">{errors['variant_color_' + vi]}</p>}
                    </div>
                    {form.variants.length > 1 && (
                      <button onClick={() => removeVariant(vi)} className="text-[#888] hover:text-red-400 transition-colors cursor-pointer text-sm shrink-0">✕</button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2 text-[0.6rem] tracking-[0.15em] uppercase text-[#888] px-1">
                      <span className="col-span-2">Size (US)</span>
                      <span className="col-span-2">Stock</span>
                      <span></span>
                    </div>
                    {variant.sizes.map((sizeEntry, si) => (
                      <div key={si} className="grid grid-cols-5 gap-2 items-center">
                        <input type="number" value={sizeEntry.size}
                          onChange={e => { updateSize(vi, si, 'size', e.target.value); setErrors(p => ({ ...p, ['variant_size_' + vi + '_' + si]: '' })); }}
                          placeholder="9" className={inputClass + " col-span-2 " + (errors['variant_size_' + vi + '_' + si] ? 'border-red-400/70' : '')} />
                        <input type="number" value={sizeEntry.stock}
                          onChange={e => { updateSize(vi, si, 'stock', e.target.value); setErrors(p => ({ ...p, ['variant_stock_' + vi + '_' + si]: '' })); }}
                          placeholder="5" className={inputClass + " col-span-2 " + (errors['variant_stock_' + vi + '_' + si] ? 'border-red-400/70' : '')} />
                        {variant.sizes.length > 1 ? (
                          <button onClick={() => removeSize(vi, si)} className="text-[#888] hover:text-red-400 transition-colors cursor-pointer text-sm text-center">✕</button>
                        ) : <span />}
                      </div>
                    ))}
                    <button onClick={() => addSize(vi)} className="text-[0.65rem] tracking-[0.15em] uppercase text-[#888] hover:text-[#f5f0eb] cursor-pointer transition-colors mt-1">
                      + Add Size
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errors.submit && <p className="text-red-400 text-xs">{errors.submit}</p>}
        </div>

        <div className="px-6 sm:px-8 pb-6 flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className={"flex-1 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer " + (saving ? 'bg-[#2e2e2e] text-[#888]' : 'bg-[#e8530a] text-white hover:bg-[#ff6b2b]')}
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button onClick={onClose} className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
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
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#f5f0eb', letterSpacing: '0.1em' }}>Delete Product?</h3>
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
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html><html><head><title>Invoice ${order.orderId}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; color:#111; padding:48px; font-size:13px; line-height:1.5; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #111; }
        .logo { font-size:2.5rem; font-weight:900; letter-spacing:0.05em; }
        .logo span { color:#e8530a; }
        .header-right { text-align:right; }
        .header-right h2 { font-size:1.1rem; font-weight:600; margin-bottom:4px; }
        .header-right p { color:#666; font-size:0.8rem; }
        .section { margin-bottom:28px; }
        .section-title { font-size:0.65rem; letter-spacing:0.25em; text-transform:uppercase; color:#e8530a; margin-bottom:12px; font-weight:600; }
        .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .info-box { background:#f9f9f9; padding:12px 16px; }
        .info-box .label { font-size:0.6rem; text-transform:uppercase; letter-spacing:0.2em; color:#999; margin-bottom:3px; }
        .info-box .value { font-size:0.85rem; font-weight:500; color:#111; }
        table { width:100%; border-collapse:collapse; }
        thead tr { border-bottom:1px solid #ddd; }
        th { text-align:left; padding:8px 12px; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.15em; color:#999; font-weight:500; }
        td { padding:10px 12px; border-bottom:1px solid #f0f0f0; font-size:0.85rem; }
        .total-row td { border-top:2px solid #111; border-bottom:none; font-weight:700; font-size:1rem; padding-top:14px; }
        .footer { margin-top:48px; padding-top:20px; border-top:1px solid #eee; display:flex; justify-content:space-between; color:#aaa; font-size:0.75rem; }
      </style></head><body>
        <div class="header">
          <div class="logo">SOLE<span>.</span></div>
          <div class="header-right">
            <h2>Invoice / Order Receipt</h2>
            <p>${order.orderId}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="grid-2">
            <div class="info-box"><div class="label">Full Name</div><div class="value">${order.customer?.firstName} ${order.customer?.lastName}</div></div>
            <div class="info-box"><div class="label">Email</div><div class="value">${order.customer?.email}</div></div>
            <div class="info-box"><div class="label">Phone</div><div class="value">${order.customer?.phone || '—'}</div></div>
            <div class="info-box"><div class="label">Payment</div><div class="value">${order.paymentMethod || '—'}</div></div>
            <div class="info-box"><div class="label">Delivery Option</div><div class="value">${order.deliveryOption || 'Store Pickup'}</div></div>
            <div class="info-box"><div class="label">Delivery Address</div><div class="value">${order.customer?.address || 'Store Pickup'}</div></div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Items Ordered</div>
          <table>
            <thead><tr><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th style="text-align:right">Price</th></tr></thead>
            <tbody>
              ${(order.items || []).map(p => `
                <tr>
                  <td><strong>${p.name}</strong><br><span style="color:#999;font-size:0.8rem">${p.brand || ''}</span></td>
                  <td>US ${p.selectedSize}</td>
                  <td style="text-transform:capitalize">${p.selectedColor}</td>
                  <td>${p.quantity}</td>
                  <td style="text-align:right">₦${(p.price * p.quantity).toFixed(2)}</td>
                </tr>`).join('')}
              <tr class="total-row">
                <td colspan="4">Order Total</td>
                <td style="text-align:right">₦${order.total?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="footer"><span>SOLE. — Premium Footwear</span><span>Printed ${new Date().toLocaleDateString()}</span></div>
      </body></html>`;
    const win = window.open('', '_blank', 'width=800,height=900');
    win.document.write(printContent);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '—';
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="h-0.5 bg-[#e8530a]" />
        <div className="px-6 sm:px-8 py-5 border-b border-[#1a1a1a] flex items-center justify-between gap-4">
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>Order Details</span>
            <p className="text-[#e8530a] text-xs tracking-[0.15em] mt-0.5">{order.orderId}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={"text-[0.65rem] tracking-[0.1em] uppercase border px-2.5 py-1 " + (STATUS_STYLES[order.status] || 'border-[#2e2e2e] text-[#888]')}>{order.status}</span>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 text-xs tracking-[0.1em] uppercase border border-[#2e2e2e] text-[#888] hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
              🖨 Print
            </button>
            <button onClick={onClose} className="text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer text-lg leading-none">✕</button>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-6">
          <div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#e8530a] mb-4">Customer Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Full Name',        value: customerName },
                { label: 'Email',            value: order.customer?.email },
                { label: 'Phone',            value: order.customer?.phone || '—' },
                { label: 'Order Date',       value: orderDate },
                { label: 'Delivery Option',  value: order.deliveryOption || 'Store Pickup' },
                { label: 'Delivery Address', value: order.customer?.address || 'Store Pickup' },
              ].map(d => (
                <div key={d.label} className="bg-[#0a0a0a] px-4 py-3">
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">{d.label}</p>
                  <p className="text-[#f5f0eb] text-sm break-all">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#e8530a] mb-4">Items Ordered</p>
            <div className="space-y-2">
              {(order.items || []).map((p, i) => (
                <div key={i} className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[#f5f0eb] text-sm font-medium">{p.name}</p>
                    <p className="text-[#888] text-xs mt-0.5">
                      {p.brand} · Size {p.selectedSize} · {p.selectedColor} · Qty {p.quantity}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb', whiteSpace: 'nowrap' }}>
                    ₦{(p.price * p.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#2e2e2e]">
                <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888]">Delivery Fee</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>
                  {order.deliveryFee ? `₦${order.deliveryFee.toLocaleString()}` : 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#2e2e2e]">
                <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#888]">Order Total</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#f5f0eb' }}>
                  ₦{order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] px-4 py-3">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">Payment Method</p>
              <p className="text-[#f5f0eb] text-sm">{order.paymentMethod || '—'}</p>
            </div>
            <div className="bg-[#0a0a0a] px-4 py-3">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">Payment Status</p>
              <p className="text-[#f5f0eb] text-sm">{order.paymentStatus || '—'}</p>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-6 flex gap-3">
          <button onClick={handlePrint}
            className="flex-1 bg-[#e8530a] text-white py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
            Print Invoice
          </button>
          <button onClick={onClose} className="flex-1 border border-[#2e2e2e] text-[#888] py-3 text-xs tracking-[0.2em] uppercase hover:border-[#f5f0eb] hover:text-[#f5f0eb] transition-all cursor-pointer">
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
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [productModal, setProductModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderStatusEdit, setOrderStatusEdit] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoadingProducts(false));
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoadingOrders(false));
  }, [loggedIn]);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const name = o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase());
  });

  const handleSaveProduct = (data) => {
    if (products.find(p => p._id === data._id)) {
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
    } else {
      setProducts(prev => [data, ...prev]);
    }
    setProductModal(null);
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch('/api/products/' + deleteTarget._id, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, mongoId, status) => {
    try {
      const res = await fetch('/api/orders/' + mongoId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setOrders(prev => prev.map(o => o._id === mongoId ? { ...o, status } : o));
      setOrderStatusEdit(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate total stock per product
  const getTotalStock = (product) => {
    if (!product.variants) return 0;
    return product.variants.reduce((total, v) => total + v.sizes.reduce((t, s) => t + s.stock, 0), 0);
  };

  const stats = [
    { label: 'Total Products', value: products.length, sub: products.filter(p => getTotalStock(p) <= 5).length + ' low stock' },
    { label: 'Total Orders',   value: orders.length,   sub: orders.filter(o => o.status === 'Pending').length + ' pending' },
    { label: 'Revenue',        value: '₦' + orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + (o.total || 0), 0).toLocaleString(), sub: 'excl. cancelled' },
    { label: 'Avg Order',      value: orders.filter(o => o.status !== 'Cancelled').length > 0 ? '₦' + Math.round(orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + (o.total || 0), 0) / orders.filter(o => o.status !== 'Cancelled').length).toLocaleString() : '₦0', sub: 'per order' },
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
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer text-xl leading-none">✕</button>
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
        @keyframes slide-in-left { from { transform:translateX(-100%); } to { transform:translateX(0); } }
        .slide-in-left { animation: slide-in-left 0.25s ease forwards; }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        .skeleton { animation: shimmer 1.5s ease-in-out infinite; background:#1a1a1a; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 bg-[#111] border-r border-[#1a1a1a] fixed top-0 left-0 h-full flex-col z-40 shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setSidebarOpen(false)} />
            <aside className="lg:hidden slide-in-left fixed top-0 left-0 h-full w-56 bg-[#111] border-r border-[#1a1a1a] flex flex-col z-50">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* MAIN */}
        <div className="lg:ml-56 flex-1 flex flex-col min-h-screen min-w-0">

          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1a1a1a] px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1 shrink-0">
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                  <span className="block w-5 h-px bg-[#f5f0eb]" />
                </button>
                <div className="min-w-0">
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#f5f0eb' }}>
                    {activeTab === 'products' ? 'Products' : 'Orders'}
                  </h1>
                  <p className="text-[#888] text-xs font-light hidden sm:block">
                    {activeTab === 'products' ? products.length + ' products' : orders.length + ' orders'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-[#111] text-[#f5f0eb] text-sm border border-[#2e2e2e] focus:border-[#e8530a] focus:outline-none px-3 py-2 w-28 sm:w-44 lg:w-52 placeholder:text-[#444] transition-colors" />
                {activeTab === 'products' && (
                  <button onClick={() => setProductModal('add')}
                    className="bg-[#e8530a] text-white px-3 sm:px-5 py-2 text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#ff6b2b] transition-colors cursor-pointer whitespace-nowrap"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                    + Add
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 space-y-4 fade-up">

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {stats.map(s => (
                <div key={s.label} className="bg-[#111] border border-[#1a1a1a] px-4 py-4">
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#888] mb-1">{s.label}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.3rem, 4vw, 2rem)', color: '#f5f0eb', letterSpacing: '0.05em' }}>{s.value}</p>
                  <p className="text-[#888] text-[0.65rem] mt-1 font-light">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* PRODUCTS */}
            {activeTab === 'products' && (
              <>
                {loadingProducts ? (
                  <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden sm:block bg-[#111] border border-[#1a1a1a] overflow-x-auto">
                      <table className="w-full text-sm min-w-[560px]">
                        <thead>
                          <tr className="border-b border-[#1a1a1a]">
                            {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                              <th key={h} className="text-left px-5 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1a1a1a]">
                          {filteredProducts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-16 text-[#888] text-sm font-light">No products found.</td></tr>
                          ) : filteredProducts.map(p => {
                            const stock = getTotalStock(p);
                            return (
                              <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
                                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-lg">👟</span>}
                                    </div>
                                    <span className="text-[#f5f0eb] font-medium text-sm">{p.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-[#888] text-sm">{p.brand}</td>
                                <td className="px-5 py-4 text-[#888] text-sm">{Array.isArray(p.category) ? p.category.join(', ') : p.category}</td>
                                <td className="px-5 py-4">
                                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>${p.price}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={"text-sm font-medium " + (stock <= 5 ? 'text-red-400' : stock <= 15 ? 'text-yellow-400' : 'text-green-400')}>
                                    {stock}{stock <= 5 && <span className="text-[0.6rem] tracking-widest uppercase ml-1">Low</span>}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setProductModal(p)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Edit</button>
                                    <span className="text-[#2e2e2e]">|</span>
                                    <button onClick={() => setDeleteTarget(p)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-2">
                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-16 text-[#888] text-sm font-light bg-[#111] border border-[#1a1a1a]">No products found.</div>
                      ) : filteredProducts.map(p => {
                        const stock = getTotalStock(p);
                        return (
                          <div key={p._id} className="bg-[#111] border border-[#1a1a1a] p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
                                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-2xl">👟</span>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[#f5f0eb] font-medium text-sm">{p.name}</p>
                                <p className="text-[#888] text-xs">{p.brand} · {Array.isArray(p.category) ? p.category.join(', ') : p.category}</p>
                              </div>
                              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: '#f5f0eb' }}>${p.price}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                              <span className={"text-xs font-medium " + (stock <= 5 ? 'text-red-400' : stock <= 15 ? 'text-yellow-400' : 'text-green-400')}>
                                Stock: {stock}{stock <= 5 && ' (Low)'}
                              </span>
                              <div className="flex gap-4">
                                <button onClick={() => setProductModal(p)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Edit</button>
                                <button onClick={() => setDeleteTarget(p)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-red-400 transition-colors cursor-pointer">Delete</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <>
                {loadingOrders ? (
                  <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden sm:block bg-[#111] border border-[#1a1a1a] overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="border-b border-[#1a1a1a]">
                            {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                              <th key={h} className="text-left px-5 py-4 text-[0.6rem] tracking-[0.25em] uppercase text-[#888] font-normal">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1a1a1a]">
                          {filteredOrders.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-16 text-[#888] text-sm font-light">No orders yet.</td></tr>
                          ) : filteredOrders.map(o => {
                            const customerName = o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : '—';
                            const orderDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—';
                            return (
                              <tr key={o._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setOrderDetail(o)}>
                                <td className="px-5 py-4"><span className="text-[#e8530a] font-medium text-xs tracking-wide">{o.orderId}</span></td>
                                <td className="px-5 py-4">
                                  <p className="text-[#f5f0eb] font-medium text-sm">{customerName}</p>
                                  <p className="text-[#888] text-xs">{o.customer?.email}</p>
                                </td>
                                <td className="px-5 py-4 text-[#888] text-sm">{o.items?.length || 0}</td>
                                <td className="px-5 py-4">
                                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: '#f5f0eb' }}>₦{o.total}</span>
                                </td>
                                <td className="px-5 py-4 text-[#888] text-xs">{orderDate}</td>
                                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                  {orderStatusEdit === o._id ? (
                                    <select defaultValue={o.status} onChange={e => handleStatusChange(o.orderId, o._id, e.target.value)} onBlur={() => setOrderStatusEdit(null)} autoFocus
                                      className="bg-[#0a0a0a] text-[#f5f0eb] text-xs border border-[#e8530a] px-2 py-1 focus:outline-none cursor-pointer">
                                      {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                  ) : (
                                    <span className={"text-[0.65rem] tracking-[0.1em] uppercase border px-2.5 py-1 " + (STATUS_STYLES[o.status] || 'border-[#2e2e2e] text-[#888]')}>{o.status}</span>
                                  )}
                                </td>
                                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setOrderDetail(o)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">View</button>
                                    <span className="text-[#2e2e2e]">|</span>
                                    <button onClick={() => setOrderStatusEdit(o._id)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Update</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile order cards */}
                    <div className="sm:hidden space-y-2">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 text-[#888] text-sm font-light bg-[#111] border border-[#1a1a1a]">No orders yet.</div>
                      ) : filteredOrders.map(o => {
                        const customerName = o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : '—';
                        const orderDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—';
                        return (
                          <div key={o._id} className="bg-[#111] border border-[#1a1a1a] p-4 cursor-pointer" onClick={() => setOrderDetail(o)}>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <p className="text-[#e8530a] text-xs tracking-wide font-medium mb-1">{o.orderId}</p>
                                <p className="text-[#f5f0eb] font-medium text-sm">{customerName}</p>
                                <p className="text-[#888] text-xs">{o.customer?.email}</p>
                              </div>
                              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#f5f0eb' }}>₦{o.total?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                              <div className="flex items-center gap-2">
                                <span className={"w-1.5 h-1.5 rounded-full " + (STATUS_DOT[o.status] || 'bg-[#888]')} />
                                <span className="text-xs text-[#888]">{o.status}</span>
                                <span className="text-[#2e2e2e]">·</span>
                                <span className="text-xs text-[#888]">{orderDate}</span>
                              </div>
                              <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                                <button onClick={() => setOrderDetail(o)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">View</button>
                                <button onClick={() => setOrderStatusEdit(o._id)} className="text-xs tracking-[0.1em] uppercase text-[#888] hover:text-[#f5f0eb] transition-colors cursor-pointer">Update</button>
                              </div>
                            </div>
                            {orderStatusEdit === o._id && (
                              <div className="mt-3 pt-3 border-t border-[#1a1a1a]" onClick={e => e.stopPropagation()}>
                                <select defaultValue={o.status} onChange={e => handleStatusChange(o.orderId, o._id, e.target.value)} onBlur={() => setOrderStatusEdit(null)} autoFocus
                                  className="w-full bg-[#0a0a0a] text-[#f5f0eb] text-xs border border-[#e8530a] px-3 py-2 focus:outline-none cursor-pointer">
                                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {productModal && <ProductModal product={productModal === 'add' ? null : productModal} onSave={handleSaveProduct} onClose={() => setProductModal(null)} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDeleteProduct} onClose={() => setDeleteTarget(null)} />}
      {orderDetail && <OrderDetailModal order={orderDetail} onClose={() => setOrderDetail(null)} />}
    </>
  );
}