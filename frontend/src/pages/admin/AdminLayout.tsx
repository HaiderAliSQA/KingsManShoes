// frontend/src/pages/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectIsAuthenticated, logout } from '../../store/authSlice';
import { useLogoutMutation } from '../../store/api/adminApi';

const AdminLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore
    } finally {
      dispatch(logout());
    }
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Products', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Orders', path: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { label: 'Back to Store', path: '/', icon: 'M10 19l-7-7m0 0l7-7m-7 7h18' },
  ];

  return (
    <div className="min-h-screen bg-km-bg font-dm text-km-text flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-km-text/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-km-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-center border-b border-km-border px-6 shrink-0 bg-[#FAFAF8]">
          <Link to="/admin/dashboard" className="flex flex-col items-center">
            <span className="font-playfair text-km-text text-2xl font-semibold tracking-wide">
              Kings Man
            </span>
            <span className="text-km-text-3 text-[10px] tracking-widest uppercase mt-0.5 font-bold">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path) && link.path !== '/';
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-colors group ${
                  isActive
                    ? 'bg-km-text text-white font-medium shadow-sm'
                    : 'text-km-text-2 hover:bg-km-surface-2 hover:text-km-text'
                }`}
              >
                <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-km-gold transition-colors'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={link.icon} />
                </svg>
                <span className="text-[13px] tracking-wider uppercase font-semibold">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-6 border-t border-km-border shrink-0 bg-[#FAFAF8]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-km-error/30 text-km-error bg-white hover:bg-km-red-bg hover:border-km-error transition-colors text-xs font-semibold uppercase tracking-widest rounded-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 bg-[#FAFAF8]">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-km-border flex items-center px-4 shrink-0 justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-km-text hover:text-km-gold transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-playfair text-km-text text-xl font-semibold tracking-wide">
            Kings Man
          </span>
          <div className="w-10"></div> {/* spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
