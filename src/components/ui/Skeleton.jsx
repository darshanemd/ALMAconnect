import React from 'react';
import './Skeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="flex items-center gap-3">
        <div className="skeleton skeleton-avatar"></div>
        <div className="flex-1">
          <div className="skeleton skeleton-text title"></div>
          <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
        </div>
      </div>
      <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
      <div className="flex items-center justify-between mt-2">
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '24px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '25%', height: '32px' }}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
