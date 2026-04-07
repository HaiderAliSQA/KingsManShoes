// frontend/src/components/ui/ProductSkeleton.tsx
import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden pb-14 border border-transparent">
      {/* Image Skeleton */}
      <div className="relative w-full h-[240px] skeleton-shimmer"></div>

      {/* Product Info Skeleton */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-3/4 skeleton-shimmer rounded"></div>
        
        {/* Star Rating Skeleton */}
        <div className="h-2 w-1/3 skeleton-shimmer rounded mt-1"></div>

        {/* Pricing Skeleton */}
        <div className="h-4 w-1/2 skeleton-shimmer rounded mt-1"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
