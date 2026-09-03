import React from 'react';
import { COL } from '../../constants/sites';

export default function ScoreResult({ result, errorMsg }) {
  if (errorMsg) {
    return (
      <p className="hint" style={{ marginTop: "12px", color: "var(--red)" }}>
        {errorMsg}
      </p>
    );
  }

  if (!result) return null;

  const color = COL[result.risk] || "var(--hi)";

  return (
    <div id="out">
      <div className="score">
        <div className="n" style={{ color }}>
          {result.score}
          <small>/100</small>
        </div>
        <span className={`bd ${result.risk}`}>{result.risk} risk</span>
      </div>

      {result.factors && result.factors.length > 0 && (
        <div className="factors-list">
          {result.factors.map(f => (
            <div className="fr" key={f.name}>
              <span>{f.name}</span>
              <div>
                <i style={{ width: `${f.value}%`, background: color }}></i>
              </div>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

