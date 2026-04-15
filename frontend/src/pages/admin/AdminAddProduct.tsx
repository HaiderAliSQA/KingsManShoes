// frontend/src/pages/admin/AdminAddProduct.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProductMutation } from '../../store/api/productsApi';
import { useUploadImagesMutation, useDeleteImageMutation } from '../../store/api/adminApi';
import { Category, CATEGORY_LABELS } from '../../types';
import toast from 'react-hot-toast';

const SIZES = [39, 40, 41, 42, 43, 44, 45, 46];
const CATEGORIES = [
  'best-selling', 'formal-collection', 'peshawari-sandals', 'skechers', 'slippers'
] as const;

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description needs to be longer'),
  price: z.number().min(1, 'Price must be greater than 0'),
  compareAtPrice: z.number().optional().nullable(),
  category: z.enum(CATEGORIES),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isVisible: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  colors: z.string(), // comma separated
  tags: z.string(), // comma separated
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminAddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [images, setImages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([...SIZES]);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: 'best-selling',
      isVisible: true,
      isFeatured: false,
      isNewArrival: true,
      stock: 0,
      price: 0,
      colors: '',
      tags: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const result = await uploadImages(formData).unwrap();
      if (result.success && result.data) {
        const newUrls = result.data.map((r: any) => r.url);
        setImages(prev => [...prev, ...newUrls]);
        toast.success(`Uploaded ${newUrls.length} images`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload images');
    }
  };

  const handleRemoveImage = async (url: string) => {
    const parts = url.split('/');
    const filename = parts.pop();
    const publicId = filename?.split('.')[0] || '';
    
    setImages(prev => prev.filter(img => img !== url));
    
    if (publicId) {
      try {
        await deleteImage(publicId).unwrap();
      } catch {
        // UI removal is enough
      }
    }
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const payload = {
      ...data,
      colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      images,
      sizes: SIZES.map(s => ({
        size: s,
        isBlocked: !selectedSizes.includes(s)
      })),
      compareAtPrice: data.compareAtPrice || undefined,
    };

    try {
      await createProduct(payload).unwrap();
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 font-dm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-km-text text-3xl font-semibold tracking-wide">Add New Product</h1>
          <p className="text-km-text-2 mt-2 text-sm tracking-wider">Expand your premium collection</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-km-text-3 hover:text-km-error transition-colors text-[13px] uppercase tracking-widest font-semibold"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core Info */}
        <div className="bg-white border border-km-border p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-km-text mb-6 border-b border-km-border pb-3 font-semibold">Basic Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Product Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
                placeholder="e.g. Classic Oxford Leather"
              />
              {errors.name && <p className="text-km-error text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold resize-y"
                placeholder="Detailed description of the product..."
              />
              {errors.description && <p className="text-km-error text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Price (PKR)</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
                  placeholder="0"
                />
                {errors.price && <p className="text-km-error text-xs mt-1.5">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Compare at Price</label>
                <input
                  {...register('compareAtPrice', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
                  placeholder="Optional"
                />
                {errors.compareAtPrice && <p className="text-km-error text-xs mt-1.5">{errors.compareAtPrice.message}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Stock Quantity</label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
                  placeholder="0"
                />
                {errors.stock && <p className="text-km-error text-xs mt-1.5">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Category</label>
                <select
                  {...register('category')}
                  className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c as Category]}</option>)}
                </select>
                {errors.category && <p className="text-km-error text-xs mt-1.5">{errors.category.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white border border-km-border p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-km-text mb-6 border-b border-km-border pb-3 font-semibold flex justify-between items-center">
            <span>Media (Images)</span>
            {isUploading && <span className="text-xs text-km-text-3 animate-pulse uppercase tracking-wider font-dm">Uploading...</span>}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-sm border border-km-border group overflow-hidden bg-km-bg">
                <img src={img} alt="Product" className="w-full h-full object-contain mix-blend-multiply p-2" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-1 right-1 bg-km-error text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-km-border-dark rounded-sm hover:border-km-gold cursor-pointer transition-colors text-km-text-3 hover:text-km-gold bg-km-surface-2 hover:bg-km-gold-bg/30 relative">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[11px] uppercase tracking-widest font-bold">Upload</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
            </label>
          </div>
          {images.length === 0 && <p className="text-km-error text-xs font-dm mt-2">At least one image is required.</p>}
        </div>

        {/* Attributes */}
        <div className="bg-white border border-km-border p-8 shadow-sm">
          <h2 className="text-lg font-playfair text-km-text mb-6 border-b border-km-border pb-3 font-semibold">Attributes & Toggles</h2>
          
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-km-text-2 mb-3 uppercase tracking-wide">Available Sizes (EU)</label>
            <div className="flex flex-wrap gap-3">
              {SIZES.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-all duration-200 font-medium text-sm ${selectedSizes.includes(s) ? 'bg-km-text border-km-text text-white shadow-sm' : 'bg-white border-km-border text-km-text-3 hover:border-km-text-3'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Colors (comma separated)</label>
              <input
                {...register('colors')}
                type="text"
                placeholder="black, brown, navy"
                className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
              />
              {errors.colors && <p className="text-km-error text-xs mt-1.5">{errors.colors.message}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-km-text-2 mb-2 uppercase tracking-wide">Tags (comma separated)</label>
              <input
                {...register('tags')}
                type="text"
                placeholder="formal, slip-on, leather"
                className="w-full bg-km-bg border border-km-border text-km-text font-dm px-4 py-3 outline-none focus:border-km-gold"
              />
              {errors.tags && <p className="text-km-error text-xs mt-1.5">{errors.tags.message}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 pt-6 border-t border-km-border bg-km-surface-2 p-5 border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isVisible')} className="w-4 h-4 rounded-sm border-km-border text-km-gold focus:ring-km-gold" />
              <span className="text-sm font-medium text-km-text group-hover:text-km-gold transition-colors">Visible to public</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded-sm border-km-border text-km-gold focus:ring-km-gold" />
              <span className="text-sm font-medium text-km-text group-hover:text-km-gold transition-colors">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register('isNewArrival')} className="w-4 h-4 rounded-sm border-km-border text-km-gold focus:ring-km-gold" />
              <span className="text-sm font-medium text-km-text group-hover:text-km-gold transition-colors">New Arrival Label</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 bg-white border border-km-border text-km-text font-dm text-[13px] uppercase tracking-widest font-medium hover:border-km-text transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-48 bg-km-gold text-white font-dm text-[13px] tracking-widest uppercase font-medium hover:bg-km-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading || isUploading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminAddProduct;
