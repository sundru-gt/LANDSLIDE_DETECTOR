import React from 'react';
import { SITES, COL } from '../../constants/sites';

export default function ZoneAssessmentTable() {
  return (
    <div className="panel" id="alerts">
      <div className="ph">
        <span>
          Drawing 2 <b>per-zone assessment</b>
        </span>
        <span>sample</span>
      </div>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Zone</th>
              <th>State</th>
              <th>Rain 24h</th>
              <th>Score</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {SITES.map(s => (
              <tr key={s.n}>
                <td>
                  <b style={{ fontFamily: "Archivo" }}>{s.n}</b>
                </td>
                <td>{s.s}</td>
                <td>{s.rain}</td>
                <td style={{ color: COL[s.r], fontWeight: 600 }}>{s.sc}</td>
                <td>
                  <span className={`bd ${s.r}`}>{s.r}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

