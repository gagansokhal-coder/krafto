import React from 'react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      },
      _count: {
        select: { items: true }
      }
    }
  });

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500';
      case 'PROCESSING': return 'bg-gold/20 text-gold';
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400';
      case 'DELIVERED': return 'bg-green-500/20 text-green-400';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/70';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500';
      case 'PAID': return 'bg-green-500/20 text-green-400';
      case 'FAILED': return 'bg-red-500/20 text-red-400';
      case 'REFUNDED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display text-ivory">Orders</h2>
      </div>
      
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-obsidian/30 text-ivory/60 uppercase tracking-wider text-xs border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Order #</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium">Fulfillment</th>
              <th className="px-6 py-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-ivory/90">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium text-ivory">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p>{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-ivory/50">{order.user?.email || order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p>{formatCurrency(order.grandTotal.toNumber())}</p>
                  <p className="text-xs text-ivory/50">{order._count.items} item(s)</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-ivory/60">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
