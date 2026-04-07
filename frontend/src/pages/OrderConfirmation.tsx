// frontend/src/pages/OrderConfirmation.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../store/api/ordersApi';
import { PaymentMethod } from '../types';

const OrderConfirmation: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const orderNumber = num ?? '';
  
  const { data, isLoading } = useGetOrdersQuery(
    { search: orderNumber, limit: 1 },
    { skip: !orderNumber }
  );

  const order = data?.data?.orders?.[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const downloadReceipt = async () => {
    if (!order?._id) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/orders/${order._id}/receipt`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Order_${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-km-bg pt-32 pb-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-km-surface-2 border-t-km-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order || order.orderNumber !== orderNumber) {
    return (
      <div className="min-h-[80vh] bg-km-bg pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-playfair text-km-text text-4xl mb-4">Order Not Found</h1>
        <p className="font-dm text-km-text-3 mb-8 tracking-wider">We couldn't find an order with the number {orderNumber}.</p>
        <Link to="/products" className="btn-outline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const getMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      jazzcash: 'JazzCash',
      easypaisa: 'Easypaisa',
      bank_transfer: 'Bank Transfer',
      cod: 'Cash on Delivery',
    };
    return labels[method];
  };

  const needsPaymentInstruction = ['jazzcash', 'easypaisa', 'bank_transfer'].includes(order.paymentMethod) && order.paymentStatus === 'pending';
  const whatsappNumber = import.meta.env['VITE_WHATSAPP_NUMBER'] as string ?? '923007702061';
  const whatsappMessage = encodeURIComponent(`Hi, I placed an order. My order number is ${order.orderNumber}`);

  return (
    <div className="min-h-[85vh] bg-[#FAFAF8] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center animate-scaleIn">
        
        {/* Animated Checkmark SVG */}
        <svg className="w-24 h-24 mx-auto mb-8 drop-shadow-md" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="#B8860B" strokeWidth="2" className="animate-drawCircle" strokeDasharray="251" />
          <path d="M22 42 L35 55 L60 28" fill="none" stroke="#B8860B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-drawCheck" strokeDasharray="100" />
        </svg>

        <h1 className="font-playfair text-4xl text-km-text font-semibold mb-3">
          Order Placed!
        </h1>
        <p className="font-dm text-km-text-2 text-[15px] mb-8">
          Thank you, {order.customerName}! Your order has been received.
        </p>

        <div className="w-[80px] h-[1px] bg-km-gold mx-auto mb-8"></div>

        {/* Order details box */}
        <div className="bg-white border border-km-border p-6 text-left space-y-4 mb-8 shadow-sm">
          <div className="flex justify-between font-dm text-[15px]">
            <span className="text-km-text-2">Order Number</span>
            <span className="text-km-gold font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between font-dm text-[15px]">
            <span className="text-km-text-2">Total Amount</span>
            <span className="text-km-text font-semibold">PKR {order.totalAmount.toLocaleString('en-PK')}</span>
          </div>
          <div className="flex justify-between font-dm text-[15px]">
            <span className="text-km-text-2">Payment Method</span>
            <span className="text-km-text">{getMethodLabel(order.paymentMethod)}</span>
          </div>
          <div className="flex justify-between font-dm text-[15px]">
            <span className="text-km-text-2">Estimated Delivery</span>
            <span className="text-km-text">2 Business Days via TCS</span>
          </div>
        </div>

        {/* Payment reminder box */}
        {needsPaymentInstruction && (
          <div className="bg-amber-50 border border-amber-200 p-5 mb-8 text-left rounded-sm">
            <h4 className="font-dm text-amber-800 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Payment Pending
            </h4>
            <p className="font-dm text-sm text-amber-900/80 leading-relaxed">
              Please complete your payment of <strong>PKR {order.totalAmount.toLocaleString('en-PK')}</strong> via {getMethodLabel(order.paymentMethod)}. Instructions have been sent to your email.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={downloadReceipt}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px',
              marginTop: '12px',
              background: 'transparent',
              border: '1px solid #B8860B',
              color: '#B8860B',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ⬇ Download Order Receipt (PDF)
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-dm font-semibold text-[13px] tracking-widest uppercase py-4 transition-all flex items-center justify-center gap-3 drop-shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Track on WhatsApp
          </a>
          
          <Link to="/products" className="btn-outline w-full block mt-2">
            Continue Shopping
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default OrderConfirmation;
