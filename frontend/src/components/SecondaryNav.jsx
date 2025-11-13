import React from 'react';
import './SecondaryNav.css';

const SecondaryNav = () => {
  return (
    <nav className="secondary-nav">
      <div className="nav-item">COMPANY ▼</div>
      <div className="nav-item">MY LOCATION</div>
      <div className="nav-item">DAIMLER TRUCK & ME</div>
      <div className="nav-item">MORE ▼</div>
      <div className="nav-item">HELP ▼</div>
    </nav>
  );
};

export default SecondaryNav;
