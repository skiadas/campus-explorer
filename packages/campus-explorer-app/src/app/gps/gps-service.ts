import { useEffect, useState } from 'react';
import * as FULLTILT from 'fulltilt-ts';
import type { OrientationData } from 'fulltilt-ts';
import { setObserver } from '../utils/observer';

interface ActualGPSData {
  location?: [number, number];
  orientation?: OrientationData;
}
export type GPSData = ActualGPSData | null;
export type PermissionState = 'none' | 'requesting' | 'granted';

const current: ActualGPSData = { location: undefined, orientation: undefined };

const [registerCallback, removeCallback, notify] = setObserver<ActualGPSData>();

export function useGpsService(): [PermissionState, GPSData, () => void] {
  const [permissionState, setPermissionState] =
    useState<PermissionState>('none');
  const [gpsData, setGpsData] = useState<GPSData>(null);
  function handleUserOK(): void {
    setPermissionState('requesting');
    startService(() => setPermissionState('granted'));
  }

  useEffect(() => {
    let callbackId: number;

    if (permissionState == 'granted') {
      callbackId = registerCallback(setGpsData);
    }
    return () => removeCallback(callbackId);
  });
  return [permissionState, gpsData, handleUserOK];
}

let activating = false;

function startService(callback: () => void): void {
  if (activating) return;
  activating = true;
  navigator.geolocation.watchPosition(
    ({ coords }: GeolocationPosition) => {
      current.location = [coords.longitude, coords.latitude];
    },
    () => {
      // eslint-disable-next-line no-console
      console.log('error getting location!');
    },
    { enableHighAccuracy: true }
  );

  const startOrientationUpdates = (): void => {
    FULLTILT.orientation.activate();
    FULLTILT.orientation.listen((data) => {
      current.orientation = data;
    });
    callback();
  };
  if (!window.DeviceOrientationEvent) return;
  if ('requestPermission' in window.DeviceOrientationEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.DeviceOrientationEvent as any)
      .requestPermission()
      .then((permission: string) => {
        if (permission === 'granted') startOrientationUpdates();
      });
  } else {
    startOrientationUpdates();
  }
}

setInterval(() => {
  const { location, orientation } = current;
  const lastReported = { location, orientation };
  notify(lastReported);
}, 250);
