import React from 'react';
import prisma from '@/lib/prisma';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      },
      orders: {
        select: { grandTotal: true }
      }
    }
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display text-ivory">Customers</h2>
      </div>
      
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-obsidian/30 text-ivory/60 uppercase tracking-wider text-xs border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-ivory/90">
            {customers.map(customer => {
              const totalSpent = customer.orders.reduce((acc, order) => acc + order.grandTotal.toNumber(), 0);
              return (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-ivory">
                    {customer.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer._count.orders}</td>
                  <td className="px-6 py-4">
                    ${totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="p-8 text-center text-ivory/60">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
