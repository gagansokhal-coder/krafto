'use client';

import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/Button';

interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
  price: number;
  category: {
    name: string;
  } | null;
  isActive: boolean;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  async function fetchInventory() {
    try {
      const res = await fetch(`/api/admin/inventory?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStock(id: string, newStock: number) {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        await fetchInventory();
        setEditingId(null);
        setEditStock('');
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    }
  }

  function getStockStatus(item: InventoryItem) {
    if (item.stock === 0) return { label: 'Out of Stock', color: 'text-red-400' };
    if (item.stock <= item.lowStockThreshold) return { label: 'Low Stock', color: 'text-yellow-400' };
    return { label: 'In Stock', color: 'text-green-400' };
  }

  if (loading) {
    return <div className="text-center py-12 text-ivory/60 font-body">Loading inventory...</div>;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-ivory mb-2">Inventory Management</h2>
          <p className="text-ivory/60 font-body text-sm">Monitor and update product stock levels.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'all'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'low'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'out'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          Out of Stock
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-obsidian border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Current Stock</th>
                <th className="text-left px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-sm font-body text-ivory/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ivory/40 font-body">
                    {filter === 'all' ? 'No products found.' : `No ${filter === 'low' ? 'low stock' : 'out of stock'} items.`}
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const status = getStockStatus(item);
                  const isEditing = editingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-body text-ivory">{item.name}</div>
                          <div className="text-sm text-ivory/50">{item.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body text-sm text-ivory/70">{item.sku || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body text-sm text-ivory/70">{item.category?.name || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-24 bg-obsidian border border-white/20 rounded-sm px-3 py-1 text-ivory focus:outline-none focus:border-gold transition-colors font-body text-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateStock(item.id, parseInt(editStock))}
                              className="text-green-400 hover:text-green-300 text-sm font-body"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditStock('');
                              }}
                              className="text-red-400 hover:text-red-300 text-sm font-body"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-body font-bold text-ivory">{item.stock}</span>
                            <span className="text-ivory/50 text-sm font-body">
                              (threshold: {item.lowStockThreshold})
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-body text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditStock(String(item.stock));
                            }}
                            className="text-gold hover:text-gold/70 transition-colors font-body text-sm"
                          >
                            Update Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Total Products</div>
          <div className="text-3xl font-display text-ivory">{items.length}</div>
        </div>
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Low Stock Items</div>
          <div className="text-3xl font-display text-yellow-400">
            {items.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length}
          </div>
        </div>
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Out of Stock</div>
          <div className="text-3xl font-display text-red-400">
            {items.filter(i => i.stock === 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
