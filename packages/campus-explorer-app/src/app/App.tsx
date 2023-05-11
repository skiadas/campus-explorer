import * as React from 'react';
import './App.css';
import 'react-tabs/style/react-tabs.css';
import { GPSContainer } from './gps/GPSContainer';
import { FeatureProvider } from './data/FeatureProvider';
import { MainApp } from './MainApp';

const App: React.FunctionComponent<unknown> = () => {
  return (
    <>
      <h1>Hanover Campus Explorer</h1>
      <GPSContainer>
        <FeatureProvider>
          <MainApp />
        </FeatureProvider>
      </GPSContainer>
    </>
  );
};

export default App;
