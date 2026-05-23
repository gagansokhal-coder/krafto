import React from 'react';

export default function TrackOrderPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory px-4 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-6">Track Your Order</h1>
        <p className="font-body text-ivory/80 mb-10">Enter your order number and email address to check the status of your Kraafto delivery.</p>
        
        <form className="bg-charcoal p-8 rounded-sm border border-white/5 max-w-xl mx-auto flex flex-col gap-6 text-left">
          <div>
            <label htmlFor="orderId" className="block font-display text-sm tracking-widest uppercase mb-2">Order Number</label>
            <input type="text" id="orderId" className="w-full bg-obsidian border border-white/10 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="e.g. KR-123456" />
          </div>
          <div>
            <label htmlFor="email" className="block font-display text-sm tracking-widest uppercase mb-2">Email Address</label>
            <input type="email" id="email" className="w-full bg-obsidian border border-white/10 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="Email used for the order" />
          </div>
          <button type="button" className="w-full bg-gold text-obsidian font-display uppercase tracking-widest py-4 mt-2 hover:bg-gold-light transition-colors">
            Track Order
          </button>
        </form>
      </div>
    </div>
  );
}
