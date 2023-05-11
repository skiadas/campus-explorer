import React, { ReactElement } from 'react';

export function ApprovalDialog(props: { onUserOK: () => void }): ReactElement {
  return (
    <dialog title="Location and Orientation Service Access" open>
      <h1>Location and Orientation Service Access</h1>
      <p>
        This application requires access to your device location and orientation services. After
        pressing OK you may be asked to approve such access.
      </p>
      <p>The application will not work properly without such access.</p>
      <button onClick={props.onUserOK}>OK</button>
    </dialog>
  );
}
