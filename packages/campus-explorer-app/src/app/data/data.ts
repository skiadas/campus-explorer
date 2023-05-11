import { Location, headingDistanceTo } from 'geolocation-utils';
import { Distance, meters } from '../units/distance';
import treeData from '../trees';

export interface BasicFeature {
  id: string;
  name: string;
  note: string;
  location: Location;
}
export interface MyFeature extends BasicFeature {
  heading: number;
  distance: Distance;
}

const basicData: BasicFeature[] = treeData.features.map((data) => {
  const [lon, lat] = data.geometry.coordinates;
  const location = { lat, lon };
  const { id, name, note } = data.properties;
  return { id, name, note, location };
});

export function getBasicFeatures(): BasicFeature[] {
  return basicData;
}

export function getData(gpsLocation: Location, max_distance: Distance): MyFeature[] {
  const features = basicData
    .map((feature) => convertToMyFeature(gpsLocation, feature))
    .filter((feature) => feature.distance.feet <= max_distance.feet);
  features.sort((a, b) => a.distance.feet - b.distance.feet);
  return features;
}

export function convertToMyFeature(gpsLocation: Location, feature: BasicFeature): MyFeature {
  const { location } = feature;
  const { heading, distance } = headingDistanceTo(gpsLocation, location);
  return {
    ...feature,
    heading,
    distance: meters(distance)
  };
}
