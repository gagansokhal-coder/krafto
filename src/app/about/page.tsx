import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen">
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2560&auto=format&fit=crop" alt="The Kraafto Atelier" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/40 to-obsidian" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-6 block animate-fade-in-up">The Kraafto Story</span>
          <h1 className="text-5xl md:text-7xl font-display text-ivory mb-6 leading-tight text-balance animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Curating the Rare,<br />Celebrating the Crafted
          </h1>
        </div>
      </section>

      {/* ── 2. The Manifesto ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-24 text-center">
        <h2 className="text-3xl font-display text-gold mb-8">Our Manifesto</h2>
        <p className="text-xl md:text-2xl text-ivory/80 font-body leading-relaxed text-balance">
          We believe true luxury is not defined by logos, but by the hands that made it, the hours poured into it, and the heritage it represents. Kraafto is a sanctuary for those who seek meaning in material—a bridge between the world&apos;s most exceptional artisans and the homes that will cherish their work for generations.
        </p>
      </section>

      {/* ── 3. The Founders ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative aspect-[3/4] rounded-sm overflow-hidden bg-charcoal">
            <Image src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop" alt="Silk textile detail" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-gold font-display text-xl">Isabella & Julian</p>
              <p className="text-ivory/60 font-body text-sm">Founders, Kraafto</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">Genesis</span>
            <h2 className="text-3xl md:text-5xl font-display text-ivory mb-6 leading-snug">Born from a Journey</h2>
            <div className="w-12 h-1 bg-gold mb-8" />
            <p className="text-ivory/80 font-body leading-relaxed mb-6 text-lg">
              Kraafto began during a winter spent in the artisan districts of Kyoto. We witnessed families dedicating their entire lives to perfecting a single craft—woodworking, ceramics, textiles—only to struggle against the tide of mass production.
            </p>
            <p className="text-ivory/80 font-body leading-relaxed text-lg">
              We realized that the most beautiful objects in the world weren&apos;t found in luxury boutiques, but in quiet, dusty ateliers. We created Kraafto to tell their stories, to preserve their techniques, and to bring their masterpieces to a global audience that understands their true value.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Our Pillars ── */}
      <section className="bg-charcoal/30 py-32 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-display text-ivory mb-6">The Three Pillars</h2>
            <div className="w-16 h-1 bg-gold mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              {
                title: 'Uncompromising Quality',
                desc: 'We inspect every weave, every joint, every glaze. If an object does not meet our exacting standards of durability and aesthetic perfection, it does not join the Kraafto collection.',
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              },
              {
                title: 'Ethical Partnership',
                desc: 'We operate on a direct-trade model. By eliminating middlemen, we ensure that the artisans who pour their soul into these creations receive the lion\'s share of the profit.',
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
              },
              {
                title: 'The Art of Gifting',
                desc: 'We believe a gift should be an experience. From handwritten notes on cotton paper to our signature obsidian and gold unboxing experience, we elevate every detail of presentation.',
                icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              }
            ].map((p, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-8 text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-500">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-display text-ivory mb-4">{p.title}</h3>
                <p className="text-ivory/70 font-body leading-relaxed text-balance">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
