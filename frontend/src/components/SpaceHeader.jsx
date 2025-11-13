import React from 'react';
import './SpaceHeader.css';

const SpaceHeader = ({ space }) => {
  return (
    <div className="space-header">
      <div className="space-header-content">
        <div className="space-info">
          <div className="space-logo">
            <h2>DAIMLER<br />TRUCK</h2>
          </div>
          <div className="space-details">
            <h1 className="space-title">
              {space?.name || 'Daimler Truck EN'}
              <span className="globe-icon">🌐</span>
            </h1>
            <div className="space-meta">
              <span className="info-label">Info</span>
              <span className="followers">2292 Follower</span>
            </div>
            <button className="follow-button">+ Follow</button>
          </div>
        </div>

        <div className="space-banner">
          <img
            src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Daimler Trucks"
            className="banner-image"
          />
          <div className="language-selector">
            <select className="language-dropdown">
              <option>English</option>
              <option>Deutsch</option>
              <option>日本語</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceHeader;
