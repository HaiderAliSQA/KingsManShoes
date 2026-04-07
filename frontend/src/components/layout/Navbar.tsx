// frontend/src/components/layout/Navbar.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Category, CATEGORY_ICONS, CATEGORY_LABELS } from '../../types';

const MEGA_MENU_CATEGORIES: Category[] = [
  'new-drops', 'formal-collection', 'chunky-formals', 'lace-up', 'best-selling',
  'casual-collection', 'sneakers', 'skechers', 'monaco',
  'peshawari-sandals', 'sandals', 'slippers', 'boots', 'loafers', 'moccasins'
];

const Navbar: React.FC = () => {
  const { count, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-km-text text-white text-[11px] font-dm tracking-widest text-center py-2 relative z-50">
        FREE DELIVERY ON ORDERS ABOVE PKR 5,000 | TCS 2-DAY DELIVERY
      </div>

      <nav className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-nav border-b border-km-border' : 'bg-white border-b border-km-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px]">
            
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <span className="font-playfair text-[22px] font-bold text-km-text tracking-[4px] uppercase">
                Kings Man
              </span>
              <span className="font-dm text-[9px] tracking-[6px] text-km-text-3 uppercase mt-[-2px]">
                Footwear for Men
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8 h-full">
              <Link to="/" className="font-dm text-sm tracking-wider text-km-text-2 hover:text-km-gold transition-colors">Home</Link>
              
              {/* Mega Menu Trigger */}
              <div 
                className="h-full flex items-center group cursor-pointer"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link to="/products" className="font-dm text-sm tracking-wider text-km-text-2 group-hover:text-km-gold transition-colors relative">
                  Shoes
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-km-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>

                {/* Mega Dropdown Panel */}
                <div 
                  className={`absolute top-full left-0 right-0 bg-white shadow-product border-t border-km-border transition-all duration-300 origin-top flex justify-center ${megaMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                  <div className="max-w-7xl w-full px-8 py-10">
                    <div className="grid grid-cols-5 gap-y-8 gap-x-6">
                      {MEGA_MENU_CATEGORIES.map((cat) => (
                        <Link 
                          key={cat} 
                          to={`/products?category=${cat}`}
                          className="flex items-center gap-3 p-2 hover:bg-km-surface-2 transition-colors rounded-sm group select-none"
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">{CATEGORY_ICONS[cat]}</span>
                          <span className="font-dm text-[13px] text-km-text-2 group-hover:text-km-gold transition-colors">{CATEGORY_LABELS[cat]}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/products?category=new-drops" className="font-dm text-sm tracking-wider text-km-text-2 hover:text-km-gold transition-colors">New Drops</Link>
              <Link to="/products?category=boots" className="font-dm text-sm tracking-wider text-km-text-2 hover:text-km-gold transition-colors">Boots</Link>
              <Link to="/products?category=sandals" className="font-dm text-sm tracking-wider text-km-text-2 hover:text-km-gold transition-colors">Sandals</Link>
              <Link to="/products?category=best-selling" className="font-dm text-sm font-bold tracking-wider text-km-error hover:text-km-red-bg hover:bg-km-error px-2 py-0.5 rounded transition-colors">SALE</Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-5">
              <button
                onClick={() => navigate('/products')}
                className="text-km-text-2 hover:text-km-gold transition-colors duration-200"
                aria-label="Search"
              >
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={toggleCart}
                className="relative text-km-text-2 hover:text-km-gold transition-colors duration-200 focus:outline-none group"
                aria-label="Toggle cart"
              >
                <svg className="w-[22px] h-[22px] group-hover:animate-cartBounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-km-error text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center animate-scaleIn shadow-sm">
                    {count}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-km-text hover:text-km-gold transition-colors focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-km-border animate-fadeInDown shadow-nav">
            <div className="px-4 py-6 flex flex-col space-y-5">
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-dm text-sm tracking-wider text-km-text uppercase">Home</Link>
              <div className="h-px bg-km-border w-full"></div>
              
              <p className="font-dm text-[10px] text-km-text-3 tracking-widest uppercase mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-4">
                {MEGA_MENU_CATEGORIES.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/products?category=${cat}`} 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <span className="font-dm text-xs text-km-text-2">{CATEGORY_LABELS[cat]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
