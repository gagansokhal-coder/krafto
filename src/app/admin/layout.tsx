import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';

export const metadata: Metadata = {
  title: 'Admin Panel — Kraafto',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/admin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-charcoal hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-display text-xl text-gold">Kraafto Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 font-body text-ivory/80 text-sm">
          <Link href="/admin" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Products
          </Link>
          <Link href="/admin/inventory" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Inventory
          </Link>
          <Link href="/admin/orders" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Orders
          </Link>
          <Link href="/admin/customers" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Customers
          </Link>
          <Link href="/admin/reviews" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Reviews
          </Link>
          <Link href="/admin/sales" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Sales & Promotions
          </Link>
          <Link href="/admin/promo-codes" className="px-4 py-2.5 rounded-sm hover:bg-obsidian hover:text-gold transition-colors">
            Promo Codes
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-ivory/60 hover:text-ivory text-sm px-4 py-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-white/10 bg-charcoal/50">
          <h1 className="font-display text-xl text-ivory">Admin Panel</h1>
          <div className="flex items-center gap-6 text-ivory/70 font-body text-sm">
            <AdminSignOutButton />
            <div className="flex items-center gap-3">
              <span>{user.name || 'Admin'}</span>
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">{initials}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
