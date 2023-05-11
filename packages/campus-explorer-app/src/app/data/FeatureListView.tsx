import React, { ReactElement } from 'react';
import { useFeatureConfigDispatchContext, useFeatureContext } from './FeatureProvider';
import { FeatureView } from './FeatureView';
import { MyFeature } from './data';
import './FeatureListView.css';

export function Features(): ReactElement {
  const { features, currentFeature, highlightedFeature } = useFeatureContext();
  const dispatch = useFeatureConfigDispatchContext();
  return (
    <section className="feature-section">
      <ul
        className="feature-list"
        onMouseLeave={(): void => dispatch && dispatch({ type: 'unset-highlighted' })}
      >
        {features.map((o) => (
          <FeatureView
            key={o.id}
            feature={o}
            onSelect={handleSelect}
            onHover={handleHover}
            mark={mark(o)}
          />
        ))}
      </ul>
    </section>
  );

  function mark(o: MyFeature): ('selected' | 'highlighted') | undefined {
    if (o === currentFeature) return 'selected';
    if (o === highlightedFeature) return 'highlighted';
    return undefined;
  }

  function handleSelect(id: string): void {
    if (!dispatch) return;
    if (id === currentFeature?.id) return dispatch({ type: 'unset-current' });
    return dispatch({ type: 'set-current', value: id });
  }

  function handleHover(id: string): void {
    return dispatch && dispatch({ type: 'set-highlighted', value: id });
  }
}
