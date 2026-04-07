// frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { 
  useGetProductsQuery 
} from '../store/api/productsApi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Category, CATEGORY_ICONS, CATEGORY_LABELS } from '../types';

const Home: React.FC = () => {
  useScrollReveal();

  const { data: newDropsData, isLoading: loadingNew } = useGetProductsQuery({ category: 'new-drops', limit: 5 });

  const { data: bestData, isLoading: loadingBest } = useGetProductsQuery({ category: 'best-selling', limit: 5 });
  const { data: casualData, isLoading: loadingCasual } = useGetProductsQuery({ category: 'casual-collection', limit: 5 });

  const renderProductGrid = (name: string, data: any, loading: boolean) => {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <h2 className="font-playfair text-3xl text-km-text uppercase tracking-widest">{name}</h2>
            <div className="w-16 h-[2px] bg-km-error mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className={`reveal delay-${(i+1)*100}`}><ProductSkeleton /></div>)
            ) : data?.data?.products?.length > 0 ? (
              data.data.products.map((p: any, i: number) => (
                <div key={p._id} className={`reveal delay-${(i+1)*100}`}>
                  <ProductCard product={p} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-km-text-3 font-dm">
                New arrivals dropping soon. Keep an eye out.
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center reveal">
            <Link to={`/products?category=${name.toLowerCase().replace(' ', '-')}`} className="btn-outline">
              View All
            </Link>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-km-bg">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[85vh] bg-[#FAFAF8] overflow-hidden flex items-center border-b border-km-border">
        {/* Subtle texture overlay could go here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <div className="inline-block px-3 py-1 border border-km-gold text-km-gold font-dm text-[10px] tracking-[5px] uppercase animate-fadeInDown mb-6">
              New Collection 2025
            </div>
            <h1 className="text-5xl md:text-[72px] leading-tight text-km-text font-playfair animate-fadeInUp delay-100">
              Step Into <br />
              <span className="italic text-km-gold font-serif">Royalty</span>
            </h1>
            <p className="mt-8 text-[15px] text-km-text-2 font-dm leading-[1.8] max-w-md animate-fadeInUp delay-200">
              Handcrafted men's footwear for the discerning gentleman. From boardrooms to banquets — crafted with precision and absolute elegance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-5 animate-fadeInUp delay-300">
              <Link to="/products?category=new-drops" className="btn-gold text-center">Shop New Drops</Link>
              <Link to="/products" className="btn-outline text-center">View Collection</Link>
            </div>
          </div>
          
          {/* Large Image Frame */}
          <div className="hidden md:flex justify-end items-center relative animate-fadeInRight delay-400">
            <div className="relative w-[450px] h-[580px] border-[1px] border-km-border-dark p-4 animate-float">
              <div className="w-full h-full bg-km-surface-2 flex items-center justify-center p-8 overflow-hidden relative">
                <div className="absolute top-6 left-6 bg-km-error text-white text-[11px] font-dm tracking-widest font-bold px-4 py-1.5 shadow-sm transform -rotate-2">
                  SAVE 30%
                </div>
                <img src="/placeholder.png" alt="Hero Shoe" className="w-full h-auto object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="w-full bg-[#F5F3EE] border-b border-km-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-dm text-[11px] tracking-widest text-km-text-2 uppercase">
          <div className="flex items-center justify-center gap-2">🚚 TCS 2-Day Delivery</div>
          <div className="flex items-center justify-center gap-2">🔄 7-Day Returns</div>
          <div className="flex items-center justify-center gap-2 md:border-l md:border-km-border-dark">✅ 100% Genuine</div>
          <div className="flex items-center justify-center gap-2 md:border-l md:border-km-border-dark">📦 Free on PKR 5000+</div>
        </div>
      </div>

      {/* 2. SHOP BY STYLE */}
      <section className="py-24 bg-km-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="font-dm text-sm text-km-text tracking-[5px] uppercase">Shop by Style</h2>
            <div className="w-[60px] h-0.5 bg-km-gold mx-auto mt-4 reveal"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Featured Row 1 */}
            {['new-drops', 'formal-collection', 'best-selling', 'casual-collection', 'peshawari-sandals'].map((cat, i) => (
              <Link 
                key={cat}
                to={`/products?category=${cat}`}
                className={`group flex flex-col bg-white border border-km-border transition-all duration-400 hover:-translate-y-1 hover:border-km-gold hover:shadow-product reveal delay-${(i+1)*100}`}
              >
                <div className="p-5 border-b border-km-border/50 flex justify-between items-center group-hover:border-km-gold/30 transition-colors">
                  <span className="font-dm text-[11px] tracking-[3px] uppercase text-km-text-2 group-hover:text-km-gold transition-colors">{CATEGORY_LABELS[cat as Category]}</span>
                </div>
                <div className="h-[160px] bg-[#FAFAF8] p-6 flex justify-center items-center overflow-hidden">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500 origin-center">{CATEGORY_ICONS[cat as Category]}</span>
                </div>
                <div className="p-4 flex items-center justify-end overflow-hidden">
                  <span className="font-dm text-[11px] text-km-gold uppercase font-semibold transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW DROPS */}
      {renderProductGrid('New Drops', newDropsData, loadingNew)}

      {/* 4. FORMAL COLLECTION BANNER */}
      <section className="w-full bg-[#1A1714] overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-24">
          <div className="reveal-left max-w-lg mb-12 md:mb-0">
            <h2 className="font-playfair text-4xl md:text-6xl text-white mb-6 leading-tight">
              FORMAL <br /> COLLECTION
            </h2>
            <p className="font-dm text-km-text-3 text-lg mb-10 leading-relaxed">
              Premium leather. Impeccable craftsmanship. Walk into the room like you own it.
            </p>
            <Link to="/products?category=formal-collection" className="btn-outline border-km-gold text-km-gold hover:bg-km-gold hover:text-white">
              Shop Now
            </Link>
          </div>
          <div className="reveal-right w-full md:w-1/2 flex justify-center">
            {/* Visual element representing shoes */}
            <div className="relative w-72 h-72 rounded-full border border-km-gold/30 flex items-center justify-center animate-pulse-gold">
               <span className="text-[120px]">👞</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING */}
      {renderProductGrid('Best Selling', bestData, loadingBest)}

      {/* 6. PESHAWARI SANDALS */}
      <section className="bg-km-surface-2 reveal py-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[400px] md:h-auto bg-km-border-dark flex items-center justify-center overflow-hidden">
            <div className="text-[180px] hover:scale-110 transition-transform duration-1000 mix-blend-overlay opacity-80">
              🩴
            </div>
          </div>
          <div className="flex flex-col justify-center px-8 md:px-20 py-24 reveal-right">
            <div className="inline-block px-3 py-1 bg-km-text text-white font-dm text-[10px] tracking-[4px] uppercase mb-6 self-start">
              Traditional Craft
            </div>
            <h2 className="font-playfair text-4xl text-km-text mb-6">Authentic <br /> Peshawari Sandals</h2>
            <p className="font-dm text-km-text-2 text-[15px] leading-relaxed mb-10 max-w-md">
              Handcrafted in the heart of Pakistan using traditional methods passed down through generations. Perfect for Friday prayers, weddings, and deep cultural roots.
            </p>
            <div className="self-start">
              <Link to="/products?category=peshawari-sandals" className="btn-gold flex items-center gap-3">
                Explore Collection
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CASUAL COLLECTION */}
      {renderProductGrid('Casual Collection', casualData, loadingCasual)}

      {/* 8. DELIVERY + TRUST SECTION */}
      <section className="py-24 bg-white border-t border-b border-km-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', title: 'Free Delivery', desc: 'On orders above PKR 5,000' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', desc: '7 Days Return Policy' },
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: '100% Genuine', desc: 'Authentic Craftsmanship' },
              { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Secure Payment', desc: 'JazzCash, Easypaisa, COD' }
            ].map((feature, i) => (
              <div key={i} className={`flex flex-col items-center reveal delay-${(i+1)*100}`}>
                <div className="w-16 h-16 rounded-full bg-[#fbf6e9] text-km-gold flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-playfair text-xl text-km-text mb-3">{feature.title}</h3>
                <p className="font-dm text-[13px] text-km-text-3">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER CTA */}
      <section className="bg-[#1A1714] py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-6 uppercase tracking-widest">
            Stay Updated on New Drops
          </h2>
          <p className="font-dm text-sm text-km-text-3 mb-10">
            Join the Kings Man circle for exclusive drops, VIP sales, and style advice right to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border border-white/20 text-white px-6 py-3 font-dm placeholder-white/30 focus:outline-none focus:border-km-gold transition-colors"
            />
            <button type="button" className="btn-gold whitespace-nowrap">Subscribe</button>
          </form>
          
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-white/10"></div>
            <span className="font-dm text-[10px] text-km-text-3 uppercase tracking-widest">OR</span>
            <div className="h-px w-10 bg-white/10"></div>
          </div>

          <a href="https://wa.me/923007702061" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] text-white font-dm text-sm font-semibold tracking-wide px-8 py-3 rounded-full mt-8 hover:-translate-y-1 hover:shadow-lg transition-transform">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
