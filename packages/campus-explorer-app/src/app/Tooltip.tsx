import React, { ReactElement, useCallback } from 'react';
import useCursorPosition from './useCursorPosition';
import './Tooltip.css';

interface TooltipProps {
  message?: string | ReactElement;
}

const Tooltip = (_props: TooltipProps): ReactElement => {
  const cursorPosition = useCursorPosition();
  const toolTipRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        node.style.zIndex = '1';
        node.style.position = 'fixed';
        node.style.pointerEvents = 'none';
        node.style.left = cursorPosition.pageX - window.scrollX + 10 + 'px';
        node.style.top = cursorPosition.pageY - window.scrollY - 10 + 'px';
      }
    },
    [cursorPosition]
  );
  if (!_props.message) return <></>;
  return (
    <div className="tooltip" ref={toolTipRef}>
      {_props.message}
    </div>
  );
};

export default Tooltip;
