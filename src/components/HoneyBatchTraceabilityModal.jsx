import React from 'react';
import { X, ShieldCheck, QrCode, Lock, Award, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HoneyBatchTraceabilityModal({ isOpen, onClose, telemetry }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '620px',
        padding: '28px',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Honey Chain Blockchain Certificate
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Immutable Batch Origin & Telemetry Proof (Prototype)
              </span>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Certificate Card */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '2px solid var(--color-honey-400)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="badge badge-normal" style={{ fontSize: '0.75rem' }}>
              <CheckCircle2 size={13} />
              VERIFIED ON HONEY CHAIN
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-honey-900)' }}>
              BATCH #HC-2026-B89
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', alignItems: 'center' }}>
            
            {/* Batch Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-honey-700)', fontWeight: 600 }}>Source Apiary & Hive</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-honey-900)' }}>
                  Sunrise Valley Apiary ({telemetry?.hive_id || 'HIVE-001'})
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-honey-700)', fontWeight: 600 }}>Microclimate Quality Grade</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065F46' }}>
                  GRADE A+ ORGANIC (Stable 34.2°C / 68.4% RH)
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-honey-700)', fontWeight: 600 }}>Cryptographic Hash</span>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                  0x8f3c7b...4e9a12d90f23
                </div>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div style={{
              background: 'white',
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid var(--color-honey-300)',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              {/* Custom SVG QR Code visual */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ margin: 'auto', display: 'block' }}>
                <rect width="100" height="100" rx="8" fill="white"/>
                {/* Corner Markers */}
                <rect x="8" y="8" width="28" height="28" rx="4" fill="#0F172A"/>
                <rect x="14" y="14" width="16" height="16" rx="2" fill="white"/>
                <rect x="18" y="18" width="8" height="8" fill="#D97706"/>

                <rect x="64" y="8" width="28" height="28" rx="4" fill="#0F172A"/>
                <rect x="70" y="14" width="16" height="16" rx="2" fill="white"/>
                <rect x="74" y="18" width="8" height="8" fill="#D97706"/>

                <rect x="8" y="64" width="28" height="28" rx="4" fill="#0F172A"/>
                <rect x="14" y="70" width="16" height="16" rx="2" fill="white"/>
                <rect x="18" y="74" width="8" height="8" fill="#D97706"/>

                {/* Random Matrix Pattern */}
                <rect x="44" y="10" width="10" height="10" fill="#0F172A"/>
                <rect x="44" y="28" width="10" height="10" fill="#D97706"/>
                <rect x="10" y="44" width="10" height="10" fill="#0F172A"/>
                <rect x="28" y="44" width="10" height="10" fill="#0F172A"/>
                <rect x="44" y="44" width="12" height="12" rx="2" fill="#D97706"/>
                <rect x="64" y="44" width="10" height="10" fill="#0F172A"/>
                <rect x="80" y="44" width="10" height="10" fill="#0F172A"/>
                <rect x="44" y="64" width="10" height="10" fill="#0F172A"/>
                <rect x="64" y="64" width="10" height="10" fill="#D97706"/>
                <rect x="78" y="78" width="12" height="12" fill="#0F172A"/>
              </svg>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-honey-900)', marginTop: '4px', display: 'block' }}>
                SCAN TO VERIFY
              </span>
            </div>

          </div>

        </div>

        {/* Info */}
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: '0 0 20px 0' }}>
          This Honey Chain certificate embeds real-time microclimate logs recorded by your ESP32-HIVE-001 device directly into smart contracts, giving consumers tamper-proof verification of honey quality.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>
            Close Certificate Preview
          </button>
        </div>

      </div>
    </div>
  );
}
