import React from 'react';

export default function Navbar() {
  return (
    <header className="bar">
      <div className="in">
        <a className="brand" href="#top">
          TERRAGUARD
        </a>
        <span className="tag">Landslide intelligence · slope risk</span>
        <nav>
          <a href="#map-sec">Map</a>
          <a href="#features">Features</a>
          <a href="#method">Method</a>
          <a className="go" href="#map-sec">
            Assess
          </a>
        </nav>
      </div>
    </header>
  );
}

