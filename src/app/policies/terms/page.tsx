import React from 'react';

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-8 text-center">Terms of Service</h1>
        <div className="prose prose-invert prose-gold max-w-none font-body text-ivory/80">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-6">Welcome to Kraafto. By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">2. Product Descriptions</h2>
          <p className="mb-6">Kraafto attempts to be as accurate as possible. However, Kraafto does not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free. Because our items are handcrafted, slight variations in color, texture, and size may occur.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">3. Intellectual Property</h2>
          <p className="mb-6">All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Kraafto or its content suppliers and protected by international copyright laws.</p>
        </div>
      </div>
    </div>
  );
}
