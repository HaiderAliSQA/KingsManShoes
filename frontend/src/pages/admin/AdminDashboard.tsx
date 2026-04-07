// frontend/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useGetDashboardStatsQuery } from '../../store/api/adminApi';
import { useGetOrdersQuery } from '../../store/api/ordersApi';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ limit: 5 });

  const stats = statsData?.data || { totalProducts: 0, visibleProducts: 0, totalOrders: 0, pendingOrders: 0 };
  const recentOrders = ordersData?.data?.orders || [];

  return (
    <div className="animate-fadeIn font-dm">
      <div className="mb-10">
        <h1 className="font-playfair text-km-text text-[32px] font-semibold tracking-wide">Performance Overview</h1>
        <p className="text-km-text-2 mt-2 tracking-wider text-[13px] uppercase">Welcome back to the Kings Man analytics hub.</p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white h-32 border border-km-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-km-border p-6 shadow-sm hover:border-km-border-dark transition-all">
            <h3 className="text-km-text-3 text-[11px] uppercase tracking-widest font-semibold mb-3">Total Orders</h3>
            <p className="text-[32px] font-playfair text-km-text font-semibold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white border border-km-border p-6 shadow-sm hover:border-km-border-dark transition-all">
            <h3 className="text-km-text-3 text-[11px] uppercase tracking-widest font-semibold mb-3">Pending Orders</h3>
            <p className="text-[32px] font-playfair text-km-text font-semibold">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white border border-km-border p-6 shadow-sm hover:border-km-border-dark transition-all">
            <h3 className="text-km-text-3 text-[11px] uppercase tracking-widest font-semibold mb-3">Total Products</h3>
            <p className="text-[32px] font-playfair text-km-text font-semibold">{stats.totalProducts}</p>
          </div>
          <div className="bg-white border border-km-border p-6 shadow-sm hover:border-km-border-dark transition-all">
            <h3 className="text-km-text-3 text-[11px] uppercase tracking-widest font-semibold mb-3">Visible Selection</h3>
            <p className="text-[32px] font-playfair text-km-text font-semibold">{stats.visibleProducts}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-km-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-km-border flex justify-between items-center bg-km-surface-2">
          <h2 className="font-playfair text-[20px] text-km-text font-semibold tracking-wide">Recent Transactions</h2>
          <Link to="/admin/orders" className="text-km-text text-[11px] uppercase tracking-widest font-semibold hover:text-km-gold transition-colors underline underline-offset-4">View All Orders</Link>
        </div>
        
        {ordersLoading ? (
          <div className="p-12 text-center text-km-text-3 animate-pulse font-dm text-[15px]">Accessing order records...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-km-text-3 font-dm text-[13px] tracking-widest uppercase">Zero recent transactions.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-2 uppercase tracking-widest text-[11px] font-semibold">
                <tr>
                  <th className="px-6 py-4 border-b border-km-border">Order ID</th>
                  <th className="px-6 py-4 border-b border-km-border">Client Name</th>
                  <th className="px-6 py-4 border-b border-km-border">Placement Date</th>
                  <th className="px-6 py-4 border-b border-km-border">Total Value</th>
                  <th className="px-6 py-4 border-b border-km-border">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-km-surface-2 transition-colors">
                    <td className="px-6 py-4 font-medium text-km-text">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-km-text uppercase tracking-wider text-[11px] font-medium">{order.customerName}</td>
                    <td className="px-6 py-4 text-km-text-2 text-[13px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-km-text font-semibold font-playfair text-lg">PKR {order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-sm text-[10px] uppercase font-bold border ${
                        order.orderStatus === 'pending' || order.orderStatus === 'processing'
                          ? 'bg-orange-50 text-orange-600 border-orange-200'
                          : order.orderStatus === 'delivered'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-blue-50 text-blue-600 border-blue-200'
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
