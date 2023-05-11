import { useRef, useState, useEffect, ReactNode } from 'react';
import './Map.css';
import MapContext, { IMapContext } from './MapContext';
import { FeatureLike } from 'ol/Feature.js';

import * as ol from 'ol';
import { useGeographic } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

export interface MapProps {
  children?: ReactNode;
  onClick?: (coords: Coordinate, features: FeatureLike[]) => void;
  zoom: number;
  rotation?: number;
  center: [number, number];
}

export const Map = ({ children, zoom, center, rotation, onClick }: MapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<ol.Map | null>(null);
  useGeographic();
  // on component mount
  useEffect(() => {
    const options = {
      view: new ol.View({ zoom, center, rotation }),
      layers: [],
      controls: [],
      overlays: [],
    };
    const mapObject = new ol.Map(options);
    if (onClick) {
      mapObject.on('click', function (evt) {
        onClick(evt.coordinate, mapObject.getFeaturesAtPixel(evt.pixel));
      });
    }
    if (mapRef.current) mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (map && rotation) map.getView().setRotation(rotation);
  }, [rotation]);
  // zoom change handler
  useEffect(() => {
    if (map) map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (map) map.getView().setCenter(center);
  }, [center]);
  const mapContext: IMapContext = map ? { map } : {};

  return (
    <MapContext.Provider value={mapContext}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};
