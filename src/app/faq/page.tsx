import React from 'react';

export default function FAQPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-8 font-body text-ivory/80">
          <div>
            <h3 className="text-xl font-display text-ivory mb-2">How long does shipping take?</h3>
            <p>Our pieces are carefully packaged and shipped globally. Standard shipping typically takes 5-7 business days, while expedited options are available at checkout.</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-ivory mb-2">Do you offer international shipping?</h3>
            <p>Yes, Kraafto delivers worldwide. Shipping costs and delivery times vary depending on the destination and are calculated at checkout.</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-ivory mb-2">Can I track my order?</h3>
            <p>Once your order is dispatched, you will receive an email with tracking information. You can also track your order through your Kraafto account.</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-ivory mb-2">What is your return policy?</h3>
            <p>We accept returns within 14 days of delivery for a full refund, provided the item is in its original, unused condition with all packaging intact. Custom or personalized items cannot be returned.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
