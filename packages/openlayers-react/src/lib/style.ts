import { Color } from 'ol/color';
import { ColorLike } from 'ol/colorlike';
import { Circle, Fill, Stroke } from 'ol/style';
import { Options as StyleOptions } from 'ol/style/Style';
import { default as Style } from 'ol/style/Style';

export function stroke(color: Color | ColorLike, width: number) {
  return new Stroke({ color, width });
}

export function fill(color: string) {
  return new Fill({ color });
}

export function circle(radius: number, fill?: Fill, stroke?: Stroke) {
  return new Circle({ radius, fill, stroke });
}

export function style(options: StyleOptions) {
  return new Style(options);
}

export function circleStyle(radius: number, fill?: Fill, stroke?: Stroke) {
  return new Style({ image: circle(radius, fill, stroke), fill, stroke });
}

export default {
  style,
  circleStyle,
  circle,
  Circle,
  fill,
  Fill,
  stroke,
  Stroke,
};
