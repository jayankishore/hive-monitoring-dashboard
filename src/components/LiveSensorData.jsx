import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Clock, Signal, WifiOff, AlertTriangle } from 'lucide-react';
import { pollEsp32Sensor } from '../services/sensorDataService';

export default function LiveSensorData({ telemetry, pollingIntervalMs }) {
  const [secondsAgo, setSecondsAgo] = useState(null);

  const isOnline = telemetry?.connection_status === "ONLINE";
  const isSensorError = telemetry?.sensor_status === "DHT22 SENSOR ERROR";
  const hasTemp = telemetry?.temperature !== null && telemetry?.temperature !== undefined;
  const hasHum = telemetry?.humidity !== null && telemetry?.humidity !== undefined;

  // Live relative timer counter
  useEffect(() => {
    const updateCounter = () => {
      if (!telemetry?.timestamp || !isOnline) {
        setSecondsAgo(null);
        return;
      }
      const diff = Math.floor((Date.now() - new Date(telemetry.timestamp).getTime()) / 1000);
      setSecondsAgo(diff >= 0 ? diff : 0);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [telemetry?.timestamp, isOnline]);

  const formattedTimestamp = telemetry?.timestamp 
    ? new Date(telemetry.timestamp).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
    : 'Never';

  const formatSecondsAgo = () => {
    if (secondsAgo === null) return 'Never';
    if (secondsAgo < 2) return 'Just now';
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    return `${Math.floor(secondsAgo / 60)}m ago`;
  };

  const lastValidTime = telemetry?.lastValidReading?.timestamp 
    ? new Date(telemetry.lastValidReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: isOnline ? 'var(--color-honey-100)' : 'var(--color-danger-bg)',
            color: isOnline ? 'var(--color-honey-700)' : 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={20} className={isOnline ? 'pulse-indicator' : ''} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Live ESP32 Telemetry Stream
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Real HTTP GET Pipeline ({pollingIntervalMs / 1000}s interval)
            </span>
          </div>
        </div>

        {/* Manual Poll Button */}
        <button 
          className="btn-secondary"
          onClick={() => pollEsp32Sensor()}
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title="Poll ESP32 endpoint immediately"
        >
          <RefreshCw size={14} />
          <span>Poll ESP32 Endpoint</span>
        </button>
      </div>

      {/* Grid Display of Current Data Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        
        {/* Current Temperature */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-card-border)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Current Temperature
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: hasTemp ? 'var(--color-honey-900)' : 'var(--color-text-light)' }}>
              {hasTemp ? telemetry.temperature.toFixed(1) : '--'}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>°C</span>
          </div>
        </div>

        {/* Current Humidity */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-card-border)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Current Humidity
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: hasHum ? '#1E3A8A' : 'var(--color-text-light)' }}>
              {hasHum ? telemetry.humidity.toFixed(1) : '--'}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>%</span>
          </div>
        </div>

        {/* Last Updated Relative Timer */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Clock size={14} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Last Updated
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {formatSecondsAgo()}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
            Timestamp: {formattedTimestamp}
          </span>
        </div>

        {/* ESP32 Connection Details */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Signal size={14} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              ESP32 Status
            </span>
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            color: isOnline ? 'var(--color-success)' : isSensorError ? 'var(--color-warning)' : 'var(--color-danger)', 
            marginTop: '4px' 
          }}>
            {isOnline ? (isSensorError ? 'SENSOR ERROR' : '● LIVE') : 'ESP32 OFFLINE'}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-mono)' }}>
            Protocol: HTTP GET /data
          </span>
        </div>

      </div>

      {/* Offline Banner when disconnected */}
      {!isOnline && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          color: '#991B1B'
        }}>
          <WifiOff size={16} color="#EF4444" style={{ flexShrink: 0 }} />
          <div>
            <strong>ESP32 OFFLINE (Sensor Unavailable):</strong> Waiting for real ESP32 connection...
            {lastValidTime && (
              <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '2px', color: '#7F1D1D' }}>
                Last successful reading was received at {lastValidTime}.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sensor Error Banner */}
      {isOnline && isSensorError && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          color: '#92400E'
        }}>
          <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>DHT22 SENSOR ERROR:</strong> The ESP32 is online, but the DHT22 sensor returned invalid data (NaN/null).
          </span>
        </div>
      )}

    </div>
  );
}
