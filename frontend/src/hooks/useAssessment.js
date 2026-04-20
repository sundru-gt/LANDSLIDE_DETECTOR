import { useState } from 'react';
import { assessLocation } from '../api/assessment';

export function useAssessment() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [statusText, setStatusText] = useState("No location selected. Search above or click the map.");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const setCoordinates = (latitude, longitude, label) => {
    setLat(String(latitude));
    setLng(String(longitude));
    setResult(null);
    setErrorMsg("");
    setStatusText((label || "Selected point") + " · check the coordinates, then confirm.");
  };

  const runAnalysis = async () => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng) || numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
      setStatusText("Enter valid coordinates.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg("");
    setResult(null);

    try {
      const data = await assessLocation(numLat, numLng);
      setResult(data);
      setStatusText(`Result for ${numLat.toFixed(4)}, ${numLng.toFixed(4)}`);
    } catch (err) {
      setErrorMsg(err.message || "Could not reach the prediction service. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    lat,
    lng,
    setLat,
    setLng,
    statusText,
    analyzing,
    result,
    errorMsg,
    setCoordinates,
    runAnalysis,
  };
}

