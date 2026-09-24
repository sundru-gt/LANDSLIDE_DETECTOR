import React from 'react';
import ZoneAssessmentTable from './ZoneAssessmentTable';

const STEPS = [
  {
    num: "01",
    title: "Location",
    desc: "A place name or map click resolves to a confirmed latitude and longitude.",
  },
  {
    num: "02",
    title: "Terrain",
    desc: "Slope angle and aspect are derived from elevation data.",
  },
  {
    num: "03",
    title: "Rainfall & soil",
    desc: "Recent rainfall and soil saturation are compared with failure thresholds.",
  },
  {
    num: "04",
    title: "Score",
    desc: "The model returns a rating out of 100: Low under 40, Moderate 40–69, High 70+.",
  },
];

export default function MethodSection() {
  return (
    <section id="method">
      <div className="sh">
        <h2>Method, reproducible</h2>
        <p>
          The same coordinates return the same score and the same factors. Every input is listed below.
        </p>
      </div>
      <div className="m">
        <div className="ml">
          {STEPS.map(s => (
            <div key={s.num}>
              <span>{s.num}</span>
              <section>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </section>
            </div>
          ))}
        </div>

        <ZoneAssessmentTable />
      </div>
    </section>
  );
}

