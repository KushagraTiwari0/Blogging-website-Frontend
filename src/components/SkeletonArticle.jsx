import React from "react";
import "./SkeletonCard.css";

const SkeletonArticle = () => {
  return (
    <article className="article-page skeleton-article">
      {/* ── Banner ── */}
      <div className="article-banner">
        <div className="container">
          <div className="skeleton skeleton-title" style={{ height: "3.2rem", width: "70%", marginBottom: "20px" }}></div>
          <div className="article-banner-meta" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="article-meta skeleton-meta" style={{ marginBottom: 0 }}>
              <div className="skeleton skeleton-avatar" style={{ width: "32px", height: "32px" }}></div>
              <div className="info skeleton-info" style={{ width: "120px" }}>
                <div className="skeleton skeleton-text skeleton-text-short"></div>
                <div className="skeleton skeleton-text skeleton-text-shorter"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div className="skeleton skeleton-text-long" style={{ height: "16px", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-text-long" style={{ height: "16px", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-text-long" style={{ height: "16px", width: "92%", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-text-long" style={{ height: "16px", width: "85%", marginBottom: "32px" }}></div>

            <div className="skeleton skeleton-text-long" style={{ height: "16px", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-text-long" style={{ height: "16px", width: "95%", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-text-long" style={{ height: "16px", width: "75%", marginBottom: "16px" }}></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkeletonArticle;
