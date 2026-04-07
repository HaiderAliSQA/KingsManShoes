// frontend/src/pages/ProductDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductBySlugQuery, useGetProductsQuery } from '../store/api/productsApi';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-fadeIn">
          
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] bg-white border border-km-border overflow-hidden cursor-zoom-in relative">
               {product.isNewArrival && (
                 <div className="absolute top-6 left-6 inline-block px-3 py-1 bg-km-text text-white font-dm text-[10px] tracking-[4px] uppercase z-10 shadow-sm">
                   New Arrival
                 </div>
               )}
               {discount > 0 && (
                 <div className="absolute top-6 right-6 inline-block px-3 py-1 bg-km-error text-white font-dm text-[10px] tracking-[4px] uppercase z-10 shadow-sm font-bold">
                   SAVE {discount}%
                 </div>
               )}
              <img 
                src={product.images[mainImageIndex] || '/placeholder-shoe.jpg'}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110 p-10"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImageIndex(i)}
                    className={`aspect-square bg-white border ${mainImageIndex === i ? 'border-km-text' : 'border-km-border'} cursor-pointer hover:border-km-text transition-colors overflow-hidden p-2`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col py-6">
            {product.isDiscontinued && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-dm text-sm px-4 py-3 tracking-wider text-center mb-6 rounded-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                This item has been discontinued and is no longer available.
              </div>
            )}
            
            <h1 className="font-playfair text-[40px] text-km-text font-semibold leading-[1.1] mb-6">
              {product.name}
            </h1>
            
            {/* Price line */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-dm text-[22px] text-km-text font-medium">
                PKR {product.price.toLocaleString('en-PK')}
              </span>
              {discount > 0 && (
                <span className="font-dm text-[16px] text-km-text-3 line-through decoration-1">
                  PKR {product.compareAtPrice?.toLocaleString('en-PK')}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="font-dm text-km-text-2 text-[15px] leading-relaxed mb-10 pb-10 border-b border-km-border whitespace-pre-line">
              {product.description}
            </div>

            {/* Selection Area */}
            {!product.isDiscontinued && product.stock > 0 && (
              <>
                {/* Sizes */}
                {product.sizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 font-semibold">
                        Select Size (EU)
                      </h3>
                      <button className="font-dm text-[11px] text-km-text underline underline-offset-4 hover:text-km-gold transition-colors">
                        Size Guide
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(({ size, isBlocked }) => (
                        <button
                          key={size}
                          disabled={isBlocked}
                          onClick={() => setSelectedSize(size)}
                          className={
                            isBlocked
                              ? "w-14 h-14 border border-km-border bg-km-surface-2 text-km-text-3/50 font-dm text-[15px] line-through cursor-not-allowed"
                              : size === selectedSize
                              ? "w-14 h-14 border border-km-text bg-km-text text-white font-dm text-[15px] font-medium transition-colors"
                              : "w-14 h-14 border border-km-border bg-white text-km-text font-dm text-[15px] hover:border-km-text transition-colors cursor-pointer"
                          }
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 font-semibold mb-4">
                      Select Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={
                            color === selectedColor
                              ? "border border-km-text bg-km-text text-white font-dm text-xs py-2.5 px-6 uppercase tracking-widest transition-colors"
                              : "border border-km-border bg-white text-km-text font-dm text-xs py-2.5 px-6 uppercase tracking-widest hover:border-km-text transition-colors cursor-pointer"
                          }
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 items-end mb-10">
                  <div className="flex flex-col gap-4 w-[120px]">
                    <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 font-semibold">
                      Quantity
                    </h3>
                    <div className="flex items-center h-14 border border-km-border bg-white">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="flex-1 h-full text-km-text-2 hover:text-km-gold hover:bg-km-surface-2 transition-colors font-dm text-xl"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-dm text-[15px] text-km-text">
                        {quantity}
                      </div>
                      <button 
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        className="flex-1 h-full text-km-text-2 hover:text-km-gold hover:bg-km-surface-2 transition-colors font-dm text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-km-text text-white font-dm text-[13px] tracking-widest uppercase hover:bg-km-gold transition-colors shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </>
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
