import React from 'react';
import { Layers, Weight, MapPin, BatteryCharging, Volume2, Wind, Sun, Boxes, QrCode, Link2, Lock, ArrowUpRight } from 'lucide-react';

export default function FutureExpansion({ onOpenTraceabilityModal }) {
  const futureModules = [
    {
      title: "Hive Weight Monitoring",
      sensor: "HX711 + Load Cells (4x 50kg)",
      desc: "Track real-time honey yield accumulation and honey extraction readiness.",
      icon: Weight,
      category: "Hardware Module"
    },
    {
      title: "GPS Location & Anti-Theft",
      sensor: "NEO-6M GPS Module",
      desc: "Apiary coordinate mapping and movement alarm for field security.",
      icon: MapPin,
      category: "Hardware Module"
    },
    {
      title: "Solar & Battery Power",
      sensor: "INA219 Voltage & Current Sensor",
      desc: "Monitor battery state of charge and solar panel charge rate in remote apiaries.",
      icon: BatteryCharging,
      category: "Power System"
    },
    {
      title: "Acoustic Swarm Prediction",
      sensor: "INMP441 I2S Microphone",
      desc: "Frequency spectrum analysis for early swarming signal detection and queen presence.",
      icon: Volume2,
      category: "AI / Audio Module"
    },
    {
      title: "Hive Ventilation & CO2",
      sensor: "SCD30 / MQ-135 Gas Sensor",
      desc: "Measure carbon dioxide concentration and airflow efficiency inside brood box.",
      icon: Wind,
      category: "Environmental"
    },
    {
      title: "Ambient Daylight & Lid Sensor",
      sensor: "BH1750 Ambient Light Sensor",
      desc: "Detect hive opening events and foraging daylight intensity.",
      icon: Sun,
      category: "Security & Environment"
    },
    {
      title: "Multi-Hive Apiary Network",
      sensor: "ESP-NOW / LoRaWAN Mesh Network",
      desc: "Scale from single hive to 100+ hives per gateway controller.",
      icon: Boxes,
      category: "Network Scaling"
    },
    {
      title: "Honey Batch QR & Blockchain",
      sensor: "HoneyChain Smart Contracts",
      desc: "Generate immutable QR code certificates for honey jar anti-counterfeiting.",
      icon: QrCode,
      category: "Traceability",
      action: onOpenTraceabilityModal
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
            <Layers size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Future Hardware & Software Expansion
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Modular Architecture Ready for Honey Chain Integration
            </span>
          </div>
        </div>

        <span style={{
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-card-border)',
          color: 'var(--color-text-muted)',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          PLUG & PLAY READY
        </span>
      </div>

      {/* Grid of Future Expansion Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {futureModules.map((module, idx) => {
          const ModuleIcon = module.icon;
          return (
            <div 
              key={idx}
              style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px dashed var(--color-honey-400)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'var(--color-honey-100)',
                    color: 'var(--color-honey-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ModuleIcon size={18} />
                  </div>
                  
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-honey-700)',
                    background: 'var(--color-honey-50)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-honey-200)'
                  }}>
                    {module.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 4px 0' }}>
                  {module.title}
                </h3>
                
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  {module.sensor}
                </span>

                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {module.desc}
                </p>
              </div>

              {module.action && (
                <button 
                  onClick={module.action}
                  style={{
                    marginTop: '12px',
                    background: 'white',
                    border: '1px solid var(--color-honey-400)',
                    color: 'var(--color-honey-900)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Preview Honey Chain Modal</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
