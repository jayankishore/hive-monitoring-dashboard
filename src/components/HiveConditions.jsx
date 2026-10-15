import React from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, AlertOctagon, Info, Thermometer, Droplets, WifiOff, Cpu, Activity, ShieldAlert } from 'lucide-react';
import { evaluateStatus, evaluateOverallHiveStatus } from '../services/sensorDataService';

export default function HiveConditions({ telemetry, thresholds }) {
  const isOffline = telemetry.connection_status === "OFFLINE";
  const isSensorError = telemetry.sensor_status === "DHT22 SENSOR ERROR";
  const hasTemp = telemetry.temperature !== null && telemetry.temperature !== undefined;
  const hasHum = telemetry.humidity !== null && telemetry.humidity !== undefined;

  const tempEval = evaluateStatus("temperature", telemetry.temperature);
  const humEval = evaluateStatus("humidity", telemetry.humidity);
  const overall = evaluateOverallHiveStatus(
    telemetry.temperature, 
    telemetry.humidity, 
    telemetry.connection_status, 
    telemetry.sensor_status
  );

  const isCriticalAlert = overall.status === 'CRITICAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Prominent Critical Alert Banner (Appears ONLY when real value breaches CRITICAL threshold) */}
      {isCriticalAlert && (
        <div className="glass-card critical-banner-active" style={{
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
          border: '2px solid #EF4444',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#DC2626',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
            }}>
              <ShieldAlert size={24} className="icon-attention" />
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991B1B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>CRITICAL ENVIRONMENTAL ALERT</span>
                <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>ACTION REQUIRED</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#B91C1C', margin: '2px 0 0 0', lineHeight: '1.4' }}>
                Real telemetry has breached critical thresholds: {tempEval.status === 'CRITICAL' ? `Temp: ${telemetry.temperature}°C ` : ''}{humEval.status === 'CRITICAL' ? `Humidity: ${telemetry.humidity}%` : ''}.
              </p>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', fontFamily: 'var(--font-mono)' }}>
            Status: CRITICAL
          </span>
        </div>
      )}

      {/* Main Hive Conditions Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '18px',
          borderBottom: '1px solid var(--color-card-border)',
          paddingBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--color-honey-100)',
              color: 'var(--color-honey-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Sensor & Hardware System Status
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Real DHT22 & ESP32 Health Matrix
              </span>
            </div>
          </div>

          {/* Overall Status Badge */}
          <span className={`badge ${overall.badgeClass}`} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            {overall.status === 'NORMAL' && <CheckCircle2 size={15} />}
            {overall.status === 'ESP32 OFFLINE' && <WifiOff size={15} />}
            {overall.status !== 'NORMAL' && overall.status !== 'ESP32 OFFLINE' && <AlertTriangle size={15} className="icon-attention" />}
            OVERALL: {overall.status}
          </span>
        </div>

        {/* Grid of Sensor & Hardware Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '18px'
        }}>
          
          {/* 1. Temperature Status */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--color-card-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Thermometer size={16} color="var(--color-honey-600)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Temperature</span>
              </div>
              <span className={`badge badge-${tempEval.color}`}>
                {hasTemp ? tempEval.status : 'WAITING'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {hasTemp ? `${telemetry.temperature.toFixed(1)} °C` : 'Waiting for real reading...'}
            </p>
          </div>

          {/* 2. Humidity Status */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--color-card-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={16} color="#2563EB" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Humidity</span>
              </div>
              <span className={`badge badge-${humEval.color}`}>
                {hasHum ? humEval.status : 'WAITING'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {hasHum ? `${telemetry.humidity.toFixed(1)} %` : 'Waiting for real reading...'}
            </p>
          </div>

          {/* 3. ESP32 Microcontroller Status */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--color-card-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="var(--color-honey-700)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>ESP32 Board</span>
              </div>
              <span className={`badge ${!isOffline ? 'badge-normal' : 'badge-critical'}`}>
                {!isOffline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, fontFamily: 'var(--font-mono)' }}>
              {!isOffline ? 'Wi-Fi Connected' : 'Unreachable'}
            </p>
          </div>

          {/* 4. DHT22 Sensor Status */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--color-card-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--color-honey-700)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>DHT22 Sensor</span>
              </div>
              <span className={`badge ${!isSensorError ? 'badge-normal' : 'badge-warning'}`}>
                {!isSensorError ? 'OK' : 'ERROR'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {!isSensorError ? 'GPIO 4 Sampling' : 'Read failure'}
            </p>
          </div>

        </div>

        {/* Mandatory Disclaimer Box */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Info size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--color-honey-900)', margin: 0, lineHeight: '1.45' }}>
            <strong>Environmental Measurement Notice:</strong> System status is derived strictly from real DHT22 microclimate readings. It does not infer biological colony health or bee population.
          </p>
        </div>

      </div>
    </div>
  );
}
