export const dynamic = 'force-dynamic';

import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin?callbackUrl=/account/wishlist');
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { user: { email: session.user.email } },
    include: {
      product: {
        include: { images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-display text-ivory">My Wishlist</h2>
        <span className="text-sm text-ivory/60 font-body">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const mainImage = item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url || '/placeholder.png';
            const badges = [];
            if (item.product.isLimitedEdition) badges.push('Limited Edition');
            if (item.product.isHandcrafted) badges.push('Handcrafted');
            if (item.product.isBestSeller) badges.push('Best Seller');

            return (
              <div key={item.id} className="relative group">
                <ProductCard
                  id={item.product.slug}
                  name={item.product.name}
                  price={item.product.price.toNumber()}
                  imageUrl={mainImage}
                  badges={badges}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-charcoal border border-white/5 rounded-sm p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-ivory/30 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h3 className="text-xl font-display text-ivory mb-2">Your wishlist is empty</h3>
          <p className="text-ivory/60 font-body mb-6">Save items you like to your wishlist to easily find them later.</p>
        </div>
      )}
    </div>
  );
}
