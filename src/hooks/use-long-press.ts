"use client";

import {
  useCallback,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";

type LongPressEvent =
  | ReactMouseEvent
  | ReactTouchEvent
  | MouseEvent
  | TouchEvent;
type ClickEvent = ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent;

interface UseLongPressOptions {
  delay?: number;
  shouldPreventDefault?: boolean;
}

export const useLongPress = (
  onLongPress: (e: LongPressEvent) => void,
  onClick: (e: ClickEvent) => void,
  { delay = 500, shouldPreventDefault = true }: UseLongPressOptions = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget | null>(null);

  const start = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event.nativeEvent || event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (shouldTriggerClick && !longPressTriggered) {
        onClick(event.nativeEvent || event);
      }
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [onClick, longPressTriggered, shouldPreventDefault],
  );

  const preventDefault = (event: Event) => {
    if (!event.cancelable) {
      return;
    }
    event.preventDefault();
  };

  return {
    onMouseDown: (e: ReactMouseEvent) => start(e),
    onTouchStart: (e: ReactTouchEvent) => start(e),
    onMouseUp: (e: ReactMouseEvent) => clear(e),
    onMouseLeave: (e: ReactMouseEvent) => clear(e, false),
    onTouchEnd: (e: ReactTouchEvent) => clear(e),
  };
};
