import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/account');
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: { orders: true, wishlist: true }
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          grandTotal: true,
          createdAt: true,
        }
      }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500';
      case 'PROCESSING': return 'bg-gold/20 text-gold';
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400';
      case 'DELIVERED': return 'bg-green-500/20 text-green-400';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-display text-ivory mb-6">Welcome back, {user.name || 'User'}</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-display text-gold">{user._count.orders}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-obsidian border border-gold/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-charcoal border border-white/5 p-6 rounded-sm flex items-center justify-between">
          <div>
            <p className="text-ivory/60 font-body text-sm mb-1 uppercase tracking-wider">Wishlist Items</p>
            <p className="text-3xl font-display text-gold">{user._count.wishlist}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-obsidian border border-gold/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display text-ivory">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm text-gold hover:underline font-body">View All</Link>
        </div>
        
        <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden">
          {user.orders.length > 0 ? (
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-obsidian/50 text-ivory/60 uppercase tracking-wider text-xs border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Order #</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-ivory/90">
                {user.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-6 py-4">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(order.grandTotal.toNumber())}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-ivory/60">
              <p className="mb-4">You haven&apos;t placed any orders yet.</p>
              <Link href="/shop" className="text-gold hover:underline">Start shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
