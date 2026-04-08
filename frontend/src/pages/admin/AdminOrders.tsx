// frontend/src/pages/admin/AdminOrders.tsx
import React, { useState } from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../store/api/ordersApi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useGetOrdersQuery({ page, limit: 12, search, orderStatus: statusFilter });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = data?.data?.orders || [];
  const totalPages = data?.data?.pages || 1;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, orderStatus: newStatus }).unwrap();
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending':
      case 'processing':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'confirmed':
      case 'shipped':
        return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'failed':
      case 'cancelled':
      case 'returned':
        return 'bg-red-50 text-km-error border-red-100';
      default:
        return 'bg-white text-km-text-3 border-km-border';
    }
  };

  return (
    <div className="animate-fadeIn font-dm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-playfair text-km-text text-[36px] font-bold tracking-tight">Customer Orders</h1>
          <p className="text-km-text-3 mt-1 tracking-[0.2em] text-[11px] uppercase font-bold">Fulfillment Center • {data?.data?.total || 0} transactions</p>
        </div>
      </div>

      <div className="bg-white border border-km-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-8 border-b border-km-border flex flex-col sm:flex-row gap-6 justify-between items-center bg-[#FAFAF8]">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by Order #, Name or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-km-border px-12 py-4 text-[13px] font-dm text-km-text placeholder-km-text-3 outline-none focus:border-km-gold transition-all"
            />
            <svg className="w-5 h-5 text-km-text-3 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-km-border px-8 py-4 text-[11px] font-bold text-km-text uppercase tracking-widest focus:outline-none focus:border-km-gold transition-all cursor-pointer"
          >
            <option value="">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="p-20 text-center text-km-text-3 font-dm skeleton-shimmer text-[15px]">Syncing royal ledger...</div>
          ) : orders.length === 0 ? (
            <div className="p-32 text-center text-km-text-3 font-dm text-[12px] tracking-[0.3em] uppercase">
              <div className="text-6xl mb-6 opacity-20">📜</div>
              <h3 className="text-km-text font-playfair text-[26px] mb-2 font-bold">No Records Found</h3>
              <p className="text-km-text-3">Adjust your search criteria to locate specific orders.</p>
            </div>
          ) : (
            <table className="w-full text-left text-[14px] whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-3 uppercase tracking-[0.2em] text-[10px] font-bold border-b border-km-border">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Customer & Contact</th>
                  <th className="px-8 py-5">Payment Details</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5 text-center">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-km-surface-2 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-km-text text-[15px] font-playfair">#{order.orderNumber}</div>
                      <div className="text-km-text-3 text-[10px] mt-1 uppercase font-bold tracking-widest">{order.items.length} Product(s)</div>
                    </td>
                    <td className="px-8 py-6 text-km-text-3 text-[12px] font-medium">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-km-text text-[13px] uppercase tracking-wide">{order.customerName}</span>
                        <span className="text-km-text-3 text-[11px] font-medium">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="uppercase tracking-[0.1em] text-[10px] font-bold text-km-text">{order.paymentMethod}</span>
                        <span className={`inline-block w-fit px-3 py-1 rounded-full text-[9px] uppercase font-bold border ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-km-text font-playfair text-[20px]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <div className="relative inline-block w-full max-w-[180px]">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={isUpdating}
                            className={`w-full text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm px-4 py-3 outline-none border transition-all cursor-pointer text-center appearance-none ${getStatusColor(order.orderStatus)}`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                            <option value="returned">RETURNED</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-km-border flex justify-between items-center bg-[#FAFAF8]">
            <span className="text-[11px] text-km-text-3 font-bold uppercase tracking-[0.2em]">Showing Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center border border-km-border bg-white text-km-text hover:bg-[#1A1714] hover:text-white disabled:opacity-20 transition-all font-bold"
              >
                &larr;
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center border border-km-border bg-white text-km-text hover:bg-[#1A1714] hover:text-white disabled:opacity-20 transition-all font-bold"
              >
                &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
