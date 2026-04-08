// frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { useGetProductsQuery } from '../store/api/productsApi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Category } from '../types';

const Home: React.FC = () => {
  const revealRef = useScrollReveal();

  const { data: newDropsData, isLoading: loadingNew } = useGetProductsQuery({ category: 'new-drops', limit: 5 });
  const { data: bestData, isLoading: loadingBest } = useGetProductsQuery({ category: 'best-selling', limit: 5 });
  const { data: casualData, isLoading: loadingCasual } = useGetProductsQuery({ category: 'casual-collection', limit: 5 });

  const renderProductGrid = (title: string, subtitle: string, data: any, loading: boolean, category: Category) => {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="font-playfair text-[32px] md:text-[42px] text-km-text uppercase tracking-[0.1em]">{title}</h2>
            <div className="underline-draw mx-auto mt-4"></div>
            <p className="font-dm text-km-text-3 mt-4 tracking-widest uppercase text-[11px]">{subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : data?.data?.products?.length > 0 ? (
              data.data.products.map((p: any, i: number) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 px-8 border-2 border-dashed border-km-border/30 rounded-lg text-center flex flex-col items-center justify-center">
                <span className="text-4xl mb-4 opacity-20">📦</span>
                <p className="font-dm text-km-text-3 tracking-widest uppercase text-xs">
                  {title} coming soon &mdash; Add products from Admin Panel
                </p>
              </div>
            )}
          </div>
          
          {data?.data?.products?.length > 0 && (
            <div className="mt-16 text-center scroll-reveal">
              <Link to={`/products?category=${category}`} className="btn-outline group inline-flex items-center gap-2">
                VIEW ALL COLLECTION
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-km-bg" ref={revealRef}>
      
      {/* SECTION 1 — HERO */}
      <section className="relative w-full h-[90vh] bg-[#FAFAF8] overflow-hidden flex items-center">
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 border border-km-gold text-km-gold font-dm text-[10px] tracking-[0.5em] font-bold uppercase scroll-reveal stagger-1 mb-8">
              New Collection 2026
            </div>
            <h1 className="text-[52px] md:text-[86px] leading-[1.1] text-km-text font-playfair mb-8">
              <span className="block scroll-reveal stagger-2">Step Into</span>
              <span className="block scroll-reveal stagger-3 text-gold-shimmer">Royalty</span>
            </h1>
            <p className="text-[16px] text-km-text-3 font-dm leading-[1.8] max-w-lg mx-auto lg:mx-0 scroll-reveal stagger-4 mb-10">
              Handcrafted for the modern visionary. Experience impeccable craftsmanship that commands respect in every room you enter.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 scroll-reveal stagger-5">
              <Link to="/products?category=new-drops" className="btn-gold px-10 py-5 btn-magnetic">Shop New Drops</Link>
              <Link to="/products" className="btn-outline px-10 py-5 btn-magnetic">View Catalogue</Link>
            </div>
          </div>
          
          <div className="hidden lg:flex lg:col-span-5 justify-end relative scroll-reveal-right stagger-4">
            <div className="relative w-[480px] h-[620px]">
              {/* Elegant Framed Image */}
              <div className="absolute inset-4 border border-km-text/10 p-2 z-0"></div>
              <div className="absolute inset-0 bg-[#F5F3EE] overflow-hidden flex items-center justify-center p-12">
                <img src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop" alt="Hero Product" className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-[2s] hover:scale-110" />
                
                {/* Floating Badge */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1A1714] rounded-full flex items-center justify-center shadow-2xl border-2 border-km-gold animate-spin-slow">
                  <div className="text-km-gold font-dm text-[10px] font-bold tracking-[0.3em] uppercase rotate-12">NEW 2026</div>
                </div>
              </div>
              
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-km-gold"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-km-gold"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-dm text-[9px] tracking-[0.4em] text-km-text-3 uppercase animate-pulse">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-km-gold to-transparent"></div>
        </div>
      </section>

      {/* SECTION 2 — TRUST BADGES */}
      <section className="bg-[#F5F3EE] border-y border-km-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'TCS Delivery', desc: 'Secure 2-Day Shipping' },
              { icon: '🔄', title: '7-Day Return', desc: 'Easy Size Exchanges' },
              { icon: '✨', title: '100% Genuine', desc: 'Premium Royal Quality' },
              { icon: '📦', title: 'Free Delivery', desc: 'Orders over PKR 5,000' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 scroll-reveal stagger-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-playfair text-[15px] font-bold text-km-text">{item.title}</span>
                  <span className="font-dm text-[11px] text-km-text-3 tracking-wider uppercase font-medium">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — SHOP BY STYLE (Asymmetric Grid) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="font-playfair text-[32px] md:text-[42px] text-km-text uppercase tracking-widest">Shop by Style</h2>
            <div className="underline-draw mx-auto mt-4"></div>
          </div>

          {/* Row 1 — 3 LARGE Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { id: 'new-drops', title: 'New Drops', bg: '#1A1714', dark: true },
              { id: 'formal-collection', title: 'Formal Collection', bg: '#F5F3EE', dark: false },
              { id: 'best-selling', title: 'Best Selling', bg: '#1A1714', dark: true }
            ].map((cat, i) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className={`group relative h-[320px] overflow-hidden scroll-reveal scale stagger-${i+1}`}>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: cat.bg }}></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 z-10 text-center">
                  <span className={`font-playfair text-4xl mb-4 transition-all duration-500 group-hover:translate-y-[-10px] ${cat.dark ? 'text-white' : 'text-km-text'}`}>{cat.title}</span>
                  <span className={`font-dm text-[11px] tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 transition-opacity ${cat.dark ? 'text-km-gold' : 'text-km-text-2'}`}>Explore Collection &rarr;</span>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/20"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-white/20"></div>
              </Link>
            ))}
          </div>

          {/* Row 2 — 5 SMALLER Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'skechers', title: 'Skechers' },
              { id: 'lace-up', title: 'Lace Up' },
              { id: 'casual-collection', title: 'Casual' },
              { id: 'peshawari-sandals', title: 'Traditional' },
              { id: 'boots', title: 'Boots' }
            ].map((cat, i) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className={`group relative h-[180px] bg-[#FAFAF8] flex flex-col items-center justify-center p-4 border border-km-border/30 transition-all duration-500 hover:bg-[#1A1714] scroll-reveal scale stagger-${i+1}`}>
                <span className="font-dm text-[11px] font-bold tracking-[0.2em] text-km-text uppercase group-hover:text-km-gold transition-colors text-center">{cat.title}</span>
                <span className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-dm tracking-[0.1em] uppercase">Shop Now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — NEW DROPS */}
      {renderProductGrid('New Drops', 'Fresh arrivals for the discerning gentleman', newDropsData, loadingNew, 'new-drops')}

      {/* SECTION 5 — FORMAL COLLECTION BANNER */}
      <section className="relative w-full bg-[#1A1714] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="scroll-reveal-left">
            <span className="font-dm text-km-gold text-[12px] tracking-[0.5em] font-bold uppercase mb-6 block">Premium Leather</span>
            <h2 className="font-playfair text-[52px] md:text-[72px] text-white leading-tight mb-8">
              FORMAL <br /> COLLECTION
            </h2>
            <p className="font-dm text-km-text-3 text-[17px] leading-relaxed mb-12 max-w-lg">
              Precision. Power. Performance. Every formal shoe is a masterpiece of design, engineered for those who never second-guess their steps.
            </p>
            <div className="flex gap-6">
              <Link to="/products?category=formal-collection" className="btn-gold px-10 py-5">SHOP NOW</Link>
              <Link to="/products?category=chunky-formals" className="btn-outline border-white text-white hover:bg-white hover:text-[#1A1714] px-10 py-5">CHUNKY STYLES</Link>
            </div>
          </div>
          <div className="scroll-reveal-right flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] aspect-square bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center group overflow-hidden border border-white/10 p-12">
               <span className="text-[120px] md:text-[180px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110">👞</span>
               <div className="absolute bottom-6 right-6 font-playfair text-white/10 text-6xl italic">Elegance</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — BEST SELLING */}
      {renderProductGrid('Best Selling', 'Our most iconic and loved silhouettes', bestData, loadingBest, 'best-selling')}

      {/* SECTION 7 — PESHAWARI SANDALS */}
      <section className="bg-[#F0EDE6] overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 min-h-[500px] h-auto relative overflow-hidden flex items-center justify-center p-20 scroll-reveal-left">
          <div className="absolute inset-4 border border-km-text/5"></div>
          <div className="text-[180px] md:text-[240px] drop-shadow-2xl transition-transform duration-[3s] hover:rotate-12">🩴</div>
          <div className="absolute top-12 left-12 font-playfair text-km-text-3 italic text-2xl">Craftsmanship</div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-24 scroll-reveal-right">
          <span className="font-dm text-km-gold text-[12px] tracking-[0.5em] font-bold uppercase mb-6 block">Traditional Craft</span>
          <h2 className="font-playfair text-[42px] md:text-[56px] text-km-text leading-tight mb-8">
            Authentic <br /> Peshawari Sandals
          </h2>
          <p className="font-dm text-km-text-2 text-[16px] leading-[1.8] mb-12 max-w-md">
            Handcrafted in the heart of Pakistan using heritage methods passed through generations. We use only the finest top-grain leather to ensure royalty in every stride.
          </p>
          <div className="flex">
            <Link to="/products?category=peshawari-sandals" className="btn-gold px-12 py-5 flex items-center gap-4">
              EXPLORE COLLECTION
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CASUAL COLLECTION */}
      {renderProductGrid('Casual Collection', 'Comfort meets unmatched style for daily striding', casualData, loadingCasual, 'casual-collection')}

      {/* SECTION 9 — NEWSLETTER + WHATSAPP */}
      <section className="bg-[#1A1714] py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="scroll-reveal">
            <h2 className="font-playfair text-[32px] md:text-[48px] text-white leading-tight mb-6 uppercase tracking-wider">
              Stay in the Circle
            </h2>
            <p className="font-dm text-km-text-3 text-[15px] mb-12 tracking-wide">
              Be the first to explore limited drops and receive a royal welcome with our exclusive newsletters.
            </p>
          </div>
          
          <form className="flex flex-col md:flex-row gap-4 mb-16 scroll-reveal scale">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 font-dm focus:outline-none focus:border-km-gold focus:bg-white/10 transition-all placeholder-white/30"
            />
            <button type="button" className="btn-gold px-12 py-5 whitespace-nowrap btn-magnetic">SUBSCRIBE</button>
          </form>
          
          <div className="flex flex-col items-center scroll-reveal">
            <div className="h-px w-24 bg-km-gold mb-8 opacity-30"></div>
            <a 
              href="https://wa.me/923007702061" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-4 bg-[#25D366] text-white font-dm text-[11px] font-bold tracking-[0.2em] px-10 py-5 rounded-sm hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition-all duration-300 uppercase"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Chat on WhatsApp for Order Updates
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
