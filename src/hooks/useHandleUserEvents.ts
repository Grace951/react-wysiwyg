import type { MouseEvent } from 'react';
import { useRef } from 'react';

import {
  getElementRoleAndObjectIdxFromUserEvent,
  getUserEventPosition,
} from '../utils';
import { CanvasState, Point, Dimension } from '../typings';
import { CANVAS_STATE, ELEMENT_ROLE } from '../constants';

function useHandleUserEvents({
  setCanvasState,
  canvasState,
  update,
  setActiveDrawObjectIdx,
}: {
  setCanvasState: (state: CanvasState) => void;
  canvasState: CanvasState;
  update: (delta: Dimension) => void;
  setActiveDrawObjectIdx: (idx: number) => void;
}) {
  const previousPoint = useRef<Point | null>(null);

  function handleObjectMove(x: number, y: number) {
    if (!previousPoint.current) {
      return;
    }
    const { x: x0, y: y0 } = previousPoint.current;
    const delta: Dimension = {
      x: x - x0,
      y: y - y0,
      width: 0,
      height: 0,
    };
    previousPoint.current = { x, y };
    update(delta);
  }
  function handleAddingObject(x, y) {
    if (!previousPoint.current) {
      return;
    }

    const { x: x0, y: y0 } = previousPoint.current;
  }

  function handleSelectObject(x, y) {
    if (!previousPoint.current) {
      return;
    }

    const { x: x0, y: y0 } = previousPoint.current;
  }

  function handleObjectResize(x: number, y: number) {
    if (!previousPoint.current) {
      return;
    }
    const { x: x0, y: y0 } = previousPoint.current;
    const delta: Dimension = {
      x: 0,
      y: 0,
      width: x - x0,
      height: y - y0,
    };
    previousPoint.current = { x, y };
    update(delta);
  }

  function handleMouseDown(e: MouseEvent) {
    if (canvasState !== CANVAS_STATE.normal) {
      return;
    }
    const { x, y } = getUserEventPosition(e);

    previousPoint.current = { x, y };
    const { role, idx } = getElementRoleAndObjectIdxFromUserEvent(e);
    switch (role) {
      case ELEMENT_ROLE.controlFrameVertex:
        setCanvasState(CANVAS_STATE.resizing);
        break;
      case ELEMENT_ROLE.drawObject:
        if (idx !== null) {
          setActiveDrawObjectIdx(idx);
        }
        break;
      default:
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    previousPoint.current = null;

    switch (canvasState) {
      case CANVAS_STATE.normal:
        return;
      case CANVAS_STATE.adding:
        setCanvasState(CANVAS_STATE.normal);
        break;
      case CANVAS_STATE.selecting:
        break;
      case CANVAS_STATE.resizing:
        setCanvasState(CANVAS_STATE.normal);
        break;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { x, y } = getUserEventPosition(e);
    const { role } = getElementRoleAndObjectIdxFromUserEvent(e);
    role && console.log(role);
    switch (canvasState) {
      case CANVAS_STATE.normal:
        role === ELEMENT_ROLE.controlFrameVertex
          ? handleObjectResize(x, y)
          : handleObjectMove(x, y);

        break;
      case CANVAS_STATE.adding:
        handleObjectResize(x, y);
        break;
      case CANVAS_STATE.resizing:
        handleObjectResize(x, y);
        break;
      case CANVAS_STATE.selecting:
        handleSelectObject(x, y);
        break;
    }
  };

  return { handleMouseMove, handleMouseDown, handleMouseUp };
}

export default useHandleUserEvents;
