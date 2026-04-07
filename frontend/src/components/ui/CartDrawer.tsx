// frontend/src/components/ui/CartDrawer.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const CartDrawer: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    count, 
    subtotal, 
    deliveryCharges, 
    total, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const navigate = useNavigate();

  // Close cart on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString('en-PK')}`;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-km-text/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[400px] h-full bg-white shadow-cart border-l border-km-border flex flex-col animate-slideCartIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-km-border bg-km-bg">
          <div className="flex items-baseline gap-3">
            <h2 className="font-playfair text-[20px] font-semibold tracking-wide text-km-text">YOUR CART</h2>
            <span className="font-dm text-[13px] text-km-text-2">({count} items)</span>
          </div>
          <button 
            onClick={closeCart}
            className="text-km-text-3 hover:text-km-error transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto w-full p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <svg className="w-16 h-16 text-km-border-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="font-dm text-lg text-km-text-2">Your cart is empty</h3>
              <button 
                onClick={() => { closeCart(); navigate('/products'); }} 
                className="btn-outline mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 pb-6 border-b border-km-border last:border-0 last:pb-0">
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-km-bg p-2 shrink-0 border border-km-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-dm text-[13px] text-km-text font-medium leading-tight">{item.name}</h4>
                        <p className="font-dm text-[11px] text-km-text-3 mt-1">
                          {item.size ? `Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-km-text-3 hover:text-km-error text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-km-border bg-white h-7">
                        <button 
                          className="px-2 h-full font-dm text-km-text-2 hover:text-km-gold hover:bg-km-bg transition-colors"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-3 font-dm text-xs text-km-text text-center min-w-[30px]">
                          {item.quantity}
                        </span>
                        <button 
                          className="px-2 h-full font-dm text-km-text-2 hover:text-km-gold hover:bg-km-bg transition-colors"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <span className="font-dm text-[14px] text-km-text font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-km-surface-2 border-t border-km-border flex flex-col gap-3 shrink-0">
            <div className="flex justify-between font-dm text-[13px] text-km-text-2">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-dm text-[13px] text-km-text-2">
              <span>Delivery (TCS)</span>
              <span className={deliveryCharges === 0 ? "text-km-success font-medium" : ""}>
                {deliveryCharges === 0 ? 'FREE' : formatPrice(deliveryCharges)}
              </span>
            </div>
            <div className="h-px w-full bg-km-border-dark/50 my-1"></div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-playfair text-[18px] font-bold text-km-text">TOTAL</span>
              <span className="font-playfair text-[18px] font-bold text-km-text">{formatPrice(total)}</span>
            </div>

            <button 
              onClick={() => { closeCart(); navigate('/checkout'); }}
              className="w-full bg-km-text text-white font-dm py-4 tracking-widest text-sm uppercase transition-all duration-300 hover:bg-km-gold flex justify-center items-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button 
              onClick={closeCart}
              className="w-full font-dm text-xs text-km-text-3 uppercase tracking-wider mt-2 hover:text-km-text transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
