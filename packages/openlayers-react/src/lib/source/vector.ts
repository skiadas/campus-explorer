import { Geometry } from 'ol/geom';
import { Vector } from 'ol/source';
import { Options } from 'ol/source/Vector';

export function vector(options: Options<Geometry>) {
  return new Vector(options);
}
