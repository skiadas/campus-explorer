import { useContext, useEffect } from 'react';
import MapContext from '../map/MapContext';
import OLTileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';

export interface TileLayerProps {
  source: TileSource;
  zIndex?: number;
}

export const TileLayer = ({ source, zIndex = 0 }: TileLayerProps) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;

    const tileLayer = new OLTileLayer({
      source,
    });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);
  return null;
};
