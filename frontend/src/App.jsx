import React, { useState, useMemo } from 'react';
import Navbar from './components/common/Navbar';
import Ruler from './components/common/Ruler';
import Footer from './components/common/Footer';
import HeroSection from './components/hero/HeroSection';
import SpecStrip from './components/hero/SpecStrip';
import MapSection from './components/map/MapSection';
import FeaturesSection from './components/features/FeaturesSection';
import MethodSection from './components/method/MethodSection';

import { SITES, FILTER_TABS } from './constants/sites';
import { useScrollState } from './hooks/useScrollState';
import { useAssessment } from './hooks/useAssessment';

export default function App() {
  const [filter, setFilter] = useState("All");

  // Hook for morphing header on scroll
  useScrollState(40);

  // Hook for assessment analysis and coordinate management
  const {
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
  } = useAssessment();

  // Filtered sites according to active tab
  const visibleSites = useMemo(() => {
    return SITES.filter(x => filter === "All" || x.r === filter);
  }, [filter]);

  // Mean score of visible zones
  const meanScore = useMemo(() => {
    if (!visibleSites.length) return 0;
    return Math.round(visibleSites.reduce((a, b) => a + b.sc, 0) / visibleSites.length);
  }, [visibleSites]);

  // Tab counts
  const filterCounts = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach(tab => {
      counts[tab] = tab === "All" ? SITES.length : SITES.filter(x => x.r === tab).length;
    });
    return counts;
  }, []);

  return (
    <>
      <Navbar />

      <main className="sheet" id="top">
        <Ruler />

        <HeroSection
          visibleSites={visibleSites}
          filter={filter}
          onFilterChange={setFilter}
          filterCounts={filterCounts}
          meanScore={meanScore}
        />

        <SpecStrip />

        <MapSection
          filter={filter}
          onFilterChange={setFilter}
          filterCounts={filterCounts}
          visibleSites={visibleSites}
          lat={lat}
          lng={lng}
          onLatChange={setLat}
          onLngChange={setLng}
          statusText={statusText}
          analyzing={analyzing}
          result={result}
          errorMsg={errorMsg}
          onAnalyze={runAnalysis}
          onSelectCoordinates={setCoordinates}
        />

        <FeaturesSection />

        <MethodSection />
      </main>

      <Footer />
    </>
  );
}
