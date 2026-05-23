export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Fetch comprehensive dashboard stats
  const [
    totalRevenueResult,
    totalOrders,
    totalCustomers,
    totalProducts,
    activeProducts,
    lowStockProducts,
    recentOrders,
    topProducts,
    revenueByMonth,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { grandTotal: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { status: 'ACTIVE', deletedAt: null } }),
    prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { id: true, name: true, inventory: true, lowStockThreshold: true },
    }).then(products => products.filter(p => p.inventory <= p.lowStockThreshold)),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        grandTotal: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 5,
    }).then(async (items) => {
      const productIds = items.map(i => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, images: { where: { isMain: true }, take: 1 } },
      });
      return items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId),
      }));
    }),
    // Revenue by month (last 6 months)
    prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
        SUM("grandTotal")::float as revenue
      FROM "orders"
      WHERE "paymentStatus" = 'PAID'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `,
  ]);

  const totalRevenue = totalRevenueResult._sum.grandTotal?.toNumber() || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display text-ivory mb-2">Dashboard Overview</h2>
        <p className="text-ivory/60 font-body text-sm">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-ivory/60 font-body text-sm uppercase tracking-wider">Total Revenue</p>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-display text-gold mb-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-ivory/40 font-body">From {totalOrders} paid orders</p>
        </div>

        <div className="bg-charcoal border border-white/5 p-6 rounded-sm hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-ivory/60 font-body text-sm uppercase tracking-wider">Total Orders</p>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-display text-ivory mb-1">{totalOrders}</p>
          <p className="text-xs text-ivory/40 font-body">Avg: {formatCurrency(avgOrderValue)}</p>
        </div>

        <div className="bg-charcoal border border-white/5 p-6 rounded-sm hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-ivory/60 font-body text-sm uppercase tracking-wider">Customers</p>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-display text-ivory mb-1">{totalCustomers}</p>
          <p className="text-xs text-ivory/40 font-body">Registered users</p>
        </div>

        <div className="bg-charcoal border border-white/5 p-6 rounded-sm hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-ivory/60 font-body text-sm uppercase tracking-wider">Products</p>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-display text-ivory mb-1">{activeProducts}</p>
          <p className="text-xs text-ivory/40 font-body">{totalProducts} total products</p>
        </div>
      </div>

      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-charcoal border border-white/5 rounded-sm p-6">
          <h3 className="font-display text-xl text-ivory mb-6">Revenue Trend (Last 6 Months)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueByMonth.map((item, i) => {
              const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gold/20 hover:bg-gold/40 transition-colors rounded-t relative group" style={{ height: `${height}%`, minHeight: '20px' }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-obsidian px-2 py-1 rounded text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                  <p className="text-xs text-ivory/40 font-body text-center">{item.month.split(' ')[0]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-ivory">Low Stock Alerts</h3>
            {lowStockProducts.length > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-body font-bold">
                {lowStockProducts.length}
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-ivory/40 text-sm font-body py-8">All products are well stocked</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center font-body text-sm border-b border-white/5 pb-3 last:border-0">
                  <span className="text-ivory truncate flex-1">{product.name}</span>
                  <span className={`font-medium ml-2 ${product.inventory === 0 ? 'text-red-400' : 'text-gold'}`}>
                    {product.inventory === 0 ? 'Out' : `${product.inventory} left`}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/products" className="block mt-4 text-center text-sm text-gold hover:underline font-body">
            Manage Inventory →
          </Link>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-charcoal border border-white/5 rounded-sm">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-display text-xl text-ivory">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-gold hover:underline font-body">View All</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-body font-medium text-ivory text-sm">{order.orderNumber}</p>
                    <p className="font-body text-xs text-ivory/50">{order.user?.name || order.user?.email || 'Guest'}</p>
                  </div>
                  <p className="font-body text-gold font-medium text-sm">{formatCurrency(order.grandTotal.toNumber())}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body ${
                    order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                    'bg-gold/20 text-gold'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-ivory/30 font-body">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-charcoal border border-white/5 rounded-sm">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-display text-xl text-ivory">Top Selling Products</h3>
          </div>
          <div className="divide-y divide-white/5">
            {topProducts.map((item, index) => (
              <div key={item.productId} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-body font-bold shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-ivory text-sm truncate">{item.product?.name || 'Unknown Product'}</p>
                  <p className="font-body text-xs text-ivory/50">{item._sum.quantity || 0} units sold</p>
                </div>
                <p className="font-body text-gold font-medium text-sm shrink-0">
                  {formatCurrency(Number(item._sum.totalPrice) || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-charcoal border border-white/5 rounded-sm p-6">
        <h3 className="font-display text-xl text-ivory mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products/new" className="flex flex-col items-center gap-3 p-6 bg-obsidian hover:bg-obsidian/70 border border-white/10 hover:border-gold/30 rounded-sm transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gold/20 group-hover:bg-gold/30 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">Add Product</span>
          </Link>

          <Link href="/admin/promo-codes" className="flex flex-col items-center gap-3 p-6 bg-obsidian hover:bg-obsidian/70 border border-white/10 hover:border-gold/30 rounded-sm transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gold/20 group-hover:bg-gold/30 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">Promo Codes</span>
          </Link>

          <Link href="/admin/sales" className="flex flex-col items-center gap-3 p-6 bg-obsidian hover:bg-obsidian/70 border border-white/10 hover:border-gold/30 rounded-sm transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gold/20 group-hover:bg-gold/30 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">Sales & Offers</span>
          </Link>

          <Link href="/admin/analytics" className="flex flex-col items-center gap-3 p-6 bg-obsidian hover:bg-obsidian/70 border border-white/10 hover:border-gold/30 rounded-sm transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gold/20 group-hover:bg-gold/30 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
