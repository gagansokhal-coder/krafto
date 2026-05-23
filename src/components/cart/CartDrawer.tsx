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
        className={`fixed inset-0 bg-obsidian/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-charcoal border-l border-white/10 shadow-2xl z-[70] flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-display text-2xl text-ivory">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-ivory/60 hover:text-gold transition-colors p-2 -mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-ivory/20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <p className="font-display text-xl text-ivory/50">Your cart is empty</p>
              <button onClick={closeCart} className="text-sm text-gold underline underline-offset-4 font-body hover:text-gold/80 transition-colors">
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-24 h-24 rounded-sm overflow-hidden shrink-0 bg-obsidian">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="font-body font-medium text-ivory text-sm leading-snug mb-1">{item.title}</h3>
                    <p className="font-body text-gold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/20 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex justify-center items-center text-ivory/70 hover:text-gold transition-colors"
                      >−</button>
                      <span className="w-8 text-center text-sm text-ivory">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex justify-center items-center text-ivory/70 hover:text-gold transition-colors"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-ivory/40 hover:text-red-400 uppercase tracking-widest transition-colors font-body"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-white/10 bg-obsidian/40">
            <div className="flex justify-between items-center mb-2 font-body">
              <span className="text-sm text-ivory/70">Subtotal</span>
              <span className="font-semibold text-lg text-gold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-ivory/40 font-body mb-6">Shipping & taxes calculated at checkout</p>
            <div className="flex flex-col gap-3">
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
              <Button variant="ghost" className="w-full text-sm" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
