'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

const GIFT_WRAP_OPTIONS = [
  { id: 'CLASSIC_GOLD', label: 'Classic Gold', description: 'Gold foil + satin ribbon', price: 99 },
  { id: 'BOTANICAL', label: 'Botanical', description: 'Kraft paper + dried flower', price: 149 },
  { id: 'LUXURY_BOX', label: 'Luxury Box', description: 'Magnetic closure box', price: 249 },
  { id: 'ECO_WRAP', label: 'Eco Wrap', description: 'Recycled handmade paper', price: 0 },
];

const GIFT_MESSAGE_TEMPLATES = [
  'Happy Birthday! Wishing you a wonderful day 🎂',
  'Congratulations on your special day! ✨',
  'With love and warm wishes 💕',
  'Thank you for everything 🙏',
];

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftOpen, setGiftOpen] = useState<Record<string, boolean>>({});
  const [giftWrap, setGiftWrap] = useState<Record<string, string>>({});
  const [giftMessage, setGiftMessage] = useState<Record<string, string>>({});
  const [giftRecipient, setGiftRecipient] = useState<Record<string, string>>({});

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const giftWrapTotal = Object.entries(giftWrap).reduce((acc, [id, wrapId]) => {
    if (!giftOpen[id]) return acc;
    const opt = GIFT_WRAP_OPTIONS.find((o) => o.id === wrapId);
    return acc + (opt?.price ?? 0);
  }, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal + giftWrapTotal + shipping - discount;

  function toggleGift(id: string) {
    setGiftOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!giftWrap[id]) setGiftWrap((prev) => ({ ...prev, [id]: 'ECO_WRAP' }));
  }

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-ivory/15">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        <h1 className="font-display text-3xl text-ivory">Your cart is empty</h1>
        <p className="text-ivory/60 font-body text-center max-w-sm">
          Looks like you haven&apos;t added anything yet. Explore our collections to find something special.
        </p>
        <Link href="/shop"><Button size="lg">Explore Collections</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="font-display text-3xl md:text-4xl text-ivory mb-10">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Left: Cart Items ── */}
          <div className="flex-1 flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-charcoal border border-white/5 rounded-sm overflow-hidden">
                {/* Item row */}
                <div className="flex gap-5 p-5">
                  <Link href={`/shop/${item.id}`} className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-sm overflow-hidden bg-obsidian shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <Link href={`/shop/${item.id}`} className="font-display text-lg text-ivory hover:text-gold transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </Link>
                      <p className="font-body text-gold font-medium mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-white/20 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-9 h-9 flex items-center justify-center text-ivory/70 hover:text-gold transition-colors"
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="w-9 text-center text-sm text-ivory font-body">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-ivory/70 hover:text-gold transition-colors"
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Line total */}
                        <span className="font-body font-semibold text-ivory">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-ivory/30 hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send as Gift toggle */}
                <div className={`border-t border-white/5 px-5 py-3 ${giftOpen[item.id] ? 'bg-gold/5 border-gold/20' : ''}`}>
                  <button
                    onClick={() => toggleGift(item.id)}
                    className="flex items-center gap-2 text-sm font-body transition-colors w-full"
                  >
                    <span className={`w-9 h-5 rounded-full transition-colors relative ${giftOpen[item.id] ? 'bg-gold' : 'bg-white/10'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-ivory transition-transform ${giftOpen[item.id] ? 'translate-x-4' : ''}`} />
                    </span>
                    <span className={giftOpen[item.id] ? 'text-gold' : 'text-ivory/60'}>
                      🎁 Send as Gift
                    </span>
                  </button>

                  {/* Gift options panel */}
                  {giftOpen[item.id] && (
                    <div className="mt-4 space-y-4">
                      {/* Wrap style */}
                      <div>
                        <p className="text-xs text-ivory/60 uppercase tracking-wider font-body mb-2">Gift Wrapping</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {GIFT_WRAP_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setGiftWrap((p) => ({ ...p, [item.id]: opt.id }))}
                              className={`p-2.5 rounded-sm border text-left transition-all ${
                                giftWrap[item.id] === opt.id
                                  ? 'border-gold bg-gold/10'
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <p className="font-body text-xs font-medium text-ivory">{opt.label}</p>
                              <p className="font-body text-xs text-ivory/50 mt-0.5">{opt.description}</p>
                              <p className="font-body text-xs text-gold mt-1">
                                {opt.price === 0 ? 'Free' : `₹${opt.price}`}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gift message */}
                      <div>
                        <p className="text-xs text-ivory/60 uppercase tracking-wider font-body mb-2">Gift Message</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {GIFT_MESSAGE_TEMPLATES.map((t) => (
                            <button
                              key={t}
                              onClick={() => setGiftMessage((p) => ({ ...p, [item.id]: t }))}
                              className="text-xs font-body text-ivory/60 border border-white/10 rounded-full px-3 py-1 hover:border-gold/50 hover:text-gold transition-colors"
                            >
                              {t.slice(0, 28)}…
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={giftMessage[item.id] ?? ''}
                          onChange={(e) => setGiftMessage((p) => ({ ...p, [item.id]: e.target.value.slice(0, 200) }))}
                          rows={3}
                          placeholder="Write a personal message… (max 200 characters)"
                          className="w-full bg-obsidian border border-white/20 rounded-sm px-3 py-2 text-ivory text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none placeholder-ivory/30"
                        />
                        <p className="text-xs text-ivory/30 font-body text-right mt-1">
                          {(giftMessage[item.id] ?? '').length}/200
                        </p>
                      </div>

                      {/* Recipient name */}
                      <div>
                        <p className="text-xs text-ivory/60 uppercase tracking-wider font-body mb-2">Recipient Name</p>
                        <input
                          type="text"
                          value={giftRecipient[item.id] ?? ''}
                          onChange={(e) => setGiftRecipient((p) => ({ ...p, [item.id]: e.target.value }))}
                          placeholder="Printed on the gift tag"
                          className="w-full bg-obsidian border border-white/20 rounded-sm px-3 py-2 text-ivory text-sm font-body focus:outline-none focus:border-gold transition-colors placeholder-ivory/30"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-charcoal border border-white/5 rounded-sm p-6 sticky top-24">
              <h2 className="font-display text-xl text-ivory mb-6 pb-4 border-b border-white/10">
                Order Summary
              </h2>

              <div className="space-y-3 font-body text-sm mb-6">
                <div className="flex justify-between text-ivory/70">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {giftWrapTotal > 0 && (
                  <div className="flex justify-between text-ivory/70">
                    <span>Gift Wrapping</span>
                    <span>₹{giftWrapTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-ivory/70">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <span className="text-sage">Free</span> : `₹${shipping}`}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sage">
                    <span>Promo (WELCOME10)</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Promo code */}
              {!promoApplied && (
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 bg-obsidian border border-white/20 rounded-sm px-3 py-2 text-ivory text-sm font-body focus:outline-none focus:border-gold transition-colors placeholder-ivory/30"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 border border-gold text-gold text-sm font-body rounded-sm hover:bg-gold hover:text-obsidian transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoApplied && (
                <div className="flex items-center gap-2 mb-6 text-sm font-body text-sage bg-sage/10 border border-sage/20 rounded-sm px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  WELCOME10 applied — 10% off
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center font-body font-semibold text-lg border-t border-white/10 pt-4 mb-6">
                <span className="text-ivory">Total</span>
                <span className="text-gold">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button fullWidth size="lg">Proceed to Checkout</Button>
              </Link>

              <Link href="/shop" className="block mt-3">
                <Button variant="ghost" fullWidth>Continue Shopping</Button>
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
                {[
                  { icon: '🔒', text: 'Secure checkout' },
                  { icon: '↩️', text: '14-day easy returns' },
                  { icon: '🚚', text: 'Free shipping over ₹2,000' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-ivory/40 font-body">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
