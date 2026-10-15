# Hive Monitoring Dashboard 🐝🍯

A modern, real-time IoT Smart Hive Monitoring and Honey Batch Traceability Dashboard built with React, Vite, and Chart.js. Designed for beekeepers and sustainable apiaries to monitor colony health, optimize honey yield, and ensure transparent honey batch tracking.

![Hive Monitoring Dashboard Preview](https://raw.githubusercontent.com/jayankishore/hive-monitoring-dashboard/main/public/favicon.svg)

---

## 🌟 Key Features

- **📊 Real-Time Telemetry & Hive Conditions**:
  - Internal & Ambient Temperature monitoring
  - Internal & Ambient Humidity tracking
  - Bee Acoustic Activity / Flight Frequency (Hz)
  - Hive Scale / Weight tracking for honey supers
  - ESP32 battery level and WiFi RSSI signal strength
- **📈 Interactive Sensor Trends & Analytics**:
  - Multi-metric historical and live time-series charts using `chart.js` and `react-chartjs-2`.
  - Configurable aggregation filters (Hourly, Daily, Weekly trends).
- **🚨 Intelligent Alert & Threshold System**:
  - Customizable high/low threshold notifications for temperature, humidity, and weight drops.
  - Swarm warning triggers and colony distress alerts.
- **⚡ ESP32 Hardware Integration**:
  - Dedicated hardware integration modal providing connection status, MAC pairing, and sample Arduino/ESP32 C++ firmware snippet for plug-and-play field deployment.
- **🔗 Honey Batch Traceability & Blockchain Verification**:
  - Batch metadata, harvest date, floral origin, moisture percentage, and tamper-evident cryptographic batch verification preview.
- **✨ Premium UI/UX**:
  - Responsive dark-mode glassmorphism design with honey-gold accents and micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jayankishore/hive-monitoring-dashboard.git
   cd hive-monitoring-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the built production bundle:

```bash
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
