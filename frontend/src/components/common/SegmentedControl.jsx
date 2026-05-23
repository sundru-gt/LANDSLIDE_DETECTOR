import React from 'react';
import { FILTER_TABS } from '../../constants/sites';

export default function SegmentedControl({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className="seg">
      {FILTER_TABS.map(tab => (
        <button
          key={tab}
          className={activeTab === tab ? "on" : ""}
          onClick={() => onTabChange(tab)}
        >
          {tab === "All" ? "All zones" : tab}
          {counts[tab] !== undefined && <small>{counts[tab]}</small>}
        </button>
      ))}
    </div>
  );
}

