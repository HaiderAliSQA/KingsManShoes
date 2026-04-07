// frontend/src/pages/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../hooks/useCart';
import { usePlaceOrderMutation } from '../store/api/ordersApi';

const formatPKR = (amount: number): string =>
  `PKR ${amount.toLocaleString('en-PK')}`;

/**
 * Validates a Pakistani mobile number.
 * Must start with 03 and be exactly 11 digits long.
 */
const pkPhoneRegex = /^03\d{9}$/;

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(pkPhoneRegex, 'Must be a valid 11-digit Pakistani mobile number starting with 03 (e.g., 03001234567)'),
  shippingAddress: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State/Province is required'),
    zipCode: z.string().min(3, 'Postal code is required'),
    country: z.literal('Pakistan', {
      errorMap: () => ({ message: 'Shipping is currently limited to Pakistan' }),
    }),
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryCharges, total, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer'>('cod');
  const [placeOrder, { isLoading, error }] = usePlaceOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        country: 'Pakistan',
      },
    },
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.shippingAddress.street,
        customerCity: data.shippingAddress.city,
        customerPostalCode: data.shippingAddress.zipCode,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
      };

      const result = await placeOrder(orderData).unwrap();
      
      if (result.success && result.data?.order) {
        clearCart();
        navigate(`/order-confirmation/${result.data.order.orderNumber}`);
      }
    } catch (err: any) {
      console.error('Failed to place order:', err);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col lg:flex-row pt-20">
      
      {/* Left Panel: Form */}
      <div className="bg-white px-6 py-10 w-full lg:w-[55%] xl:w-3/5 lg:min-h-[calc(100vh-80px)] flex justify-end xl:pr-16 border-r border-km-border">
        <div className="w-full max-w-lg">
          
          {/* Breadcrumb / Logo area could go here if isolated layout */}
          <Link to="/products" className="inline-flex items-center gap-2 font-dm text-[11px] tracking-widest text-km-text-3 uppercase hover:text-km-gold transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to Shop
          </Link>

          <div className="mb-8 block lg:hidden pb-6 border-b border-km-border">
            <h1 className="font-playfair text-2xl font-semibold mb-2 text-km-text">Order Summary</h1>
            <p className="text-km-text-2 font-dm text-lg">{formatPKR(total)}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 animate-fadeInUp">
            
            {/* Contact */}
            <section>
              <h2 className="text-lg font-playfair font-semibold text-km-text tracking-wide mb-5">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <input
                    {...register('customerEmail')}
                    placeholder="Email Address"
                    className="input-dark w-full"
                  />
                  {errors.customerEmail && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.customerEmail.message}</p>}
                </div>
                <div>
                  <input
                    {...register('customerPhone')}
                    placeholder="Mobile Number (e.g. 03001234567)"
                    className="input-dark w-full"
                  />
                  {errors.customerPhone && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.customerPhone.message}</p>}
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-lg font-playfair font-semibold text-km-text tracking-wide mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <input
                    {...register('customerName')}
                    placeholder="Full Name (First and Last Name)"
                    className="input-dark w-full"
                  />
                  {errors.customerName && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.customerName.message}</p>}
                </div>
                <div>
                  <input
                    {...register('shippingAddress.street')}
                    placeholder="Street Address, House No, Area"
                    className="input-dark w-full"
                  />
                  {errors.shippingAddress?.street && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.shippingAddress.street.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('shippingAddress.city')}
                      placeholder="City"
                      className="input-dark w-full"
                    />
                    {errors.shippingAddress?.city && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.shippingAddress.city.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register('shippingAddress.zipCode')}
                      placeholder="Postal Code"
                      className="input-dark w-full"
                    />
                    {errors.shippingAddress?.zipCode && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.shippingAddress.zipCode.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('shippingAddress.state')}
                      placeholder="Province / State"
                      className="input-dark w-full"
                    />
                    {errors.shippingAddress?.state && <p className="text-km-error text-xs mt-1.5 font-dm">{errors.shippingAddress.state.message}</p>}
                  </div>
                  <div>
                    <input
                      value="Pakistan"
                      disabled
                      className="w-full border border-km-border px-4 py-3 text-sm text-km-text-3 font-dm bg-km-bg cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Options */}
            <section>
              <h2 className="text-lg font-playfair font-semibold text-km-text tracking-wide mb-5">Secure Payment</h2>
              
              <div className="space-y-3">
                <label className={`block border px-5 py-4 cursor-pointer transition-all duration-200 hover:border-km-border-dark ${paymentMethod === 'cod' ? 'border-km-text bg-km-bg shadow-sm' : 'border-km-border'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 accent-km-text"
                    />
                    <span className="text-[15px] font-dm text-km-text font-medium">Cash on Delivery (COD)</span>
                  </div>
                </label>

                <label className={`block border px-5 py-4 cursor-pointer transition-all duration-200 hover:border-km-border-dark ${paymentMethod === 'jazzcash' ? 'border-km-text bg-km-bg shadow-sm' : 'border-km-border'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'jazzcash'} 
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="w-4 h-4 accent-km-text"
                    />
                    <span className="text-[15px] font-dm text-km-text font-medium">JazzCash Mobile Account</span>
                  </div>
                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-4 bg-km-surface-2 border border-km-border p-4 animate-fadeIn">
                      <p className="text-xs font-dm text-km-text-2 leading-relaxed">By proceeding with JazzCash, please ensure that the mobile number provided above is registered with JazzCash.</p>
                    </div>
                  )}
                </label>

                <label className={`block border px-5 py-4 cursor-pointer transition-all duration-200 hover:border-km-border-dark ${paymentMethod === 'easypaisa' ? 'border-km-text bg-km-bg shadow-sm' : 'border-km-border'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'easypaisa'} 
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="w-4 h-4 accent-km-text"
                    />
                    <span className="text-[15px] font-dm text-km-text font-medium">Easypaisa</span>
                  </div>
                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-4 bg-km-surface-2 border border-km-border p-4 animate-fadeIn">
                      <p className="text-xs font-dm text-km-text-2 leading-relaxed">After checkout, a payment authorization prompt will be sent directly to your Easypaisa app.</p>
                    </div>
                  )}
                </label>
                
                <label className={`block border px-5 py-4 cursor-pointer transition-all duration-200 hover:border-km-border-dark ${paymentMethod === 'bank_transfer' ? 'border-km-text bg-km-bg shadow-sm' : 'border-km-border'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'bank_transfer'} 
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="w-4 h-4 accent-km-text"
                    />
                    <span className="text-[15px] font-dm text-km-text font-medium">Direct Bank Transfer</span>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 bg-km-surface-2 border border-km-border p-4 animate-fadeIn">
                      <p className="text-xs font-dm text-km-text-2 leading-relaxed">Bank account instructions will be provided immediately upon order confirmation.</p>
                    </div>
                  )}
                </label>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-km-red-bg text-km-error text-sm font-dm border border-km-error/30 animate-fadeIn flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {(error as any)?.data?.message || 'Failed to place order. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-km-text text-white py-5 text-[13px] tracking-widest uppercase font-dm font-medium transition-all duration-300 hover:bg-km-gold active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex justify-center items-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                `Complete Order — ${formatPKR(total)}`
              )}
            </button>
            <p className="text-center font-dm text-[11px] text-km-text-3 mt-4 tracking-wider uppercase">
              By placing your order, you agree to our Terms of Service.
            </p>
          </form>

        </div>
      </div>

      {/* Right Panel: Order Summary */}
      <div className="bg-[#FAFAF8] px-8 py-10 flex-1 hidden lg:block xl:pl-16">
        <div className="max-w-md animate-slideInRight sticky top-32">
          <h2 className="text-lg font-playfair font-semibold text-km-text tracking-wide mb-8">Order Summary</h2>
          
          <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size || 'nosize'}-${item.color || 'nocolor'}`} className="flex gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 bg-white border border-km-border p-2 flex items-center justify-center">
                     <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-km-text text-white font-dm text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-[#FAFAF8]">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[13px] text-km-text font-dm font-medium leading-snug">{item.name}</h3>
                  <p className="text-[11px] font-dm text-km-text-3 mt-1 uppercase tracking-widest">
                    {item.size && `Size ${item.size}`}
                    {item.size && item.color && ' / '}
                    {item.color && `${item.color}`}
                  </p>
                </div>
                <div className="text-[13px] font-dm font-semibold text-km-text flex items-center">
                  {formatPKR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pb-6 border-b border-km-border-dark/20">
            <div className="flex justify-between font-dm text-[14px] text-km-text-2">
              <span>Subtotal</span>
              <span className="font-medium text-km-text">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between font-dm text-[14px] text-km-text-2">
              <span>Delivery (TCS)</span>
              <span className={deliveryCharges === 0 ? "text-km-gold font-medium" : "text-km-text font-medium"}>
                {deliveryCharges === 0 ? 'FREE' : formatPKR(deliveryCharges)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-6">
            <span className="font-dm text-[14px] text-km-text-2 uppercase tracking-widest">Total</span>
            <span className="font-playfair text-[28px] font-semibold text-km-text tracking-wide leading-none">{formatPKR(total)}</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Checkout;
