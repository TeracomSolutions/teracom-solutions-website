'use client';

import { useState, useEffect } from 'react';
import { batteryStandby } from '@/lib/calculators';

export default function BatteryStandbyCalculator() {
  const [standbyAmps, setStandbyAmps] = useState(0.5);
  const [standbyHours, setStandbyHours] = useState(24);
  const [alarmAmps, setAlarmAmps] = useState(1.5);
  const [alarmHours, setAlarmHours] = useState(0.5);
  const [derating, setDerating] = useState(1.25);
  
  const [result, setResult] = useState({
    requiredAh: 0,
    recommendedAh: null
  });

  useEffect(() => {
    const batteryResult = batteryStandby({
      standbyAmps,
      standbyHours,
      alarmAmps,
      alarmHours,
      derating
    });
    
    setResult(batteryResult);
  }, [standbyAmps, standbyHours, alarmAmps, alarmHours, derating]);

  return (
    <div className="section calculator-section">
      <div className="container calculator">
        <div className="field">
          <label htmlFor="standbyAmps">Standby current (A)</label>
          <input
            id="standbyAmps"
            type="number"
            min="0"
            step="0.1"
            value={standbyAmps}
            onChange={(e) => setStandbyAmps(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="standbyHours">Standby hours</label>
          <input
            id="standbyHours"
            type="number"
            min="0"
            value={standbyHours}
            onChange={(e) => setStandbyHours(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="alarmAmps">Alarm current (A)</label>
          <input
            id="alarmAmps"
            type="number"
            min="0"
            step="0.1"
            value={alarmAmps}
            onChange={(e) => setAlarmAmps(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="alarmHours">Alarm hours</label>
          <input
            id="alarmHours"
            type="number"
            min="0"
            step="0.1"
            value={alarmHours}
            onChange={(e) => setAlarmHours(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="derating">Derating factor</label>
          <input
            id="derating"
            type="number"
            min="0"
            step="0.01"
            value={derating}
            onChange={(e) => setDerating(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="calculator-results">
          <h2>Results</h2>
          <p>Capacity required: <strong>{result.requiredAh.toFixed(2)} Ah</strong></p>
          <p>Suggested battery: <strong>{result.recommendedAh === null ? 'Over 100 Ah -- use a larger battery bank' : result.recommendedAh + ' Ah'}</strong></p>
          <p className="form-note">
            Use the standby and alarm durations your specification and the applicable Australian Standards require.
          </p>
        </div>
      </div>
    </div>
  );
}