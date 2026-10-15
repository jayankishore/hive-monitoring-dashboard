import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SensorCard from './components/SensorCard';
import HiveConditions from './components/HiveConditions';
import LiveSensorData from './components/LiveSensorData';
import SensorCharts from './components/SensorCharts';
import AlertSystem from './components/AlertSystem';
import DeviceInfo from './components/DeviceInfo';
import FutureExpansion from './components/FutureExpansion';
import ThresholdModal from './components/ThresholdModal';
import Esp32IntegrationModal from './components/Esp32IntegrationModal';
import HoneyBatchTraceabilityModal from './components/HoneyBatchTraceabilityModal';

import { 
  subscribeToTelemetry, 
  subscribeToAlerts, 
  updateThresholds 
} from './services/sensorDataService';

export default function App() {
  const [telemetryState, setTelemetryState] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Modal Visibility States
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [isEsp32ModalOpen, setIsEsp32ModalOpen] = useState(false);
  const [isTraceabilityModalOpen, setIsTraceabilityModalOpen] = useState(false);

  // Subscribe to real telemetry service updates
  useEffect(() => {
    const unsubTelemetry = subscribeToTelemetry((data) => {
      setTelemetryState(data);
    });

    const unsubAlerts = subscribeToAlerts((data) => {
      setAlerts(data);
    });

    return () => {
      unsubTelemetry();
      unsubAlerts();
    };
  }, []);

  if (!telemetryState) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="live-pulse" style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-honey-500)',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Connecting to Real ESP32 Hardware...
          </h3>
        </div>
      </div>
    );
  }

  const { telemetry, thresholds, esp32ApiUrl, pollingIntervalMs, history } = telemetryState;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Header 
        telemetry={telemetry}
        esp32ApiUrl={esp32ApiUrl}
        onOpenThresholds={() => setIsThresholdModalOpen(true)}
        onOpenEsp32Modal={() => setIsEsp32ModalOpen(true)}
        onOpenTraceabilityModal={() => setIsTraceabilityModalOpen(true)}
      />

      {/* Main Dashboard Layout */}
      <main style={{
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 20px 48px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1
      }}>

        {/* 1. Main Sensor Cards (Temperature & Humidity) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          <SensorCard 
            type="temperature"
            value={telemetry.temperature}
            thresholds={thresholds}
            connectionStatus={telemetry.connection_status}
            sensorStatus={telemetry.sensor_status}
            lastValidReading={telemetry.lastValidReading}
          />
          <SensorCard 
            type="humidity"
            value={telemetry.humidity}
            thresholds={thresholds}
            connectionStatus={telemetry.connection_status}
            sensorStatus={telemetry.sensor_status}
            lastValidReading={telemetry.lastValidReading}
          />
        </section>

        {/* 2. Hive Conditions Section */}
        <section>
          <HiveConditions 
            telemetry={telemetry}
            thresholds={thresholds}
          />
        </section>

        {/* 3. Live Sensor Data Section */}
        <section>
          <LiveSensorData 
            telemetry={telemetry}
            pollingIntervalMs={pollingIntervalMs}
          />
        </section>

        {/* 4. Graphs Section (Real Temperature & Humidity History) */}
        <section>
          <SensorCharts 
            history={history}
            thresholds={thresholds}
          />
        </section>

        {/* 5. Alert System & Device Information Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          <AlertSystem 
            alerts={alerts}
            onOpenThresholds={() => setIsThresholdModalOpen(true)}
          />
          <DeviceInfo 
            telemetry={telemetry}
          />
        </section>

        {/* 6. Future Expansion Architecture Section */}
        <section>
          <FutureExpansion 
            onOpenTraceabilityModal={() => setIsTraceabilityModalOpen(true)}
          />
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderTop: '1px solid var(--color-card-border)',
        padding: '20px 20px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            <strong style={{ color: 'var(--color-honey-900)' }}>Honey Hive Monitor</strong> • Real ESP32 Hardware Interface
          </div>
          <div>
            Part of the <span style={{ color: 'var(--color-honey-700)', fontWeight: 600 }}>Honey Chain</span> Traceability Initiative
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ThresholdModal 
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={(newVal) => updateThresholds(newVal)}
      />

      <Esp32IntegrationModal 
        isOpen={isEsp32ModalOpen}
        onClose={() => setIsEsp32ModalOpen(false)}
        esp32ApiUrl={esp32ApiUrl}
      />

      <HoneyBatchTraceabilityModal 
        isOpen={isTraceabilityModalOpen}
        onClose={() => setIsTraceabilityModalOpen(false)}
        telemetry={telemetry}
      />

    </div>
  );
}
