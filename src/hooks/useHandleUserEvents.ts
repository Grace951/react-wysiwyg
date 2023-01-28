import type { MouseEvent } from 'react';
import { useRef, useCallback } from 'react';

import {
  block,
  getElementRoleAndObjectIdxFromUserEvent,
  getUserEventPosition,
} from '../utils';
import { Point, CanvasEvent } from '../typings';
import { ELEMENT_ROLE, CANVAS_EVENT } from '../constants';

function useHandleUserEvents({
  sendEvent,
}: {
  sendEvent: (e: CanvasEvent) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const previousPoint = useRef<Point | null>(null);
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getUserEventPosition(e, canvasRef.current);
      previousPoint.current = { x, y };
      const { role, idx, vertixIdx, widgetType } =
        getElementRoleAndObjectIdxFromUserEvent(e);

      switch (role) {
        case ELEMENT_ROLE.controlFrameVertex:
          sendEvent({
            type: CANVAS_EVENT.mouseDownOnCtrlFrameVertix,
            vertixIdx,
          });
          break;
        case ELEMENT_ROLE.drawObject:
          sendEvent({ type: CANVAS_EVENT.mouseDownOnDrawObj, idx, widgetType });
          break;
        case ELEMENT_ROLE.background:
          sendEvent({ type: CANVAS_EVENT.mouseDownOnCanvas, point: { x, y } });
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
    [sendEvent]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!previousPoint.current) {
        return;
      }

      const { x, y } = getUserEventPosition(e, canvasRef.current);
      const { x: x0, y: y0 } = previousPoint.current;
      const dx = x - x0;
      const dy = y - y0;
      previousPoint.current = { x, y };

      sendEvent({
        type: CANVAS_EVENT.mouseMoving,
        delta: { dx, dy },
        point: { x, y },
      });
    },
    [sendEvent]
  );

  return { handleMouseMove, handleMouseDown, handleMouseUp, canvasRef };
}

export default useHandleUserEvents;
