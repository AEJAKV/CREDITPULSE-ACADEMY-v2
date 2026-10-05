"use client";

// Extracted from components/SinglePageCourse.jsx (ScoreVisual, lines 320-347).
// In the source it is rendered as: <div className="reader-score-panel"><ScoreVisual /></div>
// inside an element with class "reader-shell" (which supplies the --reader-* variables and font).
import { useState } from "react";
import { CircleGauge, ShieldCheck } from "lucide-react";

export function ScoreVisual() {
  const [scoreInput, setScoreInput] = useState("650");
  const score = Math.min(900, Math.max(300, Number(scoreInput) || 300));
  const position = ((score - 300) / 600) * 100;
  const result = score < 660
    ? { key: "building", label: "Building", range: "300–659", message: "This may signal more lending risk, but it does not mean automatic rejection." }
    : score < 725
      ? { key: "good", label: "Good", range: "660–724", message: "This is generally considered a good range by Equifax Canada." }
      : score < 760
        ? { key: "very-good", label: "Very good", range: "725–759", message: "This is generally considered a very good range by Equifax Canada." }
        : { key: "excellent", label: "Excellent", range: "760–900", message: "This is generally considered an excellent range by Equifax Canada." };

  return <div className="calculator-frame score-calculator-frame"><div className="score-explorer">
    <div className="score-explorer-head"><div><CircleGauge aria-hidden="true" /><span>Explore a credit score</span></div><strong>LIVE</strong></div>
    <div className="score-live-value" aria-live="polite"><span>Your score</span><strong>{score}</strong><small>out of 900</small></div>
    <label className="score-number-label" htmlFor="credit-score-input">Enter a score</label>
    <input id="credit-score-input" className="score-number-input" type="number" min="300" max="900" inputMode="numeric" value={scoreInput} onChange={(event) => setScoreInput(event.target.value)} onBlur={() => setScoreInput(String(score))} />
    <div className="score-range-wrap">
      <input className="score-range-input" type="range" min="300" max="900" value={score} onChange={(event) => setScoreInput(event.target.value)} aria-label="Explore a credit score from 300 to 900" style={{ "--score-position": `${position}%` }} />
      <div className="score-range-labels"><span>300</span><span>900</span></div>
    </div>
    <div className="score-band-grid" aria-label="General credit score bands">
      {[{ key: "building", range: "300–659", label: "Building" }, { key: "good", range: "660–724", label: "Good" }, { key: "very-good", range: "725–759", label: "Very good" }, { key: "excellent", range: "760–900", label: "Excellent" }].map((band) => <div key={band.key} className={result.key === band.key ? "current" : ""}><i /><span>{band.range}</span><small>{band.label}</small></div>)}
    </div>
    <div className={`score-live-result ${result.key}`} aria-live="polite"><ShieldCheck aria-hidden="true" /><div><span>{result.range}</span><strong>{result.label}</strong><p>{result.message}</p></div></div>
    <p className="score-disclaimer">Educational guide only. Lenders use different models and consider other information.</p>
  </div></div>;
}
