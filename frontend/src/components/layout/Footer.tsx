// frontend/src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1714] pt-16 pb-8 border-t-[4px] border-km-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col mb-6 inline-block">
              <span className="font-playfair text-2xl font-bold text-white tracking-widest uppercase">
                Kings Man
              </span>
              <span className="font-dm text-[9px] tracking-[6px] text-km-gold uppercase mt-0.5">
                Footwear for Men
              </span>
            </Link>
            <p className="text-km-text-3 font-dm text-sm leading-relaxed mb-6">
              Step into royalty. Handcrafted men's footwear for the discerning gentleman. From boardrooms to banquets — crafted with precision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-km-gold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-km-gold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-playfair text-white text-lg mb-6">Explore</h3>
            <ul className="space-y-3 font-dm text-sm text-km-text-3">
              <li><Link to="/products?category=new-drops" className="hover:text-km-gold transition-colors block">New Drops</Link></li>
              <li><Link to="/products?category=formal-collection" className="hover:text-km-gold transition-colors block">Formal Collection</Link></li>
              <li><Link to="/products?category=casual-collection" className="hover:text-km-gold transition-colors block">Casual Collection</Link></li>
              <li><Link to="/products?category=best-selling" className="hover:text-km-gold transition-colors block">Best Sellers</Link></li>
              <li><Link to="/products?category=peshawari-sandals" className="hover:text-km-gold transition-colors block">Peshawari Sandals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="font-playfair text-white text-lg mb-6">Customer Care</h3>
            <ul className="space-y-3 font-dm text-sm text-km-text-3">
              <li><Link to="/" className="hover:text-white transition-colors block">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors block">Shipping Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors block">Returns & Exchanges</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors block">Track Order</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors block">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-playfair text-white text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4 font-dm text-sm text-km-text-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-km-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>786/A Main Boulevard, Gulberg, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-km-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:+923007702061" className="hover:text-white transition-colors">+92 300 7702 061</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-km-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:support@kingsman.pk" className="hover:text-white transition-colors">support@kingsman.pk</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-dm text-xs text-km-text-3">
            &copy; {new Date().getFullYear()} Kings Man Shoes. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-dm text-xs text-km-text-3 uppercase tracking-widest">Secure Checkout</span>
            <div className="flex gap-2 opacity-50">
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><rect width="32" height="20" rx="3" fill="#fff"/><path d="M10.87 9.87h10.27v2.53H10.87v-2.53zM10.87 5.07h6v2.53h-6V5.07z" fill="#000"/></svg>
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#fff"/><rect width="32" height="20" rx="3" fill="#fff"/><path d="M21.13 14.93v-5c0-1.33-1.06-2.4-2.4-2.4h-5.46V5.07H10.87v9.86h10.26zm-7.86-5h2.53v2.47h-2.53V9.93z" fill="#000"/></svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
