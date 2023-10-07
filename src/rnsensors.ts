import { NativeModules } from 'react-native';
const { RNSensorsProximity: ProxNative } = NativeModules;

if (!ProxNative) {
  throw new Error(
    'Native modules for proximity-sensor is not available. Did react-native link run successfully?'
  );
}

// Cache the availability of sensors
let availableSensor: null | boolean = null;

export function start() {
  ProxNative.startUpdates();
}

export function isAvailable() {
  if (availableSensor) {
    return availableSensor;
  }

  const api = ProxNative;
  const promise = api.isAvailable();
  availableSensor = promise;

  return promise;
}

export function stop() {
  ProxNative.stopUpdates();
}

export function setUpdateInterval(updateInterval: Number) {
  ProxNative.setUpdateInterval(updateInterval);
}

export function setLogLevelForType(level: Number) {
  ProxNative.setLogLevel(level);
}
