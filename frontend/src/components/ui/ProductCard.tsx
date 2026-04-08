// frontend/src/components/ui/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { formatPrice, discountPercent } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  index?: number; // for stagger animation delay
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-select first available size if any, or undefined
    const firstSize = product.sizes && product.sizes.find(s => !s.isBlocked)?.size;
    
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
      slug: product.slug,
      size: firstSize,
      color: product.colors?.[0] || 'Original',
    });
  };

  const discount = discountPercent(product.price, product.compareAtPrice || 0);

  return (
    <div 
      className="product-card-hover scroll-reveal" 
      style={{ transitionDelay: `${(index || 0) * 0.06}s` }}
    >
      <Link to={`/product/${product.slug}`} className="block relative group">
        {/* IMAGE AREA */}
        <div className="relative img-zoom bg-[#FAFAF8] aspect-square overflow-hidden border border-km-border/30">
          <img 
            src={product.images[0] || '/placeholder.png'} 
            alt={product.name} 
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
          />

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-[#C41E3A] text-white text-[10px] font-bold px-2 py-1 tracking-widest font-dm shadow-sm">
                SAVE {discount}%
              </span>
            )}
            {product.isNewArrival && !discount && (
              <span className="bg-[#1A1714] text-[#C9A84C] text-[10px] font-bold px-2 py-1 tracking-widest font-dm shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* ADD TO CART BUTTON (slides up on hover) */}
          <button 
            className="add-to-cart-btn absolute bottom-0 left-0 right-0 bg-[#1A1714] text-white py-4 text-center text-[10px] font-bold tracking-[0.2em] font-dm cursor-pointer transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 hover:bg-km-gold active:bg-km-text"
            onClick={handleQuickAdd}
          >
            ADD TO CART
          </button>
        </div>

        {/* INFO AREA */}
        <div className="py-4 px-1">
          <div className="flex flex-col gap-1">
            <span className="font-dm text-[10px] text-km-text-3 uppercase tracking-widest font-medium">
              {product.category.replace(/-/g, ' ')}
            </span>
            <h3 className="font-dm text-[13px] font-bold text-km-text uppercase tracking-wide truncate group-hover:text-km-gold transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="font-dm text-[14px] font-bold text-km-text">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-dm text-[12px] text-km-text-3 line-through opacity-60">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Star row */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-km-gold text-[10px] tracking-tight">
                {'★★★★★'}
              </div>
              <span className="font-dm text-[10px] text-km-text-3 font-medium">(0.0)</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
