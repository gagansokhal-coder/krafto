'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, closeCart } = useCart();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-obsidian/85 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-charcoal border-l border-gold/15 shadow-warm-lg z-[70] flex flex-col transition-transform duration-700 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Decorative left accent line */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-gold via-brass to-gold" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gold/10 relative">
          <div className="absolute inset-0 jaali-pattern opacity-30 pointer-events-none" />
          <h2 className="font-display text-2xl text-ivory/90 tracking-wide relative z-10">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-ivory/40 hover:text-gold transition-colors duration-300 p-2 -mr-2 relative z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-gold/40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <p className="font-display text-2xl text-ivory/60">Your cart is empty</p>
              <button onClick={closeCart} className="text-[13px] text-gold uppercase tracking-widest font-medium font-body hover:text-brass transition-colors underline underline-offset-8 mt-2">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-5 group">
                <div className="relative w-28 h-32 rounded-sm overflow-hidden shrink-0 bg-obsidian border border-transparent group-hover:border-gold/20 transition-colors duration-300">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="font-display text-lg text-ivory/90 leading-snug mb-1 group-hover:text-gold transition-colors duration-300">{item.title}</h3>
                    <p className="font-body font-medium text-gold tracking-wide">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gold/30 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-8 flex justify-center items-center text-ivory/60 hover:text-gold hover:bg-gold/10 transition-colors"
                      >−</button>
                      <span className="w-10 text-center text-[13px] text-ivory font-medium font-body">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-8 flex justify-center items-center text-ivory/60 hover:text-gold hover:bg-gold/10 transition-colors"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-ivory/40 hover:text-terracotta uppercase tracking-[0.15em] transition-colors font-body font-medium"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-8 border-t border-gold/10 bg-obsidian relative">
            <div className="absolute inset-0 jaali-pattern opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[15px] font-body text-ivory/70 uppercase tracking-wider">Subtotal</span>
                <span className="font-display text-2xl text-gold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[13px] text-ivory/40 font-body mb-8">Shipping & taxes calculated at checkout</p>
              <div className="flex flex-col gap-4">
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full" size="lg">Proceed to Checkout</Button>
                </Link>
                <Button variant="ghost" className="w-full text-sm" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
