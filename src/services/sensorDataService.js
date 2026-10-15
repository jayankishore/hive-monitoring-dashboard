/**
 * Real ESP32 Telemetry & Polling Service
 * 
 * PROJECT: Honey Hive Monitor
 * HARDWARE: ESP32 + DHT22 (Temperature & Humidity)
 * 
 * STRICT REAL DATA POLICY & RELIABLE HTTP POLLING:
 * - Default polling interval: 5 seconds (5000 ms).
 * - Request timeout: 3 seconds (3000 ms).
 * - 3 consecutive HTTP failures required before marking ESP32 OFFLINE.
 * - Single HTTP success immediately recovers ESP32 to ONLINE status.
 * - NO fake / mock / simulated data.
 */

// Configurable ESP32 API Endpoint URL (defaults to real ESP32 at http://192.168.1.49/data)
let storedUrl = localStorage.getItem('honey_hive_esp32_url');
if (!storedUrl || storedUrl === 'http://192.168.1.100/data') {
  storedUrl = 'http://192.168.1.49/data';
  localStorage.setItem('honey_hive_esp32_url', storedUrl);
}
let esp32ApiUrl = storedUrl;

// Configurable Polling Rate (Default 5000ms = 5 seconds)
let pollingIntervalMs = parseInt(localStorage.getItem('honey_hive_poll_rate')) || 5000;

// Configurable Thresholds for Alert calculations
let thresholds = {
  tempMin: 30.0,
  tempMax: 36.0,
  humidityMin: 50.0,
  humidityMax: 75.0,
};

// Consecutive failure tracking
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
let wasOffline = false;
let justReconnected = false;
let reconnectTimer = null;

// Track Last Received Valid Reading (For Offline Card Display Label)
let lastValidReading = null;

// Real Telemetry State (Starts completely null / offline)
let currentTelemetry = {
  hive_id: "HIVE-001",
  device_id: "ESP32-HIVE-001",
  temperature: null,
  humidity: null,
  timestamp: null,
  connection_status: "OFFLINE",
  sensor_status: "WAITING FOR SENSOR",
  lastAttemptTime: null,
  lastErrorReason: "ESP32 Not Reached Yet",
  consecutiveFailures: 0,
  lastValidReading: null,
  justReconnected: false
};

// Real Historical Data (Starts EMPTY - populated ONLY by real ESP32 readings)
let historicalData = [];

// Reactive Subscribers
const listeners = new Set();
const alertListeners = new Set();

// Real Active Alerts Log
let activeAlerts = [];

let pollingTimer = null;
let isPollingActive = true;
let isFetching = false;

/**
 * Perform actual HTTP GET fetch request to real ESP32 endpoint with 3s timeout & 3-failure tolerance
 */
export async function pollEsp32Sensor() {
  if (isFetching) return; // Prevent overlapping HTTP requests
  isFetching = true;

  const attemptTime = new Date().toISOString();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second reasonable timeout

    const response = await fetch(esp32ApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for valid DHT22 sensor readings
    const isTempValid = typeof data.temperature === 'number' && !isNaN(data.temperature) && data.temperature > -40 && data.temperature < 80;
    const isHumValid = typeof data.humidity === 'number' && !isNaN(data.humidity) && data.humidity >= 0 && data.humidity <= 100;

    // Detect Reconnection Event (OFFLINE -> ONLINE)
    if (wasOffline || currentTelemetry.connection_status === "OFFLINE") {
      wasOffline = false;
      justReconnected = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        justReconnected = false;
        notifyListeners();
      }, 4000); // 4-second success animation window
    }

    // Reset failure counter on successful HTTP response
    consecutiveFailures = 0;

    if (!isTempValid || !isHumValid) {
      // DHT22 Hardware Sensor Error
      currentTelemetry = {
        ...currentTelemetry,
        hive_id: data.hive_id || "HIVE-001",
        device_id: data.device_id || "ESP32-HIVE-001",
        timestamp: data.timestamp || attemptTime,
        connection_status: "ONLINE",
        sensor_status: "DHT22 SENSOR ERROR",
        lastAttemptTime: attemptTime,
        lastErrorReason: "DHT22 read failure (Returned NaN/Null)",
        consecutiveFailures: 0,
        justReconnected
      };
    } else {
      // Valid Real Sensor Reading
      const realTemp = parseFloat(data.temperature.toFixed(1));
      const realHum = parseFloat(data.humidity.toFixed(1));
      const realTimestamp = data.timestamp || new Date().toISOString();

      lastValidReading = {
        temperature: realTemp,
        humidity: realHum,
        timestamp: realTimestamp
      };

      currentTelemetry = {
        hive_id: data.hive_id || "HIVE-001",
        device_id: data.device_id || "ESP32-HIVE-001",
        temperature: realTemp,
        humidity: realHum,
        timestamp: realTimestamp,
        connection_status: "ONLINE",
        sensor_status: "OK",
        lastAttemptTime: attemptTime,
        lastErrorReason: null,
        consecutiveFailures: 0,
        lastValidReading,
        justReconnected
      };

      // Append point to REAL historical chart array
      const timeFormatted = new Date(realTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const lastPoint = historicalData[historicalData.length - 1];
      if (!lastPoint || lastPoint.timeFormatted !== timeFormatted) {
        historicalData = [
          ...historicalData,
          {
            hive_id: currentTelemetry.hive_id,
            device_id: currentTelemetry.device_id,
            temperature: realTemp,
            humidity: realHum,
            timestamp: realTimestamp,
            timeFormatted
          }
        ].slice(-60); // Keep max 60 real readings (5-10 minutes)
      }

      checkRealThresholdBreaches(currentTelemetry);
    }
  } catch (err) {
    consecutiveFailures++;
    const isTimeout = err.name === 'AbortError';
    const errMessage = isTimeout ? 'Request Timeout (3s)' : err.message;

    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      // Confirmed Offline after 3 consecutive failures
      wasOffline = true;
      currentTelemetry = {
        hive_id: "HIVE-001",
        device_id: "ESP32-HIVE-001",
        temperature: null,
        humidity: null,
        timestamp: null,
        connection_status: "OFFLINE",
        sensor_status: "WAITING FOR SENSOR",
        lastAttemptTime: attemptTime,
        lastErrorReason: `${errMessage} (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES} failed)`,
        consecutiveFailures,
        lastValidReading,
        justReconnected: false
      };
    } else {
      // Retaining current telemetry during minor Wi-Fi jitter
      currentTelemetry = {
        ...currentTelemetry,
        lastAttemptTime: attemptTime,
        lastErrorReason: `${errMessage} (Retrying ${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES})`,
        consecutiveFailures,
        lastValidReading
      };
    }
  } finally {
    isFetching = false;
  }

  notifyListeners();
}

/**
 * Start background HTTP polling loop
 */
export function startPolling() {
  if (pollingTimer) clearInterval(pollingTimer);
  isPollingActive = true;
  pollEsp32Sensor(); // Immediate first attempt
  pollingTimer = setInterval(() => {
    if (isPollingActive) {
      pollEsp32Sensor();
    }
  }, pollingIntervalMs);
}

export function stopPolling() {
  isPollingActive = false;
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  notifyListeners();
}

/**
 * Set ESP32 API Endpoint URL
 */
export function setEsp32ApiUrl(newUrl) {
  esp32ApiUrl = newUrl.trim();
  localStorage.setItem('honey_hive_esp32_url', esp32ApiUrl);
  consecutiveFailures = 0;
  pollEsp32Sensor();
}

export function getEsp32ApiUrl() {
  return esp32ApiUrl;
}

export function setPollingInterval(ms) {
  pollingIntervalMs = parseInt(ms) || 5000;
  localStorage.setItem('honey_hive_poll_rate', pollingIntervalMs);
  startPolling();
}

export function getPollingInterval() {
  return pollingIntervalMs;
}

/**
 * Evaluates real readings against configured thresholds
 */
export function evaluateStatus(type, value) {
  if (value === null || value === undefined) {
    return { status: "WAITING", label: "Waiting for Sensor", color: "warning" };
  }

  if (type === "temperature") {
    if (value < thresholds.tempMin - 2.5 || value > thresholds.tempMax + 2.5) {
      return { status: "CRITICAL", label: "Environmental temperature outside configured range", color: "danger" };
    }
    if (value < thresholds.tempMin || value > thresholds.tempMax) {
      return { status: "WARNING", label: "Environmental temperature outside configured range", color: "warning" };
    }
    return { status: "NORMAL", label: "Within Target Bounds", color: "success" };
  }

  if (type === "humidity") {
    if (value < thresholds.humidityMin - 5.0 || value > thresholds.humidityMax + 5.0) {
      return { status: "CRITICAL", label: "Environmental humidity outside configured range", color: "danger" };
    }
    if (value < thresholds.humidityMin || value > thresholds.humidityMax) {
      return { status: "WARNING", label: "Environmental humidity outside configured range", color: "warning" };
    }
    return { status: "NORMAL", label: "Within Target Bounds", color: "success" };
  }

  return { status: "WAITING", label: "Waiting for Sensor", color: "warning" };
}

/**
 * Evaluates aggregate hive microclimate status strictly from real values
 */
export function evaluateOverallHiveStatus(temp, humidity, connectionStatus, sensorStatus) {
  if (connectionStatus === "OFFLINE") {
    return {
      status: "ESP32 OFFLINE",
      message: "ESP32 unreachable. Waiting for real sensor connection...",
      badgeClass: "badge-critical"
    };
  }

  if (sensorStatus === "DHT22 SENSOR ERROR") {
    return {
      status: "SENSOR ERROR",
      message: "DHT22 sensor hardware error or invalid reading returned by ESP32",
      badgeClass: "badge-warning"
    };
  }

  if (temp === null || humidity === null) {
    return {
      status: "WAITING FOR SENSOR",
      message: "Waiting for first valid DHT22 reading from ESP32...",
      badgeClass: "badge-warning"
    };
  }

  const tempEval = evaluateStatus("temperature", temp);
  const humEval = evaluateStatus("humidity", humidity);

  if (tempEval.status === "CRITICAL" || humEval.status === "CRITICAL") {
    return {
      status: "CRITICAL",
      message: "Environmental measurement outside configured range",
      badgeClass: "badge-critical"
    };
  }
  if (tempEval.status === "WARNING" || humEval.status === "WARNING") {
    return {
      status: "WARNING",
      message: "Environmental measurement outside configured range",
      badgeClass: "badge-warning"
    };
  }
  return {
    status: "NORMAL",
    message: "Environmental measurements within configured bounds",
    badgeClass: "badge-normal"
  };
}

/**
 * Check real threshold breaches (No fake alert generation)
 */
function checkRealThresholdBreaches(telemetry) {
  if (telemetry.temperature === null || telemetry.humidity === null) return;

  const tempEval = evaluateStatus("temperature", telemetry.temperature);
  const humEval = evaluateStatus("humidity", telemetry.humidity);

  let alertObj = null;

  if (tempEval.status !== "NORMAL") {
    alertObj = {
      id: `alt-real-${Date.now()}`,
      timestamp: telemetry.timestamp,
      type: tempEval.status === "CRITICAL" ? "critical" : "warning",
      title: `Temperature ${tempEval.status}: ${telemetry.temperature}°C`,
      message: `Environmental temperature reading (${telemetry.temperature}°C) is outside configured range (${thresholds.tempMin}°C - ${thresholds.tempMax}°C).`,
      acknowledged: false
    };
  } else if (humEval.status !== "NORMAL") {
    alertObj = {
      id: `alt-real-${Date.now()}`,
      timestamp: telemetry.timestamp,
      type: humEval.status === "CRITICAL" ? "critical" : "warning",
      title: `Humidity ${humEval.status}: ${telemetry.humidity}%`,
      message: `Environmental humidity reading (${telemetry.humidity}%) is outside configured range (${thresholds.humidityMin}% - ${thresholds.humidityMax}%).`,
      acknowledged: false
    };
  }

  if (alertObj) {
    const lastAlert = activeAlerts[0];
    if (!lastAlert || lastAlert.title !== alertObj.title) {
      activeAlerts = [alertObj, ...activeAlerts].slice(0, 20);
      notifyAlertListeners();
    }
  }
}

// Subscriptions
export function subscribeToTelemetry(callback) {
  listeners.add(callback);
  callback({
    telemetry: currentTelemetry,
    thresholds,
    esp32ApiUrl,
    pollingIntervalMs,
    history: historicalData
  });
  return () => listeners.delete(callback);
}

export function subscribeToAlerts(callback) {
  alertListeners.add(callback);
  callback(activeAlerts);
  return () => alertListeners.delete(callback);
}

function notifyListeners() {
  const state = {
    telemetry: currentTelemetry,
    thresholds,
    esp32ApiUrl,
    pollingIntervalMs,
    history: historicalData
  };
  listeners.forEach(fn => fn(state));
}

function notifyAlertListeners() {
  alertListeners.forEach(fn => fn(activeAlerts));
}

export function updateThresholds(newThresholds) {
  thresholds = { ...thresholds, ...newThresholds };
  if (currentTelemetry.temperature !== null) {
    checkRealThresholdBreaches(currentTelemetry);
  }
  notifyListeners();
}

export function clearAlerts() {
  activeAlerts = [];
  notifyAlertListeners();
}

export function acknowledgeAlert(alertId) {
  activeAlerts = activeAlerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a);
  notifyAlertListeners();
}

// Start polling immediately when service loads
startPolling();
