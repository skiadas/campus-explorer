import React, { ReactElement } from 'react';
import { MyFeature } from './data';
import './FeatureView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGPSContext } from '../gps/GPSContainer';

type MarkType = 'selected' | 'highlighted';

interface FeatureViewProps {
  feature: MyFeature;
  onSelect?: (id: string) => void;
  onHover?: (id: string) => void;
  mark?: MarkType;
}

export function FeatureView({
  feature,
  mark,
  onSelect: handleSelect,
  onHover: handleHover
}: FeatureViewProps): ReactElement {
  const { id, name, distance, note, heading: heading } = feature;
  const gpsContext = useGPSContext();
  const directionOffset = gpsContext?.orientation?.screen.alpha || 0;
  return (
    <li
      data-id={id}
      onClick={(): void => handleSelect && handleSelect(id)}
      onMouseEnter={(): void => handleHover && handleHover(id)}
      onPointerOver={(): void => handleHover && handleHover(id)}
      className={'feature-view' + (mark ? ' item-' + mark : '')}
    >
      <h5 className="heading">
        {name} ({distance.feet.toFixed(2)} feet away)
        <FontAwesomeIcon
          className="direction-arrow"
          icon="arrow-up"
          transform={{ rotate: heading + directionOffset }}
        />
      </h5>
      {mark === 'selected' && <p className="details">{note}</p>}
    </li>
  );
}
