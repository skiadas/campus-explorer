import React, { Context, createContext, useContext } from 'react';
import { GPSData, useGpsService } from './gps-service';
import { ApprovalDialog } from './ApprovalDialog';

const GPSContext: Context<GPSData> = createContext<GPSData>(null);

export const useGPSContext = (): GPSData => useContext(GPSContext);

export function GPSContainer({ children }: { children?: React.ReactNode }): React.ReactElement {
  const [permissionState, gpsData, handleUserOK] = useGpsService();
  if (permissionState == 'none') {
    return <ApprovalDialog onUserOK={handleUserOK} />;
  } else if (permissionState == 'requesting') {
    return <div>Loading ...</div>;
  }
  return <GPSContext.Provider value={gpsData}>{children}</GPSContext.Provider>;
}
