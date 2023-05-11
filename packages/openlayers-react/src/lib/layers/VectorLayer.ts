import { useContext, useEffect } from 'react';
import MapContext from '../map/MapContext';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';

export interface VectorLayerProps {
  source: VectorSource;
  style: Style;
  zIndex?: number;
}

export const VectorLayer = ({ source, style, zIndex = 0 }: VectorLayerProps) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) {
      return;
    }
    const vectorLayer = new OLVectorLayer({
      source,
      style,
    });
    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setStyle(style);
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [source, map]);
  return null;
};
