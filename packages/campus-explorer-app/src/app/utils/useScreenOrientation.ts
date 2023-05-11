import { useEffect, useState } from 'react';

const hasScreenOrientationAPI = window.screen.orientation != undefined;
const initialOrientation = hasScreenOrientationAPI
  ? window.screen.orientation.type
  : computerOrientationFromDeprecatedAPI();

type OrientationType =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary';

export function useScreenOrientation(): OrientationType {
  const [screenOrientation, setScreenOrientation] = useState<OrientationType>(initialOrientation);
  useEffect(() => {
    if (window.screen.orientation) {
      const listener = function (this: ScreenOrientation): void {
        setScreenOrientation(this.type);
      };
      window.screen.orientation.addEventListener('change', listener);
      return () => window.screen.orientation.removeEventListener('change', listener);
    } else {
      // Using window.orientation
      const listener = function (): void {
        setScreenOrientation(computerOrientationFromDeprecatedAPI());
      };
      window.addEventListener('orientationchange', listener);
      return () => window.removeEventListener('orientationchange', listener);
    }
  });
  return screenOrientation;
}
function computerOrientationFromDeprecatedAPI(): OrientationType {
  switch (window.orientation) {
    case 0:
      return 'portrait-primary';
    case 180:
      return 'portrait-secondary';
    case 90:
      return 'landscape-primary';
    case -90:
      return 'landscape-secondary';
  }
  throw new Error('Unknown orientation value: ' + window.orientation);
}
