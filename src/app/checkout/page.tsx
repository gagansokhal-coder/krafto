'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

type Step = 'contact' | 'shipping' | 'payment';

const SHIPPING_METHODS = [
  {
    id: 'STANDARD',
    label: 'Standard Delivery',
    description: '5–7 business days',
    price: 0,
    priceLabel: 'Free over ₹2,000',
    icon: '📦',
  },
  {
    id: 'EXPRESS',
    label: 'Express Delivery',
    description: '2–3 business days',
    price: 199,
    priceLabel: '₹199',
    icon: '⚡',
  },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<Step>('contact');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({ email: '', phone: '' });
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [promoCode, setPromoCode] = useState('');

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCost =
    shippingMethod === 'EXPRESS' ? 199 : subtotal >= 2000 ? 0 : 99;
  const grandTotal = subtotal + shippingCost;

  // Redirect to shop if cart is empty (and order not placed)
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      // Don't redirect — just show empty state
    }
  }, [items, orderPlaced]);

  function handleContactNext(e: React.FormEvent) {
    e.preventDefault();
    setStep('shipping');
  }

  function handleShippingNext(e: React.FormEvent) {
    e.preventDefault();
    setStep('payment');
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          email: contact.email,
          phone: contact.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      if (data.url) {
        // Redirect to Stripe checkout session
        window.location.href = data.url;
      } else {
        // Fallback logic when Stripe is not configured
        setOrderNumber(data.orderNumber);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center">
          {/* Success animation */}
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-ivory mb-4 animate-fade-in-up">Order Confirmed!</h1>
          <p className="text-ivory/60 font-body mb-2 animate-fade-in-up">
            Thank you for your order. A confirmation has been sent to{' '}
            <span className="text-gold">{contact.email}</span>.
          </p>
          <p className="text-ivory/40 font-body text-sm mb-10 animate-fade-in-up">
            Order #{orderNumber}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link href="/account/orders">
              <Button variant="secondary">View My Orders</Button>
            </Link>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ivory mb-4">Your cart is empty</h1>
          <p className="text-ivory/60 font-body mb-8">Add some items before checking out.</p>
          <Link href="/shop"><Button>Shop Now</Button></Link>
        </div>
      </div>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: 'contact', label: 'Contact' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-obsidian pt-20 pb-24">
      {/* Minimal header */}
      <header className="border-b border-white/10 py-5 px-6 flex items-center justify-center">
        <Link href="/" className="font-display text-2xl tracking-[0.25em] text-ivory uppercase hover:text-gold transition-colors">
          Kraafto
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Left — Form */}
        <div className="flex-1">
          {/* Step indicator */}
          <nav className="flex items-center gap-2 mb-10 font-body text-sm">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => i < stepIndex && setStep(s.id)}
                  className={`transition-colors ${
                    s.id === step
                      ? 'text-gold font-medium'
                      : i < stepIndex
                      ? 'text-ivory/60 hover:text-gold cursor-pointer'
                      : 'text-ivory/30 cursor-default'
                  }`}
                >
                  {s.label}
                </button>
                {i < steps.length - 1 && (
                  <span className="text-ivory/20">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Step: Contact */}
          {step === 'contact' && (
            <form onSubmit={handleContactNext} className="space-y-6">
              <h2 className="font-display text-2xl text-ivory mb-6">Contact Information</h2>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contact.phone}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="pt-2">
                <Button type="submit">Continue to Shipping</Button>
              </div>
            </form>
          )}

          {/* Step: Shipping */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingNext} className="space-y-6">
              <h2 className="font-display text-2xl text-ivory mb-6">Shipping Address</h2>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={address.line1}
                  onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="Street address, apartment, suite"
                />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Address Line 2</label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) => setAddress((p) => ({ ...p, line2: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="Landmark, area (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                    className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                    className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm text-ivory/70 mb-2 font-body">Pincode *</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={address.pincode}
                  onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))}
                  className="w-full bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  placeholder="6-digit pincode"
                />
              </div>

              {/* Shipping method */}
              <div className="pt-4">
                <h3 className="font-display text-xl text-ivory mb-4">Shipping Method</h3>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                        shippingMethod === method.id
                          ? 'border-gold bg-gold/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={() => setShippingMethod(method.id as 'STANDARD' | 'EXPRESS')}
                        className="accent-gold"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-body font-medium text-ivory">{method.label}</p>
                        <p className="font-body text-sm text-ivory/60">{method.description}</p>
                      </div>
                      <span className="font-body text-gold font-medium">{method.priceLabel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit">Continue to Payment</Button>
              </div>
            </form>
          )}

          {/* Step: Payment */}
          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <h2 className="font-display text-2xl text-ivory mb-6">Payment</h2>

              {/* Simulated payment form */}
              <div className="bg-charcoal border border-white/10 rounded-sm p-6 space-y-4">
                <p className="text-sm text-ivory/60 font-body mb-4">
                  Secure payment powered by Stripe / Razorpay
                </p>
                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-ivory/70 mb-2 font-body">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ivory/70 mb-2 font-body">CVV</label>
                    <input
                      type="text"
                      placeholder="•••"
                      className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                    />
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Promo Code</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 bg-charcoal border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  />
                  <Button type="button" variant="secondary" size="md">Apply</Button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" fullWidth disabled={loading} size="lg">
                  {loading ? 'Placing Order…' : `Place Order — ${formatCurrency(grandTotal)}`}
                </Button>
                <p className="text-xs text-ivory/40 font-body text-center mt-3">
                  By placing your order, you agree to our{' '}
                  <Link href="/policies/shipping" className="text-gold hover:underline">Terms & Conditions</Link>.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-charcoal border border-white/10 rounded-sm p-6 sticky top-24">
            <h3 className="font-display text-xl text-ivory mb-6 pb-4 border-b border-white/10">
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-obsidian shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-ivory truncate">{item.title}</p>
                  </div>
                  <p className="font-body text-sm text-gold shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-white/10 pt-4 font-body text-sm">
              <div className="flex justify-between text-ivory/70">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ivory/70">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-ivory font-semibold text-base pt-3 border-t border-white/10">
                <span>Total</span>
                <span className="text-gold">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
