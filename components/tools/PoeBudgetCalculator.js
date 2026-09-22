'use client';

import { useState, useEffect } from 'react';
import { POE_TYPES, poeBudget } from '@/lib/calculators';

export default function PoeBudgetCalculator() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Cameras', poeType: 'af', watts: 15.4, quantity: 4 }
  ]);
  
  const [switchBudgetWatts, setSwitchBudgetWatts] = useState(120);
  const [switchPorts, setSwitchPorts] = useState(8);
  
  const [result, setResult] = useState({
    totalWatts: 0,
    portsUsed: 0,
    utilisationPercent: 0,
    remainingWatts: 0,
    overBudget: false,
    overPorts: false,
    lowHeadroom: false
  });

  const addDevice = () => {
    setDevices([...devices, { 
      id: devices.reduce((max, d) => Math.max(max, d.id), 0) + 1,
      name: '', 
      poeType: 'af', 
      watts: 15.4, 
      quantity: 1 
    }]);
  };

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const updateDevice = (id, field, value) => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        if (field === 'poeType') {
          // Find the poe type and update watts
          const poeType = POE_TYPES.find(type => type.id === value);
          return { ...device, [field]: value, watts: poeType ? poeType.watts : device.watts };
        }
        return { ...device, [field]: value };
      }
      return device;
    }));
  };

  useEffect(() => {
    const budgetResult = poeBudget({
      devices,
      switchBudgetWatts,
      switchPorts
    });
    
    setResult(budgetResult);
  }, [devices, switchBudgetWatts, switchPorts]);

  return (
    <div className="section calculator-section">
      <div className="container calculator">
        <div className="field">
          <label htmlFor="switchBudgetWatts">Switch PoE budget (W)</label>
          <input
            id="switchBudgetWatts"
            type="number"
            min="0"
            value={switchBudgetWatts}
            onChange={(e) => setSwitchBudgetWatts(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>

        <div className="field">
          <label htmlFor="switchPorts">Switch PoE ports</label>
          <input
            id="switchPorts"
            type="number"
            min="0"
            value={switchPorts}
            onChange={(e) => setSwitchPorts(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>

        <h2>Devices</h2>
        {devices.map((device) => (
          <div key={device.id} className="calculator-row">
            <div className="field">
              <label htmlFor={`device-name-${device.id}`}>Device name</label>
              <input
                id={`device-name-${device.id}`}
                type="text"
                value={device.name}
                onChange={(e) => updateDevice(device.id, 'name', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor={`device-poeType-${device.id}`}>PoE type</label>
              <select
                id={`device-poeType-${device.id}`}
                value={device.poeType}
                onChange={(e) => updateDevice(device.id, 'poeType', e.target.value)}
              >
                {POE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor={`device-watts-${device.id}`}>Watts (editable)</label>
              <input
                id={`device-watts-${device.id}`}
                type="number"
                min="0"
                step="0.1"
                value={device.watts}
                onChange={(e) => updateDevice(device.id, 'watts', Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className="field">
              <label htmlFor={`device-quantity-${device.id}`}>Quantity</label>
              <input
                id={`device-quantity-${device.id}`}
                type="number"
                min="0"
                value={device.quantity}
                onChange={(e) => updateDevice(device.id, 'quantity', Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>

            <button 
              type="button" 
              onClick={() => removeDevice(device.id)}
              className="btn btn-secondary"
            >
              Remove device
            </button>
          </div>
        ))}

        <button 
          type="button" 
          onClick={addDevice}
          className="btn btn-primary"
        >
          Add device
        </button>

        <div className="calculator-results">
          <h2>Results</h2>
          <p>Total W: <strong>{result.totalWatts.toFixed(1)}</strong></p>
          <p>Ports used: <strong>{result.portsUsed}</strong></p>
          <p>Utilisation: <strong>{result.utilisationPercent.toFixed(1)}%</strong></p>
          <p>Remaining W: <strong>{result.remainingWatts.toFixed(1)}</strong></p>
          
          {result.overBudget && (
            <p className="form-note-banner">
              Over budget -- choose a switch with a larger PoE budget
            </p>
          )}
          
          {result.overPorts && (
            <p className="form-note-banner">
              More devices than PoE ports
            </p>
          )}
          
          {result.lowHeadroom && (
            <p className="form-note-banner">
              Less than 20% headroom -- consider a larger budget
            </p>
          )}
          
          <p className="form-note">
            Uses the maximum power per port for each PoE standard; if you know a device&apos;s actual draw, 
            enter it in the watts field.
          </p>
        </div>
      </div>
    </div>
  );
}