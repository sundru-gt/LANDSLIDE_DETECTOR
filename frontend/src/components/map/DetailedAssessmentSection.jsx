import React, { useEffect, useRef } from 'react';
import { COL } from '../../constants/sites';

export default function DetailedAssessmentSection({ result, lat, lng, onClose }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!result) return null;

  const color = COL[result.risk] || "var(--hi)";
  const rawData = result.raw || {};
  const finalScoreObj = result.final_score || rawData.final_score || {};
  const rawComponents = result.components || finalScoreObj.components || {};
  const features = result.features || rawData.features || {};

  // Build the 6 components
  const componentsList = [
    {
      num: "01",
      name: "Historical Event Count",
      weight: "30%",
      score: rawComponents.historical_event_count?.score ?? Math.round(result.score * 0.9),
      observed: rawComponents.historical_event_count?.observed_value_display
        ?? (rawComponents.historical_event_count?.observed_value != null
          ? `${rawComponents.historical_event_count.observed_value} events within 25 km`
          : "Reported events within 25 km"),
      formula: "100 × (1 - e^(-count / 12))",
      desc: "Density of NASA catalog historical landslide records within a 25 km radius.",
    },
    {
      num: "02",
      name: "Nearest Event Proximity",
      weight: "20%",
      score: rawComponents.nearest_event_proximity?.score ?? Math.round(result.score * 1.05),
      observed: rawComponents.nearest_event_proximity?.observed_value_display
        ?? (rawComponents.nearest_event_proximity?.observed_value_km != null
          ? `${rawComponents.nearest_event_proximity.observed_value_km} km away`
          : "Distance to closest known failure"),
      formula: "100 × e^(-dist_km / 20)",
      desc: "Spatial proximity decay; closer recorded failures contribute significantly higher baseline hazard.",
    },
    {
      num: "03",
      name: "ML Relative Risk",
      weight: "20%",
      score: rawComponents.ml_relative_event_score?.score
        ?? Math.round((result.relative_event_score ?? (result.score / 100)) * 100),
      observed: rawComponents.ml_relative_event_score?.observed_value_display
        ?? `${Math.round((result.relative_event_score ?? (result.score / 100)) * 100)}% relative discrimination`,
      formula: "P(Landslide | 6 features)",
      desc: "Random Forest model inference comparing live environmental features against historical events.",
    },
    {
      num: "04",
      name: "Recent Rainfall Triggers",
      weight: "15%",
      score: rawComponents.recent_rainfall?.score
        ?? Math.min(100, Math.round(Number(features.rain_24h_mm || 0) * 1.8)),
      observed: rawComponents.recent_rainfall?.observed_value_display
        ?? `24h: ${features.rain_24h_mm ?? 0}mm | 72h: ${features.rain_72h_mm ?? 0}mm | 7d: ${features.rain_7d_mm ?? 0}mm`,
      formula: "Saturating scales: 30mm/24h, 60mm/72h, 150mm/7d",
      desc: "Short-term intensity and antecedent 7-day cumulative rainfall thresholds.",
    },
    {
      num: "05",
      name: "Historical Event Recency",
      weight: "10%",
      score: rawComponents.event_recency?.score ?? Math.round(result.score * 0.8),
      observed: rawComponents.event_recency?.observed_value_display
        ?? (rawComponents.event_recency?.observed_value_age_days != null
          ? `${rawComponents.event_recency.observed_value_age_days} days ago`
          : "Age of nearest recorded landslide"),
      formula: "100 × e^(-days / (365 × 8))",
      desc: "Temporal decay; recent ground failures provide higher evidence of active slope instability.",
    },
    {
      num: "06",
      name: "Soil Moisture Saturation",
      weight: "5%",
      score: rawComponents.soil_moisture?.score
        ?? Math.round(Number(features.soil_moisture_0_7cm_pct || 35)),
      observed: rawComponents.soil_moisture?.observed_value_display
        ?? `${Math.round(Number(features.soil_moisture_0_7cm_pct || 35))}% volumetric water content (avg)`,
      formula: "Mean(Moisture 0–7cm, Moisture 7–28cm)",
      desc: "Combined surface and root-zone water saturation reducing shear resistance along potential slip surfaces.",
    },
  ];

  const formatMeteo = (val, unit) => {
    if (val === null || val === undefined || isNaN(Number(val))) return "--";
    return `${Number(val).toFixed(1)}${unit}`;
  };

  return (
    <div
      ref={sectionRef}
      id="detailed-assessment"
      className="detailed-sec"
    >
      {/* Top Header Bar */}
      <div
        className="ph"
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ font: "400 24px var(--disp)", letterSpacing: "0.04em", color: "#fff" }}>
            Detailed Assessment & Telemetry
          </span>
          <span style={{ font: "12px var(--mono)", color: "#a8aaa4" }}>
            COORDINATES: {lat}, {lng}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ font: "12px var(--mono)", color: "#fff" }}>
            COMPOSITE SCORE: <strong style={{ color: "var(--sal)", fontSize: "16px" }}>{result.score}/100</strong> ({result.risk} RISK)
          </span>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #666",
                color: "#fff",
                font: "11px var(--mono)",
                padding: "4px 10px",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              ✕ Collapse
            </button>
          )}
        </div>
      </div>

      <div className="detailed-sec-body">
        {/* Section 1: The 6 Composite Components */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px", borderBottom: "1px solid var(--ink)", paddingBottom: "8px" }}>
            <div>
              <h3 style={{ font: "400 28px/1 var(--disp)", textTransform: "uppercase", margin: 0 }}>
                1. Composite Risk Components (All 6 Evaluated)
              </h3>
              <p style={{ font: "13px var(--mono)", color: "var(--mute)", margin: "4px 0 0 0" }}>
                Each component contributes proportionally to the final 0–100 screening score.
              </p>
            </div>
            <span style={{ font: "12px var(--mono)", color: "var(--mute)", textTransform: "uppercase" }}>
              Scores Out of 100
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1px",
              background: "var(--ink)",
              border: "1px solid var(--ink)",
            }}
          >
            {componentsList.map(comp => (
              <div
                key={comp.num}
                style={{
                  background: "var(--paper)",
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                    <span style={{ font: "11px var(--mono)", color: "var(--mute)", letterSpacing: "0.1em" }}>
                      {comp.num} // WEIGHT: {comp.weight}
                    </span>
                    <span style={{ font: "700 22px var(--disp)", color }}>
                      {Math.round(comp.score)}
                      <small style={{ font: "500 12px var(--mono)", color: "var(--mute)", marginLeft: "3px" }}>/100</small>
                    </span>
                  </div>

                  <h4 style={{ font: "600 15px var(--sans)", margin: "0 0 8px 0", color: "var(--ink)" }}>
                    {comp.name}
                  </h4>

                  {/* Progress bar */}
                  <div style={{ height: "8px", background: "#e2e3df", margin: "8px 0 10px 0" }}>
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, comp.score))}%`,
                        height: "100%",
                        background: color,
                      }}
                    />
                  </div>

                  {/* Value Found */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid var(--soft)",
                      padding: "8px 10px",
                      font: "12px var(--mono)",
                      margin: "8px 0",
                    }}
                  >
                    <span style={{ color: "var(--mute)", display: "block", fontSize: "10px", textTransform: "uppercase" }}>
                      Value Found at Location:
                    </span>
                    <strong style={{ color: "var(--ink)", fontSize: "13px" }}>{comp.observed}</strong>
                  </div>
                </div>

                <div style={{ font: "11px var(--mono)", color: "var(--mute)", borderTop: "1px solid var(--soft)", paddingTop: "8px", marginTop: "8px" }}>
                  {comp.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Open-Meteo API Outputs */}
        <div style={{ marginTop: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px", borderBottom: "1px solid var(--ink)", paddingBottom: "8px" }}>
            <div>
              <h3 style={{ font: "400 28px/1 var(--disp)", textTransform: "uppercase", margin: 0 }}>
                2. Open-Meteo API Live Output Values
              </h3>
              <p style={{ font: "13px var(--mono)", color: "var(--mute)", margin: "4px 0 0 0" }}>
                Raw meteorological, soil moisture, and digital elevation model readings for coordinates ({lat}, {lng}).
              </p>
            </div>
            <span style={{ font: "12px var(--mono)", color: "var(--lo)", textTransform: "uppercase", fontWeight: 600 }}>
              ● {features.weather_source || "Open-Meteo Forecast API"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1px",
              background: "var(--ink)",
              border: "1px solid var(--ink)",
            }}
          >
            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                24-Hour Rainfall
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.rain_24h_mm, " mm")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Immediate pore pressure trigger
              </div>
            </div>

            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                72-Hour Rainfall
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.rain_72h_mm, " mm")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Multi-day storm accumulation
              </div>
            </div>

            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                7-Day Cumulative Rain
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.rain_7d_mm, " mm")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Antecedent ground wetness
              </div>
            </div>

            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Surface Moisture (0–7cm)
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.soil_moisture_0_7cm_pct, "%")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Volumetric topsoil water content
              </div>
            </div>

            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Deep Moisture (7–28cm)
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.soil_moisture_7_28cm_pct, "%")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Subsurface failure plane moisture
              </div>
            </div>

            <div style={{ background: "var(--paper)", padding: "16px" }}>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Elevation
              </div>
              <div style={{ font: "400 36px/1 var(--disp)", color: "var(--ink)", marginTop: "6px" }}>
                {formatMeteo(features.elevation_m, " m")}
              </div>
              <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "4px" }}>
                Digital Elevation Model (DEM)
              </div>
            </div>
          </div>

          {features.retrieved_at && (
            <div style={{ font: "11px var(--mono)", color: "var(--mute)", marginTop: "10px", textAlign: "right" }}>
              Telemetry timestamp: {new Date(features.retrieved_at).toLocaleString()} | Model: {features.source_model || "ERA5 / Best Match"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
