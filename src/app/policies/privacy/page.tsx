import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-invert prose-gold max-w-none font-body text-ivory/80">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-6">At Kraafto, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-6">We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. This includes your name, email address, mailing address, phone number, and payment information.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-6">Any of the information we collect from you may be used in one of the following ways: to personalize your experience, to improve our website, to improve customer service, to process transactions, or to send periodic emails.</p>
          <h2 className="text-2xl font-display text-ivory mt-8 mb-4">3. Data Security</h2>
          <p className="mb-6">We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use state-of-the-art encryption to protect sensitive information transmitted online.</p>
        </div>
      </div>
    </div>
  );
}
