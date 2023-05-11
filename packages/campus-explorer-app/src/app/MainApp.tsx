import React, { ReactElement } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Telemetry from './Telemetry';
import { Map } from './map/Map';
import { Camera } from './camera/Camera';
import { Features } from './data/FeatureListView';
import { FeedbackSubmit } from './feedback/FeedbackSubmit';

export function MainApp(): ReactElement {
  const [screenshot, setScreenshot] = React.useState<string>('');
  function handleScreenshot(dataUrl: string): void {
    setScreenshot(dataUrl);
  }
  return (
    <>
      <div className="horizontal">
        <Tabs>
          <TabList>
            <Tab>Telemetry</Tab>
            <Tab>Map</Tab>
            <Tab>Camera</Tab>
          </TabList>
          <TabPanel>
            <Telemetry />
          </TabPanel>
          <TabPanel>
            <Map />
          </TabPanel>
          <TabPanel>
            <Camera onScreenshot={handleScreenshot} />
          </TabPanel>
        </Tabs>
        <Features />
      </div>
      <FeedbackSubmit screenshot={screenshot} onEnd={(): void => setScreenshot('')} />
    </>
  );
}
