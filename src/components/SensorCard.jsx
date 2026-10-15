import React from 'react';
import { Thermometer, Droplets, AlertOctagon, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { evaluateStatus } from '../services/sensorDataService';

export default function SensorCard({ type, value, thresholds, connectionStatus, sensorStatus, lastValidReading }) {
  const isTemp = type === 'temperature';
  const evalResult = evaluateStatus(type, value);

  const minVal = isTemp ? thresholds.tempMin : thresholds.humidityMin;
  const maxVal = isTemp ? thresholds.tempMax : thresholds.humidityMax;

  const MainIcon = isTemp ? Thermometer : Droplets;

  const isOffline = connectionStatus === 'OFFLINE';
  const isSensorError = sensorStatus === 'DHT22 SENSOR ERROR';
  const hasValue = value !== null && value !== undefined;

  const isCritical = hasValue && evalResult.status === 'CRITICAL';
  const isWarning = hasValue && evalResult.status === 'WARNING';
  const isNormal = hasValue && evalResult.status === 'NORMAL';

  const getCardAnimationClass = () => {
    if (isCritical) return 'card-critical-alert';
    if (isWarning) return 'card-warning-state';
    return '';
  };

  const getBadgeClass = () => {
    if (isOffline) return 'badge-critical';
    if (isSensorError) return 'badge-warning';
    if (isCritical) return 'badge-critical';
    if (isWarning) return 'badge-warning';
    if (isNormal) return 'badge-normal';
    return 'badge-warning';
  };

  const getBadgeText = () => {
    if (isOffline) return 'ESP32 OFFLINE';
    if (isSensorError) return 'SENSOR ERROR';
    if (!hasValue) return 'WAITING FOR SENSOR';
    return evalResult.status;
  };

  const lastValidVal = lastValidReading ? (isTemp ? lastValidReading.temperature : lastValidReading.humidity) : null;
  const lastValidTime = lastValidReading?.timestamp ? new Date(lastValidReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null;

  return (
    <div 
      className={`glass-card ${getCardAnimationClass()}`}
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Accent glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: isCritical
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(255, 255, 255, 0) 70%)'
          : isWarning
          ? 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(255, 255, 255, 0) 70%)'
          : isTemp 
          ? 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0) 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isCritical ? '#FEE2E2' : isWarning ? 'var(--color-honey-100)' : isTemp ? 'var(--color-honey-100)' : '#EFF6FF',
            color: isCritical ? '#DC2626' : isWarning ? 'var(--color-honey-700)' : isTemp ? 'var(--color-honey-700)' : '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${isCritical ? '#FCA5A5' : isWarning ? 'var(--color-honey-200)' : isTemp ? 'var(--color-honey-200)' : '#BFDBFE'}`
          }}>
            <MainIcon size={22} className={isCritical ? 'icon-attention' : ''} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-muted)', margin: 0 }}>
              {isTemp ? 'Internal Temperature' : 'Internal Humidity'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
              Sensor: DHT22 (Digital)
            </span>
          </div>
        </div>

        {/* Status Pill with Accessibility Text & Icons */}
        <span className={`badge ${getBadgeClass()}`}>
          {isNormal && <CheckCircle2 size={12} />}
          {isWarning && <AlertTriangle size={12} className="icon-attention" />}
          {isCritical && <AlertOctagon size={12} className="icon-attention" />}
          {getBadgeText()}
        </span>
      </div>

      {/* Value Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          color: isCritical ? '#991B1B' : isWarning ? '#92400E' : hasValue ? (isTemp ? 'var(--color-honey-900)' : '#1E3A8A') : 'var(--color-text-light)'
        }}>
          {hasValue ? value.toFixed(1) : '--'}
        </span>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)'
        }}>
          {isTemp ? '°C' : '%'}
        </span>
      </div>

      {/* Offline Last Received Reading Display */}
      {isOffline && lastValidVal !== null && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '6px',
          padding: '6px 10px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#92400E'
        }}>
          <Clock size={13} style={{ flexShrink: 0 }} />
          <span>
            Last received reading: <strong>{lastValidVal.toFixed(1)}{isTemp ? '°C' : '%'}</strong> ({lastValidTime})
          </span>
        </div>
      )}

      {/* Target Threshold Bounds bar */}
      <div style={{
        background: 'var(--color-bg-alt)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--color-text-muted)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <span>Target Bounds:</span>
        <span style={{ fontWeight: 700, color: 'var(--color-text-main)', fontFamily: 'var(--font-mono)' }}>
          {minVal.toFixed(1)}{isTemp ? '°C' : '%'} – {maxVal.toFixed(1)}{isTemp ? '°C' : '%'}
        </span>
      </div>
    </div>
  );
}
