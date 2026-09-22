'use client';

import { useState } from 'react';
import { CABLE_SIZES_MM2, voltageDrop } from '@/lib/calculators';

// Inputs are kept as the strings the visitor typed (so decimals like "13.8" or
// "0.75" can be entered naturally); lib/calculators.js treats blanks as zero.
export default function VoltageDropCalculator() {
  const [supplyVolts, setSupplyVolts] = useState('12');
  const [currentAmps, setCurrentAmps] = useState('1');
  const [lengthMetres, setLengthMetres] = useState('50');
  const [conductorMm2, setConductorMm2] = useState('0.5');
  const [maxDropPercent, setMaxDropPercent] = useState('10');

  const r = voltageDrop({ supplyVolts, currentAmps, lengthMetres, conductorMm2, maxDropPercent });
  const fmt = (n, dp = 2) => (Number.isFinite(n) ? n.toFixed(dp) : '0.00');

  return (
    <div className="section calculator-section">
      <div className="container calculator">
        <div className="field">
          <label htmlFor="vd-supply">Supply voltage (V DC)</label>
          <input id="vd-supply" type="number" min="0" step="0.1" inputMode="decimal" value={supplyVolts} onChange={(e) => setSupplyVolts(e.target.value)} />
          <p className="form-note">Typically 12, 13.8, 24 or 27.6 V DC.</p>
        </div>
        <div className="field">
          <label htmlFor="vd-current">Load current (A)</label>
          <input id="vd-current" type="number" min="0" step="0.01" inputMode="decimal" value={currentAmps} onChange={(e) => setCurrentAmps(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="vd-length">Cable length, one way (m)</label>
          <input id="vd-length" type="number" min="0" step="1" inputMode="decimal" value={lengthMetres} onChange={(e) => setLengthMetres(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="vd-size">Conductor size</label>
          <select id="vd-size" value={conductorMm2} onChange={(e) => setConductorMm2(e.target.value)}>
            {CABLE_SIZES_MM2.map((c) => (
              <option key={c.mm2} value={String(c.mm2)}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="vd-max">Maximum acceptable drop (%)</label>
          <input id="vd-max" type="number" min="0" step="0.5" inputMode="decimal" value={maxDropPercent} onChange={(e) => setMaxDropPercent(e.target.value)} />
          <p className="form-note">Check the minimum operating voltage on the device&apos;s datasheet.</p>
        </div>

        <div className="calculator-results">
          <h2>Results</h2>
          <p>Voltage drop: <strong>{fmt(r.dropVolts)} V ({fmt(r.dropPercent, 1)}%)</strong></p>
          <p>Voltage at the device: <strong>{fmt(r.loadVolts)} V</strong></p>
          <p>Loop resistance: <strong>{fmt(r.resistanceOhms, 3)} &Omega;</strong></p>
          <p className={r.withinLimit ? undefined : 'form-note-banner'}>
            {r.withinLimit
              ? `Within your ${fmt(Number(maxDropPercent) || 0, 1)}% limit.`
              : `Over your ${fmt(Number(maxDropPercent) || 0, 1)}% limit -- use a larger conductor, a shorter run or a higher supply voltage.`}
          </p>
          <p>
            Minimum conductor size for this limit: <strong>{fmt(r.minConductorMm2)} mm&sup2;</strong>
            {r.suggestedMm2 !== null
              ? <> &mdash; nearest standard size <strong>{r.suggestedMm2} mm&sup2;</strong></>
              : <> &mdash; larger than 6 mm&sup2;; split the load or add a local power supply</>}
          </p>
          <p className="form-note">
            Assumes a two-wire copper DC run at 20&deg;C; resistance rises with temperature, so allow some margin.
            For 230 V AC mains circuits, size cables to AS/NZS 3008.
          </p>
        </div>
      </div>
    </div>
  );
}
