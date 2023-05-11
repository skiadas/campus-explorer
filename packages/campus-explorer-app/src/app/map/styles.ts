import * as rol from 'openlayers-react';

export const treeStyle = rol.style.circleStyle(
  5,
  rol.style.fill('rgba(150,200,100,0.4)'),
  rol.style.stroke('#3399CC', 1.25)
);
export const locationStyle = rol.style.circleStyle(
  5,
  rol.style.fill('rgba(255,50,50,0.8)'),
  rol.style.stroke('rgb(255,0,0)', 1.25)
);
export const selectedTreeStyle = rol.style.circleStyle(
  5,
  rol.style.fill('rgba(50,200,50,0.9)'),
  rol.style.stroke('rgba(50,200,50,1)', 1.25)
);

export const highlightedTreeStyle = rol.style.circleStyle(
  5,
  rol.style.fill('rgba(150,200,100,0.7)'),
  rol.style.stroke('#3399CC', 1.25)
);
