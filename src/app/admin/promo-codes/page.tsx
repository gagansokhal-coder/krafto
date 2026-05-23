'use client';

import React, { useState, useEffect } from 'react';

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  async function fetchPromoCodes() {
    try {
      const res = await fetch('/api/admin/promo-codes');
      if (res.ok) {
        const data = await res.json();
        setPromoCodes(data.promoCodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          discountType: form.discountType,
          discountValue: form.discountValue ? parseFloat(form.discountValue) : 0,
          minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : null,
          maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : null,
          validFrom: form.validFrom || null,
          validUntil: form.validUntil || null,
          isActive: form.isActive,
        }),
      });

      if (res.ok) {
        setShowCreate(false);
        setForm({
          code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '',
          maxDiscount: '', usageLimit: '', perUserLimit: '', validFrom: '', validUntil: '', isActive: true,
        });
        fetchPromoCodes();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create promo code');
      }
    } catch {
      alert('Failed to create promo code');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) fetchPromoCodes();
    } catch (error) {
      console.error('Failed to toggle promo code:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPromoCodes();
    } catch (error) {
      console.error('Failed to delete promo code:', error);
    }
  }

  function formatDiscountType(type: string) {
    switch (type) {
      case 'PERCENTAGE': return 'Percentage';
      case 'FIXED_AMOUNT': return 'Fixed Amount';
      case 'FREE_SHIPPING': return 'Free Shipping';
      default: return type;
    }
  }

  function formatDiscount(promo: PromoCode) {
    if (promo.discountType === 'PERCENTAGE') return `${promo.discountValue}%`;
    if (promo.discountType === 'FIXED_AMOUNT') return `₹${promo.discountValue}`;
    return 'Free Shipping';
  }

  if (loading) {
    return <div className="text-center py-12 text-ivory/60 font-body">Loading promo codes...</div>;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-ivory mb-2">Promo Codes</h2>
          <p className="text-ivory/60 font-body text-sm">Create and manage discount codes for your customers.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-gradient-to-r from-gold to-gold-dark text-obsidian px-5 py-2.5 rounded-sm font-body text-sm font-medium hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all"
        >
          {showCreate ? 'Cancel' : '+ New Promo Code'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-charcoal border border-white/10 rounded-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Discount Type *</label>
              <select
                value={form.discountType}
                onChange={e => setForm({ ...form, discountType: e.target.value })}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            {form.discountType !== 'FREE_SHIPPING' && (
              <div>
                <label className="block text-ivory/70 font-body text-sm mb-1">
                  Discount Value ({form.discountType === 'PERCENTAGE' ? '%' : '₹'}) *
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={e => setForm({ ...form, discountValue: e.target.value })}
                  placeholder="e.g. 20"
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Min Order Value</label>
              <input
                type="number"
                value={form.minOrderValue}
                onChange={e => setForm({ ...form, minOrderValue: e.target.value })}
                placeholder="Optional"
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Max Discount (₹)</label>
              <input
                type="number"
                value={form.maxDiscount}
                onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="Optional"
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Unlimited"
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Valid From</label>
              <input
                type="datetime-local"
                value={form.validFrom}
                onChange={e => setForm({ ...form, validFrom: e.target.value })}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-ivory/70 font-body text-sm mb-1">Valid Until</label>
              <input
                type="datetime-local"
                value={form.validUntil}
                onChange={e => setForm({ ...form, validUntil: e.target.value })}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-2.5 text-ivory font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-gold to-gold-dark text-obsidian px-6 py-2.5 rounded-sm font-body text-sm font-medium hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)] disabled:opacity-50 transition-all"
            >
              {saving ? 'Creating...' : 'Create Promo Code'}
            </button>
          </div>
        </form>
      )}

      {/* Promo Codes Table */}
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-obsidian border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Discount</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Usage</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Validity</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ivory/40 font-body">
                    No promo codes found. Create your first one!
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => {
                  const now = new Date();
                  const isExpired = promo.validUntil && new Date(promo.validUntil) < now;
                  const isUpcoming = promo.validFrom && new Date(promo.validFrom) > now;

                  return (
                    <tr key={promo.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-body font-bold text-gold tracking-wider">{promo.code}</span>
                        <div className="text-xs text-ivory/50 font-body mt-1">
                          {formatDiscountType(promo.discountType)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body text-ivory font-medium">{formatDiscount(promo)}</span>
                        {promo.minOrderValue && (
                          <div className="text-xs text-ivory/50 font-body mt-1">Min: ₹{promo.minOrderValue}</div>
                        )}
                        {promo.maxDiscount && (
                          <div className="text-xs text-ivory/50 font-body mt-1">Max: ₹{promo.maxDiscount}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body text-ivory">
                          {promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-body text-ivory/70">
                          {promo.validFrom
                            ? new Date(promo.validFrom).toLocaleDateString()
                            : 'No start'}
                          {' → '}
                          {promo.validUntil
                            ? new Date(promo.validUntil).toLocaleDateString()
                            : 'No end'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isExpired ? (
                          <span className="text-red-400 font-body text-sm">Expired</span>
                        ) : isUpcoming ? (
                          <span className="text-blue-400 font-body text-sm">Upcoming</span>
                        ) : promo.isActive ? (
                          <span className="text-green-400 font-body text-sm">Active</span>
                        ) : (
                          <span className="text-ivory/40 font-body text-sm">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => toggleActive(promo.id, promo.isActive)}
                            className="text-sm font-body text-ivory/60 hover:text-gold transition-colors"
                          >
                            {promo.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="text-sm font-body text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
