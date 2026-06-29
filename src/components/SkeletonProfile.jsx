import React from "react";
import SkeletonCard from "./SkeletonCard";
import "./SkeletonCard.css";

const SkeletonProfile = () => {
  return (
    <div className="profile-page skeleton-profile">
      {/* ── Banner ── */}
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="skeleton" style={{ width: "86px", height: "86px", borderRadius: "50%", marginBottom: "18px" }}></div>
              <div className="skeleton" style={{ width: "150px", height: "24px", marginBottom: "12px" }}></div>
              <div className="skeleton" style={{ width: "250px", height: "14px", marginBottom: "24px" }}></div>
              
              <div className="profile-stats" style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "18px", alignItems: "center" }}>
                <div className="skeleton" style={{ width: "80px", height: "16px" }}></div>
                <div className="profile-stat-divider" style={{ borderLeft: "1px solid var(--rule)", height: "16px" }}></div>
                <div className="skeleton" style={{ width: "80px", height: "16px" }}></div>
              </div>

              <div className="skeleton" style={{ width: "110px", height: "30px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="feed-toggle">
              <ul className="nav-pills">
                <li className="nav-item">
                  <div className="nav-link active" style={{ borderBottom: "none", pointerEvents: "none" }}>
                    <div className="skeleton" style={{ width: "100px", height: "14px" }}></div>
                  </div>
                </li>
              </ul>
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
