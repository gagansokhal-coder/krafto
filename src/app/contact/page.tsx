'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BRAND_EMAIL, BRAND_PHONE, BRAND_WHATSAPP } from '@/lib/constants';

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-8 bg-obsidian min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16">

        {/* Left Column — Contact Info */}
        <div className="lg:w-1/3">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-ivory mb-6">Contact Us</h1>
          <p className="text-ivory/70 font-body mb-10 leading-relaxed text-balance">
            Whether you have a question about our bespoke services, need assistance with an order,
            or simply wish to learn more about our artisans, we are here to assist you.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl text-gold mb-2">Customer Care</h3>
              <p className="text-ivory/80 font-body">
                Email:{' '}
                <a href={`mailto:${BRAND_EMAIL}`} className="hover:text-gold transition-colors">
                  {BRAND_EMAIL}
                </a>
              </p>
              <p className="text-ivory/80 font-body">
                Phone:{' '}
                <a href={`tel:${BRAND_PHONE}`} className="hover:text-gold transition-colors">
                  {BRAND_PHONE}
                </a>
              </p>
              <p className="text-ivory/60 font-body text-sm mt-1">
                Available Mon–Fri, 9am – 6pm IST
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl text-gold mb-2">WhatsApp</h3>
              <a
                href={BRAND_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/80 font-body hover:text-gold transition-colors"
              >
                Chat with us on WhatsApp →
              </a>
            </div>

            <div>
              <h3 className="font-display text-xl text-gold mb-2">Corporate Gifting</h3>
              <p className="text-ivory/80 font-body">
                For bulk orders and corporate gifting enquiries, visit our{' '}
                <a href="/corporate-gifts" className="text-gold hover:underline">
                  Corporate Gifts
                </a>{' '}
                page.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column — Contact Form */}
        <div className="lg:w-2/3 bg-charcoal p-8 md:p-12 rounded-sm border border-white/5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sage/20 border border-sage/40 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-sage"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-ivory">Message Sent!</h2>
              <p className="text-ivory/60 font-body max-w-sm">
                Thank you for reaching out. Our concierge team will respond within 24 hours.
              </p>
              <button
                onClick={() => { setSuccess(false); setForm({ firstName: '', lastName: '', email: '', subject: 'general', message: '' }); }}
                className="text-gold hover:underline font-body text-sm mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-display text-ivory mb-6 border-b border-white/10 pb-4">
                Send a Message
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body px-4 py-3 rounded-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="firstName">
                      First Name <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="lastName">
                      Last Name <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="email">
                    Email Address <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="subject">
                    Inquiry Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
                  >
                    <option value="general" className="bg-obsidian">General Inquiry</option>
                    <option value="order" className="bg-obsidian">Order Status</option>
                    <option value="bespoke" className="bg-obsidian">Bespoke / Custom Order</option>
                    <option value="corporate" className="bg-obsidian">Corporate Gifting</option>
                    <option value="press" className="bg-obsidian">Press / Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-ivory/70 mb-2 font-body" htmlFor="message">
                    Message <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors resize-none font-body"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full md:w-auto px-12">
                    {loading ? 'Sending…' : 'Submit Inquiry'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
