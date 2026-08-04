import React from 'react';

export default function SpecStrip() {
  return (
    <section className="spec">
      <div>
        <small>Project</small>TerraGuard · India
      </div>
      <div>
        <small>Zones</small>8 monitored
      </div>
      <div>
        <small>High risk</small>
        <span className="red">3 zones</span>
      </div>
      <div>
        <small>Model accuracy</small>92%
      </div>
      <div>
        <small>Data</small>NASA GLC + Open-Meteo
      </div>
      <div>
        <small>Sheet</small>1 / 1 · zones 1–8
      </div>
    </section>
  );
}

