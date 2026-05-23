'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const BENEFITS = [
  { icon: '🎁', title: 'Bulk Ordering', desc: 'Quantity discounts from 10+ units. The more you order, the more you save.' },
  { icon: '🏷️', title: 'Custom Branding', desc: 'Add your company logo to packaging, gift tags, and ribbon.' },
  { icon: '📦', title: 'Premium Packaging', desc: 'Signature Kraafto obsidian boxes with custom tissue and ribbon.' },
  { icon: '🚚', title: 'Dedicated Delivery', desc: 'Coordinated delivery to multiple addresses across India.' },
  { icon: '👤', title: 'Account Manager', desc: 'A dedicated gifting concierge for your account.' },
  { icon: '🧾', title: 'GST Invoicing', desc: 'Proper GST invoices for seamless business accounting.' },
];

const OCCASIONS = ['Diwali', 'Christmas', 'New Year', 'Employee Appreciation', 'Client Onboarding', 'Milestones & Awards', 'Product Launches', 'Conferences'];

export default function CorporateGiftsPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', quantity: '', budget: '', occasion: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, POST to /api/corporate-inquiry
    setSubmitted(true);
  }

  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen">

      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2560&auto=format&fit=crop" alt="Corporate gifting" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/30 to-obsidian" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">For Businesses</span>
          <h1 className="font-display text-5xl md:text-7xl text-ivory mb-6 leading-tight">Corporate Gifting</h1>
          <p className="text-xl text-ivory/80 font-body max-w-2xl mx-auto mb-8">
            Leave a lasting impression on clients, partners, and employees with handcrafted luxury gifts that speak volumes.
          </p>
          <a href="#inquiry">
            <Button size="lg">Get a Custom Quote</Button>
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-4">Why Kraafto for Corporate Gifting?</h2>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-charcoal border border-white/5 rounded-sm p-6 hover:border-gold/20 transition-colors">
              <span className="text-3xl mb-4 block">{b.icon}</span>
              <h3 className="font-display text-xl text-ivory mb-2">{b.title}</h3>
              <p className="font-body text-sm text-ivory/60 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-charcoal/30 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-4">Perfect for Every Occasion</h2>
          <p className="text-ivory/60 font-body mb-10 max-w-xl mx-auto">From festive celebrations to employee milestones, we have the perfect gift for every corporate moment.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((o) => (
              <span key={o} className="px-5 py-2.5 bg-obsidian border border-white/10 rounded-full text-sm font-body text-ivory/70">
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-4">Request a Quote</h2>
          <p className="text-ivory/60 font-body">Tell us about your requirements and our gifting concierge will get back to you within 24 hours.</p>
        </div>

        {submitted ? (
          <div className="bg-charcoal border border-gold/20 rounded-sm p-12 text-center">
            <span className="text-4xl mb-4 block">🎁</span>
            <h3 className="font-display text-2xl text-ivory mb-3">Thank You!</h3>
            <p className="text-ivory/60 font-body mb-6">Your inquiry has been received. Our corporate gifting team will contact you within 24 hours.</p>
            <Link href="/shop"><Button variant="secondary">Browse Products</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-charcoal border border-white/5 rounded-sm p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Your Name *</label>
                <input name="name" required value={form.name} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Company Name *</label>
                <input name="company" required value={form.company} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Email Address *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Phone Number</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Quantity Required *</label>
                <input name="quantity" required placeholder="e.g. 50" value={form.quantity} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
              <div>
                <label className="block text-sm text-ivory/70 mb-2 font-body">Budget per Gift (₹)</label>
                <input name="budget" placeholder="e.g. 2000" value={form.budget} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ivory/70 mb-2 font-body">Occasion</label>
              <select name="occasion" value={form.occasion} onChange={handleChange} className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body">
                <option value="">Select an occasion</option>
                {OCCASIONS.map((o) => <option key={o} value={o} className="bg-obsidian">{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-ivory/70 mb-2 font-body">Additional Requirements</label>
              <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Custom branding, specific products, delivery timeline…"
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body resize-none placeholder-ivory/30" />
            </div>
            <Button type="submit" size="lg">Submit Inquiry</Button>
          </form>
        )}
      </section>
    </div>
  );
}
