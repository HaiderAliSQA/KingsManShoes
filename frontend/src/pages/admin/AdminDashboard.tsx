// frontend/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useGetDashboardStatsQuery } from '../../store/api/adminApi';
import { useGetOrdersQuery } from '../../store/api/ordersApi';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: 5 });

  const stats = statsData?.data || { totalProducts: 0, visibleProducts: 0, totalOrders: 0, pendingOrders: 0 };
  const recentOrders = ordersData?.data?.orders || [];

  return (
    <div className="animate-fadeIn font-dm">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-km-text text-[36px] font-bold tracking-tight">Performance Overview</h1>
          <p className="text-km-text-3 mt-1 tracking-[0.2em] text-[11px] uppercase font-bold">Kings Man Analytics Hub • Real-time Data</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/add" className="btn-gold px-6 py-3 text-[11px]">Add New Product</Link>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white h-32 border border-km-border skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Orders', value: stats.totalOrders, color: 'text-km-text' },
            { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-km-gold' },
            { label: 'Total Products', value: stats.totalProducts, color: 'text-km-text' },
            { label: 'Visible Selection', value: stats.visibleProducts, color: 'text-km-text' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-km-border p-8 shadow-sm hover:border-km-gold/50 transition-all group">
              <h3 className="text-km-text-3 text-[10px] uppercase tracking-[0.3em] font-bold mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{stat.label}</h3>
              <p className={`text-[42px] font-playfair font-bold leading-none ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-km-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-km-border flex justify-between items-center bg-[#FAFAF8]">
          <h2 className="font-playfair text-[22px] text-km-text font-bold tracking-tight">Recent Transactions</h2>
          <Link to="/admin/orders" className="text-km-gold text-[11px] uppercase tracking-[0.2em] font-bold hover:text-km-text transition-colors flex items-center gap-2 group">
            <span>View All Activity</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {ordersLoading ? (
          <div className="p-20 text-center text-km-text-3 skeleton-shimmer font-dm text-[15px]">Accessing royal ledger...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-20 text-center text-km-text-3 font-dm text-[12px] tracking-[0.3em] uppercase border-b border-km-border border-dashed m-8">
            The vault is empty. No recent transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-3 uppercase tracking-[0.2em] text-[10px] font-bold">
                <tr>
                  <th className="px-8 py-5 border-b border-km-border">Order ID</th>
                  <th className="px-8 py-5 border-b border-km-border">Customer</th>
                  <th className="px-8 py-5 border-b border-km-border">Date</th>
                  <th className="px-8 py-5 border-b border-km-border">Total Amount</th>
                  <th className="px-8 py-5 border-b border-km-border">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-km-surface-2 transition-colors group">
                    <td className="px-8 py-6 font-dm text-[13px] text-km-text font-bold">#{order.orderNumber}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-km-text font-bold text-[13px] uppercase tracking-wide">{order.customerName}</span>
                        <span className="text-km-text-3 text-[11px]">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-km-text-3 text-[12px] font-medium">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-km-text font-bold font-playfair text-[18px]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-[0.1em] border ${
                        order.orderStatus === 'pending' || order.orderStatus === 'processing'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : order.orderStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
