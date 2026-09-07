import React, { useState } from 'react';
import SegmentedControl from '../common/SegmentedControl';
import LeafletMap from './LeafletMap';
import AssessCard from './AssessCard';
import ZonesList from './ZonesList';

export default function MapSection({
  filter,
  onFilterChange,
  filterCounts,
  visibleSites,
  lat,
  lng,
  onLatChange,
  onLngChange,
  statusText,
  analyzing,
  result,
  errorMsg,
  onAnalyze,
  onSelectCoordinates,
}) {
  const [flyToTarget, setFlyToTarget] = useState(null);

  const selectedCoords = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

  const handleMapClick = (clickedLat, clickedLng) => {
    onSelectCoordinates(clickedLat, clickedLng, "Pinned on map");
  };

  const handleSelectLocation = (locLat, locLng, name) => {
    onSelectCoordinates(locLat, locLng, name);
    setFlyToTarget({ lat: locLat, lng: locLng, zoom: 9, timestamp: Date.now() });
  };

  const handleSiteClick = site => {
    setFlyToTarget({ lat: site.lat, lng: site.lng, zoom: 7, siteName: site.n, timestamp: Date.now() });
  };

  return (
    <section id="map-sec">
      <div className="sh">
        <h2>Assess any slope</h2>
        <p>
          Search a place name or click the map. Zoom in, drop a pin, confirm the latitude and longitude,
          then run the assessment.
        </p>
      </div>

      <div className="mapwrap">
        {/* Map Column */}
        <div className="panel">
          <div className="ph">
            <span>
              Map <b>Leaflet</b>
            </span>
            <SegmentedControl
              activeTab={filter}
              onTabChange={onFilterChange}
              counts={filterCounts}
            />
          </div>
          <LeafletMap
            filter={filter}
            selectedCoords={selectedCoords}
            onMapClick={handleMapClick}
            flyToTarget={flyToTarget}
          />
        </div>

        {/* Control Column */}
        <div className="col">
          <AssessCard
            lat={lat}
            lng={lng}
            onLatChange={onLatChange}
            onLngChange={onLngChange}
            statusText={statusText}
            analyzing={analyzing}
            result={result}
            errorMsg={errorMsg}
            onAnalyze={onAnalyze}
            onSelectLocation={handleSelectLocation}
          />

          <ZonesList
            sites={visibleSites}
            onSiteClick={handleSiteClick}
          />
        </div>
      </div>
    </section>
  );
}

