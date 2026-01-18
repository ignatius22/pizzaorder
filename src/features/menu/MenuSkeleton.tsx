import React from 'react';
import Skeleton from '../../ui/Skeleton';

function MenuSkeleton() {
  return (
    <div className="py-4">
      <Skeleton className="h-10 w-48 mb-8 rounded-xl" />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="island-card flex flex-col !p-0">
            <Skeleton className="h-48 w-full rounded-b-none rounded-t-3xl" />
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4 border-t border-stone-100 flex justify-between">
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuSkeleton;
