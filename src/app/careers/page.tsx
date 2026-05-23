import React from 'react';

export default function CareersPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-6">Join Kraafto</h1>
        <p className="font-body text-ivory/80 mb-12 text-lg">We are always looking for passionate individuals who share our dedication to exceptional craftsmanship and luxury experiences.</p>
        
        <div className="bg-charcoal p-12 border border-white/5 rounded-sm">
          <h2 className="text-2xl font-display mb-4">Current Openings</h2>
          <p className="font-body text-ivory/60 mb-8">There are currently no open positions, but we are always eager to connect with talented people.</p>
          <p className="font-body text-ivory/80">Please send your resume and portfolio to <a href="mailto:careers@kraafto.com" className="text-gold hover:underline">careers@kraafto.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
