'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push('/account');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-3xl tracking-[0.25em] text-ivory uppercase hover:text-gold transition-colors">
            Kraafto
          </Link>
          <p className="text-ivory/50 font-body text-sm mt-3">Create your account</p>
        </div>

        <div className="bg-charcoal border border-white/10 rounded-sm p-8 md:p-10">
          <h1 className="font-display text-2xl text-ivory mb-8">Join Kraafto</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-ivory/70 mb-2 font-body">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-ivory/70 mb-2 font-body">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-ivory/70 mb-2 font-body">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm text-ivory/70 mb-2 font-body">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange}
                className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
                placeholder="Repeat your password"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-ivory/50 font-body mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
