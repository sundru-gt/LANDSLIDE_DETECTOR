import React from 'react';
import SegmentedControl from '../common/SegmentedControl';
import RiskBarChart from './RiskBarChart';

export default function HeroSection({
  visibleSites,
  filter,
  onFilterChange,
  filterCounts,
  meanScore,
}) {
  return (
    <section className="hero">
      <div className="hl">
        <h1>
          Score the slope <span className="r">before</span> it moves.
        </h1>
        <p>
          TerraGuard fuses terrain, rainfall and soil data to rate landslide risk for any location.
          Name a place or click the map, confirm the coordinates, and get a 0–100 rating with the factors
          behind it.
        </p>
        <a className="btn" href="#map-sec">
          Assess an area &rarr;
        </a>
        <br />
        <a className="lnk" href="#method">
          Read the methodology
        </a>
      </div>

      <div className="hr">
        <div className="dh">
          <h3>Drawing 1 · Risk by zone</h3>
          <span>score out of 100 · live data · zones 1–8</span>
        </div>
        <div className="leg">
          <span>
            <i style={{ background: "var(--hi)" }}></i>High
          </span>
          <span>
            <i style={{ background: "var(--md)" }}></i>Moderate
          </span>
          <span>
            <i style={{ background: "var(--lo)" }}></i>Low
          </span>
        </div>
        <div className="axis">
          <div>ZONE / STATE</div>
          <div>
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <RiskBarChart sites={visibleSites} />

        {/* Summary & Filters */}
        <div className="sum">
          <SegmentedControl
            activeTab={filter}
            onTabChange={onFilterChange}
            counts={filterCounts}
          />
          <b>{visibleSites.length}</b>
          <span>zones shown · mean score {meanScore}</span>
        </div>
      </div>
    </section>
  );
}

