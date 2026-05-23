import React from 'react';
import Image from 'next/image';

export default function SustainabilityPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory">
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display text-gold mb-6">Sustainable Luxury</h1>
        <p className="font-body text-ivory/80 text-xl max-w-3xl mx-auto leading-relaxed">
          At Kraafto, we believe that true luxury must be respectful of both the maker and the earth. Our commitment to sustainability is woven into every decision we make.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square md:aspect-[4/3] bg-charcoal">
          <Image src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop" alt="Natural materials" fill className="object-cover opacity-80" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-display text-gold mb-6">Conscious Materials</h2>
          <p className="font-body text-ivory/80 leading-relaxed mb-6">
            We work exclusively with artisans who source their materials responsibly. Whether it is ethically harvested wood, organic cotton, or recycled metals, every element of a Kraafto product is chosen with its environmental impact in mind.
          </p>
          <p className="font-body text-ivory/80 leading-relaxed">
            Our packaging is 100% plastic-free, utilizing recycled paper, biodegradable natural dyes, and reusable organic cotton dust bags to ensure that your unboxing experience is as mindful as it is beautiful.
          </p>
        </div>
      </div>
    </div>
  );
}
