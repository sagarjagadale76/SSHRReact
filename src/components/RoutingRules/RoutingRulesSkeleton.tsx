import * as React from "react";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const RoutingRulesSkeleton = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <SkeletonBox className="h-8 w-48 mb-4" />
      </div>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* First row of filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <SkeletonBox className="h-4 w-24 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div>
            <SkeletonBox className="h-4 w-24 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div>
            <SkeletonBox className="h-4 w-16 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div>
            <SkeletonBox className="h-4 w-20 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
        </div>

        {/* Second row of filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SkeletonBox className="h-4 w-20 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div>
            <SkeletonBox className="h-4 w-16 mb-2" />
            <SkeletonBox className="h-10 w-full" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <SkeletonBox className="h-10 w-28" />
          <SkeletonBox className="h-10 w-24" />
          <SkeletonBox className="h-10 w-24" />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 p-4">
            <SkeletonBox className="h-4 w-8" />
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-4 w-16" />
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-4 w-16" />
            <SkeletonBox className="h-4 w-16" />
            <SkeletonBox className="h-4 w-16" />
            <SkeletonBox className="h-4 w-16" />
          </div>
        </div>

        {/* Table Rows */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border-b last:border-b-0">
            <div className="grid grid-cols-12 gap-4 p-4 items-start">
              {/* ID */}
              <div className="flex items-center space-x-2">
                <SkeletonBox className="h-4 w-4" />
                <SkeletonBox className="h-4 w-12" />
              </div>

              {/* Active */}
              <SkeletonBox className="h-4 w-4" />

              {/* Service Code */}
              <div className="space-y-1">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-3 w-20" />
              </div>

              {/* Users */}
              <div className="space-y-1">
                <SkeletonBox className="h-4 w-16" />
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-3 w-16" />
              </div>

              {/* Excluded Users */}
              <SkeletonBox className="h-4 w-8" />

              {/* Warehouse */}
              <div className="space-y-1">
                <SkeletonBox className="h-4 w-28" />
              </div>

              {/* Country */}
              <SkeletonBox className="h-4 w-20" />

              {/* Conditions */}
              <div className="space-y-2">
                <SkeletonBox className="h-3 w-20" />
                <SkeletonBox className="h-3 w-24" />
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-3 w-full" />
                <SkeletonBox className="h-3 w-32" />
              </div>

              {/* Priority */}
              <SkeletonBox className="h-4 w-8" />

              {/* Carrier */}
              <SkeletonBox className="h-4 w-24" />

              {/* Actions */}
              <div className="flex space-x-2">
                <SkeletonBox className="h-6 w-6" />
                <SkeletonBox className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <SkeletonBox className="h-4 w-32" />
        <div className="flex space-x-2">
          <SkeletonBox className="h-8 w-8" />
          <SkeletonBox className="h-8 w-8" />
          <SkeletonBox className="h-8 w-20" />
          <SkeletonBox className="h-8 w-8" />
          <SkeletonBox className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default RoutingRulesSkeleton;
