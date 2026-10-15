import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, Database, ShieldAlert, Globe } from 'lucide-react';

export default function Esp32IntegrationModal({ isOpen, onClose, esp32ApiUrl }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const rawJsonSpec = JSON.stringify({
    hive_id: "HIVE-001",
    device_id: "ESP32-HIVE-001",
    temperature: 29.4,
    humidity: 72.1,
    timestamp: "2026-09-24T14:10:00"
  }, null, 2);

  const arduinoWebServerCode = `// ESP32 Web Server Firmware with CORS Headers (GET /data)
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

void handleData() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // IMPORTANT: Enable CORS for browser access
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (isnan(temp) || isnan(hum)) {
    // DHT22 Error Response
    server.send(500, "application/json", "{\\"error\\":\\"DHT22 read failure\\",\\"temperature\\":null,\\"humidity\\":null}");
    return;
  }

  // Construct JSON Response
  String json = "{\\"hive_id\\":\\"HIVE-001\\",\\"device_id\\":\\"ESP32-HIVE-001\\",\\"temperature\\":" 
                + String(temp, 1) + ",\\"humidity\\":" + String(hum, 1) + "}";

  server.send(200, "application/json", json);
}

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\\nWiFi Connected! IP Address: ");
  Serial.println(WiFi.localIP());

  // Setup GET /data endpoint
  server.on("/data", HTTP_GET, handleData);
  server.on("/data", HTTP_OPTIONS, handleOptions);
  server.begin();
  Serial.println("HTTP Web Server Started. Listening on GET /data");
}

void loop() {
  server.handleClient();
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(arduinoWebServerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--color-honey-100)',
              color: 'var(--color-honey-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Code2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                ESP32 Web Server Firmware Guide
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Configured Endpoint: <code style={{ fontFamily: 'var(--font-mono)' }}>{esp32ApiUrl}</code>
              </span>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* CORS Security Notice */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <ShieldAlert size={20} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400E', margin: '0 0 4px 0' }}>
              CRITICAL CORS (Cross-Origin Resource Sharing) REQUIREMENT
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-honey-900)', margin: 0, lineHeight: '1.45' }}>
              Because your web dashboard runs in a web browser and sends HTTP GET requests to your ESP32's local IP address, the ESP32 <strong>MUST</strong> send CORS header: <br />
              <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>Access-Control-Allow-Origin: *</code><br />
              The C++ firmware snippet below includes these headers automatically.
            </p>
          </div>
        </div>

        {/* Expected JSON Format */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Database size={16} color="var(--color-honey-700)" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
              Expected ESP32 JSON Format (GET /data)
            </h4>
          </div>

          <pre style={{
            background: '#0F172A',
            color: '#38BDF8',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto'
          }}>
            {rawJsonSpec}
          </pre>
        </div>

        {/* Arduino WebServer Snippet */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={16} color="var(--color-honey-700)" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                ESP32 WebServer C++ Code (Arduino IDE)
              </h4>
            </div>

            <button
              className="btn-secondary"
              onClick={copyCode}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={13} color="green" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre style={{
            background: '#1E293B',
            color: '#F8FAFC',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            maxHeight: '280px',
            overflowY: 'auto'
          }}>
            {arduinoWebServerCode}
          </pre>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
