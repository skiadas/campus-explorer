import { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

interface CursorPosition {
  pageX: number;
  pageY: number;
}

const useCursorPosition = (): CursorPosition => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    pageX: 0,
    pageY: 0
  });
  useEventListener('mousemove', (ev) => {
    setCursorPosition({ pageX: ev.pageX, pageY: ev.pageY });
  });
  return cursorPosition;
};

export default useCursorPosition;
