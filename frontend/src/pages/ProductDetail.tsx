// frontend/src/pages/ProductDetail.tsx
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductBySlugQuery, useGetProductsQuery } from '../store/api/productsApi';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';
import { cloudinaryUrl } from '../utils/cloudinaryUrl';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data, isLoading, isError } = useGetProductBySlugQuery(slug || '');
  const product = data?.data;

  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category, limit: 4 },
    { skip: !product }
  );
  
  const relatedProducts = (relatedData?.data?.products || []).filter(p => p._id !== product?._id).slice(0, 4);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const EU_TO_US: Record<number, number> = {
    39: 6, 40: 7, 41: 8, 42: 9, 43: 10, 44: 11, 45: 12
  };

  if (isLoading) {
    return (
      <div className="min-h-[85vh] bg-[#FAFAF8] pt-32 pb-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-km-surface-2 border-t-km-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[85vh] bg-[#FAFAF8] pt-32 pb-12 flex flex-col items-center justify-center">
        <h2 className="font-playfair text-4xl text-km-text mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn-outline">
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '',
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    });
    
    toast.success('Added to cart');
  };

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-dm text-[11px] text-km-text-3 tracking-widest uppercase mb-8">
          <button onClick={() => navigate('/')} className="hover:text-km-gold transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-km-gold transition-colors">Products</button>
          <span>/</span>
          <span className="text-km-text-2">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-20 animate-fadeIn">
          
          {/* Gallery - Thumbnails on left for all viewports */}
          <div className="flex flex-row gap-2 sm:gap-4 h-fit">
            {/* Thumbnails Column (Fixed left, vertical) */}
            <div className="flex flex-col gap-2 sm:gap-3 w-14 sm:w-20 shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMainImageIndex(i);
                    scrollRef.current?.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' });
                  }}
                  className={`aspect-square bg-white border ${mainImageIndex === i ? 'border-km-text shadow-md' : 'border-km-border'} cursor-pointer hover:border-km-text transition-all overflow-hidden p-1 sm:p-1.5`}
                >
                  <img src={cloudinaryUrl(img, { width: 120 })} alt={`Thumbnail ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>

            {/* Main Image Container (Horizontal Scroll Carousel) */}
            <div className="flex-1 flex flex-col gap-4 relative group/gallery">
              <div 
                ref={scrollRef}
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-[4/5] bg-transparent overflow-x-auto snap-x snap-mandatory flex no-scrollbar scroll-smooth cursor-zoom-in"
                onScroll={(e) => {
                  const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                  const width = (e.target as HTMLDivElement).clientWidth;
                  const newIndex = Math.round(scrollLeft / width);
                  if (newIndex !== mainImageIndex) setMainImageIndex(newIndex);
                }}
              >
                {product.images.map((img, i) => (
                  <div key={i} className="min-w-full h-full snap-center flex items-center justify-center p-0 sm:p-10 relative">
                    {product.isNewArrival && i === 0 && (
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-block px-2 sm:px-3 py-1 bg-km-text text-white font-dm text-[9px] sm:text-[10px] tracking-[4px] uppercase z-10 shadow-sm">
                        New Arrival
                      </div>
                    )}
                    {discount > 0 && i === 0 && (
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-block px-2 sm:px-3 py-1 bg-km-error text-white font-dm text-[9px] sm:text-[10px] tracking-[4px] uppercase z-10 shadow-sm font-bold">
                        SAVE {discount}%
                      </div>
                    )}
                    <img 
                      src={cloudinaryUrl(img || '/placeholder-shoe.jpg', { width: 900 })}
                      alt={product.name}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* Prev/Next Navigation Arrows (Desktop overlay only) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
                }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-km-border rounded-full items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10 hover:bg-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-km-border rounded-full items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity z-10 hover:bg-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>

              {/* Gallery Indicators (Mobile visibility only) */}
              <div className="md:hidden flex flex-col items-center gap-3 mt-4">
                {/* Dot Indicators */}
                <div className="flex justify-center gap-1.5">
                  {product.images.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => scrollRef.current?.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' })}
                      className={`h-1 rounded-full transition-all ${mainImageIndex === i ? 'bg-km-text w-6' : 'bg-km-border w-1.5'}`}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-[160px] h-1 bg-km-border/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-km-gold transition-all duration-300"
                    style={{ width: `${((mainImageIndex + 1) / product.images.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col py-2 md:py-6">
            {product.isDiscontinued && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-dm text-sm px-4 py-3 tracking-wider text-center mb-4 md:mb-6 rounded-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                This item has been discontinued and is no longer available.
              </div>
            )}
            
            <h1 className="font-playfair text-[32px] md:text-[40px] text-km-text font-semibold leading-[1.1] mb-2 md:mb-4 break-words">
              {product.name}
            </h1>
            
            {/* Price line */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-dm text-[28px] text-[#C41E3A] font-bold">
                RS.{product.price.toLocaleString('en-PK')} PKR
              </span>
              {discount > 0 && (
                <span className="font-dm text-[16px] text-km-text-3 line-through opacity-60">
                  RS.{product.compareAtPrice?.toLocaleString('en-PK')} PKR
                </span>
              )}
            </div>

            {/* Description moved below buttons */}            {/* Selection Area */}
            {!product.isDiscontinued && product.stock > 0 && (
              <>
                {/* Sizes */}
                {product.sizes.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-col gap-2 mb-3 md:mb-4">
                      <h3 className="font-dm text-[12px] md:text-[13px] text-km-text uppercase font-medium tracking-wide">
                        Shoe size:
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 md:mb-6">
                      {product.sizes.map(({ size, isBlocked }) => (
                        <button
                          key={size}
                          disabled={isBlocked}
                          onClick={() => setSelectedSize(size)}
                          className={
                            isBlocked
                              ? "h-9 border border-km-border bg-km-surface-2 text-km-text-3/50 font-dm text-[11px] line-through cursor-not-allowed flex items-center justify-center p-1 whitespace-nowrap"
                              : size === selectedSize
                              ? "h-9 border-2 border-km-text bg-white text-km-text font-dm text-[12px] font-black flex items-center justify-center px-1 whitespace-nowrap shadow-sm"
                              : "h-9 border border-km-border bg-white text-km-text-2 font-dm text-[12px] font-bold hover:border-km-text transition-all cursor-pointer flex items-center justify-center px-1 whitespace-nowrap"
                          }
                        >
                          {size} <span className="text-[10px] ml-0.5">({EU_TO_US[size]})</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <button 
                        onClick={() => setIsSizeChartOpen(true)}
                        className="flex-1 h-11 bg-black text-white px-2 rounded-[3px] font-dm text-[11px] font-bold uppercase tracking-widest hover:bg-km-text-2 transition-all shadow-sm animate-gentle-float relative z-10"
                      >
                        Size Chart
                      </button>
                      
                      <div className="flex items-center h-11 border border-km-border bg-white w-[140px] shrink-0">
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="flex-1 h-full text-km-text-3 hover:text-km-text hover:bg-km-surface-2 transition-colors font-dm text-lg"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-dm text-[14px] text-km-text font-medium">
                          {quantity}
                        </div>
                        <button 
                          onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                          className="flex-1 h-full text-km-text-3 hover:text-km-text hover:bg-km-surface-2 transition-colors font-dm text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 font-semibold mb-3">
                      Select Color
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={
                            color === selectedColor
                              ? "border border-km-text bg-km-text text-white font-dm text-xs py-2 px-5 uppercase tracking-widest transition-colors"
                              : "border border-km-border bg-white text-km-text font-dm text-xs py-2 px-5 uppercase tracking-widest hover:border-km-text transition-colors cursor-pointer"
                          }
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selection & Action Area Restructured */}
                <div className="flex flex-col gap-3 mb-6">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full h-[50px] border-2 border-[#C9A84C] bg-white text-km-text font-dm text-[12px] tracking-[0.2em] font-bold uppercase transition-all duration-300 animate-btn-shine"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                    className="w-full h-[50px] text-white font-dm text-[12px] tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3 buy-it-now-the-best"
                  >
                    <svg className="w-5 h-5 text-km-gold animate-pulse text-gold-shimmer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Buy it Now
                  </button>
                </div>

                {/* Description Appears Here Now */}
                <div className="font-dm text-[#5C5650] text-[14px] leading-relaxed mb-6 whitespace-pre-line">
                  {product.description}
                </div>
              </>
            )}

            {/* Size Chart Modal */}
            {isSizeChartOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-km-text/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsSizeChartOpen(false)}></div>
                <div className="relative bg-white w-full max-w-md shadow-2xl animate-scaleIn rounded-sm overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-km-border">
                    <h2 className="font-playfair text-2xl text-km-text font-semibold">Size Chart</h2>
                    <button onClick={() => setIsSizeChartOpen(false)} className="text-km-text-3 hover:text-km-text transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div className="p-8">
                    <table className="w-full font-dm text-sm text-center border-collapse">
                      <thead className="bg-[#FAFAF8] text-km-text-3 uppercase tracking-widest text-[11px] font-bold">
                        <tr>
                          <th className="py-4 border border-km-border">UK</th>
                          <th className="py-4 border border-km-border">EU</th>
                          <th className="py-4 border border-km-border">US</th>
                        </tr>
                      </thead>
                      <tbody className="text-km-text">
                        {[
                          { uk: 5, eu: 39, us: 6 },
                          { uk: 6, eu: 40, us: 7 },
                          { uk: 7, eu: 41, us: 8 },
                          { uk: 8, eu: 42, us: 9 },
                          { uk: 9, eu: 43, us: 10 },
                          { uk: 10, eu: 44, us: 11 },
                          { uk: 11, eu: 45, us: 12 }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-km-surface-2 transition-colors">
                            <td className="py-4 border border-km-border font-medium">{row.uk}</td>
                            <td className="py-4 border border-km-border font-medium">{row.eu}</td>
                            <td className="py-4 border border-km-border font-medium">{row.us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-8 text-[11px] text-km-text-3 font-dm tracking-wide leading-relaxed italic text-center uppercase">
                      * All measurements are standard and may vary slightly by design.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fullscreen Lightbox */}
            {isLightboxOpen && (
              <div className="fixed inset-0 z-[200] bg-black animate-fadeIn flex flex-col">
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[210] bg-gradient-to-b from-black/50 to-transparent">
                  <span className="text-white font-dm text-xs tracking-widest uppercase">
                    {mainImageIndex + 1} / {product.images.length} — {product.name}
                  </span>
                  <button 
                    onClick={() => setIsLightboxOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                
                <div 
                  className="flex-1 overflow-x-auto snap-x snap-mandatory flex no-scrollbar scroll-smooth"
                  onScroll={(e) => {
                    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                    const width = (e.target as HTMLDivElement).clientWidth;
                    const newIndex = Math.round(scrollLeft / width);
                    if (newIndex !== mainImageIndex) {
                      setMainImageIndex(newIndex);
                      // Sync back to primary gallery
                      scrollRef.current?.scrollTo({ left: newIndex * scrollRef.current.clientWidth, behavior: 'instant' });
                    }
                  }}
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {product.images.map((img, i) => (
                    <div key={i} className="min-w-full h-full flex items-center justify-center snap-center p-4">
                      <img 
                        src={cloudinaryUrl(img, { width: 900 })} 
                        alt={`Fullscreen ${i + 1}`} 
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-[210]">
                  {product.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all ${mainImageIndex === i ? 'bg-white w-8' : 'bg-white/30 w-4'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Area for OOS/Discontinued */}
            {(product.isDiscontinued || product.stock <= 0) && (
              <button disabled className="w-full h-14 bg-km-surface-2 text-km-text-3 border border-km-border font-dm text-[13px] tracking-widest uppercase cursor-not-allowed mb-8">
                Out of Stock
              </button>
            )}

            {product.stock <= 5 && product.stock > 0 && !product.isDiscontinued && (
              <div className="flex items-center gap-2 text-km-error font-dm text-xs font-semibold uppercase tracking-wider mb-8">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Low Stock — Only {product.stock} items left
              </div>
            )}

            {/* Guarantee Flags */}
            <div className="flex flex-col gap-5 pt-8 border-t border-km-border">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#fbf6e9] text-km-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="font-dm text-[13px] text-km-text font-medium group-hover:text-km-gold transition-colors">100% Genuine Leather Guarantee</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#fbf6e9] text-km-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p className="font-dm text-[13px] text-km-text font-medium group-hover:text-km-gold transition-colors">Priority 2-Day Delivery (TCS)</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#fbf6e9] text-km-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <p className="font-dm text-[13px] text-km-text font-medium group-hover:text-km-gold transition-colors">Secure Payment via JazzCash or Cash on Delivery</p>
              </div>
            </div>

          </div>
        </div>

        {/* You may also like */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-km-border">
            <h2 className="font-playfair text-3xl text-km-text uppercase text-center tracking-widest mb-12">
              Complete Your Look
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
