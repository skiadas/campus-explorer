import React, { DialogHTMLAttributes, ReactElement, useEffect, useRef } from 'react';

interface ModalDialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  shouldShow: boolean;
  children: ReactElement;
}

export function ModalDialog({
  shouldShow,
  children,
  ...dialogProps
}: ModalDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialogRef.current) {
      if (shouldShow) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [shouldShow]);

  return (
    <dialog {...dialogProps} ref={dialogRef} open={false}>
      {children}
    </dialog>
  );
}
