import React from 'react';

const ReturnsExchanges: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-6 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-km-bg">
      <h1 className="font-playfair text-4xl text-km-text mb-4 text-center">Returns & Exchanges</h1>
      <p className="text-center font-dm text-km-text-2 mb-12">
        We ensure our footwear meets the highest standards. Should you need to process a return or exchange, please read our straightforward protocol below.
      </p>

      <div className="bg-white border border-km-border p-8 lg:p-10">
        <h2 className="font-playfair text-2xl text-km-text mb-6 pb-4 border-b border-km-border">The 7-Day Guarantee</h2>
        <p className="font-dm text-km-text-2 leading-relaxed mb-6">
          Kings Man proudly offers a strict <strong>7-Day Return and Exchange Window</strong>. If the shoe size or style does not match your expectations upon delivery, you securely retain the right to query an exchange or return within exactly 7 days of the shipment delivery physical timestamp.
        </p>

        <h3 className="font-playfair text-xl text-km-text mb-4 mt-8">Required Conditions</h3>
        <ul className="space-y-4 font-dm text-km-text-2 list-none">
          <li className="flex items-start gap-3">
            <span className="text-km-gold mt-1">✓</span>
            <span>The footwear strictly remains absolutely unwashed, entirely unworn, and uncreased.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-km-gold mt-1">✓</span>
            <span>The product must be securely repacked in the original Kings Man premium branded box preserving all structural padding and printed tags.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-km-gold mt-1">✓</span>
            <span>The original digital or printed invoice must vividly be present during the manual audit.</span>
          </li>
        </ul>

        <h3 className="font-playfair text-xl text-km-text mb-4 mt-10">Return Process Instructions</h3>
        <div className="bg-[#f8f5f0] border-l-2 border-km-gold p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-playfair font-bold text-km-gold shrink-0 border border-km-gold/30">1</div>
            <div>
              <h4 className="font-dm font-bold text-km-text mb-1 uppercase text-sm tracking-widest">Lodge Complaint</h4>
              <p className="font-dm text-sm text-km-text-2">Contact our WhatsApp hotline (+92 300 7702061) sharing your Order ID and attached proof images depicting the current state.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-playfair font-bold text-km-gold shrink-0 border border-km-gold/30">2</div>
            <div>
              <h4 className="font-dm font-bold text-km-text mb-1 uppercase text-sm tracking-widest">Shipment Dispatch</h4>
              <p className="font-dm text-sm text-km-text-2">Dispatch the carefully sealed parcel securely backwards to our formally shared Chiniot warehouse address utilizing Leopard or TCS.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-playfair font-bold text-km-gold shrink-0 border border-km-gold/30">3</div>
            <div>
              <h4 className="font-dm font-bold text-km-text mb-1 uppercase text-sm tracking-widest">Audit & Resolution</h4>
              <p className="font-dm text-sm text-km-text-2">Upon receiving the stock, our warehouse executes a physical inspection evaluating the condition. Approved cases will receive requested sizes or manual banking refunds instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
