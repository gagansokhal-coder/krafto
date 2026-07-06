'use client';

import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/Button';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isApproved: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    slug: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/admin/reviews?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });

      if (res.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  }

  async function handleReject(id: string) {
    if (!confirm('Are you sure you want to reject this review?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-gold' : 'text-ivory/20'}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-ivory/60 font-body">Loading reviews...</div>;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-ivory mb-2">Reviews Management</h2>
          <p className="text-ivory/60 font-body text-sm">Moderate customer reviews before they appear on the site.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'pending'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'approved'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-colors ${
            filter === 'all'
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal text-ivory/70 border border-white/20 hover:border-white/40'
          }`}
        >
          All Reviews
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-charcoal border border-white/5 rounded-sm p-12 text-center">
            <p className="text-ivory/40 font-body">
              {filter === 'pending' ? 'No pending reviews.' : 'No reviews found.'}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-charcoal border border-white/5 rounded-sm p-6 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    {review.isApproved ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-body rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-body rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h3 className="font-body font-bold text-ivory mb-2">{review.title}</h3>
                  )}
                  {review.body && (
                    <p className="text-ivory/70 font-body text-sm mb-3">{review.body}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-ivory/50 font-body">
                    <span>By {review.user.name}</span>
                    <span>•</span>
                    <span>For: {review.product.name}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                {!review.isApproved && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors rounded-sm font-body text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-sm font-body text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Total Reviews</div>
          <div className="text-3xl font-display text-ivory">{reviews.length}</div>
        </div>
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Pending Approval</div>
          <div className="text-3xl font-display text-yellow-400">
            {reviews.filter(r => !r.isApproved).length}
          </div>
        </div>
        <div className="bg-charcoal border border-white/5 rounded-sm p-6">
          <div className="text-ivory/60 font-body text-sm mb-2">Average Rating</div>
          <div className="text-3xl font-display text-gold">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
