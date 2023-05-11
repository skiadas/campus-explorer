import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';

export function point(options: Coordinate) {
  return new Point(options);
}
