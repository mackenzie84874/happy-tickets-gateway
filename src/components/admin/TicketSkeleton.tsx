
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TicketSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden p-5">
      <div className="space-y-3">
        {/* Status and timestamp */}
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Contact info */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
};

export default TicketSkeleton;
