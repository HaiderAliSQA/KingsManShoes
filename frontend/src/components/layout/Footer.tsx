// frontend/src/components/layout/Footer.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.footer-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription submitted');
    // Can be connected to API later
  };

  return (
    <footer className="flex flex-col border-none">

      {/* ══════════════════════════════
          SECTION 1 — NEWSLETTER BAR
      ══════════════════════════════ */}
      <div
        className="bg-[#0D0B04] border-b border-[#1E1A08] px-6 py-6 md:px-12 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 footer-reveal"
        style={{ transitionDelay: '0s' }}
      >
        <div className="flex flex-col gap-1">
          <h4 className="font-playfair text-[18px] text-[#E8E0D0] font-semibold m-0">
            Stay Updated on New Drops
          </h4>
          <p className="font-dm text-[12px] text-[#6B6355] m-0">
            Fresh arrivals, exclusive offers — delivered to your inbox
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Newsletter Form */}
          <form onSubmit={handleSubscribe} className="flex h-[38px] w-full sm:w-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="newsletter-input bg-[#1A1608] border border-[#2A2416] border-r-0 text-[#E8E0D0] font-dm text-[12px] px-4 py-2 placeholder-[#3D3520] w-[220px] flex-1 sm:flex-none transition-colors"
            />
            <button
              type="submit"
              className="bg-[#B8860B] text-black font-dm text-[10px] font-bold tracking-[2px] px-5 py-2 hover:bg-[#D4A017] transition-all duration-200"
            >
              SUBSCRIBE
            </button>
          </form>

          {/* WhatsApp Button */}
          <button
            onClick={() => window.open('https://wa.me/923007002061', '_blank')}
            className="flex items-center gap-2 bg-[#0A1F0F] border border-[#1A3A1F] px-4 py-[10px] sm:py-2 hover:bg-[#0F2D16] hover:border-[#22C55E] cursor-pointer transition-all duration-300 w-full sm:w-auto h-[38px] justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-dm text-[11px] text-[#22C55E] tracking-[1px] font-medium">
              WHATSAPP UPDATES
            </span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════
          SECTION 2 — MAIN FOOTER GRID
      ══════════════════════════════ */}
      <div className="bg-[#111008] px-6 py-10 md:px-12 md:pt-[60px] md:pb-[48px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-7 md:gap-10">

          {/* COLUMN 1 — Brand */}
          <div className="flex flex-col footer-col footer-reveal" style={{ transitionDelay: '0s' }}>
            <Link to="/" className="flex flex-col hover:opacity-90 transition-opacity">
              <span className="font-playfair font-bold text-[22px] text-white tracking-[4px] uppercase m-0 leading-none">
                Kings Man
              </span>
              <span className="font-dm text-[9px] tracking-[6px] text-[#B8860B] uppercase mt-1">
                Footwear for Men
              </span>
            </Link>

            <p className="font-dm text-[12px] text-[#6B6355] leading-[1.8] mt-4 max-w-[220px]">
              Step into royalty. Handcrafted men's footwear for the
              discerning gentleman. From boardrooms to banquets —
              crafted with precision.
            </p>

            <div className="flex flex-row gap-2.5 mt-5">
              <button className="social-btn w-[34px] h-[34px] rounded-full border border-[#2A2416] bg-transparent flex items-center justify-center hover:border-[#B8860B] hover:bg-[#B8860B]/10 group">
                <svg className="w-3.5 h-3.5 fill-[#6B6355] group-hover:fill-[#B8860B] transition-colors" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="social-btn w-[34px] h-[34px] rounded-full border border-[#2A2416] bg-transparent flex items-center justify-center hover:border-[#B8860B] hover:bg-[#B8860B]/10 group">
                <svg className="w-3.5 h-3.5 fill-[#6B6355] group-hover:fill-[#B8860B] transition-colors" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
              <button
                onClick={() => window.open('https://wa.me/923007002061', '_blank')}
                className="social-btn w-[34px] h-[34px] rounded-full border border-[#2A2416] bg-transparent flex items-center justify-center hover:border-[#B8860B] hover:bg-[#B8860B]/10 group"
              >
                <svg className="w-3.5 h-3.5 fill-[#6B6355] group-hover:fill-[#B8860B] transition-colors" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
            </div>
          </div>

          {/* COLUMN 2 — Explore */}
          <div className="flex flex-col footer-col footer-reveal" style={{ transitionDelay: '0.1s' }}>
            <h3 className="footer-col-title font-dm text-[10px] tracking-[3px] text-[#B8860B] font-medium uppercase mb-5">
              Explore
            </h3>
            <div className="flex flex-col font-dm text-[12px]">
              <Link to="/products?category=new-drops" className="footer-link text-[#6B6355]">New Drops</Link>
              <Link to="/products?category=formal-collection" className="footer-link text-[#6B6355]">Formal Collection</Link>
              <Link to="/products?category=casual-collection" className="footer-link text-[#6B6355]">Casual Collection</Link>
              <Link to="/products?category=best-selling" className="footer-link text-[#6B6355]">Best Sellers</Link>
              <Link to="/products?category=peshawari-sandals" className="footer-link text-[#6B6355]">Peshawari Sandals</Link>
              <Link to="/products?category=skechers" className="footer-link text-[#6B6355]">Skechers</Link>
              <Link to="/products?category=boots" className="footer-link text-[#6B6355]">Boots & Loafers</Link>
            </div>
          </div>

          {/* COLUMN 3 — Customer Care */}
          <div className="flex flex-col footer-col footer-reveal" style={{ transitionDelay: '0.2s' }}>
            <h3 className="footer-col-title font-dm text-[10px] tracking-[3px] text-[#B8860B] font-medium uppercase mb-5">
              Customer Care
            </h3>
            <div className="flex flex-col font-dm text-[12px]">
              <Link to="/contact" className="footer-link text-[#6B6355]">Contact Us</Link>
              <Link to="/shipping-policy" className="footer-link text-[#6B6355]">Shipping Policy</Link>
              <Link to="/returns" className="footer-link text-[#6B6355]">Returns & Exchanges</Link>
              <Link to="/track-order" className="footer-link text-[#6B6355]">Track Order</Link>
              <Link to="/size-guide" className="footer-link text-[#6B6355]">Size Guide</Link>
              <Link to="/faqs" className="footer-link text-[#6B6355]">FAQs</Link>
            </div>
          </div>

          {/* COLUMN 4 — Get in Touch */}
          <div className="flex flex-col footer-col footer-reveal" style={{ transitionDelay: '0.3s' }}>
            <h3 className="footer-col-title font-dm text-[10px] tracking-[3px] text-[#B8860B] font-medium uppercase mb-5">
              Get in Touch
            </h3>
            <div className="flex flex-col">
              {/* Address */}
              <div className="flex flex-row items-start gap-2.5 mb-3.5">
                <div className="w-7 h-7 rounded-full border border-[#2A2416] shrink-0 flex items-center justify-center -mt-0.5">
                  <svg className="w-3 h-3 fill-[#B8860B]" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <span className="font-dm text-[12px] text-[#6B6355] leading-[1.6]">
                  Jhumra Chowk, Near MCB Bank
                  Alamgir Road, Left Street No. 1
                  Chiniot, Pakistan
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-row items-center gap-2.5 mb-3.5 group cursor-pointer" onClick={() => window.open('tel:+923007702061')}>
                <div className="w-7 h-7 rounded-full border border-[#2A2416] shrink-0 flex items-center justify-center group-hover:border-[#B8860B] transition-colors">
                  <svg className="w-3 h-3 fill-[#B8860B]" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </div>
                <span className="font-dm text-[12px] text-[#6B6355] group-hover:text-[#E8E0D0] transition-colors">
                  +92 300 7702 061
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-row items-center gap-2.5 mb-3.5 group cursor-pointer" onClick={() => window.open('mailto:shahbazarif770@gmail.com')}>
                <div className="w-7 h-7 rounded-full border border-[#2A2416] shrink-0 flex items-center justify-center group-hover:border-[#B8860B] transition-colors">
                  <svg className="w-3 h-3 fill-[#B8860B]" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <span className="font-dm text-[12px] text-[#6B6355] group-hover:text-[#E8E0D0] transition-colors">
                  shahbazarif770@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          SECTION 3 — THIN DIVIDER
      ══════════════════════════════ */}
      <div
        className="h-px bg-transparent"
        style={{
          margin: '0',
          background: 'linear-gradient(90deg, #111008 0%, #2A2416 20%, #2A2416 80%, #111008 100%)'
        }}
      ></div>

      {/* ══════════════════════════════
          SECTION 4 — BOTTOM BAR
      ══════════════════════════════ */}
      <div
        className="bg-[#111008] px-6 py-4 md:px-12 md:py-5 flex flex-col md:flex-row justify-between items-center gap-3 footer-reveal"
        style={{ transitionDelay: '0.1s' }}
      >
        <span className="font-dm text-[11px] text-[#3D3520] tracking-[1px] text-center md:text-left">
          &copy; {new Date().getFullYear()} Kings Man Shoes. All rights reserved. — Men's Collection Only
        </span>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <span className="bg-[#1A1608] border border-[#2A2416] px-3 py-1 font-dm text-[10px] text-[#4A4228] tracking-[1px]">
            SECURE CHECKOUT
          </span>
          <span className="bg-[#1A1608] border border-[#2A2416] px-3 py-1 font-dm text-[10px] text-[#4A4228] tracking-[1px]">
            TCS DELIVERY
          </span>
          <span className="bg-[#1A1608] border border-[#2A2416] px-3 py-1 font-dm text-[10px] text-[#4A4228] tracking-[1px]">
            7-DAY RETURNS
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
