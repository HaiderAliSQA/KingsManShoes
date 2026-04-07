// frontend/src/pages/admin/AdminOrders.tsx
import React, { useState } from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../store/api/ordersApi';
import toast from 'react-hot-toast';

const formatPKR = (amount: number): string => `PKR ${amount.toLocaleString('en-PK')}`;

const AdminOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useGetOrdersQuery({ page, limit: 10, search, orderStatus: statusFilter });
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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'confirmed':
      case 'shipped':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'failed':
      case 'cancelled':
      case 'returned':
        return 'bg-km-red-bg text-km-error border-km-error/30';
      default:
        return 'bg-white text-km-text-3 border-km-border';
    }
  };

  return (
    <div className="animate-fadeIn font-dm">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-playfair text-km-text text-[32px] font-semibold tracking-wide">Customer Orders</h1>
          <p className="text-km-text-2 mt-2 tracking-wider text-[13px] uppercase">Monitor and fulfill your premium footwear orders</p>
        </div>
      </div>

      <div className="bg-white border border-km-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-km-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-km-surface-2">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by order # or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-km-border px-10 py-3 text-[13px] text-km-text placeholder-km-text-3 focus:outline-none focus:border-km-gold transition-all"
            />
            <svg className="w-4 h-4 text-km-text-3 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-km-border px-6 py-3 text-[13px] font-medium text-km-text focus:outline-none focus:border-km-gold transition-all"
          >
            <option value="">All Statuses</option>
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
            <div className="p-12 text-center text-km-text-3 animate-pulse text-[15px] font-dm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-km-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-km-text font-playfair text-2xl font-semibold">No orders found</h3>
            </div>
          ) : (
            <table className="w-full text-left text-[14px] whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-2 uppercase tracking-widest text-[11px] font-semibold border-b border-km-border">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border flex-1">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-km-surface-2 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-km-text">{order.orderNumber}</div>
                      <div className="text-km-text-3 text-xs mt-1 font-medium">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-5 text-km-text-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-km-text">{order.customerName}</div>
                      <div className="text-km-text-3 text-xs mt-1">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="uppercase tracking-wider text-[11px] font-bold text-km-text mb-1">{order.paymentMethod}</div>
                      <div className={`inline-block px-2.5 py-1 rounded-sm text-[9px] uppercase font-bold border ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-km-text font-playfair text-[16px]">
                      {formatPKR(order.totalAmount)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                        className={`text-[10px] uppercase tracking-widest font-bold rounded-sm px-3 py-1.5 outline-none border focus:ring-1 focus:ring-km-gold text-center appearance-none ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="confirmed">CONFIRMED</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                        <option value="returned">RETURNED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-km-border flex justify-end gap-3 bg-[#FAFAF8]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 border border-km-border bg-white text-km-text disabled:opacity-50 hover:bg-km-text hover:text-white hover:border-km-text transition-all text-[11px] uppercase tracking-widest font-bold"
            >
              Prev
            </button>
            <span className="px-5 py-2 text-[11px] text-km-text-2 font-bold self-center uppercase tracking-widest">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2 border border-km-border bg-white text-km-text disabled:opacity-50 hover:bg-km-text hover:text-white hover:border-km-text transition-all text-[11px] uppercase tracking-widest font-bold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
