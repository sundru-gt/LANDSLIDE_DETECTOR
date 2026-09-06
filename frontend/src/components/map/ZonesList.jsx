import React from 'react';
import { COL } from '../../constants/sites';

export default function ZonesList({ sites, onSiteClick }) {
  return (
    <div className="panel">
      <div className="ph">
        <span>
          Zones <b>list</b>
        </span>
        <span>tap to fly</span>
      </div>
      <div id="list">
        {sites.map(s => (
          <div className="site" key={s.n} onClick={() => onSiteClick(s)}>
            <div>
              <b>{s.n}</b>
              <br />
              <span style={{ color: "var(--mute)" }}>{s.s}</span>
            </div>
            <span className="sc" style={{ color: COL[s.r] }}>
              {s.sc}
            </span>
            <span className={`bd ${s.r}`}>{s.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

