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
import { formatPrice } from '../../utils/formatPrice';

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
      toast.success(`Product ${action} updated`);
    } catch {
      toast.error(`Failed to update ${action}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Permanently delete "${name}" from inventory?`)) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
      } catch {
        toast.error('Deletion failed');
      }
    }
  };

  return (
    <div className="animate-fadeIn font-dm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-playfair text-km-text text-[36px] font-bold tracking-tight">Products Inventory</h1>
          <p className="text-km-text-3 mt-1 tracking-[0.2em] text-[11px] uppercase font-bold">Catalogue Management • {data?.data?.total || 0} items</p>
        </div>
        <Link
          to="/admin/products/add"
          className="btn-gold px-10 py-4 text-[11px] btn-magnetic"
        >
          ADD NEW MASTERPIECE
        </Link>
      </div>

      <div className="bg-white border border-km-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-8 border-b border-km-border flex flex-col sm:flex-row gap-6 justify-between items-center bg-[#FAFAF8]">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name, category or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-km-border px-12 py-4 text-[13px] font-dm text-km-text placeholder-km-text-3 outline-none focus:border-km-gold transition-all"
            />
            <svg className="w-5 h-5 text-km-text-3 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="p-20 text-center text-km-text-3 font-dm skeleton-shimmer text-[15px]">Syncing inventory...</div>
          ) : products.length === 0 ? (
            <div className="p-32 text-center">
              <div className="text-6xl mb-6 opacity-20">👞</div>
              <h3 className="text-km-text font-playfair text-[26px] mb-2 font-bold">No items match your search</h3>
              <p className="text-km-text-3 text-[13px] tracking-widest uppercase font-medium">Try different keywords or clear search.</p>
            </div>
          ) : (
            <table className="w-full text-left text-[14px] whitespace-nowrap">
              <thead className="bg-[#FAFAF8] text-km-text-3 uppercase tracking-[0.2em] text-[10px] font-bold border-b border-km-border">
                <tr>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-8 py-5">Unit Price</th>
                  <th className="px-8 py-5">Inventory</th>
                  <th className="px-8 py-5">Visibility</th>
                  <th className="px-8 py-5">Featured</th>
                  <th className="px-8 py-5">Discontinued</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-border">
                {products.map(product => (
                  <tr key={product._id} className={`hover:bg-km-surface-2 transition-colors group ${product.isDiscontinued ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#F5F3EE] p-1 border border-km-border group-hover:border-km-gold/50 transition-colors">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold uppercase text-km-text-3">NO IMAGE</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-km-text font-bold text-[14px] uppercase tracking-wide truncate w-64" title={product.name}>{product.name}</p>
                          <p className="text-km-gold text-[10px] uppercase tracking-[0.2em] font-bold">{product.category.replace(/-/g, ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-km-text font-bold font-playfair text-[18px]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${product.stock > 10 ? 'text-emerald-600' : 'text-km-error'}`}>
                          {product.stock} Units
                        </span>
                        <div className="w-24 h-1 bg-km-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-km-error'}`} style={{ width: `${Math.min(product.stock, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => handleToggle(product._id, 'visibility')} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${product.isVisible ? 'bg-km-text' : 'bg-km-border'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isVisible ? 'left-[26px]' : 'left-1'}`} />
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => handleToggle(product._id, 'featured')} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${product.isFeatured ? 'bg-km-gold' : 'bg-km-border'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isFeatured ? 'left-[26px]' : 'left-1'}`} />
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => handleToggle(product._id, 'discontinued')} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${product.isDiscontinued ? 'bg-km-error' : 'bg-km-border'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${product.isDiscontinued ? 'left-[26px]' : 'left-1'}`} />
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/products/edit/${product._id}`} className="bg-white p-2.5 border border-km-border hover:border-km-gold hover:text-km-gold transition-all shadow-sm" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={() => handleDelete(product._id, product.name)} className="bg-white p-2.5 border border-km-border hover:border-km-error hover:text-km-error transition-all shadow-sm" title="Delete">
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

export default AdminProducts;
