import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Clear cart on mount once order is placed
    clearCart();

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/by-number/${orderNumber}`);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Order fetch error:', err);
        setError(true);
        toast.error('Order details load nahi ho sakay');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60 font-dm uppercase tracking-widest text-xs">Order detail fetch ho rahi hai...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E8E0D0] p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-red-50 text-[#D23F57] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl text-[#1A1A1A] mb-4 font-bold">Order Nahi Mila</h1>
          <p className="text-[#1A1A1A]/60 font-dm mb-8 leading-relaxed text-sm tracking-wide">
            Ye order number invalid hai ya order abhi tak save nahi hua. Barae meharbani link check karein.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#1A1A1A] text-white px-10 py-4 font-dm text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all"
          >
            Home pe wapis jayein
          </Link>
        </div>
      </div>
    );
  }

  // Calculate delivery estimate (Order Date + 2 days)
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(orderDate.getDate() + 2);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(orderDate.getDate() + 3);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header / Success Animation */}
        <div className="bg-white border border-[#E8E0D0] shadow-sm mb-8 overflow-hidden">
          <div className="bg-green-50 py-10 text-center border-b border-[#E8E0D0] relative">
            <div className="w-20 h-20 bg-white border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl text-[#1A1A1A] font-bold uppercase tracking-tight mb-2">
              Shukriya {(order.customerName || '').split(' ')[0]} Bhai!
            </h1>
            <p className="text-green-700 font-dm text-[11px] uppercase tracking-[0.25em] font-bold">
              Order Placed Successfully
            </p>
          </div>

          <div className="p-8 sm:p-12 text-center border-b border-[#E8E0D0] bg-[#FAF9F6]">
            <p className="text-[#1A1A1A]/70 font-dm text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Aapka order receive ho gaya — hum jald dispatch karein ge. Niche di gayi details check kar lein.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9C9890] font-bold mb-1">Order Number</p>
                <p className="font-dm text-lg font-bold text-[#1A1A1A]">{order.orderNumber}</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-[#E8E0D0] self-center"></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9C9890] font-bold mb-1">Order Date</p>
                <p className="font-dm text-sm font-semibold text-[#1A1A1A]">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('en-PK', { 
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true 
                  }) : 'Just now'}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-8 sm:p-12">
            <h3 className="font-playfair text-xl text-[#1A1A1A] font-bold mb-6 border-b border-[#E8E0D0] pb-4 uppercase tracking-wider">
              Order Items
            </h3>
            <div className="space-y-6">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-6 pb-6 border-b border-[#E8E0D0] last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-[#FAF9F6] border border-[#E8E0D0] rounded-sm flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-playfair text-[#1A1A1A] font-bold truncate tracking-wide">{item.name}</h4>
                    <p className="text-xs text-[#1A1A1A]/60 mt-1 font-dm uppercase tracking-widest">
                      Size: {item.size} <span className="mx-2 text-[#E8E0D0]">|</span> 
                      Color: {item.color} <span className="mx-2 text-[#E8E0D0]">|</span>
                      Qty: {item.quantity}
                    </p>
                    <p className="text-[#1A1A1A] font-bold mt-3 font-dm text-sm tracking-widest">
                      PKR {(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-10 pt-8 border-t-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 rounded-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60">Summary</span>
                <span className="text-xs font-dm text-[#1A1A1A]/70 font-semibold">
                  SUBTOTAL PKR {(order.subtotal || 0).toLocaleString()} + DELIVERY PKR {(order.deliveryCharges || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-playfair font-black text-[#1A1A1A] uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-playfair font-black text-[#1A1A1A]">
                  PKR {(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#E8E0D0] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-[#C9A84C]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-playfair text-lg text-[#1A1A1A] font-bold uppercase tracking-wider">TCS Delivery Estimate</h3>
            </div>
            <p className="text-2xl font-playfair font-bold text-[#1A1A1A] mb-3">
              {deliveryStart.getDate()}–{deliveryEnd.getDate()} {deliveryEnd.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[#1A1A1A]/60 text-xs font-dm leading-relaxed tracking-wide">
              Aapka parcel TCS courier ke zariye deliver hoga. Tracking number dispatch ke baad WhatsApp pe bheja jaega.
            </p>
          </div>

          <div className="bg-white border border-[#E8E0D0] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-[#C9A84C]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-playfair text-lg text-[#1A1A1A] font-bold uppercase tracking-wider">Customer Details</h3>
            </div>
            <div className="space-y-3 text-xs font-dm tracking-wider">
              <p className="flex justify-between">
                <span className="text-[#9C9890] font-bold uppercase text-[10px]">Name</span>
                <span className="text-[#1A1A1A] font-bold">{order.customerName}</span>
              </p>
              <p className="flex justify-between">
                <span className="#9C9890 font-bold uppercase text-[10px]">Phone</span>
                <span className="text-[#1A1A1A] font-bold">{order.customerPhone}</span>
              </p>
              <p className="flex justify-between border-t border-[#E8E0D0] pt-3 mt-3">
                <span className="#9C9890 font-bold uppercase text-[10px]">City</span>
                <span className="text-[#1A1A1A] font-bold">{order.customerCity}</span>
              </p>
              <p className="flex flex-col gap-1">
                <span className="#9C9890 font-bold uppercase text-[10px]">Address</span>
                <span className="text-[#1A1A1A] font-bold text-[11px] leading-relaxed">{order.customerAddress}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment and Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1A1A1A] text-white p-8 shadow-lg relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full"></div>
            
            <h3 className="font-playfair text-lg text-[#C9A84C] font-bold uppercase tracking-wider mb-6">Payment Method</h3>
            <div className="mb-6">
              <p className="text-lg font-dm font-bold tracking-widest">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : (order.paymentMethod || '').toUpperCase()}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">Status: {(order.paymentStatus || 'pending').toUpperCase()}</p>
            </div>
            <div className="p-4 bg-white/10 border border-white/20 rounded-sm">
              <p className="text-xs italic leading-relaxed text-[#C9A84C]">
                PKR {(order.totalAmount || 0).toLocaleString()} cash tayar rakhein delivery ke waqt.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8E0D0] p-8 shadow-sm">
            <h3 className="font-playfair text-lg text-[#1A1A1A] font-bold uppercase tracking-wider mb-2">KINGS MAN — CONTACT US</h3>
            <p className="text-xs text-[#9C9890] font-dm mb-6 tracking-wide italic">Order ya delivery ke baare mein koi sawal?</p>
            
            <div className="space-y-4 font-dm font-bold text-[13px] tracking-widest uppercase">
              <a 
                href="https://wa.me/923007702061" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all transform hover:scale-[1.02]"
              >
                <span>WhatsApp Karein</span>
              </a>
              <a 
                href="tel:+923007702061" 
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#FAF9F6] border border-[#E8E0D0] text-[#1A1A1A]/70 hover:border-[#1A1A1A] transition-all"
              >
                <span>Call: +92 300 7702 061</span>
              </a>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-[#1A1A1A] text-white text-center py-5 font-bold font-dm text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] py-5 font-bold font-dm text-[11px] uppercase tracking-[0.3em] hover:bg-[#FAF9F6] transition-all"
          >
            Download Receipt PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
