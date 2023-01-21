import type { MouseEvent } from 'react';
import { useRef, useCallback } from 'react';

import {
  block,
  getElementRoleAndObjectIdxFromUserEvent,
  getUserEventPosition,
} from '../utils';
import { Point, CanvasEvent, CanvasStateType } from '../typings';
import { ELEMENT_ROLE, CANVAS_EVENT, CANVAS_STATE } from '../constants';

function useHandleUserEvents({
  sendEvent,
  convasState,
}: {
  sendEvent: (e: CanvasEvent) => void;
  convasState: CanvasStateType;
}) {
  const previousPoint = useRef<Point | null>(null);
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getUserEventPosition(e);
      previousPoint.current = { x, y };
      const { role, idx, vertixIdx } =
        getElementRoleAndObjectIdxFromUserEvent(e);

      switch (role) {
        case ELEMENT_ROLE.controlFrameVertex:
          sendEvent({
            type: CANVAS_EVENT.mouseDownOnCtrlFrameVertix,
            vertixIdx,
          });
          break;
        case ELEMENT_ROLE.drawObject:
          sendEvent({ type: CANVAS_EVENT.mouseDownOnDrawObj, idx });
          break;
        default:
      }
    },
    [sendEvent]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      previousPoint.current = null;
      sendEvent({ type: CANVAS_EVENT.mouseUp });
    },
    [sendEvent, convasState]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!previousPoint.current) {
        return;
      }

      const { x, y } = getUserEventPosition(e);
      const { x: x0, y: y0 } = previousPoint.current;
      const dx = x - x0;
      const dy = y - y0;
      previousPoint.current = { x, y };

      sendEvent({
        type: CANVAS_EVENT.mouseMoving,
        delta: { dx, dy },
      });
    },
    [sendEvent]
  );

  return { handleMouseMove, handleMouseDown, handleMouseUp };
}

export default useHandleUserEvents;
