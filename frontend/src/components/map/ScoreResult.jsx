import React from 'react';
import { COL } from '../../constants/sites';

export default function ScoreResult({ result, errorMsg, onToggleDetails, showDetails }) {
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
        <div>
          <span className={`bd ${result.risk}`}>{result.risk} risk</span>
          <div style={{ fontSize: "11px", color: "var(--mute)", fontFamily: "var(--mono)", marginTop: "4px" }}>
            COMPOSITE SCREENING SCORE
          </div>
        </div>
      </div>

      {result.factors && result.factors.length > 0 && (
        <div className="factors-list" style={{ marginTop: "12px" }}>
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

      {/* Button to reveal the detailed assessment section below */}
      {onToggleDetails && (
        <button
          type="button"
          className="btn full sm"
          onClick={onToggleDetails}
          style={{
            marginTop: "16px",
            background: showDetails ? "var(--paper)" : "var(--ink)",
            color: showDetails ? "var(--ink)" : "#fff",
            border: "1px solid var(--ink)",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          <span>{showDetails ? "Hide Detailed Assessment ↑" : "Detailed Assessment ↓"}</span>
        </button>
      )}
    </div>
  );
}
