import React, { ReactElement, useState } from 'react';
import { useFeatureContext } from '../data/FeatureProvider';
import { MyFeature } from '../data/data';
import './Feedback.css';
import { ModalDialog } from '../utils/ModalDialog';
import { Case, Default, Switch } from '../utils/Switch';

interface FeedbackSubmitProps {
  screenshot: string;
  onEnd: () => void;
}

type FeedbackState = 'preparing' | 'submitting' | 'done' | 'error';

export function FeedbackSubmit({ screenshot, onEnd }: FeedbackSubmitProps): ReactElement {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('preparing');
  const featureContext = useFeatureContext();
  const currentFeature = featureContext.currentFeature;
  const canSave = screenshot != '' && featureContext.currentFeature;
  const id = featureContext.currentFeature?.id;
  // console.log(feedbackState);
  function handleCancel(): void {
    setFeedbackState('preparing');
    onEnd();
  }
  function handleSave(): void {
    if (!id) return;
    setFeedbackState('submitting');
    submitFeedback({ id, screenshot }).then(
      () => {
        setFeedbackState('done');
      },
      () => {
        setFeedbackState('error');
      }
    );
  }
  return (
    <ModalDialog className="feedbackDialog" shouldShow={screenshot != ''}>
      <section>
        <Switch test={feedbackState}>
          <Case value={'preparing'}>
            <div>
              <img src={screenshot} />
            </div>
            <div>
              <Message feature={currentFeature}></Message>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleSave} disabled={!canSave}>
                Save
              </button>
            </div>
          </Case>
          <Case value={'submitting'}>
            <div>Processing ...</div>
          </Case>
          <Case value={'done'}>
            <div>
              <p>Your screenshot has been saved!</p>
              <button
                onClick={(): void => {
                  setFeedbackState('preparing');
                  onEnd();
                }}
              >
                OK
              </button>
            </div>
          </Case>
          <Case value={'error'}>
            <div>
              <p>There was an error with your submission! Please try again.</p>
              <button
                onClick={(): void => {
                  setFeedbackState('preparing');
                  onEnd();
                }}
              >
                Back
              </button>
            </div>
          </Case>
          <Default>Something is wrong!</Default>
        </Switch>
      </section>
    </ModalDialog>
  );
}

function Message({ feature }: { feature?: MyFeature }): ReactElement {
  if (!feature) return <p>You must first select a feature to associate with the screenshot.</p>;
  return <p>You are about to upload a screenshot associated with feature: {feature.name} </p>;
}

async function submitFeedback({
  id,
  screenshot
}: {
  id: string;
  screenshot: string;
}): Promise<void> {
  const submission = await fetch(
    'https://pceqofio6h.execute-api.us-east-1.amazonaws.com/Prod/feedbackSubmit',
    {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ id, screenshot })
    }
  );
  if (submission.status != 200) {
    throw new Error('Error with submission: ' + JSON.stringify(submission));
  }
}
