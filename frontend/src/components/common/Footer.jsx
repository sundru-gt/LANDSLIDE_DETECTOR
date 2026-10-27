import React from 'react';

export default function Footer() {
  return (
    <footer className="foot-minimal">
      {/* Top: Section navigation links & Red "Back to map" button (aligned to content grid) */}
      <div className="foot-top-wrap">
        <div className="foot-top">
          <nav className="foot-nav" aria-label="Footer navigation">
            <a href="#top">Overview</a>
            <a href="#map-sec">Map</a>
            <a href="#features">Features</a>
            <a href="#method">Method</a>
            <a href="#alerts">Alerts</a>
          </nav>

          <a href="#map-sec" className="btn-back-map" aria-label="Scroll back to map">
            Back to map &uarr;
          </a>
        </div>
      </div>

      {/* Divider spanning full width of the screen */}
      <div className="foot-divider" />

      {/* Bottom: Spans the ENTIRE width of the screen */}
      <div className="foot-bottom-full">
        <div className="foot-brand">
          <b>TERRAGUARD</b>
          <span>· Landslide Intelligence</span>
        </div>

        <div className="foot-credits">
          Made by — <span>Kanishk, Aditi, Disanti, Sudhanshu and Aditi</span>
        </div>
      </div>
    </footer>
  );
}
