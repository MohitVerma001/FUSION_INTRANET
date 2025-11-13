import React from 'react';
import './TopNavigation.css';

const TopNavigation = () => {
  return (
    <header className="top-navigation">
      <div className="nav-left">
        <h1 className="logo">Social Intranet</h1>
      </div>

      <div className="nav-center">
        <h2 className="brand-title">DAIMLER TRUCK</h2>
      </div>

      <div className="nav-right">
        <button className="icon-button">
          <span className="icon">👤</span>
        </button>
        <button className="icon-button notification">
          <span className="icon">🔔</span>
          <span className="badge">0</span>
        </button>
        <button className="icon-button">
          <span className="icon">⊞</span>
        </button>
        <button className="icon-button">
          <span className="icon">➕</span>
        </button>
        <button className="icon-button">
          <span className="icon">🔍</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavigation;
