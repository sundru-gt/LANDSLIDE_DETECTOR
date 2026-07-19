import React from 'react';
import { COL } from '../../constants/sites';

export default function RiskBarChart({ sites }) {
  return (
    <div id="chart">
      {sites.map(site => (
        <div className="row-bar" key={site.n}>
          <span className="l">
            <i>{site.s}</i>
            {site.n}
          </span>
          <div className="tr">
            <b style={{ width: `${site.sc}%`, background: COL[site.r] }}></b>
            <em style={{ left: `calc(${site.sc}% + 8px)`, color: COL[site.r] }}>{site.sc}</em>
          </div>
        </div>
      ))}
    </div>
  );
}

