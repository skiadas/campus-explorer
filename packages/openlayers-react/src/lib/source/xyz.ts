import { XYZ } from 'ol/source';
import { Options } from 'ol/source/XYZ';

export function xyz(options: Options) {
  return new XYZ(options);
}
