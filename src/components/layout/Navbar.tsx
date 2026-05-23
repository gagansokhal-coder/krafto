'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/collections', label: 'Collections' },
  { href: '/shop', label: 'Shop' },
  { href: '/gifts', label: 'Gifts' },
  { href: '/about', label: 'Our Story' },
];

export function Navbar() {
  const { items, openCart } = useCart();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === 'ADMIN' ||
    (session?.user as { role?: string } | undefined)?.role === 'SUPER_ADMIN';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
      ? session.user.email.charAt(0).toUpperCase()
      : '?';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="font-display text-2xl tracking-[0.25em] text-ivory uppercase hover:text-gold transition-colors">
            Kraafto
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium tracking-widest uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ivory/70 hover:text-gold transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5 text-ivory">
            {/* Search */}
            <button className="hover:text-gold transition-colors" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="hidden sm:block w-5 h-5 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              /* Logged In — User Avatar + Dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-sm font-bold">
                    {initials}
                  </div>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-charcoal border border-white/10 rounded-sm shadow-2xl overflow-hidden animate-fade-in-up z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-body text-ivory font-medium truncate">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs font-body text-ivory/50 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-ivory/80 hover:bg-white/5 hover:text-gold transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        My Account
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-gold hover:bg-gold/10 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-white/10 py-2">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-body text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In — Login Link */
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 text-sm font-body text-ivory/80 hover:text-gold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Sign In
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative hover:text-gold transition-colors"
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce-gentle">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-charcoal border-r border-white/10 z-[90] flex flex-col p-8 gap-8 transition-transform duration-500 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-widest text-ivory uppercase" onClick={() => setMobileOpen(false)}>
            Kraafto
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-ivory/60 hover:text-gold transition-colors" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-2xl text-ivory/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-8">
          {session ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-sm font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-body text-ivory font-medium">{session.user?.name || 'User'}</p>
                  <p className="text-xs font-body text-ivory/50">{session.user?.email}</p>
                </div>
              </div>
              <Link href="/account" className="text-sm font-body text-ivory/60 hover:text-gold transition-colors" onClick={() => setMobileOpen(false)}>My Account</Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-body text-gold hover:text-gold/80 transition-colors" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="text-sm font-body text-red-400 hover:text-red-300 transition-colors text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-body text-gold hover:text-gold/80 transition-colors" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="text-sm font-body text-ivory/60 hover:text-gold transition-colors" onClick={() => setMobileOpen(false)}>Create Account</Link>
            </>
          )}
          <Link href="/contact" className="text-sm font-body text-ivory/60 hover:text-gold transition-colors" onClick={() => setMobileOpen(false)}>Contact Us</Link>
        </div>
      </div>
    </>
  );
}
