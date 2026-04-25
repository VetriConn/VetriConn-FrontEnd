"use client";
import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  aspectRatio?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "4px", 
  className = "",
  aspectRatio 
}) => {
  return (
    <div 
      className={clsx("inline-block animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%]", className)} 
      style={{ width, height, borderRadius, aspectRatio }} 
    />
  );
};

/**
 * Responsive skeleton for buttons - matches button padding at different breakpoints
 */
export const ButtonSkeleton: React.FC<{ fullWidth?: boolean; className?: string }> = ({ 
  fullWidth = false, 
  className = "" 
}) => (
  <div 
    className={clsx(
      "h-[44px] md:h-[48px] rounded-lg animate-shimmer bg-gray-200",
      fullWidth ? "w-full" : "w-32 md:w-40",
      className
    )} 
  />
);

/**
 * Responsive skeleton for cards - matches card padding at different breakpoints
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={clsx("bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6", className)}>
    <div className="h-5 md:h-6 w-3/4 bg-gray-200 rounded animate-shimmer mb-3 md:mb-4" />
    <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-shimmer mb-2" />
    <div className="h-4 md:h-5 w-5/6 bg-gray-200 rounded animate-shimmer mb-4 md:mb-6" />
    <ButtonSkeleton fullWidth />
  </div>
);

/**
 * Responsive skeleton for images - reserves space with aspect ratio
 */
export const ImageSkeleton: React.FC<{ 
  aspectRatio?: string;
  className?: string;
  rounded?: boolean;
}> = ({ 
  aspectRatio = "16/9", 
  className = "",
  rounded = false 
}) => (
  <div 
    className={clsx(
      "w-full bg-gray-200 animate-shimmer",
      rounded ? "rounded-lg md:rounded-xl" : "",
      className
    )}
    style={{ aspectRatio }}
  />
);

/**
 * Responsive skeleton for form inputs - matches input sizing at different breakpoints
 */
export const InputSkeleton: React.FC<{ label?: boolean; className?: string }> = ({ 
  label = true, 
  className = "" 
}) => (
  <div className={className}>
    {label && (
      <div className="h-4 w-24 md:w-28 bg-gray-200 rounded animate-shimmer mb-1.5 md:mb-2" />
    )}
    <div className="h-10 md:h-12 w-full bg-gray-100 rounded-lg animate-shimmer" />
  </div>
);

/**
 * Responsive skeleton for text - matches typography scaling
 */
export const TextSkeleton: React.FC<{ 
  variant?: "h1" | "h2" | "h3" | "body" | "small";
  width?: string;
  className?: string;
}> = ({ 
  variant = "body", 
  width = "100%",
  className = "" 
}) => {
  const heightClasses = {
    h1: "h-8 md:h-10 lg:h-12",
    h2: "h-6 md:h-8",
    h3: "h-5 md:h-7",
    body: "h-4 md:h-5",
    small: "h-3 md:h-4"
  };

  return (
    <div 
      className={clsx(
        heightClasses[variant],
        "bg-gray-200 rounded animate-shimmer",
        className
      )}
      style={{ width }}
    />
  );
};

export const ProfileHeaderSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 p-4 md:p-8 bg-white">
    <div className="flex items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
      <div className="relative shrink-0">
        {/* Avatar with aspect ratio preserved */}
        <ImageSkeleton 
          aspectRatio="1" 
          className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full" 
        />
      </div>
      <div className="flex-1 flex flex-col gap-1.5 md:gap-2">
        <TextSkeleton variant="h2" width="160px" className="md:w-52" />
        <TextSkeleton variant="body" width="128px" className="md:w-40" />
        <TextSkeleton variant="small" width="144px" className="md:w-44" />
        <div className="flex gap-2 mt-2">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded animate-shimmer" />
          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded animate-shimmer" />
          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded animate-shimmer" />
        </div>
      </div>
    </div>
    <div className="shrink-0 w-full md:w-auto">
      <ButtonSkeleton fullWidth className="md:w-32" />
    </div>
  </div>
);

export const ProfileStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-white border border-gray-200 rounded-lg mx-4 md:mx-6 my-4 md:my-6 overflow-hidden">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-4 md:p-6 border-r border-gray-200 flex flex-col gap-1.5 last:border-r-0 md:border-b md:border-gray-200 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(3)]:border-b-0 md:[&:nth-child(4)]:border-b-0">
        <TextSkeleton variant="small" width="64px" className="md:w-20" />
        <TextSkeleton variant="body" width={i === 4 ? "64px" : "80px"} className={i === 4 ? "md:w-20" : "md:w-24"} />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <TextSkeleton variant="h2" width="144px" className="md:w-48 mb-2" />
        <TextSkeleton variant="body" width="240px" className="md:w-80" />
      </div>

      {/* Find Your Next Opportunity Card */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <TextSkeleton variant="h3" width="192px" className="md:w-60 mb-2" />
        <TextSkeleton variant="small" width="224px" className="md:w-72 mb-4 md:mb-6" />
        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 md:items-end">
          <div className="flex-1 min-w-full md:min-w-52">
            <InputSkeleton />
          </div>
          <div className="w-full md:w-auto md:min-w-40">
            <InputSkeleton />
          </div>
          <div className="w-full md:w-auto">
            <InputSkeleton />
          </div>
          <div className="w-full md:w-auto md:min-w-36">
            <InputSkeleton />
          </div>
          <ButtonSkeleton fullWidth className="md:w-24" />
        </div>
      </div>

      {/* Complete Your Profile Card */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex items-start gap-3 md:gap-4">
          <ImageSkeleton 
            aspectRatio="1" 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <TextSkeleton variant="h3" width="128px" className="md:w-44 mb-2" />
            <TextSkeleton variant="small" width="100%" className="max-w-xs md:max-w-md mb-3 md:mb-4" />
            <div className="flex items-center justify-between mb-2">
              <TextSkeleton variant="small" width="112px" className="md:w-36" />
              <TextSkeleton variant="small" width="32px" className="md:w-10" />
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full animate-shimmer mb-3 md:mb-4" />
            <ButtonSkeleton className="w-32 md:w-40" />
          </div>
        </div>
      </div>

      {/* Recommended Jobs Skeleton */}
      <RecommendedJobsSkeleton />
    </div>
  </div>
);

export const RecommendedJobsSkeleton: React.FC = () => (
  <div className="rounded-lg md:rounded-xl py-4 md:py-6">
    {/* Header */}
    <div className="flex items-center gap-2 md:gap-3 mb-1">
      <ImageSkeleton 
        aspectRatio="1" 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
      />
      <TextSkeleton variant="h3" width="144px" className="md:w-44" />
    </div>
    <div className="ml-10 md:ml-12 mb-4 md:mb-6">
      <TextSkeleton variant="small" width="224px" className="md:w-72" />
    </div>
    
    {/* Job Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-5 flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
          <div>
            <TextSkeleton variant="body" width="90%" className="mb-3" />
            <TextSkeleton variant="small" width="70%" className="mb-2" />
            <TextSkeleton variant="small" width="50%" className="mb-2" />
            <TextSkeleton variant="small" width="60%" className="mb-2" />
            <TextSkeleton variant="small" width="55%" className="mb-4" />
          </div>
          <ButtonSkeleton fullWidth />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Responsive skeleton for job detail page
 */
export const JobDetailSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <TextSkeleton variant="small" width="40px" />
        <TextSkeleton variant="small" width="16px" />
        <TextSkeleton variant="small" width="80px" />
      </div>
      <TextSkeleton variant="small" width="128px" className="mb-6 md:mb-8" />

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Main content skeleton */}
        <div className="flex-1">
          <div className="flex gap-2 mb-4 md:mb-5">
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-shimmer" />
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-shimmer" />
          </div>
          <TextSkeleton variant="h1" width="75%" className="mb-3" />
          <div className="flex items-center gap-3 mb-6">
            <ImageSkeleton aspectRatio="1" className="w-10 h-10 rounded-lg" />
            <div>
              <TextSkeleton variant="body" width="112px" className="mb-1" />
              <TextSkeleton variant="small" width="80px" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 md:h-10 w-32 md:w-36 bg-gray-200 rounded-lg animate-shimmer" />
            ))}
          </div>
          <div className="space-y-3">
            <TextSkeleton variant="h3" width="160px" />
            <TextSkeleton variant="body" width="100%" />
            <TextSkeleton variant="body" width="100%" />
            <TextSkeleton variant="body" width="75%" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6">
            <TextSkeleton variant="h3" width="112px" className="mb-4 md:mb-5" />
            <div className="space-y-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded animate-shimmer" />
                  <div className="flex-1">
                    <TextSkeleton variant="small" width="64px" className="mb-1" />
                    <TextSkeleton variant="body" width="96px" />
                  </div>
                </div>
              ))}
            </div>
            <ButtonSkeleton fullWidth className="mb-3" />
            <ButtonSkeleton fullWidth />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Responsive skeleton for job cards in listings
 */
export const JobCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6">
    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
      <ImageSkeleton aspectRatio="1" className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <TextSkeleton variant="h3" width="80%" className="mb-2" />
        <TextSkeleton variant="body" width="60%" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-6 w-20 md:w-24 bg-gray-200 rounded animate-shimmer" />
      ))}
    </div>
    <TextSkeleton variant="body" width="100%" className="mb-2" />
    <TextSkeleton variant="body" width="90%" className="mb-4 md:mb-6" />
    <div className="flex flex-col sm:flex-row gap-3">
      <ButtonSkeleton fullWidth className="sm:flex-1" />
      <div className="h-[44px] md:h-[48px] w-full sm:w-[44px] md:w-[48px] bg-gray-200 rounded-lg animate-shimmer" />
    </div>
  </div>
);

/**
 * Responsive skeleton for table rows
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-gray-200">
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-4 py-3 md:px-6 md:py-4">
        <TextSkeleton variant="body" width={i === 0 ? "80%" : "60%"} />
      </td>
    ))}
  </tr>
);

