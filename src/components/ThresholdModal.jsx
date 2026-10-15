import React, { useState } from 'react';
import { X, Sliders, Save, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function ThresholdModal({ isOpen, onClose, thresholds, onSaveThresholds }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({ ...thresholds });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(val) || 0
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveThresholds(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetDefaults = () => {
    setFormData({
      tempMin: 30.0,
      tempMax: 36.0,
      humidityMin: 50.0,
      humidityMax: 75.0
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '24px',
        position: 'relative',
        animation: 'pulse-slow 0.2s ease-out'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--color-honey-100)',
              color: 'var(--color-honey-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Configure Microclimate Thresholds
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Set custom trigger points for Hive-001 alerts
              </span>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Saved Success Toast */}
        {savedSuccess && (
          <div style={{
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            color: '#065F46',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} />
            <span>Thresholds updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          
          {/* Temperature Section */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--color-card-border)',
            marginBottom: '16px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-honey-900)' }}>
              Temperature Thresholds (°C)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Min Target Temp (°C)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.tempMin}
                  onChange={(e) => handleChange('tempMin', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Max Target Temp (°C)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.tempMax}
                  onChange={(e) => handleChange('tempMax', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Humidity Section */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--color-card-border)',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: '#1E3A8A' }}>
              Humidity Thresholds (%)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Min Target Humidity (%)
                </label>
                <input 
                  type="number" 
                  step="0.5"
                  value={formData.humidityMin}
                  onChange={(e) => handleChange('humidityMin', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Max Target Humidity (%)
                </label>
                <input 
                  type="number" 
                  step="0.5"
                  value={formData.humidityMax}
                  onChange={(e) => handleChange('humidityMax', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleResetDefaults}
              style={{ fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={onClose} style={{ fontSize: '0.8rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.8rem' }}>
                <Save size={15} />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
