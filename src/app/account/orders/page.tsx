import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin?callbackUrl=/account/orders');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
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
      <h2 className="text-2xl font-display text-ivory mb-6 border-b border-white/10 pb-4">Order History</h2>

      {user.orders.length > 0 ? (
        <div className="space-y-8">
          {user.orders.map((order) => (
            <div key={order.id} className="bg-charcoal border border-white/5 rounded-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-obsidian/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-white/5 font-body text-sm">
                <div className="flex gap-8">
                  <div>
                    <p className="text-ivory/60 uppercase tracking-wider text-xs mb-1">Order Placed</p>
                    <p className="text-ivory">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-ivory/60 uppercase tracking-wider text-xs mb-1">Total</p>
                    <p className="text-ivory">{formatCurrency(order.grandTotal.toNumber())}</p>
                  </div>
                  <div>
                    <p className="text-ivory/60 uppercase tracking-wider text-xs mb-1">Order #</p>
                    <p className="text-ivory">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button className="text-gold hover:underline">View Invoice</button>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-4">
                {order.items.map((item) => {
                  const mainImage = item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url || '/placeholder.png';
                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative w-20 h-20 bg-obsidian rounded-sm overflow-hidden shrink-0">
                        <Image src={mainImage} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-body text-ivory">{item.name}</h4>
                        <p className="font-body text-sm text-ivory/60 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-body text-gold">
                        {formatCurrency(item.unitPrice.toNumber())}
                      </div>
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 flex gap-2">
                         {/* Next.js app router doesn't allow form inside div without 'use client', but we'll just link to product page */}
                        <Button variant="secondary" className="w-full sm:w-auto text-xs py-2 px-4" asChild>
                          <a href={`/shop/${item.product.slug}`}>View Product</a>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-charcoal border border-white/5 rounded-sm p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-ivory/30 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h3 className="text-xl font-display text-ivory mb-2">No orders yet</h3>
          <p className="text-ivory/60 font-body mb-6">When you place an order, it will appear here.</p>
          <Button asChild>
            <a href="/shop">Start Shopping</a>
          </Button>
        </div>
      )}
    </div>
  );
}
