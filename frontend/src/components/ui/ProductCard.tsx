// frontend/src/components/ui/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
      slug: product.slug,
      size: product.sizes.find(s => !s.isBlocked)?.size,
    });
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group relative flex flex-col bg-white overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-product-hover pb-14"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative bg-km-bg w-full h-[240px] flex items-center justify-center p-6 overflow-hidden">
        {discountPercent > 0 && (
          <div className="absolute top-0 left-0 bg-km-error text-white font-dm text-[10px] font-bold tracking-widest px-3 py-1 z-10 shadow-sm">
            SAVE {discountPercent}%
          </div>
        )}
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-dm text-[12px] text-km-text-2 tracking-wide uppercase truncate">
          {product.name}
        </h3>
        
        {/* Star Rating Row */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex text-km-gold text-[10px]">
            {'★★★★★'}
          </div>
          <span className="font-dm text-[10px] text-km-text-3">(0.0)</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-dm text-[13px] font-semibold text-km-text">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="font-dm text-[11px] text-km-text-3 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button (Slides up) */}
      <div 
        className={`absolute bottom-0 left-0 w-full bg-km-text text-white text-center py-3 font-dm text-xs tracking-widest uppercase transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={handleQuickAdd}
      >
        Add to Cart
      </div>
    </Link>
  );
};

export default ProductCard;
