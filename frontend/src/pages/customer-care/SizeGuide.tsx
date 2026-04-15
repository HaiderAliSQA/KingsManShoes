import React from 'react';

const SizeGuide: React.FC = () => {
  return (
    <div className="pt-24 pb-20 px-6 sm:px-6 lg:px-8 max-w-5xl mx-auto bg-km-bg">
      <h1 className="font-playfair text-4xl text-km-text mb-4 text-center">Men's Size Guide</h1>
      <p className="text-center font-dm text-km-text-2 mb-12 max-w-2xl mx-auto">
        Kings Man footwear traditionally conforms entirely to internationally established sizing charts ensuring consistently standardized fitments. Kindly manually consult the chart below structurally matching local sizing options.
      </p>

      <div className="bg-white border border-km-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-dm text-sm">
            <thead className="bg-[#f8f5f0] border-b border-km-border text-km-gold">
              <tr>
                <th className="px-6 py-5 uppercase tracking-widest font-bold">Standard EU Size</th>
                <th className="px-6 py-5 uppercase tracking-widest font-bold">UK Sizing</th>
                <th className="px-6 py-5 uppercase tracking-widest font-bold">US Sizing</th>
                <th className="px-6 py-5 uppercase tracking-widest font-bold">Foot Length (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-border text-km-text">
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">39</td>
                <td className="px-6 py-4">6</td>
                <td className="px-6 py-4">7</td>
                <td className="px-6 py-4 text-km-text-3">24.5</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">40</td>
                <td className="px-6 py-4">6.5</td>
                <td className="px-6 py-4">7.5</td>
                <td className="px-6 py-4 text-km-text-3">25.0</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">41</td>
                <td className="px-6 py-4">7.5</td>
                <td className="px-6 py-4">8.5</td>
                <td className="px-6 py-4 text-km-text-3">26.0</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">42</td>
                <td className="px-6 py-4">8</td>
                <td className="px-6 py-4">9</td>
                <td className="px-6 py-4 text-km-text-3">26.5</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">43</td>
                <td className="px-6 py-4">9</td>
                <td className="px-6 py-4">10</td>
                <td className="px-6 py-4 text-km-text-3">27.5</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">44</td>
                <td className="px-6 py-4">9.5</td>
                <td className="px-6 py-4">10.5</td>
                <td className="px-6 py-4 text-km-text-3">28.0</td>
              </tr>
              <tr className="hover:bg-[#fcfaf7] transition-colors">
                <td className="px-6 py-4 font-bold">45</td>
                <td className="px-6 py-4">10.5</td>
                <td className="px-6 py-4">11.5</td>
                <td className="px-6 py-4 text-km-text-3">29.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-[#1A1714] text-white">
          <h4 className="font-playfair text-lg text-km-gold mb-2">How to correctly measure</h4>
          <p className="font-dm text-sm text-km-text-3 font-light leading-relaxed">
            Position a blank sheet of paper squarely against a flat physical wall alongside the floor. Firmly stand atop securely anchoring your heel against exactly the wall line. Systematically mark the absolute tip of your longest toe physically using a pen. Extensively calculate the horizontal distance securely concluding with Centimeters (CM) manually interpreting the conversion chart precisely mentioned upwards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
