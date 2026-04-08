// frontend/src/pages/Products.tsx
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';

const SIDEBAR_CATEGORIES = [
  { value: '',                  label: 'All Products' },
  { value: 'new-drops',         label: 'New Drops' },
  { value: 'formal-collection', label: 'Formal Collection' },
  { value: 'lace-up',           label: 'Lace Up' },
  { value: 'chunky-formals',    label: 'Chunky Formals' },
  { value: 'best-selling',      label: 'Best Selling' },
  { value: 'casual-collection', label: 'Casual Collection' },
  { value: 'peshawari-sandals', label: 'Peshawari Sandals' },
  { value: 'skechers',          label: 'Skechers' },
  { value: 'sandals',           label: 'Sandals' },
  { value: 'slippers',          label: 'Slippers' },
  { value: 'boots',             label: 'Boots' },
  { value: 'loafers',           label: 'Loafers' },
  { value: 'moccasins',         label: 'Moccasins' },
  { value: 'sneakers',          label: 'Sneakers' },
  { value: 'monaco',            label: 'Monaco' },
];
const SIZES = [39, 40, 41, 42, 43, 44, 45, 46];
const COLORS = ['Black', 'Brown', 'Tan', 'Navy', 'White', 'Burgundy'];
const SORTS = [
  { label: 'Newest Arrivals', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
];

export const ProductSkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Form states mirrored from URL params
  const category = searchParams.get('category') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading } = useGetProductsQuery({
    category,
    size: size || undefined,
    color: color || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sortBy: sort,
    page,
    limit: 12,
  });

  const products = data?.data?.products || [];
  const totalPages = data?.data?.pages || 1;
  const totalItems = data?.data?.total || 0;

  const updateParam = useCallback((key: string, value: string) => {
    setSearchParams(params => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') params.set('page', '1');
      return params;
    });
  }, [setSearchParams]);

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const FiltersContent = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Category */}
      <div>
        <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 mb-4 font-semibold">Categories</h3>
        <div className="space-y-3">
          {SIDEBAR_CATEGORIES.map(c => (
            <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category" 
                value={c.value} 
                checked={category === c.value}
                onChange={() => updateParam('category', c.value)}
                className="w-4 h-4 text-km-gold border-gray-300 focus:ring-km-gold cursor-pointer"
              />
              <span className="font-dm text-[13px] text-km-text-2 group-hover:text-km-text transition-colors">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 mb-4 font-semibold">Size (EU)</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map(s => {
            const isSelected = size === s.toString();
            return (
              <button
                key={s}
                onClick={() => updateParam('size', isSelected ? '' : s.toString())}
                className={
                  isSelected
                    ? "w-10 h-10 border border-km-text bg-km-text text-white font-dm text-xs cursor-pointer transition-colors"
                    : "w-10 h-10 border border-km-border text-km-text-2 font-dm text-xs hover:border-km-text transition-colors cursor-pointer bg-white"
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 mb-4 font-semibold">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => {
            const isSelected = color === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => updateParam('color', isSelected ? '' : c.toLowerCase())}
                className={
                  isSelected
                    ? "border border-km-text bg-km-text text-white font-dm text-[11px] px-3 py-1.5 cursor-pointer transition-colors"
                    : "border border-km-border text-km-text-2 font-dm text-[11px] px-3 py-1.5 hover:border-km-text transition-colors cursor-pointer bg-white"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-dm text-[11px] tracking-widest uppercase text-km-text-3 mb-4 font-semibold">Price Range (PKR)</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-full bg-white border border-km-border text-km-text font-dm px-3 py-2 text-xs placeholder-km-text-3 outline-none focus:border-km-gold"
          />
          <span className="text-km-text-3 text-xs">—</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full bg-white border border-km-border text-km-text font-dm px-3 py-2 text-xs placeholder-km-text-3 outline-none focus:border-km-gold"
          />
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="font-dm font-semibold tracking-wider text-km-error hover:text-red-700 text-[11px] uppercase w-full text-left mt-2"
      >
        [ Clear All Filters ]
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-km-bg pt-[70px]">
      
      {/* Mobile Filters Header */}
      <div className="lg:hidden bg-white border-b border-km-border px-4 py-3 flex justify-between items-center sticky top-[70px] z-30 shadow-sm">
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-dm text-xs tracking-widest uppercase text-km-text font-medium px-4 py-2 border border-km-border bg-km-surface-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filter
        </button>
        <span className="font-dm text-xs text-km-text-2 tracking-wider">Showing {totalItems} items</span>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-km-text/40 backdrop-blur-[2px] animate-fadeIn" 
            onClick={() => setIsMobileFiltersOpen(false)} 
          />
          <div className="relative bg-white w-full h-[85vh] rounded-t-[10px] flex flex-col animate-slideInUp overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-km-border bg-km-surface-2">
              <h2 className="font-playfair text-xl text-km-text font-semibold">Filter & Sort</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="text-km-text-3 hover:text-km-text">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <FiltersContent />
            </div>
            <div className="p-4 border-t border-km-border bg-white flex gap-4">
              <button onClick={() => setIsMobileFiltersOpen(false)} className="btn-gold w-full flex-1">View Results</button>
            </div>
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div className="flex w-full">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 bg-white border-r border-km-border min-h-[calc(100vh-70px)]">
          <div className="sticky top-[70px] px-8 py-10 h-[calc(100vh-70px)] overflow-y-auto">
            <h2 className="font-dm text-xs tracking-[4px] uppercase text-km-text-3 font-semibold mb-8">Filter By</h2>
            <FiltersContent />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 lg:px-10 py-6 lg:py-10 bg-[#FAFAF8] min-h-[calc(100vh-70px)]">
          
          <div className="max-w-7xl mx-auto w-full">
            {/* Top Bar Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <span className="font-dm text-[13px] text-km-text-2 tracking-wider">
                Showing {products.length > 0 ? (page - 1) * 12 + 1 : 0} – {Math.min(page * 12, totalItems)} of {totalItems} items
              </span>
              
              <div className="flex items-center gap-3">
                <span className="font-dm text-[11px] tracking-widest uppercase text-km-text-3">Sort by:</span>
                <select 
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="font-dm text-sm text-km-text py-2 px-3 border border-km-border bg-white cursor-pointer outline-none focus:border-km-gold min-w-[200px]"
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Top Bar Mobile (Sort) */}
            <div className="lg:hidden mb-6 flex justify-end">
              <select 
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="font-dm text-xs text-km-text py-2 px-3 border border-km-border bg-white cursor-pointer outline-none w-full max-w-[200px]"
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <ProductSkeletonGrid count={8} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center py-32 bg-white border border-km-border border-dashed">
                <div className="text-center animate-fadeInUp">
                  <svg className="w-16 h-16 text-km-border-dark mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="font-playfair text-2xl text-km-text mb-2 tracking-wide">No Exact Matches</h3>
                  <p className="font-dm text-sm text-km-text-3 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <button onClick={clearFilters} className="btn-outline">
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-16 pb-8">
                <button
                  onClick={() => updateParam('page', Math.max(1, page - 1).toString())}
                  disabled={page === 1}
                  className="w-10 h-10 bg-white border border-km-border text-km-text font-dm text-sm hover:border-km-text disabled:opacity-30 disabled:hover:border-km-border transition-colors flex items-center justify-center cursor-pointer"
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateParam('page', (i + 1).toString())}
                    className={
                      page === i + 1
                        ? "w-10 h-10 border border-km-text bg-km-text text-white font-dm text-sm flex items-center justify-center cursor-pointer transition-colors"
                        : "w-10 h-10 bg-white border border-km-border text-km-text font-dm text-sm hover:border-km-text transition-colors flex items-center justify-center cursor-pointer"
                    }
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => updateParam('page', Math.min(totalPages, page + 1).toString())}
                  disabled={page === totalPages}
                  className="w-10 h-10 bg-white border border-km-border text-km-text font-dm text-sm hover:border-km-text disabled:opacity-30 disabled:hover:border-km-border transition-colors flex items-center justify-center cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
