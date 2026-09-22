'use client';

import { useState, useEffect } from 'react';
import { BITRATE_PRESETS, cctvStorage } from '@/lib/calculators';

export default function CctvStorageCalculator() {
  const [cameras, setCameras] = useState(8);
  const [resolution, setResolution] = useState('4mp');
  const [codec, setCodec] = useState('h265');
  const [bitrate, setBitrate] = useState(6);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [activityPercent, setActivityPercent] = useState(100);
  const [retentionDays, setRetentionDays] = useState(30);
  
  const [result, setResult] = useState({
    gbPerCameraPerDay: 0,
    totalTB: 0
  });

  useEffect(() => {
    // Find the selected preset
    const preset = BITRATE_PRESETS.find(p => p.id === resolution);
    if (preset) {
      // Update bitrate based on codec and preset
      const newBitrate = codec === 'h264' ? preset.h264Mbps : preset.h265Mbps;
      setBitrate(newBitrate);
    }
  }, [resolution, codec]);

  useEffect(() => {
    const storageResult = cctvStorage({
      cameras,
      bitrateMbps: bitrate,
      hoursPerDay,
      activityPercent,
      retentionDays
    });
    
    setResult(storageResult);
  }, [cameras, bitrate, hoursPerDay, activityPercent, retentionDays]);

  return (
    <div className="section calculator-section">
      <div className="container calculator">
        <div className="field">
          <label htmlFor="cameras">Number of cameras</label>
          <input
            id="cameras"
            type="number"
            min="0"
            value={cameras}
            onChange={(e) => setCameras(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="resolution">Resolution</label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            {BITRATE_PRESETS.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="codec">Codec</label>
          <select
            id="codec"
            value={codec}
            onChange={(e) => setCodec(e.target.value)}
          >
            <option value="h264">H.264</option>
            <option value="h265">H.265</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="bitrate">Bitrate per camera (Mbps)</label>
          <input
            id="bitrate"
            type="number"
            min="0"
            step="0.1"
            value={bitrate}
            onChange={(e) => setBitrate(Math.max(0, parseFloat(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="hoursPerDay">Recording hours per day</label>
          <input
            id="hoursPerDay"
            type="number"
            min="0"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
          />
        </div>

        <div className="field">
          <label htmlFor="activityPercent">Recording activity (%)</label>
          <input
            id="activityPercent"
            type="number"
            min="0"
            max="100"
            value={activityPercent}
            onChange={(e) => setActivityPercent(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
          />
        </div>

        <div className="field">
          <label htmlFor="retentionDays">Retention period (days)</label>
          <input
            id="retentionDays"
            type="number"
            min="0"
            value={retentionDays}
            onChange={(e) => setRetentionDays(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>

        <div className="calculator-results">
          <h2>Results</h2>
          <p>Storage per camera per day: <strong>{result.gbPerCameraPerDay.toFixed(2)} GB</strong></p>
          <p>Total storage needed: <strong>{result.totalTB.toFixed(2)} TB</strong></p>
          <p className="form-note">
            Estimate only. Real bitrates vary with scene activity, frame rate and camera settings -- check the camera&apos;s own bitrate figure. 
            RAID and file-system overhead are not included.
          </p>
        </div>
      </div>
    </div>
  );
}