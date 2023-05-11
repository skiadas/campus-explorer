import * as React from 'react';
import { useGeographic } from 'ol/proj.js';
import './Map.css';

import * as rol from 'openlayers-react';
import { toLatLon, toLonLatTuple } from 'geolocation-utils';
import { FeatureLike } from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
import { useGPSContext } from '../gps/GPSContainer';
import { useFeatureContext, useFeatureConfigDispatchContext } from '../data/FeatureProvider';
import { locationStyle, treeStyle, selectedTreeStyle, highlightedTreeStyle } from './styles';
import { ReactElement } from 'react';
import { MyFeature } from '../data/data';
import Style from 'ol/style/Style';

export const Map = (): ReactElement => {
  const gpsData = useGPSContext();
  const { features, currentFeature, highlightedFeature } = useFeatureContext();
  const dispatch = useFeatureConfigDispatchContext();
  const location = gpsData?.location || [0, 0];
  const orientation = gpsData?.orientation;
  useGeographic();
  const { lon: longitude, lat: latitude } =
    location !== undefined ? toLatLon(location) : { lon: 0, lat: 0 };
  const clickHandler = (coords: Coordinate, clickedFeatures: FeatureLike[]): void => {
    if (!dispatch) return;
    const id = clickedFeatures[0]?.get('id');
    if (id === undefined) dispatch({ type: 'unset-current' });
    else dispatch({ type: 'set-current', value: id });
  };
  const rotation = (orientation?.screen.alpha || 0) * (Math.PI / 180);

  return (
    <rol.Map zoom={18} rotation={rotation} center={[longitude, latitude]} onClick={clickHandler}>
        <rol.layers.Layers>
          <rol.layers.TileLayer source={rol.source.osm()} />
          <Features features={features} />
          <CurrentLocation location={[longitude, latitude]} />
          <SingleFeature feature={highlightedFeature} style={highlightedTreeStyle} />
          <SingleFeature feature={currentFeature} style={selectedTreeStyle} />
        </rol.layers.Layers>
      </rol.Map>
  );
};

function Features({ features }: { features: MyFeature[] }): ReactElement {
  const elements = features.map((mf) =>
    rol.features.feature(
      {
        geometry: rol.geom.point(toLonLatTuple(mf.location))
      },
      { name: mf.name, id: mf.id }
    )
  );
  return (
    <rol.layers.VectorLayer source={rol.source.vector({ features: elements })} style={treeStyle} />
  );
}

function SingleFeature({ feature, style }: { feature?: MyFeature; style: Style }): ReactElement {
  if (!feature) return <></>;
  return (
    <rol.layers.VectorLayer
      source={rol.source.vector({
        features: [rol.features.feature(rol.geom.point(toLonLatTuple(feature.location)))]
      })}
      style={style}
    />
  );
}

function CurrentLocation({ location }: { location: [number, number] }): ReactElement {
  return (
    <rol.layers.VectorLayer
      source={rol.source.vector({
        features: [rol.features.feature(rol.geom.point(location))]
      })}
      style={locationStyle}
    />
  );
}
