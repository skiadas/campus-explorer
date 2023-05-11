import React from 'react';
import { useGPSContext } from './gps/GPSContainer';

export default function Telemetry(): React.ReactElement {
  const gpsData = useGPSContext();
  if (gpsData == null) return <p>No data available</p>;
  const { location, orientation } = gpsData;
  const [lon, lat] = location ?? [0, 0];
  return (
    <ul>
      <li>Latitude: {lat}</li>
      <li>Longtitude: {lon}</li>
      <li>Orientation: {JSON.stringify(orientation)}</li>
      <li>Alpha: {orientation?.screen.alpha}</li>
      <li>Beta: {orientation?.screen.beta}</li>
      <li>Gamma: {orientation?.screen.gamma}</li>
    </ul>
  );
}
