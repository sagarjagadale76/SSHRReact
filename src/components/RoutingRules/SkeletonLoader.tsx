import * as React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export const SkeletonLoader = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header with title */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Filter section */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Code dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Warehouse dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Users dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Country dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Second row of filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Carrier dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Status dropdown */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
      </Card>

      {/* Table section */}
      <Card>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b">
              {/* ID */}
              <Skeleton className="h-4 w-12" />

              {/* Active checkbox */}
              <Skeleton className="h-4 w-4" />

              {/* Service Code */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Users */}
              <Skeleton className="h-4 w-16" />

              {/* Excluded Users */}
              <Skeleton className="h-4 w-20" />

              {/* Warehouse */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Country */}
              <Skeleton className="h-4 w-16" />

              {/* Conditions */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>

              {/* Priority */}
              <Skeleton className="h-4 w-8" />

              {/* Carrier */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

//export default SkeletonLoader
