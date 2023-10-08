import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  type EmitterSubscription,
} from 'react-native';
import { Observable } from 'rxjs';
import { publish, refCount } from 'rxjs/operators';
import type { Unsubscribable } from 'rxjs';
import * as RNSensors from './rnsensors';

const LINKING_ERROR =
  `The package 'react-native-proximity-sensor' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ProxNative = NativeModules.RNSensorsProximity
  ? NativeModules.RNSensorsProximity
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

let eventEmitterSubscription: EmitterSubscription | null = null;

const subscribe = (observer: {
  next: (arg0: any) => void;
  error: (arg0: string) => void;
}) => {
  let isSensorAvailable = false;

  let unsubscribeCallback = () => {
    if (!isSensorAvailable) return;
    if (eventEmitterSubscription) eventEmitterSubscription.remove();

    // stop the sensor
    RNSensors.stop();
  };

  RNSensors.isAvailable().then(
    () => {
      isSensorAvailable = true;

      const emitter = new NativeEventEmitter(ProxNative);

      eventEmitterSubscription = emitter.addListener(
        'RNSensorsProximity',
        (data) => {
          observer.next(data);
        }
      );

      // Start the sensor manager
      RNSensors.start();
    },
    () => {
      observer.error(`Sensor Proximity is not available`);
    }
  );

  return unsubscribeCallback;
};

interface Observer {
  distance: number;
  is_close: boolean;
  is_toggle: boolean;
  is_double_toggle: boolean;
}

function createSensorObservable(): Observable<Observer> {
  return Observable.create(subscribe).pipe(makeSingleton());
}

// As we only have one sensor we need to share it between the different consumers
function makeSingleton() {
  return (source: any) => source.pipe(publish(), refCount());
}
export type SubscriptionRef = Unsubscribable;
export default createSensorObservable();
