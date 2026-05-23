import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account — Kraafto',
};

const ACCOUNT_NAV = [
  { name: 'Dashboard', href: '/account' },
  { name: 'Order History', href: '/account/orders' },
  { name: 'Wishlist', href: '/account/wishlist' },
  { name: 'Account Settings', href: '/account/settings' },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/account');
  }

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 md:px-8 bg-obsidian min-h-screen">
      <div className="mb-10 pb-6 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-display text-ivory">My Account</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2 font-body text-ivory/80">
            {ACCOUNT_NAV.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="px-4 py-3 rounded-sm hover:bg-charcoal hover:text-gold transition-colors focus:bg-charcoal"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-8 border-t border-white/10 pt-4">
              <Link 
                href="/api/auth/signout"
                className="px-4 py-3 w-full text-left text-ivory/60 hover:text-red-400 transition-colors block"
              >
                Sign Out
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
