import Map from 'ol/Map';
import { createContext } from 'react';
export interface IMapContext {
  map?: Map;
}

const MapContext = createContext<IMapContext>({});

export default MapContext;
