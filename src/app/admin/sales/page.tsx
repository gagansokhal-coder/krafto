'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
// import { formatCurrency } from '@/lib/utils';

interface Sale {
  id: string;
  name: string;
  description: string | null;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    isActive: true,
    productIds: [] as string[],
  });

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      const res = await fetch('/api/admin/sales');
      if (res.ok) {
        const data = await res.json();
        setSales(data.sales || []);
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      name: '',
      description: '',
      discountPercentage: '',
      startDate: '',
      endDate: '',
      isActive: true,
      productIds: [],
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(sale: Sale) {
    setForm({
      name: sale.name,
      description: sale.description || '',
      discountPercentage: String(sale.discountPercentage),
      startDate: sale.startDate.split('T')[0],
      endDate: sale.endDate.split('T')[0],
      isActive: sale.isActive,
      productIds: [],
    });
    setEditingId(sale.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        discountPercentage: parseFloat(form.discountPercentage),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
        productIds: form.productIds,
      };

      const url = editingId ? `/api/admin/sales/${editingId}` : '/api/admin/sales';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchSales();
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save sale');
      }
    } catch (error) {
      console.error('Failed to save sale:', error);
      alert('Failed to save sale');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    try {
      const res = await fetch(`/api/admin/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchSales();
      }
    } catch (error) {
      console.error('Failed to delete sale:', error);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        await fetchSales();
      }
    } catch (error) {
      console.error('Failed to toggle sale:', error);
    }
  }

  function getSaleStatus(sale: Sale) {
    const now = new Date();
    const start = new Date(sale.startDate);
    const end = new Date(sale.endDate);

    if (!sale.isActive) return { label: 'Inactive', color: 'bg-gray-500/20 text-gray-400' };
    if (now < start) return { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-400' };
    if (now > end) return { label: 'Ended', color: 'bg-red-500/20 text-red-400' };
    return { label: 'Active', color: 'bg-green-500/20 text-green-400' };
  }

  if (loading) {
    return <div className="text-center py-12 text-ivory/60 font-body">Loading sales...</div>;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-ivory mb-2">Sales & Promotions</h2>
          <p className="text-ivory/60 font-body text-sm">Create and manage site-wide sales and promotional campaigns.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Sale'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <h3 className="font-display text-xl text-ivory mb-6">
            {editingId ? 'Edit Sale' : 'Create New Sale'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-ivory/70 mb-2 font-body">Sale Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="Summer Sale 2026"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-ivory/70 mb-2 font-body">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  rows={3}
                  placeholder="Brief description of the sale..."
                />
              </div>

              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Discount Percentage * (%)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>

              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Start Date *</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>

              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">End Date *</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-obsidian text-gold focus:ring-gold focus:ring-offset-0"
              />
              <label htmlFor="isActive" className="text-sm text-ivory/70 font-body cursor-pointer">
                Active (sale is live)
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit">{editingId ? 'Update' : 'Create'} Sale</Button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-transparent border border-white/20 text-ivory hover:border-white/40 transition-colors rounded-sm font-body text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales List */}
      <div className="grid grid-cols-1 gap-4">
        {sales.length === 0 ? (
          <div className="bg-charcoal border border-white/5 rounded-sm p-12 text-center">
            <p className="text-ivory/40 font-body">No sales yet. Create your first promotional campaign!</p>
          </div>
        ) : (
          sales.map((sale) => {
            const status = getSaleStatus(sale);
            return (
              <div
                key={sale.id}
                className="bg-charcoal border border-white/5 rounded-sm p-6 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl text-ivory">{sale.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {sale.description && (
                      <p className="text-ivory/60 font-body text-sm mb-3">{sale.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-ivory/50 font-body">
                      <span className="text-gold font-bold text-lg">{sale.discountPercentage}% OFF</span>
                      <span>•</span>
                      <span>{new Date(sale.startDate).toLocaleDateString('en-IN')} - {new Date(sale.endDate).toLocaleDateString('en-IN')}</span>
                      <span>•</span>
                      <span>{sale.productCount} products</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(sale.id, sale.isActive)}
                      className="px-4 py-2 bg-obsidian border border-white/20 text-ivory hover:border-white/40 transition-colors rounded-sm font-body text-sm"
                    >
                      {sale.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(sale)}
                      className="px-4 py-2 bg-obsidian border border-white/20 text-gold hover:border-gold/70 transition-colors rounded-sm font-body text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-sm font-body text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
