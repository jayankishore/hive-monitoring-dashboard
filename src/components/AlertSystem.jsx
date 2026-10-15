import React from 'react';
import { Bell, AlertTriangle, AlertOctagon, Info, Check, Trash2, Sliders } from 'lucide-react';
import { clearAlerts, acknowledgeAlert } from '../services/sensorDataService';

export default function AlertSystem({ alerts, onOpenThresholds }) {
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        borderBottom: '1px solid var(--color-card-border)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: unacknowledgedCount > 0 ? 'var(--color-danger-bg)' : 'var(--color-honey-100)',
            color: unacknowledgedCount > 0 ? 'var(--color-danger)' : 'var(--color-honey-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Bell size={20} className={unacknowledgedCount > 0 ? 'pulse-indicator' : ''} />
            {unacknowledgedCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--color-danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unacknowledgedCount}
              </span>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              System Alerts & Notifications
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Real-time telemetry breach events & threshold log
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-secondary" 
            onClick={onOpenThresholds}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <Sliders size={14} />
            <span>Configure Bounds</span>
          </button>

          {alerts.length > 0 && (
            <button 
              className="btn-secondary" 
              onClick={() => clearAlerts()}
              style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#991B1B' }}
              title="Clear all alerts"
            >
              <Trash2 size={14} />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerts Feed List */}
      {alerts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-card-border)'
        }}>
          <Bell size={28} color="var(--color-text-light)" style={{ marginBottom: '8px', opacity: 0.6 }} />
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
            No active alerts recorded.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
            All microclimate readings are currently within configured bounds.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
          {alerts.map((alert) => {
            const isCritical = alert.type === 'critical';
            const isWarning = alert.type === 'warning';

            return (
              <div 
                key={alert.id}
                style={{
                  background: isCritical ? 'var(--color-danger-bg)' : isWarning ? 'var(--color-warning-bg)' : 'var(--color-bg)',
                  border: `1px solid ${isCritical ? 'var(--color-danger-border)' : isWarning ? 'var(--color-warning-border)' : 'var(--color-card-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  opacity: alert.acknowledged ? 0.75 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {isCritical && <AlertOctagon size={18} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                  {isWarning && <AlertTriangle size={18} color="var(--color-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                  {!isCritical && !isWarning && <Info size={18} color="var(--color-info)" style={{ marginTop: '2px', flexShrink: 0 }} />}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                        {alert.title}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                      {alert.message}
                    </p>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <button 
                    onClick={() => acknowledgeAlert(alert.id)}
                    style={{
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}
                  >
                    <Check size={12} />
                    <span>Dismiss</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
