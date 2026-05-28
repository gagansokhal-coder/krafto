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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-xl border-b border-gold/10 py-3 shadow-warm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ivory hover:text-gold transition-colors duration-300"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="font-display text-2xl md:text-[1.7rem] tracking-[0.3em] text-ivory uppercase hover:text-gold transition-colors duration-500 font-semibold">
              Kraafto
            </Link>
            <span className="hidden md:block text-[9px] tracking-[0.35em] text-gold/50 uppercase font-body mt-0.5">
              Forged in Tradition
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-body text-[13px] font-medium tracking-[0.2em] uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ivory/60 hover:text-gold transition-colors duration-300 relative group py-1"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 text-ivory">
            {/* Search */}
            <button className="hover:text-gold transition-colors duration-300 group" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="hidden sm:block w-5 h-5 rounded-full bg-gold/10 animate-pulse" />
            ) : session ? (
              /* Logged In — User Avatar + Dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 group"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold group-hover:border-gold/60 group-hover:bg-gold/25 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(200,150,60,0.15)]">
                    {initials}
                  </div>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-charcoal border border-gold/10 rounded-sm shadow-warm-lg overflow-hidden animate-fade-in-up z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gold/10">
                      <p className="text-sm font-body text-ivory font-medium truncate">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs font-body text-ivory/40 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1.5">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-ivory/70 hover:bg-gold/5 hover:text-gold transition-colors duration-300"
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
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-gold hover:bg-gold/10 transition-colors duration-300"
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
                    <div className="border-t border-gold/10 py-1.5">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-body text-red-400/80 hover:bg-red-500/10 transition-colors duration-300"
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
                className="hidden sm:flex items-center gap-2 text-[13px] font-body text-ivory/60 hover:text-gold transition-colors duration-300 tracking-wider uppercase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Sign In
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative hover:text-gold transition-colors duration-300 group"
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-gold text-obsidian text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-gold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-sm" />
      </div>

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-charcoal border-r border-gold/10 z-[90] flex flex-col transition-transform duration-700 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Decorative gold accent line */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        <div className="flex items-center justify-between p-8 pb-6">
          <Link href="/" className="font-display text-xl tracking-[0.25em] text-ivory uppercase font-semibold" onClick={() => setMobileOpen(false)}>
            Kraafto
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-ivory/40 hover:text-gold transition-colors duration-300" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Subtle gold divider */}
        <div className="mx-8 h-px bg-gradient-to-r from-gold/20 via-gold/5 to-transparent mb-6" />

        <nav className="flex flex-col gap-1 px-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-2xl text-ivory/70 hover:text-gold transition-colors duration-300 py-2 border-b border-gold/5 last:border-0"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-gold/10 p-8">
          {session ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-body text-ivory font-medium">{session.user?.name || 'User'}</p>
                  <p className="text-xs font-body text-ivory/40">{session.user?.email}</p>
                </div>
              </div>
              <Link href="/account" className="text-sm font-body text-ivory/50 hover:text-gold transition-colors duration-300" onClick={() => setMobileOpen(false)}>My Account</Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-body text-gold/80 hover:text-gold transition-colors duration-300" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="text-sm font-body text-red-400/70 hover:text-red-400 transition-colors duration-300 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-body text-gold hover:text-brass transition-colors duration-300" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="text-sm font-body text-ivory/50 hover:text-gold transition-colors duration-300" onClick={() => setMobileOpen(false)}>Create Account</Link>
            </>
          )}
          <Link href="/contact" className="text-sm font-body text-ivory/50 hover:text-gold transition-colors duration-300" onClick={() => setMobileOpen(false)}>Contact Us</Link>
        </div>
      </div>
    </>
  );
}
