import React, { useState } from 'react';

export default function CtaSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCmd = async () => {
    const text = `$ curl -X POST http://localhost:8000/api/v1/live/assess \\\n    -H "Content-Type: application/json" \\\n    -d '{"latitude": 30.556, "longitude": 79.564}'`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="cta">
      <div>
        <h2>
          Ask it about the <span>last slope</span> that failed.
        </h2>
        <p>
          If the score matches what you saw on the ground, you have a second opinion in seconds. If it
          doesn't, you have a model issue worth reporting.
        </p>
        <a className="btn" href="#map-sec">
          Back to the map &uarr;
        </a>
      </div>

      <div className="code">
        <div className="ph">
          <span>
            API <b>shell</b>
          </span>
          <button onClick={handleCopyCmd}>{copied ? "Copied" : "Copy"}</button>
        </div>
        <pre id="cmd">
          <span className="d">$</span> curl -X POST http://localhost:8000/api/v1/live/assess \{"\n"}
          {"    "}<span className="d">-H</span> "Content-Type: application/json" \{"\n"}
          {"    "}<span className="d">-d</span> '{JSON.stringify({ latitude: 30.556, longitude: 79.564 })}'{"\n\n"}
          <span className="y">&#123; "score": 84, "factors": [ … ] &#125;</span>
        </pre>
      </div>
    </section>
  );
}

