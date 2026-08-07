import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SITES, COL } from '../../constants/sites';

export default function LeafletMap({
  filter,
  selectedCoords,
  onMapClick,
  flyToTarget,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const markersRef = useRef({});
  const pinRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      scrollWheelZoom: true,
    }).setView([22, 80], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    layerGroupRef.current = layer;
    mapInstanceRef.current = map;

    // Create markers for monitored zones
    const siteMarkers = {};
    SITES.forEach(x => {
      const c = COL[x.r];
      const halo = L.circle([x.lat, x.lng], {
        radius: x.r === "High" ? 90000 : 60000,
        color: c,
        weight: 1,
        fillColor: c,
        fillOpacity: 0.15,
      });

      const m = L.circleMarker([x.lat, x.lng], {
        radius: 9,
        color: "#fff",
        weight: 2,
        fillColor: c,
        fillOpacity: 1,
        bubblingMouseEvents: false,
      }).bindPopup(
        `<b>${x.n}</b>, ${x.s}<br>Score: <b style="color:${c}">${x.sc}/100</b> · ${x.r}<br>Rainfall 24h: ${x.rain}`
      );

      siteMarkers[x.n] = { m, halo, ...x };
    });
    markersRef.current = siteMarkers;

    map.on("click", e => {
      const clickedLat = Number(e.latlng.lat.toFixed(4));
      const clickedLng = Number(e.latlng.lng.toFixed(4));
      onMapClick(clickedLat, clickedLng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filter site markers
  useEffect(() => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    const vis = SITES.filter(x => filter === "All" || x.r === filter);
    vis.forEach(x => {
      const markerData = markersRef.current[x.n];
      if (markerData) {
        layerGroupRef.current.addLayer(markerData.halo);
        layerGroupRef.current.addLayer(markerData.m);
      }
    });
  }, [filter]);

  // Update selected pin on map
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCoords) return;
    const { lat, lng } = selectedCoords;
    if (isNaN(lat) || isNaN(lng)) return;

    if (pinRef.current) {
      pinRef.current.setLatLng([lat, lng]);
    } else {
      pinRef.current = L.circleMarker([lat, lng], {
        radius: 11,
        color: "#151714",
        weight: 4,
        fillColor: "#fff",
        fillOpacity: 1,
        bubblingMouseEvents: false,
      }).addTo(mapInstanceRef.current);
    }
  }, [selectedCoords]);

  // Fly to target site or location
  useEffect(() => {
    if (!mapInstanceRef.current || !flyToTarget) return;
    const { lat, lng, zoom, siteName } = flyToTarget;
    mapInstanceRef.current.setView([lat, lng], zoom || 9);

    if (siteName && markersRef.current[siteName]?.m) {
      markersRef.current[siteName].m.openPopup();
    }
  }, [flyToTarget]);

  return <div id="map" ref={mapContainerRef}></div>;
}

