'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/admin/ProductForm';
import { formatCurrency } from '@/lib/utils';

type ProductStatus = 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'ARCHIVED';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  status: ProductStatus;
  inventory: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  imageUrl?: string | null;
  category: string;
  totalOrders: number;
  updatedAt: string;
}

const STATUS_COLORS: Record<ProductStatus, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  DRAFT: 'bg-gold/20 text-gold',
  OUT_OF_STOCK: 'bg-red-500/20 text-red-400',
  ARCHIVED: 'bg-gray-500/20 text-gray-400',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products?limit=100');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleProductCreated() {
    setShowAddModal(false);
    loadProducts();
  }

  function handleProductUpdated() {
    setEditingProduct(null);
    loadProducts();
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeletingProductId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display text-ivory">Products</h2>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          + Add Product
        </Button>
      </div>

      <div className="bg-charcoal border border-white/5 rounded-sm overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-obsidian/30 text-ivory/60 uppercase tracking-wider text-xs border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Inventory</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-ivory/90">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-white/5 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-ivory/60">
                  No products found. Add a product to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-obsidian rounded-sm relative overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ivory/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ivory">{product.name}</p>
                        <p className="text-xs text-ivory/40">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${product.isLowStock ? 'text-red-400' : 'text-ivory/90'}`}>
                    {product.inventory === 0 ? 'Out of stock' : `${product.inventory} in stock`}
                    {product.isLowStock && product.inventory > 0 && (
                      <span className="ml-1 text-xs text-red-400">(low)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-ivory/60">{product.category}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(typeof product.price === 'string' ? parseFloat(product.price) : product.price)}
                  </td>
                  <td className="px-6 py-4 text-ivory/60">{product.totalOrders}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-gold hover:text-gold/80 transition-colors p-1"
                        title="Edit product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingProductId === product.id}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50"
                        title="Delete product"
                      >
                        {deletingProductId === product.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        maxWidth="max-w-2xl"
      >
        <ProductForm
          onSuccess={handleProductCreated}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
          maxWidth="max-w-2xl"
        >
          <ProductForm
            product={editingProduct}
            onSuccess={handleProductUpdated}
            onCancel={() => setEditingProduct(null)}
          />
        </Modal>
      )}
    </div>
  );
}
