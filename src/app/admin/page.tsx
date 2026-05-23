export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [totalRevenueResult, totalOrders, totalCustomers, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        grandTotal: true,
      },
    }),
    prisma.order.count(),
    prisma.user.count({
      where: { role: 'CUSTOMER' }
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, email: true } }
      }
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.grandTotal?.toNumber() || 0;

  // Let's assume a simplified calculation for "Low Stock" items
  const lowStockProducts = await prisma.product.findMany({
    where: { inventory: { lte: 5 } },
    take: 5,
    orderBy: { inventory: 'asc' },
    select: { name: true, inventory: true }
  });

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-display text-ivory mb-8">Overview</h2>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm">
          <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-display text-gold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm">
          <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Orders</p>
          <p className="text-3xl font-display text-ivory">{totalOrders}</p>
        </div>
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm">
          <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Customers</p>
          <p className="text-3xl font-display text-ivory">{totalCustomers}</p>
        </div>
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm">
          <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Avg. Order Value</p>
          <p className="text-3xl font-display text-ivory">{totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : '$0.00'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-charcoal border border-white/5 rounded-sm">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-display text-xl text-ivory">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-body text-gold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-obsidian/30 text-ivory/60 uppercase tracking-wider text-xs border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Order #</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-ivory/90">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.user?.name || order.user?.email || order.email}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">{formatCurrency(order.grandTotal.toNumber())}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 text-white rounded-full text-xs">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="p-8 text-center text-ivory/60">
                No orders found.
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-charcoal border border-white/5 rounded-sm h-fit">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-display text-xl text-ivory flex items-center gap-2">
              Low Stock Alerts
              <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-body">{lowStockProducts.length}</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {lowStockProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center font-body text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <span className="text-ivory">{product.name}</span>
                <span className="text-red-400 font-medium">
                  {product.inventory === 0 ? 'Out of stock' : `${product.inventory} left`}
                </span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center text-ivory/60 text-sm">
                Inventory is healthy.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
