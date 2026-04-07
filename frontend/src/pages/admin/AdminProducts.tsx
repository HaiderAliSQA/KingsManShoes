// frontend/src/pages/admin/AdminProducts.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAdminProductsQuery,
  useToggleVisibilityMutation,
  useToggleDiscontinuedMutation,
  useToggleFeaturedMutation,
  useDeleteProductMutation,
} from '../../store/api/productsApi';
import toast from 'react-hot-toast';

const AdminProducts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useGetAdminProductsQuery({ page, limit: 12, search });
  const [toggleVisibility] = useToggleVisibilityMutation();
  const [toggleDiscontinued] = useToggleDiscontinuedMutation();
  const [toggleFeatured] = useToggleFeaturedMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data?.products || [];
  const totalPages = data?.data?.pages || 1;

  const handleToggle = async (id: string, action: 'visibility' | 'discontinued' | 'featured') => {
    try {
      if (action === 'visibility') await toggleVisibility(id).unwrap();
      if (action === 'discontinued') await toggleDiscontinued(id).unwrap();
      if (action === 'featured') await toggleFeatured(id).unwrap();
      toast.success(`Product ${action} toggled successfully`);
    } catch {
      toast.error(`Failed to toggle ${action}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="animate-fadeIn font-dm">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-playfair text-km-text text-[32px] font-semibold tracking-wide">Products Inventory</h1>
          <p className="text-km-text-2 mt-2 tracking-wider text-[13px] uppercase">Manage your premium storefront collection</p>
        </div>
        <Link
          to="/admin/products/add"
          className="btn-gold px-8 py-3 text-[13px] shadow-sm uppercase tracking-widest font-semibold"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white border border-km-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-km-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-km-surface-2">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-km-border px-10 py-3 text-[13px] font-dm text-km-text placeholder-km-text-3 outline-none focus:border-km-gold transition-all"
            />
            <svg className="w-4 h-4 text-km-text-3 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="p-12 text-center text-km-text-3 font-dm animate-pulse text-[15px]">Refining inventory...</div>
          ) : products.length === 0 ? (
            <div className="p-20 text-center">
              <svg className="w-12 h-12 text-km-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <h3 className="text-km-text font-playfair text-[24px] mb-2 font-semibold">No items found</h3>
              <p className="text-km-text-2 text-[13px] tracking-wide font-dm">Your collection is currently empty.</p>
            </div>
          ) : (
            <table className="w-full text-left text-[14px] whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-2 uppercase tracking-widest text-[11px] font-semibold border-b border-km-border">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4">Visible</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Discontinued</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border">
                {products.map(product => (
                  <tr key={product._id} className={`hover:bg-km-surface-2 transition-colors ${product.isDiscontinued ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-km-border p-1 shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-km-text-3 text-[9px] uppercase font-bold text-center">No Image</div>
                          )}
                        </div>
                        <div>
                          <p className="text-km-text font-medium w-48 truncate tracking-wide" title={product.name}>{product.name}</p>
                          <p className="text-km-gold text-[10px] uppercase tracking-widest mt-0.5 font-bold">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-km-text font-semibold font-playfair text-[16px]">PKR {product.price.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-km-error border-red-200'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleToggle(product._id, 'visibility')} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${product.isVisible ? 'bg-km-text' : 'bg-km-border-dark'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isVisible ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleToggle(product._id, 'featured')} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${product.isFeatured ? 'bg-km-gold' : 'bg-km-border-dark'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isFeatured ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleToggle(product._id, 'discontinued')} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${product.isDiscontinued ? 'bg-km-error' : 'bg-km-border-dark'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isDiscontinued ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 text-km-text-2">
                        <Link to={`/admin/products/edit/${product._id}`} className="p-2 hover:text-km-gold hover:bg-km-surface-2 transition-all rounded-sm border border-transparent hover:border-km-border" title="Edit Item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={() => handleDelete(product._id, product.name)} className="p-2 hover:text-km-error hover:bg-km-red-bg transition-all rounded-sm border border-transparent hover:border-km-error/20" title="Remove Item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
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
          <div className="p-5 border-t border-km-border flex justify-end gap-3 bg-[#FAFAF8]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 border border-km-border bg-white text-km-text disabled:opacity-30 hover:bg-km-text hover:text-white hover:border-km-text transition-all text-[11px] uppercase tracking-widest font-bold"
            >
              Prev
            </button>
            <span className="px-5 py-2 text-[11px] text-km-text-2 font-bold self-center uppercase tracking-widest">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2 border border-km-border bg-white text-km-text disabled:opacity-30 hover:bg-km-text hover:text-white hover:border-km-text transition-all text-[11px] uppercase tracking-widest font-bold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
