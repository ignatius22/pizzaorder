import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-stone-200 rounded-md ${className}`}
          style={{ minHeight: '1rem' }}
        />
      ))}
    </>
  );
}

export default Skeleton;
