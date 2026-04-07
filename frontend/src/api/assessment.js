import { ASSESS_ENDPOINT } from './client';

/**
 * Assesses landslide risk for given coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{score: number, risk: string, factors: Array<{name: string, value: number}>}>}
 */
export async function assessLocation(latitude, longitude) {
  const res = await fetch(ASSESS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API request failed with status ${res.status}`);
  }

  const data = await res.json();

  // Normalize score to 0–100 scale
  let rawScore = 0;
  if (typeof data.score === "number") {
    rawScore = data.score;
  } else if (data.final_score && typeof data.final_score.final_landslide_screening_score === "number") {
    rawScore = data.final_score.final_landslide_screening_score;
  } else if (typeof data.relative_event_score === "number") {
    rawScore = data.relative_event_score <= 1.0 ? data.relative_event_score * 100 : data.relative_event_score;
  }

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const risk = score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";

  // Map factors
  let factors = [];
  if (Array.isArray(data.factors) && data.factors.length > 0) {
    factors = data.factors.map(f => ({
      name: f.name || "Factor",
      value: Math.max(0, Math.min(100, Math.round(f.value || 0))),
    }));
  } else if (data.final_score && data.final_score.components) {
    const comp = data.final_score.components;
    const labelMap = {
      recent_rainfall: "Rainfall",
      soil_moisture: "Soil saturation",
      ml_relative_event_score: "ML relative risk",
      historical_event_count: "Historical records",
      nearest_event_proximity: "Event proximity",
    };
    factors = Object.entries(comp)
      .filter(([_, item]) => item && typeof item.score === "number")
      .map(([key, item]) => ({
        name: labelMap[key] || key.replace(/_/g, " "),
        value: Math.max(0, Math.min(100, Math.round(item.score))),
      }));
  }

  return { score, risk, factors };
}

