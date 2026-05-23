import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal pt-20 pb-8 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand / Newsletter */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="font-display text-2xl tracking-widest text-ivory uppercase">
            Kraafto
          </Link>
          <p className="text-ivory/70 text-sm font-body">
            Get exclusive access to new collections & gift guides.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-obsidian border border-white/10 rounded-sm px-4 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold"
            />
            <button type="submit" className="bg-gold text-obsidian px-4 py-2 rounded-sm text-sm font-medium hover:bg-gold-light transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* About */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-lg text-ivory">About Kraafto</h4>
          <nav className="flex flex-col gap-3 text-sm text-ivory/70 font-body">
            <Link href="/about" className="hover:text-gold transition-colors">Our Story</Link>
            <Link href="/artisans" className="hover:text-gold transition-colors">The Artisans</Link>
            <Link href="/sustainability" className="hover:text-gold transition-colors">Sustainability</Link>
            <Link href="/careers" className="hover:text-gold transition-colors">Careers</Link>
          </nav>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-lg text-ivory">Customer Service</h4>
          <nav className="flex flex-col gap-3 text-sm text-ivory/70 font-body">
            <Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link>
            <Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link>
            <Link href="/policies/shipping" className="hover:text-gold transition-colors">Shipping & Returns</Link>
            <Link href="/track" className="hover:text-gold transition-colors">Track Order</Link>
          </nav>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-lg text-ivory">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-all">
              <span className="sr-only">Instagram</span>
              {/* Instagram Icon */}
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            {/* Pinterest Placeholder */}
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-all">
              <span className="font-display italic text-lg leading-none">P</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory/50 font-body">
        <p>&copy; {new Date().getFullYear()} Kraafto. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/policies/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          <Link href="/policies/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
