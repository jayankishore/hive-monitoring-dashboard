import React, { useState, useEffect } from 'react';
import { Sliders, Code2, ShieldCheck, Wifi, WifiOff, Settings, RefreshCw, Check, Globe, Clock } from 'lucide-react';
import { setEsp32ApiUrl, pollEsp32Sensor } from '../services/sensorDataService';

export default function Header({ 
  telemetry, 
  esp32ApiUrl,
  onOpenThresholds, 
  onOpenEsp32Modal,
  onOpenTraceabilityModal
}) {
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(esp32ApiUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(null);

  const isOnline = telemetry?.connection_status === "ONLINE";
  const isSensorError = telemetry?.sensor_status === "DHT22 SENSOR ERROR";
  const justReconnected = telemetry?.justReconnected;

  // Live updated seconds ago counter
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

  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setEsp32ApiUrl(urlInput.trim());
      setEditingUrl(false);
    }
  };

  const handleManualPoll = async () => {
    setIsRefreshing(true);
    await pollEsp32Sensor();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const formatSecondsAgo = () => {
    if (secondsAgo === null) return 'Never';
    if (secondsAgo < 2) return 'Just now';
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    return `${Math.floor(secondsAgo / 60)}m ago`;
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-card-border)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            flexShrink: 0
          }}>
            {/* Bee SVG Symbol */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 'auto' }}>
              <path d="M12 2L14.5 4.5L12 7L9.5 4.5L12 2Z" fill="white" fillOpacity="0.2"/>
              <path d="M12 7V17"/>
              <path d="M7 10C5 10 3 11.5 3 13.5C3 15.5 5 17 7 17"/>
              <path d="M17 10C19 10 21 11.5 21 13.5C21 15.5 19 17 17 17"/>
              <path d="M8 12H16"/>
              <path d="M9 15H15"/>
              <circle cx="12" cy="19" r="1.5" fill="white"/>
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                color: 'var(--color-text-main)',
                margin: 0
              }}>
                Honey Hive Monitor
              </h1>

              {/* Hive ID Badge */}
              <span style={{
                background: 'var(--color-honey-100)',
                color: 'var(--color-honey-900)',
                border: '1px solid var(--color-honey-400)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                {telemetry?.hive_id || 'HIVE-001'}
              </span>
            </div>

            <p style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-text-muted)', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Hardware Telemetry Stream</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {telemetry?.device_id || 'ESP32-HIVE-001'}
              </span>
            </p>
          </div>
        </div>

        {/* Real Status Indicators & ESP32 Endpoint Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Reconnect Toast */}
          {justReconnected && (
            <div className="reconnect-toast badge badge-live" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
              <Check size={14} /> ESP32 RECONNECTED
            </div>
          )}

          {/* Real LIVE / OFFLINE Indicator Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isOnline ? 'var(--color-success-bg)' : isSensorError ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
            border: `1px solid ${isOnline ? 'var(--color-success-border)' : isSensorError ? 'var(--color-warning-border)' : 'var(--color-danger-border)'}`,
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: isOnline ? '#065F46' : isSensorError ? '#92400E' : '#991B1B'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isOnline ? 'var(--color-success)' : isSensorError ? 'var(--color-warning)' : 'var(--color-danger)',
              display: 'inline-block'
            }} className={isOnline ? 'live-pulse' : ''} />
            
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>
              {isOnline ? (isSensorError ? 'SENSOR ERROR' : '● LIVE') : 'ESP32 OFFLINE'}
            </span>
          </div>

          {/* Last Updated Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg)',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)'
          }}>
            <Clock size={13} color="var(--color-honey-600)" />
            <span>Updated: {formatSecondsAgo()}</span>
          </div>

          {/* ESP32 IP Endpoint Bar */}
          {!editingUrl ? (
            <div 
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-card-border)',
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <Globe size={13} color="var(--color-honey-600)" />
              <span title="Configured ESP32 Endpoint URL">{esp32ApiUrl}</span>
              <button 
                onClick={() => setEditingUrl(true)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--color-honey-700)' }}
                title="Change ESP32 IP Endpoint URL"
              >
                <Settings size={13} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveUrl} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input 
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://192.168.1.49/data"
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-honey-500)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  width: '180px'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                <Check size={12} /> Save
              </button>
            </form>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn-secondary"
              onClick={handleManualPoll}
              disabled={isRefreshing}
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              title="Poll ESP32 endpoint now"
            >
              <RefreshCw size={14} className={isRefreshing ? 'pulse-indicator' : ''} />
              <span>Poll</span>
            </button>

            <button 
              className="btn-secondary"
              onClick={onOpenThresholds}
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            >
              <Sliders size={15} />
              <span>Thresholds</span>
            </button>

            <button 
              className="btn-secondary"
              onClick={onOpenEsp32Modal}
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            >
              <Code2 size={15} />
              <span>ESP32 API</span>
            </button>

            <button 
              className="btn-primary"
              onClick={onOpenTraceabilityModal}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={15} />
              <span>Honey Chain</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
