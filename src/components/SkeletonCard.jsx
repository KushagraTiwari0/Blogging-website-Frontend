import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="article-preview skeleton-card">
      <div className="article-meta skeleton-meta">
        <div className="skeleton skeleton-avatar"></div>
        <div className="info skeleton-info">
          <div className="skeleton skeleton-text skeleton-text-short"></div>
          <div className="skeleton skeleton-text skeleton-text-shorter"></div>
        </div>
      </div>
      <div className="preview-link">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-title skeleton-title-short"></div>
        <div className="skeleton skeleton-text skeleton-text-long"></div>
        <div className="skeleton skeleton-text skeleton-text-long"></div>
        <div className="preview-footer skeleton-footer">
          <div className="skeleton skeleton-text skeleton-text-shorter"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
