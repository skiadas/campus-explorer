import React, { Context, Reducer, createContext, useContext, useReducer } from 'react';
import { MyFeature, getData } from './data';
import { useGPSContext } from '../gps/GPSContainer';
import { feet } from '../units/distance';

interface FeatureSet {
  features: MyFeature[];
  currentFeature?: MyFeature;
  highlightedFeature?: MyFeature;
}

interface FeatureConfig {
  currentFeatureId?: string;
  highlightedFeatureId?: string;
}

type Action =
  | { type: 'set-current'; value: string }
  | { type: 'unset-current' }
  | { type: 'set-highlighted'; value: string }
  | { type: 'unset-highlighted' };

type Dispatcher = ((action: Action) => void) | undefined;

const FeatureContext: Context<FeatureSet> = createContext<FeatureSet>({ features: [] });
const FeatureConfigDispatchContext: Context<Dispatcher> = createContext<Dispatcher>(undefined);

export const useFeatureContext = (): FeatureSet => useContext(FeatureContext);
export const useFeatureConfigDispatchContext = (): Dispatcher =>
  useContext(FeatureConfigDispatchContext);

export function FeatureProvider({ children }: { children?: React.ReactNode }): React.ReactElement {
  const [featureConfig, featureConfigDispatch] = useReducer<Reducer<FeatureConfig, Action>>(
    reducer,
    {
      currentFeatureId: undefined
    },
    undefined
  );
  const gpsData = useGPSContext();
  const location = gpsData?.location;
  const features = location == undefined ? [] : getData(location, feet(500));
  const currentFeature = features.find((v) => v.id === featureConfig.currentFeatureId);
  const highlightedFeature = features.find((v) => v.id === featureConfig.highlightedFeatureId);

  return (
    <FeatureContext.Provider value={{ features, currentFeature, highlightedFeature }}>
      <FeatureConfigDispatchContext.Provider value={featureConfigDispatch}>
        {children}
      </FeatureConfigDispatchContext.Provider>
    </FeatureContext.Provider>
  );
}

function reducer(state: FeatureConfig, action: Action): FeatureConfig {
  switch (action.type) {
    case 'set-current':
      return { ...state, currentFeatureId: action.value };
    case 'unset-current':
      return { ...state, currentFeatureId: undefined };
    case 'set-highlighted':
      return { ...state, highlightedFeatureId: action.value };
    case 'unset-highlighted':
      return { ...state, highlightedFeatureId: undefined };
    default:
      return state;
  }
}
