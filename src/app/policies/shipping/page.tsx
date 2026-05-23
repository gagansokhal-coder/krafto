import React from 'react';

export default function PoliciesPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-8">
      <h1 className="text-4xl md:text-5xl font-display text-ivory mb-12 text-center">Shipping & Returns</h1>
      
      <div className="space-y-12 font-body text-ivory/80 leading-relaxed">
        
        <section>
          <h2 className="text-2xl font-display text-gold mb-4 border-b border-white/10 pb-2">Shipping Information</h2>
          <p className="mb-4">
            At Kraafto, we understand that our handcrafted pieces require the utmost care in transit. 
            All items are securely packaged using custom-fitted, eco-friendly materials to ensure they arrive in pristine condition.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong className="text-ivory">Standard Shipping (5-7 Business Days):</strong> Complimentary on all orders over $200. For orders under $200, a flat rate of $15 applies.</li>
            <li><strong className="text-ivory">Express Shipping (2-3 Business Days):</strong> Available for $35 on all domestic orders.</li>
            <li><strong className="text-ivory">White Glove Delivery:</strong> For oversized or extremely fragile items (such as large sculptures or furniture), we offer a white-glove delivery service starting at $150. This includes room-of-choice placement and debris removal.</li>
          </ul>
          <p>
            Please note that bespoke and personalized items require an additional 2-4 weeks for creation before they are ready to ship.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-gold mb-4 border-b border-white/10 pb-2">International Shipping</h2>
          <p className="mb-4">
            We proudly ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on the destination and the weight/dimensions of the items.
          </p>
          <p>
            <strong className="text-ivory">Duties & Taxes:</strong> International orders may be subject to local customs duties and taxes. These are the responsibility of the recipient and are not included in the purchase price or shipping cost.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display text-gold mb-4 border-b border-white/10 pb-2">Return Policy</h2>
          <p className="mb-4">
            We want you to be completely enamored with your Kraafto purchase. If for any reason an item does not meet your expectations, we accept returns within 14 days of delivery for a full refund (excluding original shipping costs).
          </p>
          <p className="mb-4">
            To be eligible for a return, the item must be unused, in the same condition that you received it, and in its original premium packaging.
          </p>
          <p className="mb-4">
            <strong className="text-ivory">Exceptions:</strong> Due to their nature, the following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bespoke or personalized items</li>
            <li>Gift cards</li>
            <li>Items marked as &ldquo;Final Sale&rdquo;</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-display text-gold mb-4 border-b border-white/10 pb-2">How to Initiate a Return</h2>
          <p className="mb-4">
            To initiate a return, please contact our concierge team at <a href="mailto:concierge@kraafto.com" className="text-gold hover:underline">concierge@kraafto.com</a> with your order number. We will provide you with a complimentary return shipping label and detailed instructions.
          </p>
          <p>
            Once your return is received and inspected, we will send you an email to notify you of the approval or rejection of your refund. Approved refunds will be processed to the original method of payment within 5-7 business days.
          </p>
        </section>

      </div>
    </div>
  );
}
