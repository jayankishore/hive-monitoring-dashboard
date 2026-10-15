import React from 'react';
import { Cpu, Radio, Shield, Hash, Wifi, Activity, Calendar, AlertCircle } from 'lucide-react';

export default function DeviceInfo({ telemetry }) {
  const isOnline = telemetry?.connection_status === "ONLINE";
  const isSensorError = telemetry?.sensor_status === "DHT22 SENSOR ERROR";

  const getStatusText = () => {
    if (isOnline) return isSensorError ? "DHT22 SENSOR ERROR" : "ONLINE (Active Telemetry)";
    return "OFFLINE (Unreachable)";
  };

  const getStatusBadge = () => {
    if (isOnline) return isSensorError ? "badge-warning" : "badge-normal";
    return "badge-critical";
  };

  const deviceFields = [
    { label: "Hive Identifier", val: telemetry?.hive_id || "HIVE-001", icon: Hash },
    { label: "Main Controller", val: "ESP32 (ESP-WROOM-32)", icon: Cpu },
    { label: "Active Sensor Module", val: "DHT22 (AM2302 Digital)", icon: Radio },
    { label: "Measured Parameters", val: "Temperature + Humidity ONLY", icon: Activity },
    { label: "Wireless Network", val: "Wi-Fi 802.11 b/g/n (2.4 GHz)", icon: Wifi },
    { label: "Firmware Protocol", val: "v1.4.2-honeychain", icon: Shield },
    { 
      label: "Connection Status", 
      val: getStatusText(),
      icon: Radio,
      badge: getStatusBadge()
    },
    { 
      label: "Last ESP32 Timestamp", 
      val: telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleString() : 'Never', 
      icon: Calendar,
      mono: true 
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header */}
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
            background: 'var(--color-honey-100)',
            color: 'var(--color-honey-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Device Information
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              ESP32 & DHT22 Hardware Specifications
            </span>
          </div>
        </div>

        <span className="badge badge-live">
          REAL ESP32 HARDWARE
        </span>
      </div>

      {/* Grid of Device Meta */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px'
      }}>
        {deviceFields.map((field, idx) => {
          const FieldIcon = field.icon;
          return (
            <div 
              key={idx}
              style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--color-card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-honey-700)',
                flexShrink: 0
              }}>
                <FieldIcon size={16} />
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {field.label}
                </span>
                <span style={{ 
                  display: 'block',
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  color: 'var(--color-text-main)',
                  fontFamily: field.mono ? 'var(--font-mono)' : 'inherit',
                  marginTop: '2px'
                }}>
                  {field.badge ? (
                    <span className={`badge ${field.badge}`} style={{ fontSize: '0.7rem' }}>
                      {field.val}
                    </span>
                  ) : field.val}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
