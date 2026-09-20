import React from 'react';

const FEATURES = [
  {
    num: "1",
    title: "Satellite & sensor fusion",
    desc: "Remote sensing and ground sensors are combined for continuous slope monitoring.",
  },
  {
    num: "2",
    title: "Rainfall triggers",
    desc: "Tracks the rainfall thresholds that have historically preceded slope failure.",
  },
  {
    num: "3",
    title: "ML risk prediction",
    desc: "A trained model scores each coordinate from 0 to 100 and updates as data arrives.",
  },
  {
    num: "4",
    title: "Factors, not just a number",
    desc: "Slope, rainfall, soil saturation and vegetation loss are printed with every result.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="sh">
        <h2>What TerraGuard does</h2>
        <p>
          Satellite and ground data go in. A single score per location comes out, with the reasons
          printed beside it.
        </p>
      </div>
      <div className="g2">
        {FEATURES.map(f => (
          <div key={f.num}>
            <span className="nn">{f.num}</span>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

