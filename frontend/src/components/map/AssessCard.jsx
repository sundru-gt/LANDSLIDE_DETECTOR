import React, { useState } from 'react';
import { searchLocation } from '../../api/geocoding';
import ScoreResult from './ScoreResult';

export default function AssessCard({
  lat,
  lng,
  onLatChange,
  onLngChange,
  statusText,
  analyzing,
  result,
  errorMsg,
  onAnalyze,
  onSelectLocation,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    const results = await searchLocation(query);
    setSuggestions(results);
  };

  const handleSelectSuggestion = item => {
    setSuggestions([]);
    setQuery(item.name);
    onSelectLocation(item.lat, item.lng, item.name);
  };

  return (
    <div className="panel">
      <div className="ph">
        <span>
          Assess <b>an area</b>
        </span>
        <span>input</span>
      </div>
      <div className="pb">
        {/* Search Field */}
        <div className="fld">
          <input
            className="in-field"
            placeholder="Search a place, e.g. Mussoorie"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            autoComplete="off"
          />
          <button className="btn sm" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="sug">
            {suggestions.map(s => (
              <button key={s.name} onClick={() => handleSelectSuggestion(s)}>
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* Coordinate Inputs */}
        <div className="ll">
          <div>
            <label htmlFor="lat">Latitude</label>
            <input
              className="in-field"
              id="lat"
              type="number"
              step="any"
              placeholder="--"
              value={lat}
              onChange={e => onLatChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lng">Longitude</label>
            <input
              className="in-field"
              id="lng"
              type="number"
              step="any"
              placeholder="--"
              value={lng}
              onChange={e => onLngChange(e.target.value)}
            />
          </div>
        </div>

        <p className="hint">{statusText}</p>

        {/* Action Button */}
        <button
          className="btn full"
          disabled={analyzing || !lat || !lng}
          onClick={onAnalyze}
        >
          {analyzing ? "Analyzing…" : "Confirm & analyze"}
        </button>

        {/* Assessment Score / Factors Output */}
        <ScoreResult result={result} errorMsg={errorMsg} />
      </div>
    </div>
  );
}

