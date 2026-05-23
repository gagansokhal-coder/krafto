'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-10">
        <Link href="/" className="font-display text-3xl tracking-[0.25em] text-ivory uppercase hover:text-gold transition-colors">
          Kraafto
        </Link>
        <p className="text-ivory/50 font-body text-sm mt-3">Sign in to your account</p>
      </div>

      <div className="bg-charcoal border border-white/10 rounded-sm p-8 md:p-10">
        <h1 className="font-display text-2xl text-ivory mb-8">Welcome Back</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body px-4 py-3 rounded-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-ivory/70 mb-2 font-body">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-sm text-ivory/70 font-body">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-gold hover:underline font-body">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Quick Access Hint */}
        <div className="mt-6 p-4 bg-obsidian/50 border border-white/5 rounded-sm">
          <p className="text-xs text-ivory/40 font-body mb-2 uppercase tracking-wider">Demo Credentials</p>
          <div className="space-y-1 text-xs font-body text-ivory/60">
            <p><span className="text-gold">Admin:</span> admin@kraafto.com / Admin@Kraafto2026</p>
            <p><span className="text-ivory/80">Customer:</span> demo@kraafto.com / Customer@123</p>
          </div>
        </div>

        <p className="text-center text-sm text-ivory/50 font-body mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-gold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-24">
      <Suspense fallback={
        <div className="w-full max-w-md text-center text-ivory/60 font-body">Loading...</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
