// frontend/src/pages/OrderConfirmation.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../store/api/ordersApi';
import { PaymentMethod } from '../types';
import { formatPrice } from '../utils/formatPrice';

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
      a.download = `KingsMan_Order_${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Receipt download failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-km-gold border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="font-dm text-[11px] font-bold tracking-[0.3em] uppercase text-km-text-3">Syncing Order Ledger...</p>
      </div>
    );
  }

  if (!order || order.orderNumber !== orderNumber) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12 flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
        <div className="text-6xl mb-8">🔍</div>
        <h1 className="font-playfair text-[32px] md:text-[42px] font-bold text-km-text mb-4 uppercase tracking-tight">Order Not Located</h1>
        <p className="font-dm text-km-text-3 text-[14px] mb-10 max-w-md mx-auto leading-relaxed">We were unable to locate an order matching ID #{orderNumber}. Please verify the link or contact support.</p>
        <Link to="/products" className="btn-gold px-12 py-5 btn-magnetic">
          RETURN TO COLLECTION
        </Link>
      </div>
    );
  }

  const getMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      jazzcash: 'JazzCash Mobile Account',
      easypaisa: 'Easypaisa Mobile Account',
      bank_transfer: 'Direct Bank Transfer',
      cod: 'Cash on Delivery',
    };
    return labels[method];
  };

  const needsPaymentInstruction = ['jazzcash', 'easypaisa', 'bank_transfer'].includes(order.paymentMethod) && order.paymentStatus === 'pending';
  const whatsappNumber = import.meta.env['VITE_WHATSAPP_NUMBER'] as string ?? '923007702061';
  const whatsappMessage = encodeURIComponent(`Hi, I just placed an order. Order Reference: #${order.orderNumber}`);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-32 pb-20">
      <div className="max-w-2xl w-full text-center">
        
        {/* Animated Success Icon */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 bg-km-gold/10 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-[#FAFAF8] w-full h-full rounded-full border border-km-gold/30 flex items-center justify-center shadow-inner">
            <svg className="w-16 h-16 text-km-gold" viewBox="0 0 80 80">
              <path d="M22 42 L35 55 L60 28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-drawCheck" strokeDasharray="100" />
            </svg>
          </div>
        </div>

        <h1 className="font-playfair text-[36px] md:text-[48px] font-bold text-km-text mb-4 uppercase tracking-tight animate-fadeIn">
          Order Confirmed
        </h1>
        <p className="font-dm text-km-text-3 text-[14px] mb-12 tracking-wide max-w-md mx-auto animate-fadeInUp">
          A masterpiece has been reserved for you, <span className="text-km-text font-bold uppercase">{order.customerName}</span>. Your journey with Kings Man begins now.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fadeInUp">
          <div className="bg-[#FAFAF8] border border-km-border p-8 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow group">
            <h3 className="font-dm text-[10px] font-bold text-km-text-3 tracking-[0.3em] uppercase mb-2 border-b border-km-border pb-4">Transaction Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">Reference No.</span>
                <span className="font-dm text-[13px] text-km-gold font-bold tracking-widest">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">Total Value</span>
                <span className="font-playfair text-[18px] text-km-text font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">Payment Method</span>
                <span className="font-dm text-[12px] text-km-text font-bold text-right">{getMethodLabel(order.paymentMethod as PaymentMethod)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFAF8] border border-km-border p-8 text-left space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-dm text-[10px] font-bold text-km-text-3 tracking-[0.3em] uppercase mb-2 border-b border-km-border pb-4">Tracking Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">Current Status</span>
                <span className="px-3 py-1 bg-km-text text-white text-[9px] font-bold uppercase tracking-widest">{order.orderStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">Carrier Provider</span>
                <span className="font-dm text-[12px] text-km-text font-bold italic tracking-widest">TCS Express Delivery</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-widest">ETA (Approx.)</span>
                <span className="font-dm text-[12px] text-km-text font-bold">2-3 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Reminders */}
        {needsPaymentInstruction && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-12 text-left animate-fadeInRight">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⚠️</span>
              <h4 className="font-dm text-[12px] text-amber-900 font-bold uppercase tracking-widest leading-none">Awaiting Transfer Authorization</h4>
            </div>
            <p className="font-dm text-[13px] text-amber-800 leading-relaxed font-medium">
              To expedite fulfillment, please authorize payment of <span className="font-bold underline">{formatPrice(order.totalAmount)}</span> via {getMethodLabel(order.paymentMethod as PaymentMethod)}. Detailed instructions have been dispatched to your provided email address.
            </p>
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={downloadReceipt}
            className="flex-1 bg-white border border-km-text text-km-text font-dm text-[11px] font-bold tracking-[0.2em] uppercase py-5 hover:bg-[#1A1714] hover:text-white transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            GET OFFICIAL RECEIPT (PDF)
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white font-dm text-[11px] font-bold tracking-[0.2em] uppercase py-5 hover:bg-[#1EBE5A] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-checkout btn-magnetic"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            PRIORITY WHATSAPP SUPPORT
          </a>
        </div>
        
        <Link to="/products" className="font-dm text-[11px] font-bold text-km-text-3 uppercase tracking-[0.4em] hover:text-km-text transition-colors border-b border-transparent hover:border-km-text pb-1">
          &larr; BACK TO COLLECTION
        </Link>
        
      </div>
    </div>
  );
};

export default OrderConfirmation;
