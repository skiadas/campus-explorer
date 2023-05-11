import Feature, { ObjectWithGeometry } from 'ol/Feature.js';
import { Geometry } from 'ol/geom';

export function feature(
  options: Geometry | ObjectWithGeometry<Geometry> | undefined,
  attributes?: object,
) {
  const feature = new Feature(options);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      feature.set(key, value);
    }
  }
  return feature;
}
