export const dynamic = 'force-dynamic';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin?callbackUrl=/account/settings');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Split name
  const nameParts = (user.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-display text-ivory mb-6 border-b border-white/10 pb-4">Account Settings</h2>

      <div className="space-y-10">
        {/* Profile Form */}
        <section>
          <h3 className="text-lg font-display text-gold mb-4">Personal Information</h3>
          <div className="bg-charcoal p-6 rounded-sm border border-white/5">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    defaultValue={firstName}
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    defaultValue={lastName}
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  disabled
                  defaultValue={user.email}
                  className="w-full bg-obsidian/50 cursor-not-allowed border border-white/10 rounded-sm px-4 py-3 text-ivory/50 focus:outline-none transition-colors" 
                />
                <p className="text-xs text-ivory/40 mt-1">Email cannot be changed.</p>
              </div>
              <div className="pt-2">
                <Button type="button">Save Changes</Button>
              </div>
            </form>
          </div>
        </section>

        {/* Password Form */}
        <section>
          <h3 className="text-lg font-display text-gold mb-4">Change Password</h3>
          <div className="bg-charcoal p-6 rounded-sm border border-white/5">
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="currentPassword">Current Password</label>
                <input 
                  type="password" 
                  id="currentPassword"
                  className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword"
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" 
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button type="button" variant="secondary">Update Password</Button>
              </div>
            </form>
          </div>
        </section>

        {/* Communication Preferences */}
        <section>
          <h3 className="text-lg font-display text-gold mb-4">Preferences</h3>
          <div className="bg-charcoal p-6 rounded-sm border border-white/5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-gold" />
              <div>
                <p className="text-ivory font-body text-sm font-medium">Order Updates</p>
                <p className="text-ivory/60 font-body text-sm">Receive email notifications about your order status.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-gold" />
              <div>
                <p className="text-ivory font-body text-sm font-medium">Exclusive Offers</p>
                <p className="text-ivory/60 font-body text-sm">Receive emails about new collections and exclusive sales.</p>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
