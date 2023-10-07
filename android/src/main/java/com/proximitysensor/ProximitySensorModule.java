package com.proximitysensor;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.SystemClock;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.module.annotations.ReactModule;
import android.hardware.Sensor;

@ReactModule(name = ProximitySensorModule.NAME)
public class ProximitySensorModule extends ReactContextBaseJavaModule implements SensorEventListener  {
  public static final String NAME = "RNSensorsProximity";
  private final ReactApplicationContext reactContext;
  private final SensorManager sensorManager;
  private final Sensor sensor;
  private double lastReading = (double) System.currentTimeMillis();
  private int interval;
  private Arguments arguments;
  private int logLevel = 0;
  private int listenerCount = 0;

  public ProximitySensorModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.sensorManager = (SensorManager)reactContext.getSystemService(reactContext.SENSOR_SERVICE);
    this.sensor = this.sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
  }

  // RN Methods
  @ReactMethod
  public void isAvailable(Promise promise) {
    if (this.sensor == null) {
      // No sensor found, throw error
      promise.reject(new RuntimeException("No Proximity Sensor found"));
      return;
    }
    promise.resolve(null);
  }

  @ReactMethod
  public void setUpdateInterval(int newInterval) {
    this.interval = newInterval;
  }

  @ReactMethod
  public void setLogLevel(int newLevel) {
    this.logLevel = newLevel;
  }

  @ReactMethod
  public void startUpdates() {
    // Milliseconds to Microseconds conversion
    sensorManager.registerListener(this, sensor, this.interval * 1000);
  }

  @ReactMethod
  public void stopUpdates() {
    sensorManager.unregisterListener(this);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private static double sensorTimestampToEpochMilliseconds(long elapsedTime) {
    // elapsedTime = The time in nanoseconds at which the event happened.
    return System.currentTimeMillis() + ((elapsedTime-SystemClock.elapsedRealtimeNanos())/1000000L);
  }

  // SensorEventListener Interface
  private void sendEvent(String eventName, @Nullable WritableMap params) {
    try {
      this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
    } catch (RuntimeException e) {
      Log.e("ERROR", "java.lang.RuntimeException: Trying to invoke Javascript before CatalystInstance has been set!");
    }
  }

  @Override
  public void onSensorChanged(SensorEvent sensorEvent) {
    if(this.listenerCount <= 0) {
      return; // avoid all the computation if there are no observers
    }

    double tempMs = (double) System.currentTimeMillis();
    if (tempMs - lastReading >= interval) {
      lastReading = tempMs;
      WritableMap map = this.arguments.createMap();
      map.putDouble("proximity", sensorEvent.values[0]);
      map.putDouble("timestamp", this.sensorTimestampToEpochMilliseconds(sensorEvent.timestamp));
      this.sendEvent("RNSensorsProximity", map);
    }
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {
  }

  // this is called by RN when the first listener is registered
  // not implementing this method will cause a warning on RN 0.65 onwards
  @ReactMethod
  public void addListener(String eventName) {
    this.listenerCount += 1;
  }

  // this is called by RN when the last listener is deregistered
  // not implementing this method will cause a warning on RN 0.65 onwards
  @ReactMethod
  public void removeListeners(Integer count) {
    this.listenerCount -= count;
    // If we no longer have listeners registered we should also probably also stop the sensor since the sensor events are essentially being dropped.
    if (this.sensorManager != null && this.listenerCount <= 0) {
      stopUpdates(); // maybe only calling `stopUpdates()` is enough
    }
  }
}
