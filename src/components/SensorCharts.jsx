import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Thermometer, Droplets, Database, Info } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorCharts({ history, thresholds }) {
  const [timeRange, setTimeRange] = useState('realtime');

  const hasData = history && history.length > 0;

  const labels = hasData ? history.map(item => item.timeFormatted) : [];
  const tempData = hasData ? history.map(item => item.temperature) : [];
  const humData = hasData ? history.map(item => item.humidity) : [];

  const createOptions = (title, unit, minBound, maxBound) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${title}: ${context.parsed.y} ${unit}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.04)' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748B', maxTicksLimit: 8 }
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.04)' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748B' },
        suggestedMin: minBound - 2,
        suggestedMax: maxBound + 2
      }
    }
  });

  const tempChartData = {
    labels,
    datasets: [
      {
        label: 'Real Temperature (°C)',
        data: tempData,
        borderColor: '#D97706',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.25,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#D97706',
        pointHoverBackgroundColor: '#D97706',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const humidityChartData = {
    labels,
    datasets: [
      {
        label: 'Real Humidity (%)',
        data: humData,
        borderColor: '#2563EB',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.25,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#2563EB',
        pointHoverBackgroundColor: '#2563EB',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Real Telemetry Timeseries Graphs
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Populated strictly from live HTTP responses from ESP32-HIVE-001 ({history.length} datapoints)
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-bg-alt)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            <Database size={14} color="var(--color-honey-600)" />
            <span>REAL SESSION READINGS ONLY</span>
          </div>
        </div>
      </div>

      {/* Grid of Two Responsive Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>

        {/* Temperature History Chart */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--color-honey-100)',
                color: 'var(--color-honey-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Thermometer size={18} />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
                Real Temperature History (°C)
              </h3>
            </div>
          </div>

          <div style={{ height: '260px', position: 'relative' }}>
            {hasData ? (
              <Line 
                data={tempChartData} 
                options={createOptions('Temperature', '°C', thresholds.tempMin, thresholds.tempMax)} 
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)',
                borderRadius: '8px',
                border: '1px dashed var(--color-card-border)',
                color: 'var(--color-text-light)',
                padding: '20px',
                textAlign: 'center'
              }}>
                <Database size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  No Real Readings Recorded Yet
                </span>
                <span style={{ fontSize: '0.75rem' }}>
                  Connect ESP32 to start plotting real live temperature points
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Humidity History Chart */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Droplets size={18} />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
                Real Humidity History (%)
              </h3>
            </div>
          </div>

          <div style={{ height: '260px', position: 'relative' }}>
            {hasData ? (
              <Line 
                data={humidityChartData} 
                options={createOptions('Humidity', '%', thresholds.humidityMin, thresholds.humidityMax)} 
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)',
                borderRadius: '8px',
                border: '1px dashed var(--color-card-border)',
                color: 'var(--color-text-light)',
                padding: '20px',
                textAlign: 'center'
              }}>
                <Database size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  No Real Readings Recorded Yet
                </span>
                <span style={{ fontSize: '0.75rem' }}>
                  Connect ESP32 to start plotting real live humidity points
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
